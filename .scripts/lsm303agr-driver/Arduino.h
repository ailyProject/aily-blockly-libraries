#pragma once
#include <cmath>
#include "Wire.h"
extern unsigned long testTimeMs;
inline unsigned long millis() { return testTimeMs; }
inline void delay(unsigned long ms) { testTimeMs += ms; }
