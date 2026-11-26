#pragma once
#include "Arduino.h"
#include <algorithm>
#include <array>
#include <vector>

// A single addressable device with the QMI8658 output bank's byte-order control.
class TwoWire {
public:
  std::array<uint8_t, 256> registers{};
  uint8_t deviceAddress = 0x6b;
  bool attached = true;
  int shortReadRegister = -1;
  unsigned writes = 0;

  void begin(int, int, uint32_t) {}

  void beginTransmission(uint8_t address) {
    selected = address;
    transmission.clear();
  }

  size_t write(uint8_t value) {
    transmission.push_back(value);
    return 1;
  }

  int endTransmission(bool = true) {
    if (!attached || selected != deviceAddress) return 2;
    if (transmission.empty()) return 0;
    pointer = transmission.front();
    for (size_t i = 1; i < transmission.size(); ++i) {
      registers[pointer++] = transmission[i];
      ++writes;
    }
    return 0;
  }

  size_t requestFrom(uint16_t address, size_t count, bool = true) {
    reply.clear();
    index = 0;
    if (!attached || address != deviceAddress) return 0;
    if (pointer == shortReadRegister) count = std::min(count, size_t(1));
    for (size_t i = 0; i < count; ++i) {
      const bool sample = pointer >= 0x33 && pointer <= 0x40;
      const uint8_t reg = sample && (registers[2] & 0x20)
        ? uint8_t(0x33 + ((pointer - 0x33) ^ 1))
        : pointer;
      reply.push_back(registers[reg]);
      if (registers[2] & 0x40) ++pointer;
    }
    return reply.size();
  }

  int available() const { return static_cast<int>(reply.size() - index); }
  int read() { return available() ? reply[index++] : -1; }

private:
  uint8_t selected = 0;
  uint8_t pointer = 0;
  size_t index = 0;
  std::vector<uint8_t> transmission, reply;
};

extern TwoWire Wire;
