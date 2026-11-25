#pragma once
#include <Arduino.h>
#include <array>
#include <vector>
class TwoWire {
 public:
  bool connected = true;
  uint8_t address = 0x40;
  int failRead = -1, failWrite = -1;
  unsigned writes = 0;
  std::array<uint64_t, 64> registers{};
  void begin() {}
  void end() {}
  void setClock(uint32_t) {}
  void beginTransmission(uint8_t address) { selected = address; tx.clear(); }
  size_t write(const uint8_t* bytes, size_t len) {
    tx.insert(tx.end(), bytes, bytes + len);
    return len;
  }
  uint8_t endTransmission(bool = true) {
    if (!connected || selected != address) return 2;
    if (tx.empty()) return 0;
    pointer = tx.front();
    if (pointer >= registers.size()) return 3;
    if (tx.size() == 1) return 0;
    if (pointer == failWrite) return 3;
    ++writes;
    uint64_t value = 0;
    for (size_t i = 1; i < tx.size(); ++i) value = (value << 8) | tx[i];
    registers[pointer] = value;
    return 0;
  }
  size_t requestFrom(uint8_t addr, uint8_t count, uint8_t) {
    rx.clear(); cursor = 0;
    if (!connected || addr != address || pointer == failRead) return 0;
    for (int i = count - 1; i >= 0; --i) rx.push_back(registers[pointer] >> (8*i));
    return rx.size();
  }
  int read() { return cursor < rx.size() ? rx[cursor++] : -1; }
 private:
  uint8_t selected = 0, pointer = 0;
  size_t cursor = 0;
  std::vector<uint8_t> tx, rx;
};
extern TwoWire Wire;
