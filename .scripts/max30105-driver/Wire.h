#pragma once
#include <algorithm>
#include <array>
#include <cassert>
#include <cstdint>
#include <vector>
class TwoWire {
public:
  uint8_t address = 0x57, id = 0x15, selected = 0;
  bool present = true, partial = false, rejectSelect = false, rejectRewind = false;
  unsigned partialOnBurst = 0;
  int truncated = -1, mode = 3, nextReadFault = -1, denyRegister = -1;
  unsigned configWrites=0, reads=0;
  std::array<uint8_t,256> reg{};
  std::array<std::array<uint32_t,3>,32> fifo{};
  std::vector<std::size_t> bursts;
  void begin() {}
  void setClock(uint32_t) {}
  void append(uint32_t r,uint32_t i,uint32_t g) {
    fifo[reg[4]]={r,i,g};reg[4]=(reg[4]+1)%32;
  }
  void beginTransmission(uint8_t addr){dest=addr;tx.clear();}
  size_t write(uint8_t v){tx.push_back(v);return 1;}
  uint8_t endTransmission(bool=true){
    if(!present || dest!=address || tx.empty())return 2;
    if(rejectSelect && tx.size()==1 && tx[0]==7){rejectSelect=false;return 3;}
    selected=tx[0];
    if(tx.size()>1){
      if(rejectRewind && selected==6){rejectRewind=false;return 3;}
      ++configWrites;reg[selected]=tx[1];
      if(selected==6)byteOffset=0;
      if(selected==9 && (tx[1]&64)){reg.fill(0);byteOffset=0;}
    }
    return 0;
  }
  size_t requestFrom(uint8_t addr,size_t n){
    ++reads;rx.clear();cursor=0;
    if(!present || addr!=address || selected==denyRegister)return 0;
    if(selected!=7){
      rx.push_back(selected==255?id:selected==254?0x02:reg[selected]);return 1;
    }
    bursts.push_back(n);
    if(partial || bursts.size()==partialOnBurst){n=std::min<size_t>(n,4);partial=false;}
    for(size_t a=0;a<n;++a){
      if(!byteOffset){reg[5]=0;latched=fifo[reg[6]];reg[6]=(reg[6]+1)%32;}
      const auto word=latched[byteOffset/3];
      rx.push_back(uint8_t(word>>(16-(byteOffset%3)*8)));
      if(++byteOffset==3*mode)byteOffset=0;
    }
    return rx.size();
  }
  int available(){return static_cast<int>(rx.size()-cursor);}
  int read(){
    if(!available())return -1;
    if(selected==7 && static_cast<int>(cursor)==nextReadFault){
      nextReadFault=-1;++cursor;return -1;
    }
    return rx[cursor++];
  }
private:
  std::array<uint32_t,3> latched{};
  uint8_t dest=0;
  int byteOffset=0;
  size_t cursor=0;
  std::vector<uint8_t> tx,rx;
};
extern TwoWire Wire;
