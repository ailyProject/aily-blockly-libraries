#pragma once
#include <cstdint>
#include <cstddef>
using byte = uint8_t;
constexpr int HIGH = 1, LOW = 0;
extern uint32_t nowMs;
inline uint32_t millis() { return nowMs; }
inline void delay(unsigned long ms) { nowMs += ms; }
inline void digitalWrite(int, int) {}
inline int digitalRead(int) { return LOW; }
