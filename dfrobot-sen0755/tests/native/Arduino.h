#pragma once
#include <stdint.h>
class Stream {
public:
  int available() { return 0; }
  int read() { return 0; }
};
inline unsigned long millis() { static unsigned long now = 0; return now++; }
inline void delay(unsigned long) {}
