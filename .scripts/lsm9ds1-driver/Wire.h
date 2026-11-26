#pragma once
#include "Arduino.h"
#include <array>
#include <cassert>
#include <vector>
struct TwoWire {
  struct Die {
    std::array<uint8_t, 128> regs{};
    bool online = true;
    unsigned writes = 0;
  } ag, mag;
  uint8_t agAddress = 0x6b, magAddress = 0x1e;
  int failWriteReg = -1, shortRegister = -1, badReadIndex = -1, queueLimit = -1;
  std::vector<uint8_t> tx, rx;
  Die *current = nullptr;
  bool repeated = false;
  size_t offset = 0;
  void beginTransmission(uint8_t address) {
    assert(!repeated);
    current = address == agAddress ? &ag : address == magAddress ? &mag : nullptr;
    tx.clear();
  }
  size_t write(uint8_t value) {
    if (int(tx.size()) == queueLimit) return 0;
    tx.push_back(value);
    return 1;
  }
  uint8_t endTransmission(bool stop = true) {
    if (!current || !current->online || tx.empty()) return 2;
    if (tx.size() == 2) {
      if (tx[0] == failWriteReg) return 3;
      current->regs.at(tx[0] & 127) = tx[1];
      ++current->writes;
    }
    repeated = !stop;
    return 0;
  }
  uint8_t requestFrom(uint8_t address, uint8_t count) {
    assert(repeated && (address == agAddress || address == magAddress));
    repeated = false;
    const auto pointer = tx.at(0) & 127;
    if (pointer == shortRegister && count) --count;
    offset = 0;
    rx.assign(current->regs.begin() + pointer, current->regs.begin() + pointer + count);
    return count;
  }
  int available() const { return int(rx.size() - offset); }
  int read() { const size_t i = offset++; return i >= rx.size() || int(i) == badReadIndex ? -1 : rx[i]; }
};
extern TwoWire Wire;
