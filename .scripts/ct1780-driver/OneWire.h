#pragma once
#include <array>
#include <cmath>
#include <cstddef>
#include <cstdint>
#include <algorithm>
#include <cassert>
#include <vector>
inline unsigned elapsed;
inline void delay(unsigned ms) { elapsed += ms; }
class OneWire {
 public:
  explicit OneWire(uint8_t) {}
  std::array<uint8_t,8> rom{};
  std::array<uint8_t,9> scratch{};
  std::vector<uint8_t> sent;
  bool found = false;
  std::vector<std::array<uint8_t, 8>> prefix;
  size_t cursor = 0;
  bool search(uint8_t* address) {
    if (!prefix.empty()) {
      std::copy(prefix.front().begin(), prefix.front().end(), address);
      prefix.erase(prefix.begin());
      return true;
    }
    if (found) return false;
    found = true;
    std::copy(rom.begin(), rom.end(), address);
    return true;
  }
  bool reset() { cursor = 0; return true; }
  void select(uint8_t* address) { assert(std::equal(rom.begin(),rom.end(),address)); }
  void write(uint8_t command) { sent.push_back(command); }
  uint8_t read() { return scratch.at(cursor++); }
  static uint8_t crc8(const uint8_t* bytes, size_t n) {
    uint8_t value = 0;
    for(size_t i=0;i<n;i++) {
      value ^= bytes[i];
      for(unsigned bit=0;bit<8;bit++)value=(value>>1)^((value&1)?0x8c:0);
    }
    return value;
  }
};
