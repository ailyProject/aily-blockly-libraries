#pragma once
#include <stddef.h>
#include <stdint.h>

extern unsigned long elapsedUs;
inline void delay(unsigned long ms) { elapsedUs += ms * 1000; }
inline void delayMicroseconds(unsigned int us) { elapsedUs += us; }
