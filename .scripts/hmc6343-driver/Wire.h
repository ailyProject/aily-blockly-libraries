#pragma once
#include "Arduino.h"
#include <algorithm>
#include <cassert>
#include <vector>

class TwoWire {
public:
  bool ack = true;
  int acceptedWrites = 3;
  int expectedDelayUs = 0;
  int reportedLength = -1;
  int readsRequested = 0;
  std::vector<uint8_t> reply, tx;

  void beginTransmission(uint8_t addr) {
    assert(addr == 0x19);
    tx.clear();
  }
  size_t write(uint8_t byte) {
    if ((int)tx.size() >= acceptedWrites) return 0;
    tx.push_back(byte);
    return 1;
  }
  uint8_t endTransmission() { sentAt = elapsedUs; return ack ? 0 : 2; }
  uint8_t requestFrom(uint8_t addr, uint8_t count) {
    assert(addr == 0x19 && elapsedUs - sentAt >= (unsigned)expectedDelayUs);
    ++readsRequested;
    cursor = 0;
    limit = std::min(reply.size(), (size_t)count);
    return reportedLength < 0 ? (uint8_t)limit : (uint8_t)reportedLength;
  }
  int available() { return (int)(limit - cursor); }
  int read() { return available() ? reply[cursor++] : -1; }
private:
  size_t cursor = 0, limit = 0;
  unsigned long sentAt = 0;
};
extern TwoWire Wire;
