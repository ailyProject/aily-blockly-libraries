#pragma once
#include "Arduino.h"
#include <array>

struct TwoWire {
    std::array<uint8_t, 256> registers{};
    uint8_t address = 0x62, pointer = 0;
    int queued = 0, index = 0, got = 0, polls = 0;
    int nack = -1, shortRegister = -1, emptyRegister = -1;
    bool online = true, stuck = false, repeated = false, rejectPayload = false;

    void beginTransmission(uint8_t target) { address = target; queued = 0; repeated = false; }
    size_t write(uint8_t value) { pointer = value; ++queued; return 1; }
    size_t write(const uint8_t* values, size_t count) {
        if (rejectPayload) return 0;
        if (online && pointer != nack) {
            for (size_t i = 0; i < count; ++i) registers[pointer + i] = values[i];
            if (pointer == 0) polls = 0;
        }
        queued += count;
        return count;
    }
    int endTransmission(bool stop = true) {
        repeated = !stop && queued == 1;
        return !online || address != 0x62 || (queued && pointer == nack) ? 2 : 0;
    }
    uint8_t requestFrom(uint8_t target, uint8_t count) {
        got = repeated && target == address && online ? count - (pointer == shortRegister) : 0;
        repeated = false; index = 0;
        return got;
    }
    int available() { return got - index; }
    int read() {
        if (index >= got || pointer == emptyRegister) return -1;
        const int reg = pointer + index++;
        if (reg == 1) return ++polls <= 2 || stuck ? 1 : 0;
        return registers[reg];
    }
};
extern TwoWire Wire;
