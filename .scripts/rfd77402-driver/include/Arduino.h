#pragma once
#include <cstdint>
using boolean = bool;
using byte = uint8_t;
extern unsigned long delayedMs;
inline void delay(unsigned long ms) { delayedMs += ms; }
