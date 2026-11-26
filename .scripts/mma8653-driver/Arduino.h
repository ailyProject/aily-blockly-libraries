#pragma once

#include <cmath>
#include <cstddef>
#include <cstdint>

using byte = uint8_t;
constexpr double PI = 3.14159265358979323846;
inline void delay(unsigned long) {}
#define bitRead(value, bit) (((value) >> (bit)) & 1)
