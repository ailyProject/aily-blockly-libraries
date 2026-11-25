#pragma once
#include <Arduino.h>
enum { SPI_MODE0, SPI_MODE1, SPI_MODE2, SPI_MODE3 };
class SPISettings {
 public:
  SPISettings(uint32_t, BitOrder, uint8_t) {}
};
class SPIClass {
 public:
  void begin() {}
  void beginTransaction(const SPISettings&) {}
  void endTransaction() {}
  uint8_t transfer(uint8_t value) { return value; }
  void transfer(uint8_t*, size_t) {}
};
extern SPIClass SPI;
