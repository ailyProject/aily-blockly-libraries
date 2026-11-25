#pragma once
#include <algorithm>
#include <cmath>
#include <cstddef>
#include <cstdint>
#include <cstring>
using std::min;
enum BitOrder { LSBFIRST, MSBFIRST };
enum { LOW, HIGH, INPUT, OUTPUT };
inline void delay(unsigned long) {}
inline void delayMicroseconds(unsigned long) {}
inline void digitalWrite(int, int) {}
inline int digitalRead(int) { return LOW; }
inline void pinMode(int, int) {}
enum { HEX = 16 };
class Stream {
 public:
  void print(const char*) {}
  void print(uint32_t, int) {}
  void println() {}
};
extern Stream Serial;
