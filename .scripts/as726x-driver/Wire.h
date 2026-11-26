#pragma once
#include "Arduino.h"
#include <array>
#include <vector>

class TwoWire {
public:
    std::array<uint8_t, 256> regs{};
    std::vector<uint8_t> tx;
    int selected = -1, pending = -1, reply = -1, readByte = -1;
    int nackAddress = -1, nackData = -1, shortAt = -1;
    bool lost = false, stuck = false, ready = false, lateRead = false;
    unsigned lit = 0, unlit = 0;

    void beginTransmission(uint8_t) { tx.clear(); }
    size_t write(uint8_t byte) { tx.push_back(byte); return 1; }
    int endTransmission() {
        if (lost) return 2;
        selected = tx.at(0);
        if (tx.size() == 1) return 0;
        const int value = tx.at(1);
        if (selected != 1) return 3;
        if (pending >= 0) {
            if (nackData == pending) { nackData = -1; return 3; }
            if (pending == 7) { if (value & 8) ++lit; else ++unlit; }
            regs[pending] = value;
            if (pending == 4 && (value & 12) == 12 && ready) regs[4] |= 2;
            pending = -1;
        } else if (value & 128) {
            if (nackAddress == (value & 127)) { nackAddress = -1; return 3; }
            pending = value & 127;
        } else {
            reply = value;
        }
        return 0;
    }
    int requestFrom(uint8_t, uint8_t) {
        if (selected == 0) readByte = (stuck ? 2 : 0) | (reply >= 0 ? 1 : 0);
        else if (selected == 2 && reply >= 0) {
            const int address = reply;
            reply = -1;
            if (address == shortAt) { shortAt = -1; readByte = -1; return 0; }
            readByte = regs[address];
        } else return 0;
        return 1;
    }
    int available() const { return readByte >= 0; }
    int read() { int value = readByte; readByte = -1; if (lateRead) { lateRead=false; return -1; } return value; }
};
extern TwoWire Wire;
