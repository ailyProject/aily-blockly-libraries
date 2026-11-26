#pragma once
#include <cmath>
#include <cstddef>
#include <cstdint>
extern unsigned long clockMs;
inline unsigned long partialUs = 0;
inline unsigned long micros() { return clockMs * 1000 + partialUs; }
inline void delayMicroseconds(unsigned int us) {
  partialUs += us; clockMs += partialUs / 1000; partialUs %= 1000;
}
inline void delay(unsigned long ms) { if (ms) delayMicroseconds(ms * 1000 - 150); }
struct QuietSerial { void println(const char*) {} };
extern QuietSerial Serial;
