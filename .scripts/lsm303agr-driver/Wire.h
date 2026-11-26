#pragma once
#include <array>
#include <cstddef>
#include <cstdint>
using byte = uint8_t;

struct TwoWire {
    std::array<std::array<uint8_t, 256>, 2> regs{};
    std::array<bool, 2> present{{true, true}};
    uint8_t die = 0, reg = 0, value = 0;
    int writes = 0, left = 0, capacity = 32, limit = 32;
    void begin() {}
    void beginTransmission(uint8_t address) {
        die = address == 0x19 ? 0 : address == 0x1e ? 1 : 2;
        writes = 0;
    }
    size_t write(uint8_t b) {
        if (writes >= capacity) return 0;
        if (writes++ == 0) reg = b; else value = b;
        return 1;
    }
    uint8_t endTransmission(bool) {
        if (die > 1 || !present[die]) return 2;
        if (writes == 2) regs[die][reg] = value;
        return 0;
    }
    uint8_t requestFrom(uint8_t addr, uint8_t size) {
        if (die > 1 || !present[die] || addr != (die == 0 ? 0x19 : 0x1e)) return 0;
        left = size > limit ? limit : size;
        return left;
    }
    int available() { return left; }
    int read() { if (left <= 0) return -1; --left; return regs[die][reg++]; }
};
