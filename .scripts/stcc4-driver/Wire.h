#pragma once
#include "Arduino.h"
#include <algorithm>
#include <vector>
class TwoWire {
public:
  uint8_t addr = 0, endStatus = 0;
  unsigned long wroteAt = 0, minDelay = 0;
  size_t pos = 0;
  std::vector<uint8_t> tx, response;
  void setClock(unsigned long) {}
  void begin() {}
  void beginTransmission(uint8_t address) { addr = address; tx.clear(); }
  size_t write(uint8_t b) { tx.push_back(b); return 1; }
  uint8_t endTransmission() { wroteAt = clockMs; return endStatus; }
  size_t requestFrom(uint8_t, uint8_t n) {
    pos = 0;
    return clockMs - wroteAt < minDelay ? 0 : std::min(response.size(), size_t(n));
  }
  int read() { return pos < response.size() ? response[pos++] : -1; }
};
extern TwoWire Wire;
