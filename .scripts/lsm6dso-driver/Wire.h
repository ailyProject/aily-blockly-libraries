#pragma once
#include "Arduino.h"
#include <algorithm>
#include <array>
#include <cassert>
#include <vector>

struct TwoWire {
  std::array<uint8_t,256> regs{};
  uint8_t deviceAddress = 0x6b, address = 0, pointer = 0;
  std::vector<uint8_t> tx, rx;
  int truncateReg = -1, failWriteReg = -1, failQueueAfter = -1, failedReadByte = -1;
  bool online = true, repeated = false;
  size_t index = 0;
  unsigned writes = 0;
  void beginTransmission(uint8_t a) { assert(!repeated); address = a; tx.clear(); }
  size_t write(uint8_t b) {
    if (int(tx.size()) == failQueueAfter) return 0;
    tx.push_back(b);
    return 1;
  }
  uint8_t endTransmission(bool stop = true) {
    if (!online || address != deviceAddress || tx.empty()) return 2;
    pointer = tx[0];
    if (tx.size() > 1) {
      if (pointer == failWriteReg) return 3;
      ++writes; std::copy(tx.begin()+1, tx.end(), regs.begin()+pointer);
    }
    repeated = !stop;
    return 0;
  }
  uint8_t requestFrom(uint8_t a, uint8_t count) {
    assert(repeated && a == address);
    repeated = false; index = 0;
    if (pointer == truncateReg && count) --count;
    rx.assign(regs.begin()+pointer, regs.begin()+pointer+count);
    return count;
  }
  int available() const { return int(rx.size()-index); }
  int read() {
    const size_t pos = index++;
    return pos < rx.size() && int(pos) != failedReadByte ? rx[pos] : -1;
  }
};
extern TwoWire Wire;
