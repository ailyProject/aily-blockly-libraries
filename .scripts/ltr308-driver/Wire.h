#pragma once
#include "Arduino.h"
#include <algorithm>
#include <array>
#include <deque>
#include <vector>
#include <cassert>

class TwoWire {
public:
    std::array<uint8_t, 256> regs{};
    std::vector<uint8_t> tx, timing;
    std::deque<uint8_t> rx;
    uint8_t pointer = 0;
    unsigned limit = 3, readable = 3;
    int failReg = -1;
    bool present = true;
    unsigned writes = 0, requests = 0;

    TwoWire() { resetChip(); }
    void resetChip() {
        regs.fill(0);
        regs[4] = 0x22; regs[5] = 1; regs[6] = 0xB1; regs[7] = 0x20;
    }
    void beginTransmission(uint8_t addr) { assert(addr == 0x53); tx.clear(); }
    size_t write(uint8_t v) { tx.push_back(v); return 1; }
    uint8_t endTransmission(bool stop = true) {
        if (!present) return 2;
        if (!tx.empty()) pointer = tx.front();
        if (tx.size() == 2) {
            assert(stop);
            ++writes;
            if (pointer == failReg) return 3;
            if (pointer == 0 && tx[1] == 0x10) resetChip();
            else regs[pointer] = tx[1];
            if (pointer == 4) timing.push_back(tx[1]);
        }
        return 0;
    }
    uint8_t requestFrom(uint8_t addr, uint8_t count) {
        assert(addr == 0x53);
        ++requests;
        rx.clear();
        unsigned reported = present ? std::min<unsigned>(count, limit) : 0;
        for (unsigned i = 0; i < std::min(reported, readable); ++i) rx.push_back(regs[pointer++]);
        return reported;
    }
    int available() { return int(rx.size()); }
    int read() {
        if (rx.empty()) return -1;
        int value = rx.front(); rx.pop_front(); return value;
    }
};
extern TwoWire Wire;
