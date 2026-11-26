#pragma once
#include "Arduino.h"
#include <array>
#include <vector>

class TwoWire {
public:
    std::array<uint8_t,128> identities{};
    std::array<uint8_t,256> registers{};
    int writes = 0, frames = 0, failWrite = -1, failRead = -1;
    bool queueFailure = false, shortTransfer = false;
    std::array<int16_t,3> raw{100,0,-80};
    void beginTransmission(uint8_t addr) { selected = addr; tx.clear(); }
    size_t write(uint8_t value) {
        if (queueFailure) return 0;
        tx.push_back(value); return 1;
    }
    uint8_t endTransmission(bool=true) {
        if (!identities[selected]) return 2;
        if (!tx.empty()) reg = tx.front();
        if (tx.size() == 2) {
            if (reg == failWrite) return 3;
            ++writes; registers[reg] = tx[1];
        }
        return 0;
    }
    size_t requestFrom(uint8_t addr,size_t count,bool) {
        pos=0; rx.clear();
        if (!identities[addr]) return 0;
        if (reg==0 && count==1) rx.push_back(identities[addr]);
        else if (reg==1 && count==6) {
            ++frames;
            for (uint16_t v : raw) { rx.push_back(v & 255); rx.push_back(v >> 8); }
        }
        else rx.resize(count);
        return shortTransfer ? 0 : count;
    }
    int read() {
        if(pos==failRead || pos>=int(rx.size())) return -1;
        return rx[pos++];
    }
private:
    uint8_t selected=0, reg=0;
    int pos=0; std::vector<uint8_t> rx,tx;
};
extern TwoWire Wire;
