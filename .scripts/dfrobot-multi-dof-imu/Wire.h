#pragma once
#include "Arduino.h"
#include <vector>
#include <deque>
class TwoWire {
  std::vector<uint8_t> tx;
  std::deque<uint8_t> rx;
public:
  void begin() {}
  void setClock(unsigned long);
  void beginTransmission(uint8_t);
  void write(uint8_t byte){tx.push_back(byte);}
  uint8_t endTransmission();
  size_t requestFrom(uint8_t,size_t);
  int available(){return int(rx.size());}
  int read(){if(rx.empty())return -1;auto b=rx.front();rx.pop_front();return b;}
};
extern TwoWire Wire;
