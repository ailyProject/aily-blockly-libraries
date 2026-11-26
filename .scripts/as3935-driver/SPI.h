#pragma once
#include "Arduino.h"
#include <vector>
constexpr int MSBFIRST = 1, SPI_MODE1 = 1;
struct SPISettings {
    uint32_t speed; int order, mode;
    SPISettings(uint32_t s = 0, int o = 0, int m = 0) : speed(s), order(o), mode(m) {}
};
struct SPIClass {
    uint8_t regs[64]{}, command = 0;
    int stuck = -1, transfers = 0, completedReads = 0;
    bool active = false;
    std::vector<uint8_t> edges;
    void beginTransaction(SPISettings settings);
    uint8_t transfer(uint8_t byte);
    void endTransaction();
};
extern SPIClass SPI;
