#pragma once
#include <cstdint>
#include <string>
using byte = uint8_t;
using String = std::string;
enum { INPUT, RISING, FALLING };
uint32_t millis();
int analogRead(byte);
void attachInterrupt(int, void(*)(), int);
inline int digitalPinToInterrupt(byte pin) { return pin; }
inline void pinMode(byte,int) {}
inline void interrupts() {}
inline void noInterrupts() {}
inline void detachInterrupt(int) {}
struct Console {
  template<class... T> void print(T...) {}
  template<class... T> void println(T...) {}
};
extern Console Serial;
