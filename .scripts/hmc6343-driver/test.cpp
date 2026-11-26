#include "SFE_HMC6343.h"
#include <cassert>
#include <cmath>
#include <cstdio>

TwoWire Wire;
unsigned long elapsedUs = 0;
using Field = SFE_HMC6343::Measurement;

static void initialize(SFE_HMC6343& sensor) {
  Wire.reply = {0x32};
  Wire.expectedDelayUs = 10000;
  const auto start = elapsedUs;
  assert(sensor.init() && sensor.isInitialized());
  assert(elapsedUs - start >= 510000);
  assert(Wire.tx == std::vector<uint8_t>({0xe1, 0}));
  assert(std::isnan(sensor.value(Field::Pitch)));
  Wire.expectedDelayUs = 1000;
}

int main() {
  SFE_HMC6343 sensor;
  assert(!sensor.isInitialized());
  initialize(sensor);
  Wire.reply = {0x0d, 0xe8, 0xff, 0x85, 0, 0x2d};
  sensor.readHeading();
  assert(Wire.tx == std::vector<uint8_t>({0x50}));
  assert(sensor.value(Field::Heading) == 3560 && sensor.pitch == -123 && sensor.roll == 45);
  assert(std::isnan(sensor.value(Field::Temperature)));
  Wire.reply = {0xff, 0xf6, 0x7f, 0xff, 0x80, 0x00};
  sensor.readMag();
  assert(sensor.value(Field::MagX) == -10 && sensor.value(Field::MagY) == 32767 && sensor.value(Field::MagZ) == -32768);
  Wire.reply = {0xff, 0xff, 0x00, 0x00, 0x00, 0x01};
  sensor.readAccel();
  assert(sensor.value(Field::AccelX) == -1 && sensor.value(Field::AccelY) == 0 && sensor.value(Field::AccelZ) == 1);
  Wire.reply = {0, 5, 0xff, 0xe2, 0xff, 0xf0};
  sensor.readTilt();
  assert(sensor.value(Field::Pitch) == 5 && sensor.value(Field::Roll) == -30 && sensor.value(Field::Temperature) == -16);
  assert(sensor.value(Field::Heading) == 3560);

  Wire.reply = {0, 7, 0};
  sensor.readMag();
  assert(!sensor.isInitialized() && std::isnan(sensor.value(Field::MagY)));
  assert(sensor.magX == -10 && sensor.magY == 32767 && sensor.magZ == -32768);
  assert(std::isnan(sensor.value(Field::Heading)));
  initialize(sensor);
  Wire.reply = {0x32};
  Wire.reportedLength = 6;
  sensor.readMag();
  assert(!sensor.isInitialized() && sensor.magZ == -32768);
  Wire.reportedLength = -1;
  Wire.reply = {0x19};
  assert(!sensor.init());
  initialize(sensor);
  Wire.ack = false;
  const int before = Wire.readsRequested;
  sensor.readAccel();
  assert(Wire.readsRequested == before && !sensor.isInitialized());
  Wire.ack = true;
  Wire.acceptedWrites = 1;
  assert(!sensor.init() && Wire.readsRequested == before);
  Wire.acceptedWrites = 3;
  initialize(sensor);
  Wire.reply = {0x11};
  assert(sensor.readOPMode1() == 0x11);
  const auto start = elapsedUs;
  sensor.writeEEPROM(5, 2);
  assert(Wire.tx == std::vector<uint8_t>({0xf1, 5, 2}) && elapsedUs - start >= 10000);
  sensor.enterSleep();
  assert(Wire.tx[0] == 0x83);
  const auto wake = elapsedUs;
  sensor.exitSleep();
  assert(Wire.tx[0] == 0x84 && elapsedUs - wake >= 20000);
  sensor.exitStandby();
  assert(Wire.tx[0] == 0x75);
  sensor.reset();
  assert(!sensor.isInitialized() && std::isnan(sensor.value(Field::Temperature)));
  puts("HMC6343 signed groups, real zero, short frames, ACK, retry, EEPROM and timing passed");
}
