#pragma once
#include <cassert>
#include <cstdint>
#include <vector>
struct TestWire {
    uint8_t address = 0x06;
    int angle = 0;
    int reg = -1, nack = -1, shortRead = -1, missingByte = -1;
    bool present = true, selected = false;
    unsigned accesses = 0;
    std::vector<int> reads;
    void begin() {}
    void setClock(unsigned speed) { assert(speed == 400000); }
    void beginTransmission(uint8_t addr) { selected = addr == address; reg = -1; }
    int write(uint8_t value) { reg = value; return 1; }
    int endTransmission(bool stop = true) {
        ++accesses;
        if (!present || !selected || (reg >= 0 && reg == nack)) return 2;
        assert(stop == (reg < 0)); return 0;
    }
    int requestFrom(uint8_t addr, uint8_t len) {
        assert(addr == address && len == 1 && (reg == 3 || reg == 4));
        reads.push_back(reg); return int(reg != shortRead);
    }
    int available() { return int(reg != missingByte); }
    int read() { return reg == 3 ? angle >> 6 : ((angle << 2) & 255) | 3; }
};
extern TestWire Wire;
