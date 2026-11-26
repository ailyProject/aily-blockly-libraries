#pragma once
#include <cmath>
#include <cstddef>
#include <cstdint>
extern unsigned long clockMs;
inline void delay(unsigned long ms) { clockMs += ms; }
struct QuietSerial { void println(const char*) {} };
extern QuietSerial Serial;
