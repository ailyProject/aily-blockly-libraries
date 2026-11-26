#pragma once
#include <stdint.h>
extern unsigned long elapsed;
inline void delay(unsigned long ms) { elapsed += ms; }
