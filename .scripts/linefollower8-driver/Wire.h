#pragma once
#include "Arduino.h"
#include <vector>
#include <cassert>
class TwoWire {
public:
  int begins=0, speed=0, address=0, index=0, reads=0;
  uint8_t error=0;
  std::vector<uint8_t> data, tx;
  void begin(){++begins;}
  void setClock(int rate){speed=rate;}
  void beginTransmission(int a){address=a;tx.clear();}
  size_t write(uint8_t b){tx.push_back(b);return 1;}
  uint8_t endTransmission(){return error;}
  size_t requestFrom(uint8_t a,uint8_t n){assert(a==0x27 && n==32);index=0;++reads;return data.size();}
  int available(){return static_cast<int>(data.size())-index;}
  int read(){return available() ? data[index++] : -1;}
};
inline TwoWire Wire;
