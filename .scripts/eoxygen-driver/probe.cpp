#include "DFRobot_EOxygenSensor.h"
#include <cassert>
#include <cmath>
#include <cstdio>
TwoWire Wire;
unsigned long elapsed = 0;
int main() {
  DFRobot_EOxygenSensor_I2C defaultDriver;
  assert(defaultDriver.begin() && Wire.selected == E_OXYGEN_ADDRESS_0);
  for (uint8_t addr = 0x70; addr <= 0x73; ++addr) {
    TwoWire bus;
    bus.physical = addr;
    DFRobot_EOxygenSensor_I2C driver(&bus, addr);
    assert(driver.begin());
    for (unsigned expected : {0, 1, 2090, 9950, 10000}) {
      bus.oxygen = {uint8_t(expected/100), uint8_t(expected/10%10), uint8_t(expected%10)};
      assert(std::lround(driver.readOxygenConcentration()*100) == expected);
    }
    for (auto invalid : std::vector<std::vector<uint8_t>>{{},{20},{20,9},{20,10,0},{20,9,10},{100,0,1}}) {
      bus.oxygen = invalid;
      assert(std::isnan(driver.readOxygenConcentration()));
    }
    bus.reported = 3; bus.oxygen = {20}; // Transport reported bytes which never arrived.
    assert(std::isnan(driver.readOxygenConcentration()));
    bus.oxygen = {20,9,0,127};
    bus.failReadAt = 1;
    assert(std::isnan(driver.readOxygenConcentration()));
    bus.failReadAt = -1;
    uint8_t bytes[4] = {0,0,0,0xee};
    assert(driver.readData(0x10,bytes,3) == 0 && bytes[3] == 0xee);
    bus.reported = -1;
    assert(driver.calibration_20_9() && driver.readCalibrationState() == 1);
    assert(driver.calibration_99_5() && driver.readCalibrationState() == 3);
    unsigned long before = elapsed;
    bus.rejectCommand = true;
    assert(!driver.calibration_20_9() && !driver.clearCalibration() && elapsed == before);
    bus.rejectCommand = false;
    bus.failWriteAt = 1;
    assert(!driver.calibration_99_5());
    bus.failWriteAt = 0;
    assert(std::isnan(driver.readOxygenConcentration()));
    bus.failWriteAt = -1;
    bus.connected = false;
    assert(!driver.begin() && driver.readCalibrationState() == 0xff);
    assert(std::isnan(driver.readOxygenConcentration()) && !driver.clearCalibration());
    bus.connected = true;
    assert(driver.begin() && driver.clearCalibration() && driver.readCalibrationState() == 0);
    assert(std::lround(driver.readOxygenConcentration()*100) == 2090);
  }
  std::puts("SEN0496 packaged driver passed on all four addresses");
}
