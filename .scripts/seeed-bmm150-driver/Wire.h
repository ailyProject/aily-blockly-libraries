#pragma once
#include <stdint.h>
#include <vector>
#include <array>
class TwoWire {
public:
  std::array<uint8_t,256> regs{};
  bool present=true;
  int shortReg=-1, refusedReg=-1;
  unsigned rejected=0, incomplete=0, writes=0;
  std::vector<uint8_t> tx,rx;
  uint8_t ptr=0,selected=0;
  unsigned pos=0;
  void begin(){}
  void beginTransmission(uint8_t a){selected=a;tx.clear();}
  void write(uint8_t x){tx.push_back(x);}
  unsigned endTransmission(bool = true){
    if(!present||selected!=0x13)return 2;
    if(tx.empty())return 0;
    ptr=tx[0]; if(tx.size()==1)return 0;
    if(ptr==refusedReg){++rejected;return 3;}
    for(unsigned i=1;i<tx.size();++i)regs[ptr+i-1]=tx[i];
    ++writes;return 0;
  }
  unsigned requestFrom(uint8_t addr,unsigned n){
    pos=0;rx.clear();
    if(!present||addr!=0x13)return 0;
    if(ptr==shortReg && n){--n;++incomplete;}
    for(unsigned i=0;i<n;i++)rx.push_back(regs[ptr+i]);
    return n;
  }
  int available(){return int(rx.size()-pos);}
  int read(){return pos<rx.size()?rx[pos++]:-1;}
};
extern TwoWire Wire;
