#pragma once
#include "Arduino.h"
#include <deque>
#include <vector>
#include <cassert>
struct TwoWire {
 int ack=0, statusOnce=0, txLimit=32, announced=-1, requests=0;
 std::vector<int> tx; std::deque<int> rx;
 void begin(){}
 void beginTransmission(uint8_t addr){assert(addr==0x1d);tx.clear();}
 size_t write(uint8_t v){if(int(tx.size())>=txLimit)return 0;tx.push_back(v);return 1;}
 uint8_t endTransmission(){int s=statusOnce;statusOnce=0;return s?s:ack;}
 uint8_t requestFrom(uint8_t addr,uint8_t){assert(addr==0x1d);++requests;return announced<0?rx.size():announced;}
 int available(){return int(rx.size());}
 int read(){if(rx.empty())return -1;int v=rx.front();rx.pop_front();return v;}
};
extern TwoWire Wire;
