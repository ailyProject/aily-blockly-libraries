#pragma once
#include <cstdint>
#include <cstddef>
constexpr uint8_t HIGH = 1, LOW = 0, OUTPUT = 1;
inline void pinMode(uint8_t, uint8_t) {}
void digitalWrite(uint8_t, uint8_t);
void delay(unsigned long);
