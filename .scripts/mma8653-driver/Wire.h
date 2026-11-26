#pragma once

#include "Arduino.h"
#include <algorithm>
#include <array>
#include <cassert>

// Register-level test peer. A failed selector and a short data burst are independent.
struct TestWire {
    std::array<byte, 256> regs{};
    bool online = true;
    int rejectReg = -1;
    int shortBurst = 6;
    int index = 0, selected = 0, cursor = 0, remaining = 0;
    byte pending = 0;
    void begin() {}
    void beginTransmission(byte address) { assert(address == 0x1d); index = 0; }
    size_t write(byte value) {
        if (index++ == 0) selected = value;
        else pending = value;
        return 1;
    }
    byte endTransmission(bool = true) {
        if (!online || selected == rejectReg) return 2;
        if (index == 2) {
            if (selected == 0x2b && pending == 0x40) {
                regs.fill(0);
                regs[0x0d] = 0x5a;
            } else regs[selected] = pending;
        }
        return 0;
    }
    byte requestFrom(byte, byte count) {
        cursor = selected;
        remaining = online ? std::min(int(count), selected == 1 ? shortBurst : 6) : 0;
        return remaining;
    }
    int available() const { return remaining; }
    int read() {
        if (!remaining) return -1;
        --remaining;
        const byte value = regs[cursor];
        cursor += selected == 1 && (regs[0x2a] & 2) ? 2 : 1;
        return value;
    }
};
extern TestWire Wire;
