#pragma once
#include "Arduino.h"
#include <array>
#include <cassert>
#include <vector>
struct TwoWire {
  struct Chip { bool online = true; std::array<uint8_t, 256> regs{}; };
  Chip accel, mag;
  std::vector<uint8_t> tx;
  uint8_t addr = 0, pointer = 0;
  bool pending = false, repeated = false;
  int shortReg = -1, emptyReg = -1, readErrorReg = -1, writeErrorReg = -1;
  int writeLimit = 2;
  Chip& chip(uint8_t address) {
    assert(address == 0x1d || address == 0x1e);
    return address == 0x1d ? accel : mag;
  }
  void beginTransmission(uint8_t address) {
    assert(!repeated);
    addr = address;
    tx.clear();
  }
  size_t write(uint8_t x) {
    if (int(tx.size()) >= writeLimit) return 0;
    tx.push_back(x); return 1;
  }
  uint8_t endTransmission(bool stop = true) {
    if (!chip(addr).online || (tx.size() == 2 && tx[0] == writeErrorReg)) return 2;
    if (!tx.empty()) pointer = tx[0];
    if (tx.size() == 2) chip(addr).regs[pointer] = tx[1];
    repeated = !stop;
    return 0;
  }
  uint8_t requestFrom(uint8_t address, uint8_t count) {
    assert(repeated && address == addr && count == 1);
    repeated = false;
    pending = pointer != shortReg && pointer != emptyReg;
    return pointer == shortReg ? 0 : 1;
  }
  int available() { return pending ? 1 : 0; }
  int read() {
    assert(pending); pending = false;
    return pointer == readErrorReg ? -1 : chip(addr).regs[pointer];
  }
};
extern TwoWire Wire;
