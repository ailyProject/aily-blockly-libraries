#pragma once
#include "Arduino.h"
class Stream { public: int available(){return 0;} int read(){return -1;} void flush(){} size_t write(const uint8_t*,size_t n){return n;} };
