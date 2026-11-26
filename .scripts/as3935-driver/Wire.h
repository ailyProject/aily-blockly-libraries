#pragma once
#include "Arduino.h"
#include <vector>
struct TwoWire {
    uint8_t regs[64]{}, pointer = 0, address = 0;
    bool online = true, ignoreWrites = false, shortDataWrite = false, shortPointer = false;
    int unreadableReg = -1, negativeReg = -1, nackPointer = -1, badRequestAddress = 0;
    std::vector<uint8_t> tx, writeLog, readLog;
    void beginTransmission(uint8_t addr) { address = addr; tx.clear(); }
    size_t write(uint8_t value) {
        if ((shortPointer && tx.empty()) || (shortDataWrite && !tx.empty())) return 0;
        tx.push_back(value);
        return 1;
    }
    uint8_t endTransmission(bool = true) {
        if (!online || address != 3) return 2;
        if (!tx.empty()) pointer = tx[0];
        if (tx.size() == 1 && nackPointer == pointer) return 2;
        if (tx.size() == 2) {
            writeLog.push_back(pointer);
            if (!ignoreWrites) regs[pointer] = tx[1];
        }
        return 0;
    }
    uint8_t requestFrom(uint8_t addr, uint8_t count) {
        if (addr != address || count != 1) ++badRequestAddress;
        readLog.push_back(pointer);
        return online && unreadableReg != pointer;
    }
    int read() { return negativeReg == pointer ? -1 : regs[pointer]; }
};
extern TwoWire Wire;
