#pragma once
#include "Arduino.h"
#include <deque>
class HardwareSerial: public Stream {
  std::deque<uint8_t> rx;
public:
  void begin(unsigned long);
  int available() override {return int(rx.size());}
  int read() override {if(rx.empty())return -1;auto b=rx.front();rx.pop_front();return b;}
  size_t write(const uint8_t*,size_t) override;
};
