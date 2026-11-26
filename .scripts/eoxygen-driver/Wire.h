#pragma once
#include <algorithm>
#include <stdint.h>
#include <vector>
class TwoWire {
public:
  uint8_t physical = 0x70, selected = 0, pointer = 0, flags = 0;
  bool connected = true, rejectCommand = false;
  int reported = -1, failReadAt = -1, failWriteAt = -1;
  unsigned cursor = 0;
  std::vector<uint8_t> oxygen{20,9,0}, tx, rx;
  void begin() {}
  void setClock(unsigned) {}
  void beginTransmission(uint8_t addr) { selected = addr; tx.clear(); }
  unsigned write(uint8_t value) {
    if (int(tx.size()) == failWriteAt) return 0;
    tx.push_back(value); return 1;
  }
  uint8_t endTransmission() {
    if (!connected || selected != physical) return 2;
    if (tx.empty()) return 0;
    if (tx.size() == 2 && rejectCommand) return 3;
    pointer = tx[0];
    if (pointer == 0x18 && tx.size() == 2) flags = tx[1] == 3 ? 0 : flags | tx[1];
    return 0;
  }
  uint8_t requestFrom(uint8_t addr, uint8_t len) {
    cursor = 0;
    rx = pointer == 0x10 ? oxygen : std::vector<uint8_t>{flags};
    if (!connected || addr != physical) rx.clear();
    return reported >= 0 ? reported : std::min<unsigned>(len, rx.size());
  }
  int available() { return cursor < rx.size(); }
  int read() { return available() && int(cursor) != failReadAt ? rx[cursor++] : -1; }
};
extern TwoWire Wire;
