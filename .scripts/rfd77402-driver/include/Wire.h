#pragma once
#include <array>
#include <cassert>
#include <cstdint>
#include <vector>

class TwoWire {
public:
  uint16_t result = 0x8000, confidence = 7, chipId = 0xad01;
  bool ready = true, present = true, failQueue = false;
  bool calibration = false;
  unsigned mailboxWords = 0, transactions = 0;
  int nackReadPointer = -1, nackWrite = -1, shortRead = -1, negativeByte = -1;
  std::array<uint16_t,256> regs{};
  void begin() {}
  void setClock(uint32_t rate) { clock = rate; }
  void beginTransmission(int address) { assert(address == 0x4c); tx.clear(); }
  unsigned write(uint8_t value) { if (failQueue) return 0; tx.push_back(value); return 1; }
  int endTransmission() {
    ++transactions;
    if (!present || tx.empty()) return 2;
    reg = tx[0];
    if (tx.size() == 1) return reg == nackReadPointer ? 2 : 0;
    if (reg == nackWrite) return 3;
    regs[reg] = tx[1];
    if (tx.size() == 3) regs[reg] |= uint16_t(tx[2]) << 8;
    if (reg == 0x10 && regs[reg] == 6) calibration = true;
    return 0;
  }
  int requestFrom(uint8_t address, uint8_t count) {
    assert(address == 0x4c && (count == 1 || count == 2));
    cursor = 0; rx.clear();
    if (!present) return 0;
    uint16_t value = regs[reg];
    switch (reg) {
      case 0x28: value = chipId; break;
      case 6: value = regs[4] == 0x92 ? 0x18 : regs[4] == 0x91 ? 0x10 : 0; break;
      case 0: value = (ready ? 0x10 : 0) | (calibration ? 0x20 : 0); break;
      case 8: value = result; break;
      case 10: value = confidence; break;
      case 0x12: value = 0xab00 | mailboxWords++; break;
    }
    for (int i = 0; i < count - (reg == shortRead ? 1 : 0); ++i) rx.push_back((value >> (8*i)) & 255);
    return int(rx.size());
  }
  int available() const { return int(rx.size() - cursor); }
  int read() { if (!available()) return -1; int value = rx[cursor++]; return reg == negativeByte ? -1 : value; }
  uint32_t clock = 0;
private:
  std::vector<uint8_t> tx, rx;
  unsigned cursor = 0;
  uint8_t reg = 0;
};
extern TwoWire Wire;
