#pragma once
#include "Arduino.h"
#include <array>
#include <cstddef>
#include <map>
#include <vector>

class TestWire {
public:
    bool online = true, sealed = true, configuring = false;
    bool discardCommit = false, collideOnReadback = false, holdConfig = false;
    bool shortReply = false, missingByte = false, queueFull = false;
    int transfers = 0, nackAt = -1;
    uint16_t deviceId = 0x0421, voltage = 4248;
    std::map<uint8_t, std::array<uint8_t,32>> memory;
    void begin() {}
    void beginTransmission(uint8_t address) { tx.clear(); validAddress = address == 0x55; }
    size_t write(uint8_t byte) {
        if (queueFull) return 0;
        tx.push_back(byte);
        return 1;
    }
    int endTransmission(bool) {
        if (failed() || tx.empty()) return 2;
        reg = tx[0];
        if (tx.size() == 1) return 0;
        if (reg == 0 && tx.size() == 3) {
            const unsigned cmd = tx[1] | (tx[2] << 8);
            switch (cmd) {
            case 0: control = sealed ? 0x2000 : 0; break;
            case 1: control = deviceId; break;
            case 0x8000:
                if (++keyWrites == 2) { sealed = false; keyWrites = 0; }
                break;
            case 0x20: sealed = true; keyWrites = 0; break;
            case 0x13: if (!sealed && !holdConfig) configuring = true; break;
            case 0x42: case 0x43: configuring = false; break;
            }
            return 0;
        }
        if (!configuring || sealed) return 3;
        const auto byte = tx[1];
        if (reg == 0x3e) cls = byte;
        if (reg == 0x3f) pending = memory[cls];
        if (reg >= 0x40 && reg < 0x60) pending[reg-0x40] = byte;
        if (reg == 0x60 && byte == checksum(pending) && !discardCommit) {
            memory[cls] = pending;
            if (collideOnReadback) { ++memory[cls][10]; --memory[cls][11]; }
        }
        return 0;
    }
    uint8_t requestFrom(uint8_t, uint8_t count) {
        rx.clear(); cursor = 0;
        if (failed()) return 0;
        if (reg >= 0x40 && reg < 0x60) {
            for (unsigned i = 0; i < count && reg+i < 0x60; ++i) rx.push_back(pending[reg+i-0x40]);
        } else if (reg == 0x60) {
            rx.push_back(checksum(memory[cls]));
        } else {
            unsigned word = 0;
            switch (reg) {
            case 0: word = control; break;
            case 4: word = voltage; break;
            case 6: word = configuring ? 0x10 : 0; break;
            case 0x10: word = 0xff85; break;
            case 0x18: word = 0xfe0c; break;
            case 0x1e: word = 2982; break;
            case 0x20: word = 0x0350; break;
            }
            rx.push_back(word & 255); rx.push_back(word >> 8);
        }
        if (shortReply && !rx.empty()) rx.pop_back();
        return static_cast<uint8_t>(rx.size());
    }
    int read() { return missingByte || cursor >= rx.size() ? -1 : rx[cursor++]; }
private:
    bool validAddress = false;
    uint8_t reg = 0, cls = 0;
    uint16_t control = 0;
    int keyWrites = 0;
    size_t cursor = 0;
    std::vector<uint8_t> tx,rx;
    std::array<uint8_t,32> pending{};
    bool failed() { return ++transfers == nackAt || !online || !validAddress; }
    static uint8_t checksum(const std::array<uint8_t,32>& data) {
        uint8_t value = 255;
        for (auto byte : data) value -= byte;
        return value;
    }
};
extern TestWire Wire;
