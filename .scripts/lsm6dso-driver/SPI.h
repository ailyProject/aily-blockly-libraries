#pragma once
#include "Arduino.h"
struct SPISettings {};
struct SPIClass {
  void beginTransaction(SPISettings) {}
  void endTransaction() {}
  uint8_t transfer(uint8_t) { return 0; }
  void transfer(void *, size_t) {}
};
extern SPIClass SPI;
