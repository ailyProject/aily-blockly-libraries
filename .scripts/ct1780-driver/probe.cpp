#include "DFRobot_CT1780.h"
#include <cstdio>
int main() {
  DFRobot_CT1780 sensor(5);
  sensor.rom = {0x3b,1,2,3,4,5,6,0};
  sensor.rom.back() = OneWire::crc8(sensor.rom.data(),7);
  uint8_t address[8]{};
  auto otherFamily = sensor.rom;
  otherFamily[0] = 0x28;
  otherFamily[7] = OneWire::crc8(otherFamily.data(), 7);
  auto badCrc = sensor.rom;
  badCrc[7] ^= 1;
  sensor.prefix = {otherFamily, badCrc};
  assert(sensor.searchDevice(address)==1 && sensor.searchDevice(address)==0);
  for(int quarterDegrees : {-1080, -1, 0, 1, 550, 5488}) {
    uint16_t encoded = static_cast<uint16_t>(quarterDegrees * 4);
    sensor.scratch = {uint8_t(encoded), uint8_t(encoded>>8),0,0,0xab,0,0,0,0};
    sensor.scratch.back()=OneWire::crc8(sensor.scratch.data(),8);
    sensor.sent.clear();
    auto initial=elapsed;
    assert(sensor.getCelsius(address)==quarterDegrees/4.f);
    assert(elapsed-initial==750 && sensor.sent==std::vector<uint8_t>({0x44,0xbe}));
    assert(sensor.getConfigAddr(address)==11);
    sensor.scratch.back() ^= 1;
    assert(std::isnan(sensor.getCelsius(address)) && sensor.getConfigAddr(address)==-1);
  }
  sensor.scratch.fill(0xff);
  assert(std::isnan(sensor.getCelsius(address)));
  sensor.found=false; sensor.rom[0]=0x28; sensor.rom.back()=OneWire::crc8(sensor.rom.data(),7);
  assert(sensor.searchDevice(address)==0);
  puts("PASS six signed temperature vectors, conversion delay, family, ROM search exhaustion, DIP nibble, CRC failures, disconnected frame");
}
