#pragma once
#include "Arduino.h"
#include <array>
#include <cassert>
#include <vector>

class TestWire {
public:
    std::array<uint8_t, 256> registers{};
    bool online = true, acceptRegister = true;
    int countOverride = -1, availableLimit = -1;
    unsigned selects = 0, requests = 0;
    unsigned lastRequest = 0;
    bool stopped = true;
    void begin() {}
    void begin(int, int) {}
    void beginTransmission(int address) {
        assert(address == 0x38);
        tx.clear();
        ++selects;
    }
    size_t write(uint8_t byte) {
        if (!acceptRegister) return 0;
        tx.push_back(byte);
        return 1;
    }
    int endTransmission(bool stop = true) {
        stopped = stop;
        if (!online) return 2;
        if (!tx.empty()) cursor = tx[0];
        if (tx.size() == 2) registers.at(cursor) = tx[1];
        return 0;
    }
    int requestFrom(uint8_t address, uint8_t size) {
        assert(address == 0x38 && !stopped);
        ++requests;
        lastRequest = size;
        stopped = true;
        const int count = countOverride < 0 ? size : countOverride;
        remaining = availableLimit < 0 ? count : availableLimit;
        return count;
    }
    int available() const { return remaining; }
    int read() {
        if (!remaining) return -1;
        --remaining;
        return registers.at(cursor++);
    }
private:
    std::vector<uint8_t> tx;
    unsigned cursor = 0;
    int remaining = 0;
};
extern TestWire Wire;
