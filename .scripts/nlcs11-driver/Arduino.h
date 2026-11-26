#pragma once
#include <stdint.h>
uint32_t millis();

// Arduino cores provide this compatibility macro for sketch expressions.
inline uint16_t makeWord(uint16_t value) { return value; }
#define word(...) makeWord(__VA_ARGS__)
