#pragma once
#include <cstddef>
#include <cstdint>
#include <cstdlib>
#include <cstring>
#define OUTPUT 1
#define HIGH 1
#define LOW 0
unsigned long millis();
void delay(unsigned long);
inline void delayMicroseconds(unsigned int) {}
inline void digitalWrite(int,int) {}
inline void pinMode(int,int) {}
class Stream {
public:
  virtual int available()=0;
  virtual int read()=0;
  virtual size_t write(const uint8_t*,size_t)=0;
  virtual void flush() {}
  virtual ~Stream()=default;
};
