#pragma once
#include "Arduino.h"
constexpr int MSBFIRST = 1, SPI_MODE0 = 0;
struct SPISettings { SPISettings(unsigned long, int, int) {} };
struct SPIClass {
  void begin() {}
  void beginTransaction(SPISettings) {}
  uint8_t transfer(uint8_t) { return 0xff; }
};
extern SPIClass SPI;
