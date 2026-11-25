#pragma once
#include <cstdint>

template<class T, class L, class H>
inline T constrain(T value, L low, H high) {
    return value < low ? low : value > high ? high : value;
}
inline void delay(unsigned long) {}
inline void delayMicroseconds(unsigned int) {}
