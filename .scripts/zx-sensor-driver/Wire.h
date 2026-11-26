#pragma once
#include <array>
#include <cassert>
#include <cstdint>
#include <vector>

class TwoWire {
public:
    enum class Fault { none, nack, queue, shortRead, unavailable, invalidByte };
    std::array<uint8_t, 256> bytes{};
    int address = 0x10;
    int transfers = 0;
    int failAt = 0;
    Fault fault = Fault::none;
    bool absent = false;

    void begin() {}
    void beginTransmission(int selected) { assert(selected == address); tx.clear(); ++transfers; }
    unsigned write(uint8_t value) {
        if (failed(Fault::queue)) return 0;
        tx.push_back(value);
        return 1;
    }
    int endTransmission() {
        if (absent || failed(Fault::nack)) return 2;
        if (!tx.empty()) pointer = tx.front();
        if (tx.size() == 2) bytes[pointer] = tx.back();
        return 0;
    }
    unsigned requestFrom(int selected, int count) {
        assert(selected == address && count == 1);
        ++transfers;
        readable = !absent && !failed(Fault::shortRead) && !failed(Fault::unavailable);
        return (absent || failed(Fault::shortRead)) ? 0 : 1;
    }
    int available() const { return readable ? 1 : 0; }
    int read() {
        if (!readable || failed(Fault::invalidByte)) return -1;
        readable = false;
        return bytes[pointer];
    }
private:
    bool failed(Fault kind) const { return fault == kind && (failAt == 0 || transfers == failAt); }
    std::vector<uint8_t> tx;
    uint8_t pointer = 0;
    bool readable = false;
};
extern TwoWire Wire;
