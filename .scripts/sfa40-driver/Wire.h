#pragma once
#include "Arduino.h"
#include <vector>
struct TwoWire {
  bool b4=false, present=true, corrupt=false, shortRead=false;
  unsigned command=0;
  std::vector<uint8_t> data;
  size_t index=0;
  void begin() {}
  void beginTransmission(uint8_t) {command=0;}
  void write(uint8_t v) {command=(command<<8)|v;}
  uint8_t endTransmission() {return present ? 0 : 2;}
  unsigned requestFrom(uint8_t, uint8_t requested) {
    index=0;data.clear();
    const bool id=command==(b4?0x0559:0x02ce);
    const bool measurement=command==(b4?0xe06d:0xc0eb);
    if(!present||(!id&&!measurement))return 0;
    // Independent CRC-8 check vector, 0xBEEF -> 0x92.
    const unsigned words=id?(b4?5:3):4;
    for(unsigned i=0;i<words;i++)data.insert(data.end(),{0xBE,0xEF,0x92});
    if(corrupt)data.back()^=1;
    if(shortRead)data.pop_back();
    return (unsigned)data.size()<requested?(unsigned)data.size():requested;
  }
  int read() {return index<data.size()?data[index++]:-1;}
};
extern TwoWire Wire;
