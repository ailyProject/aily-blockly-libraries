#include <cstdio>
#include <cassert>
#include <string>
#include "DFRobot_SFA40.h"
TwoWire Wire;
int main(int argc,char** argv) {
  const bool original=argc==2&&std::string(argv[1])=="stock";
  for(bool b4:{false,true}) {
    TwoWire bus;bus.b4=b4;DFRobot_SFA40 sensor(&bus);
    assert(sensor.begin()==0);
    int expected=b4?10:6;
    assert(sensor.getSerialNumber()&&sensor.serialNumberLen==expected);
    for(bool crc:{false,true}) {
      bus.shortRead=!crc;bus.corrupt=crc;
      assert(!sensor.getSerialNumber()&&sensor.serialNumberLen==0);
      bus.shortRead=false;bus.corrupt=false;
      auto bytes=sensor.getSerialNumber();
      assert(bytes&&bytes[0]==0xbe&&bytes[expected-1]==0xef);
      std::printf("%s %s restoredBytes=%d reportedLength=%d expected=%d\n",
                  b4?"B4":"D1",crc?"crc":"short",expected,sensor.serialNumberLen,expected);
      assert(sensor.serialNumberLen==(original?0:expected));
    }
  }
}
