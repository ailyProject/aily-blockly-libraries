#pragma once
#include <Arduino.h>
#include <algorithm>
#include <deque>
#include <vector>
class TwoWire {
public:
  std::deque<byte> input;
  std::vector<byte> writes;
  std::function<void()> onRequest;
  bool ack = true;
  bool rejectWrite = false;
  int countOverride = -1;
  void beginTransmission(uint8_t addr) { if (addr != 0x15) std::abort(); writes.clear(); }
  size_t write(uint8_t value) { if (rejectWrite) return 0; writes.push_back(value); return 1; }
  int endTransmission(bool) { return ack ? 0 : 2; }
  size_t requestFrom(uint8_t, uint8_t count, bool) {
    if (onRequest) onRequest();
    return countOverride >= 0 ? static_cast<size_t>(countOverride) : std::min(input.size(), size_t(count));
  }
  int available() { return int(input.size()); }
  int read() { if (input.empty()) return -1; int b = input.front(); input.pop_front(); return b; }
};
inline TwoWire Wire;
