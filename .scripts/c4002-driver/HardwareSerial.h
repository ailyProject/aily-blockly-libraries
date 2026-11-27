#pragma once
#include <Arduino.h>
#include <functional>
#include <deque>
class HardwareSerial {
public:
  std::deque<uint8_t> rx;
  std::function<void(const uint8_t*,size_t)> onWrite;
  uint32_t baud=0;
  int rxPin=-1,txPin=-1;
  void begin(uint32_t b,int,int r,int t) { baud=b;rxPin=r;txPin=t; }
  int available() { return int(rx.size()); }
  int read() { if(rx.empty())return -1;auto b=rx.front();rx.pop_front();return b; }
  size_t write(const uint8_t* p,size_t n) { onWrite(p,n);return n; }
};
