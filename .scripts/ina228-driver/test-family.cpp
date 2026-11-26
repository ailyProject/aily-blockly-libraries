#include <Adafruit_INA237.h>
#include <Adafruit_INA238.h>
#include <cassert>
#include <cmath>
#include <cstdio>

static void closeTo(float actual, float expected, float tolerance) {
  if (!std::isfinite(actual) || std::abs(actual - expected) > tolerance) {
    std::fprintf(stderr, "expected %g ± %g, got %g\n", expected, tolerance, actual);
    assert(false);
  }
}

void checkIna237Family() {
  TwoWire bus;
  bus.address = 0x45;
  Adafruit_INA237 selected237;
  Adafruit_INA238 selected238;
  bus.registers[0x3e] = 0x5449;
  // TI does not guarantee a value at 0x3f on INA237. Neither a failed
  // read nor the Adafruit-reported shared ID blocks explicit selection.
  for (int mode = 0; mode < 4; ++mode) {
    bus.registers[0x3f] = mode == 2 ? 0x2381 : mode == 3 ? 0xffff : 0;
    bus.failRead = mode == 0 ? 0x3f : -1;
    assert(selected237.begin(0x45, &bus, true));
    assert(selected238.begin(0x45, &bus, true) == (mode == 2));
    assert(bus.writes == 0);
  }
  bus.registers[0x3f] = 0x2281;
  assert(!selected237.begin(0x45, &bus) && !selected238.begin(0x45, &bus));
  bus.failRead = 0x3f; bus.registers[0x10] = 0x7fff; // default INA228 limit
  assert(!selected237.retryBegin());
  bus.failRead = -1; bus.registers[0x3f] = 0; bus.registers[0x10] = 0x7ff0;
  for (auto reg : {0, 2, 6, 0x10, 0x3e}) {
    bus.failRead = reg;
    assert(!selected237.retryBegin());
  }
  assert(bus.writes == 0);
  bus.failRead = -1;
  bus.registers[0] = 0x20;
  assert(!selected237.retryBegin() && bus.writes == 0);
  bus.registers[0] = 0; bus.registers[0x3e] = 0xbeef;
  assert(!selected237.retryBegin() && bus.writes == 0);
  bus.registers[0x3e] = 0x5449;
  bus.registers[0x3f] = 0x2381;
  for (Adafruit_INA237* part : {&selected237, static_cast<Adafruit_INA237*>(&selected238)}) {
    Adafruit_INA2xx& common = *part;
    bus.connected = false; const unsigned before = bus.writes;
    assert(!common.begin(0x45, &bus));
    for (unsigned i = 0; i < 100; ++i) assert(!common.retryBegin());
    part->setShunt(0.015f, 8); part->setAlertType(INA237_ALERT_OVERSHUNT);
    assert(bus.writes == before);
    bus.connected = true; bus.failWrite = 0;
    assert(!common.retryBegin() && !common.isInitialized());
    bus.failWrite = -1; assert(common.retryBegin() && common.isInitialized());
    bus.registers[0] = 0;
    assert(std::isnan(common.readCurrent()) && std::isnan(common.readPower()));
    // TI worked example, 10 A scale, 16.2 mΩ shunt, 48 V, ~6 A, ~288 W.
    part->setShunt(0.0162f, 10);
    assert(bus.registers[2] == 4050);
    bus.registers[4] = 19440; bus.registers[5] = 15360;
    bus.registers[6] = 0x0c80; bus.registers[7] = 19660; bus.registers[8] = 4718604;
    closeTo(common.getBusVoltage_V(),48,0.00001f);
    closeTo(common.getShuntVoltage_mV(),97.2f,0.0001f);
    closeTo(part->readShuntVoltage(),0.0972f,0.000001f);
    closeTo(common.getCurrent_mA(),5999.756f,0.002f);
    closeTo(common.getPower_mW(),288000.7324f,0.04f);
    closeTo(part->readDieTemp(),25,0.001f);
    part->setShunt(0.015f,8); assert(bus.registers[2] == 3000);
    bus.registers[4] = (uint16_t)-3000; bus.registers[7] = (uint16_t)-4096;
    bus.registers[6] = 0xf3f0; bus.registers[8] = 67584;
    closeTo(common.getShuntVoltage_mV(),-15,0.0001f);
    closeTo(part->readDieTemp(),-24.125f,0.0001f);
    closeTo(common.getCurrent_mA(),-1000,0.001f);
    closeTo(common.getPower_mW(),3300,0.001f);
    common.setADCRange(1); assert(bus.registers[2]==12000);
    bus.registers[4]=(uint16_t)-12000;closeTo(common.getShuntVoltage_mV(),-15,0.0001f);
    bus.failWrite=2;part->setShunt(0.015f,4);bus.failWrite=-1;
    part->setShunt(-1,8);part->setShunt(1e30f,8);
    closeTo(common.getCurrent_mA(),-1000,0.001f);assert(bus.registers[2]==12000);
    bus.registers[4]=bus.registers[5]=bus.registers[6]=bus.registers[7]=bus.registers[8]=0;
    assert(common.getBusVoltage_V()==0 && common.getShuntVoltage_mV()==0 &&
           common.getCurrent_mA()==0 && common.getPower_mW()==0 && part->readDieTemp()==0);
    bus.connected=false;
    assert(std::isnan(common.getBusVoltage_V()) && std::isnan(common.getShuntVoltage_mV()) &&
           std::isnan(common.getCurrent_mA()) && std::isnan(common.getPower_mW()) &&
           std::isnan(part->readDieTemp()) && !common.conversionReady());
    assert(!common.retryBegin());bus.connected=true;assert(common.retryBegin());
    assert(std::isnan(common.getCurrent_mA()));
    bus.registers[0]=0;part->setShunt(0.015f,8);assert(common.getCurrent_mA()==0);
    common.reset();assert(std::isnan(common.getCurrent_mA()));
  }
}
