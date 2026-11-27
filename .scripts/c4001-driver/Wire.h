#pragma once
#include "Arduino.h"
#include <deque>
#include <vector>
class TwoWire {
public:
  unsigned address=0, requested=0, error=0;
  bool lastStop=true;
  std::vector<uint8_t> tx;
  std::deque<uint8_t> rx;
  void begin() {}
  void beginTransmission(uint8_t a) { address=a; tx.clear(); }
  size_t write(uint8_t value) { tx.push_back(value); return 1; }
  size_t write(const uint8_t* bytes,size_t n) { tx.insert(tx.end(),bytes,bytes+n);return n; }
  int endTransmission(bool stop=true) { lastStop=stop;return error; }
  size_t requestFrom(uint8_t a,uint8_t len) { address=a;requested=len; return rx.size(); }
  int available() const { return rx.size(); }
  int read() { int b=rx.front();rx.pop_front();return b; }
};
inline TwoWire Wire;
