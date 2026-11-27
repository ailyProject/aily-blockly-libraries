#pragma once
#include <cstdint>
#include <cstdlib>
#include <cstring>
#include <string>
#include <cmath>
using String = std::string;
inline uint32_t clockMs = 0;
inline uint32_t millis() { return clockMs++; }
inline void delay(uint32_t amount) { clockMs += amount; }
constexpr int INPUT = 0, HIGH = 1, SERIAL_8N1 = 0x800001c;
inline int outState = 0;
inline void pinMode(int, int) {}
inline void digitalWrite(int,int) {}
inline int digitalRead(int) { return outState; }
