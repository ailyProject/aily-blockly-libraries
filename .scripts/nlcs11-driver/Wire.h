#pragma once
#include <algorithm>
#include <cstdint>
#include <vector>

class TwoWire {
 public:
  uint8_t address = 0, status = 0;
  size_t capacity = 8, advertised = 8, readable = 8, received = 8, requests = 0;
  std::vector<uint8_t> sent, frame{25, 0, 50, 0, 75, 0, 100, 0};
  void beginTransmission(uint8_t addr) { address = addr; sent.clear(); }
  size_t write(uint8_t byte) { return write(&byte, 1); }
  size_t write(const uint8_t* data, size_t n) {
    n = std::min(n, capacity - sent.size());
    sent.insert(sent.end(), data, data + n);
    return n;
  }
  uint8_t endTransmission() { return status; }
  size_t requestFrom(uint8_t addr, uint8_t) { address = addr; ++requests; return advertised; }
  int available() const { return static_cast<int>(readable); }
  size_t readBytes(uint8_t* out, size_t n) {
    n = std::min(n, std::min(received, frame.size()));
    std::copy_n(frame.begin(), n, out);
    return n;
  }
};
extern TwoWire Wire;
