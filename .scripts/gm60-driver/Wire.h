#pragma once
#include <Arduino.h>
#include <cassert>
#include <deque>
#include <vector>
class TwoWire {
public:
    std::vector<std::vector<uint8_t>> writes;
    std::deque<uint8_t> rx;
    void begin() {}
    void beginTransmission(int address) { assert(address == 0x1a); writes.emplace_back(); }
    size_t write(uint8_t value) { writes.back().push_back(value); return 1; }
    int endTransmission() { return 0; }
    size_t requestFrom(int address, int count) { assert(address == 0x1a && count == 1); return rx.empty() ? 0 : 1; }
    int read() {
        if (rx.empty()) return -1;
        auto b = rx.front(); rx.pop_front(); return b;
    }
};
extern TwoWire Wire;
