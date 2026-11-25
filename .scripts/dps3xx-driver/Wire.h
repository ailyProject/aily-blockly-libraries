#pragma once
#include <algorithm>
#include <array>
#include <cstdint>
#include <vector>

class TwoWire {
public:
    std::array<uint8_t, 256> registers{};
    uint8_t address = 0x77;
    int truncatedRegister = -1;
    int truncatedLength = 0;
    int rejectedWrite = -1;
    int rejectedPointer = -1;

    void begin() {}

    void beginTransmission(uint8_t address) {
        peer = address;
        outgoing.clear();
    }

    size_t write(uint8_t byte) {
        outgoing.push_back(byte);
        return 1;
    }

    int endTransmission(bool = true) {
        if (peer != address || outgoing.empty()) return 2;
        const uint8_t reg = outgoing.front();
        if (outgoing.size() == 1 && reg == rejectedPointer) return 3;
        if (outgoing.size() == 2 && reg == rejectedWrite) return 3;
        pointer = reg;
        if (outgoing.size() == 2) {
            registers[reg] = outgoing.back();
            if (reg == 0x08) {
                const uint8_t mode = outgoing.back() & 7;
                registers[reg] = 0xc0;
                if (mode == 1) registers[reg] |= 0x10;
                if (mode == 2) registers[reg] |= 0x20;
            }
        }
        return 0;
    }

    int requestFrom(uint8_t address, uint8_t length, uint8_t) {
        if (address != this->address) return 0;
        if (pointer == truncatedRegister) return std::min<int>(length, truncatedLength);
        return length;
    }

    int read() { return registers[pointer++]; }

private:
    uint8_t peer = 0;
    uint8_t pointer = 0;
    std::vector<uint8_t> outgoing;
};
