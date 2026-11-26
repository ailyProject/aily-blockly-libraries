#include <Adafruit_INA228.h>
#include <Adafruit_INA237.h>
#include <Adafruit_INA238.h>
#include <cassert>
#include <cmath>
TwoWire Wire;
SPIClass SPI;
Stream Serial;
static void near(float observed, float expected) {
  assert(std::abs(observed - expected) <= std::max(1e-10f, std::abs(expected) * 1e-5f));
}
void checkIna237Family();
int main() {
  checkIna237Family();
  TwoWire bus;
  bus.address = 0x45;
  Adafruit_INA228 meter;
  assert(!meter.isInitialized() && std::isnan(meter.readCharge()));
  assert(!meter.begin(0x45, nullptr));
  bus.connected = false;
  assert(!meter.begin(0x45, &bus));
  for (unsigned i = 0; i < 1000; ++i) assert(!meter.retryBegin());
  bus.connected = true;
  bus.registers[0x3f] = 0x2283;
  assert(!meter.retryBegin());
  bus.registers[0x3e] = 0x5449;
  bus.registers[0x3f] = 0x2381;
  assert(!meter.retryBegin());
  meter.setShunt(0.015f, 8.0f); meter.setMode(INA2XX_MODE_CONTINUOUS);
  meter.setAlertType(INA228_ALERT_OVERPOWER); meter.resetAccumulators();
  assert(bus.writes == 0);
  bus.registers[0x3f] = 0x2281;
  bus.failRead = 0x3f;
  assert(!meter.retryBegin() && bus.writes == 0);
  bus.failRead = -1; bus.failWrite = 0;
  assert(!meter.retryBegin() && !meter.isInitialized());
  bus.failWrite = -1;
  assert(meter.retryBegin() && meter.isInitialized());
  assert(bus.writes == 3);
  bus.registers[0] = 0;
  meter.setShunt(0.015f, 8.0f);
  const float lsb = 8.0f / 524288.0f;
  assert(bus.registers[2] == 3000);
  near(meter.readBusVoltage(), 0);
  near(meter.readCharge(), 0);
  bus.registers[5] = 0x000400;
  near(meter.readBusVoltage(), 0.0125f);
  bus.registers[4] = 0xfffff0;
  near(meter.readShuntVoltage(), -0.0003125f);
  meter.setADCRange(1);
  near(meter.readShuntVoltage(), -0.000078125f);
  assert(bus.registers[2] == 12000);
  bus.registers[6] = 0xff80;
  near(meter.readDieTemp(), -1);
  bus.registers[7] = 0xffffe0;
  near(meter.readCurrent(), -2 * lsb * 1000);
  bus.failWrite = 2;
  meter.setShunt(0.015f, 4.0f);
  near(meter.readCurrent(), -2 * lsb * 1000);
  assert(bus.registers[2] == 12000);
  bus.failWrite = -1;
  meter.setShunt(-0.015f, -4.0f);
  meter.setShunt(1.0f, 1000.0f);
  assert(bus.registers[2] == 12000);
  bus.registers[8] = 0xffffff;
  near(meter.readPower(), 0xffffff * 3.2f * lsb * 1000);
  bus.registers[9] = 0x100000002ULL;
  near(meter.readEnergy(), static_cast<float>(0x100000002ULL) * 51.2f * lsb);
  bus.registers[10] = 0xfffffffffeULL;
  near(meter.readCharge(), -2 * lsb);
  bus.registers[0xb] = 2;
  assert(meter.conversionReady());
  bus.failRead = 0;
  assert(std::isnan(meter.readShuntVoltage()));
  bus.failRead = -1;
  bus.connected = false;
  assert(std::isnan(meter.readEnergy()) && std::isnan(meter.readCharge()) &&
         std::isnan(meter.readCurrent()) && std::isnan(meter.readBusVoltage()) &&
         std::isnan(meter.readPower()) && std::isnan(meter.readDieTemp()) &&
         !meter.conversionReady());
  assert(!meter.retryBegin() && !meter.isInitialized());
  bus.connected = true;
  assert(meter.retryBegin());
  Adafruit_INA228 copy = meter;
  assert(copy.Config != meter.Config && copy.Diag_Alert != meter.Diag_Alert);
  Wire.connected = false;
  assert(!meter.begin(0x40, &Wire));
  assert(copy.retryBegin() && !meter.retryBegin());
  Adafruit_INA237 sibling;
  Adafruit_INA238 sibling238;
  unsigned prior = bus.writes;
  assert(!sibling.begin(0x45, &bus) && !sibling238.begin(0x45, &bus));
  assert(bus.writes == prior);
  bus.registers[0x3f] = INA237_DEVICE_ID << 4;
  assert(sibling.begin(0x45, &bus, true));
  bus.registers[0x3f] = INA238_DEVICE_ID << 4;
  assert(sibling238.begin(0x45, &bus, true));
  assert(bus.writes == prior);
}
