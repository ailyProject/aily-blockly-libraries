#pragma once
#include <cstddef>
#include <cstdint>
#include <vector>

void delay(unsigned long);

class TwoWire {
public:
  void setClock(unsigned long hz) { frequency = hz; }
  void beginTransmission(uint8_t address) { selected = address; tx.clear(); }
  size_t write(uint8_t value);
  size_t write(const uint8_t *bytes, size_t count);
  uint8_t endTransmission(bool stop);
  uint8_t requestFrom(uint8_t address, uint8_t count);
  int read();

  bool connected = true, correctDevice = true, configured = false, selectedMemory = false;
  bool refuseKeys = false, discardCommit = false, shortWrite = false, shortRead = false;
  bool emptyFifo = false, pendingKey = false, repeatedStart = false;
  uint8_t access = 4, selected = 0, reg = 0;
  uint16_t capacity = 3000, staged = 0;
  unsigned long frequency = 0;
  unsigned entries = 0, exits = 0, commits = 0;
  std::vector<uint8_t> tx, rx;
};
