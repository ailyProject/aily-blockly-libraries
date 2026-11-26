#pragma once
#include <algorithm>
#include <cstddef>
#include <cstdint>
#include <vector>

class TwoWire {
 public:
  uint8_t status = 0, address = 0;
  size_t requests = 0, selections = 0, cursor = 0, capacity = 32;
  int reported = -1, failAt = -1;
  std::vector<uint8_t> tx, rx;

  void beginTransmission(uint8_t addr) { ++selections; address = addr; tx.clear(); }
  size_t write(uint8_t byte) { return write(&byte, 1); }
  size_t write(const uint8_t* bytes, size_t n) {
    const size_t sent = std::min(capacity - tx.size(), n);
    tx.insert(tx.end(), bytes, bytes + sent);
    return sent;
  }
  uint8_t endTransmission() { return status; }
  uint8_t requestFrom(uint8_t, uint8_t n) {
    ++requests; cursor = 0;
    return reported < 0 ? std::min<size_t>(n, rx.size()) : reported;
  }
  int available() const { return cursor < rx.size(); }
  int read() { return available() && int(cursor) != failAt ? rx[cursor++] : -1; }
};
extern TwoWire Wire;
