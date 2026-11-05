#pragma once
#include <stdint.h>
class TwoWire {
public:
  int failReg = -1;
  bool shortRead = false;
  uint8_t reg = 0, index = 0;
  void begin() {}
  void beginTransmission(uint8_t) {}
  void write(uint8_t value) { reg = value; index = 0; }
  uint8_t endTransmission(bool) { return reg == failReg && !shortRead ? 4 : 0; }
  uint8_t requestFrom(uint8_t, uint8_t count) {
    return reg == failReg && shortRead ? count - 1 : count;
  }
  uint8_t read() {
    const uint16_t value = reg == 0x3C ? 1234 : reg == 0x02 ? 5678 : 2300;
    return index++ == 0 ? value & 0xff : value >> 8;
  }
};
extern TwoWire Wire;
