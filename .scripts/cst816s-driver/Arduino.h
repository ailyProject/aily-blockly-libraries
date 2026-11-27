#pragma once
#include <array>
#include <cstdint>
#include <functional>
#include <string>
using byte = uint8_t;
using String = std::string;
enum PinStatus { LOW, HIGH, RISING, FALLING };
enum { INPUT, OUTPUT };
inline std::array<std::function<void()>, 32> interrupts;
inline int digitalPinToInterrupt(int p) { return p >= 0 && p < 32 ? p : -1; }
inline void digitalWrite(int, PinStatus) {}
inline void pinMode(int,int) {}
inline void delay(unsigned long) {}
inline void attachInterrupt(int pin, std::function<void()> f, PinStatus) { interrupts.at(pin) = f; }
inline void detachInterrupt(int pin) { interrupts.at(pin) = {}; }
