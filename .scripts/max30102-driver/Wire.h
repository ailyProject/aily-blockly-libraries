#pragma once
#include <array>
#include <cstddef>
#include <cstdint>
#include <vector>
#include "Arduino.h"

class TwoWire {
public:
  std::array<uint8_t, 256> regs{};
  std::array<std::array<uint8_t, 6>, 32> fifo{};
  bool present = true, failSelect = false, failWrite = false, failRewind = false;
  bool resetStuck = false, tempStuck = false;
  int shortAt = -1, readFault = -1, failRegister = -1;
  unsigned configWrites = 0;
  uint8_t id = 0x15;
  void begin() {}
  void setClock(uint32_t) {}
  void beginTransmission(uint8_t address) { dest = address; tx.clear(); }
  size_t write(uint8_t value) {
    if (failWrite) return 0;
    tx.push_back(value);
    return 1;
  }
  int endTransmission(bool stop = true) {
    if (!present || dest != 0x57 || tx.empty()) return 2;
    selected = tx[0];
    if (tx.size() == 1) return failSelect || stop ? 3 : 0;
    if (failRewind && selected == 6) return 3;
    ++configWrites;
    regs[selected] = tx[1];
    if (selected == 9 && (tx[1] & 0x40) && !resetStuck) regs.fill(0);
    if (selected == 0x21 && tx[1] == 1) tempStarted = millis();
    return 0;
  }
  size_t requestFrom(uint8_t address, uint8_t count) {
    rx.clear();
    cursor = 0;
    if (!present || address != 0x57 || selected == failRegister) return 0;
    if (selected == 7) {
      const auto &frame = fifo[regs[6]];
      const size_t size = shortAt < 0 ? count : size_t(shortAt);
      shortAt = -1;
      if (size) { regs[6] = (regs[6]+1) % 32; regs[5] = 0; }
      rx.assign(frame.begin(), frame.begin()+size);
    } else {
      if (selected == 0x21 && !tempStuck && millis()-tempStarted >= 29) regs[0x21] = 0;
      rx.push_back(selected == 0xff ? id : regs[selected]);
      if (selected == 0 || selected == 1) regs[selected] = 0;
    }
    return rx.size();
  }
  int available() { return int(rx.size() - cursor); }
  int read() {
    if (!available()) return -1;
    if (selected == 7 && int(cursor) == readFault) { ++cursor; readFault = -1; return -1; }
    return rx[cursor++];
  }
  void sample(uint32_t red, uint32_t ir) {
    fifo[regs[4]] = {uint8_t(red>>16),uint8_t(red>>8),uint8_t(red),uint8_t(ir>>16),uint8_t(ir>>8),uint8_t(ir)};
    regs[4] = (regs[4]+1) % 32;
    regs[0] |= 0x40;
  }
private:
  uint8_t dest = 0, selected = 0;
  unsigned long tempStarted = 0;
  std::vector<uint8_t> tx, rx;
  size_t cursor = 0;
};
extern TwoWire Wire;
