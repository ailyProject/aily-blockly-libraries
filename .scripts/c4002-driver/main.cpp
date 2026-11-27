#include <DFRobot_C4002.h>
#include <cassert>
#include <cstdio>
#include <vector>
#include <numeric>

int main() {
  HardwareSerial port;
  DFRobot_C4002 radar(&port,115200,44,43);
  std::vector<uint8_t> commands;
  port.onWrite=[&](const uint8_t* p,size_t n) {
    assert(n >= 14 && n == (p[4] | (p[5]<<8)));
    const std::vector<uint8_t> header{0xfa,0xf5,0xaa,0xa5};
    assert(std::equal(header.begin(),header.end(),p));
    assert((p[n-2] | (p[n-1]<<8)) == std::accumulate(p,p+n-2,0));
    const uint8_t cmd=p[8];
    commands.push_back(cmd);
    std::vector<uint8_t> payload;
    if(cmd==CMD_SET_REPORT_PERIOD) { assert(p[7]==FRAME_TYPE_WRITE_REQUSET && p[12]==255); }
    else if(cmd==CMD_GET_AND_SET_RESOLUTION_MODE) { assert(p[7]==FRAME_TYPE_READ_REQUSET);payload.push_back(eResolution20Cm); }
    else { assert(cmd==CMD_CONFIG_OUT_MODE && p[7]==FRAME_TYPE_READ_REQUSET);payload.push_back(eOutpinMode3); }
    uint8_t type = p[7]==FRAME_TYPE_READ_REQUSET ? FRAME_TYPE_READ_RESPOND : FRAME_TYPE_WRITE_RESPOND;
    std::vector<uint8_t> packet{0xfa,0xf5,0xaa,0xa5,uint8_t(14+payload.size()),0,0,type,cmd,eSucceed,uint8_t(4+payload.size()),0};
    packet.insert(packet.end(),payload.begin(),payload.end());
    int sum=std::accumulate(packet.begin(),packet.end(),0);
    packet.push_back(uint8_t(sum));packet.push_back(uint8_t(sum>>8));
    port.rx.insert(port.rx.end(),packet.begin(),packet.end());
  };
  assert(radar.begin(5));
  assert((commands==std::vector<uint8_t>{CMD_SET_REPORT_PERIOD,CMD_GET_AND_SET_RESOLUTION_MODE,CMD_CONFIG_OUT_MODE}));
  assert(port.baud==115200 && port.rxPin==44 && port.txPin==43);
  outState=0;assert(radar.getOutTargetState()==eNoTarget);
  outState=1;assert(radar.getOutTargetState()==eMotionOrPresence);
  std::printf("stock begin: 3 verified binary frames; 115200 8N1 RX44 TX43; OUT low/high accepted in mode 3\n");
}
