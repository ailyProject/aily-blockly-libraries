#include "SparkFunLSM6DSO.h"
#include <cassert>
#include <cmath>
#include <cstdio>
TwoWire Wire;
SPIClass SPI;
int main() {
  LSM6DSO imu;
  assert(!imu.isConfigured() && std::isnan(imu.readTempC()));
  Wire.regs[0x0f] = 0x6a;
  assert(!imu.begin() && !imu.initialize() && Wire.writes == 0);
  assert(std::isnan(imu.readFloatAccelX()) && std::isnan(imu.readFloatGyroY()));
  Wire.regs[0x0f] = 0x6c;
  Wire.truncateReg = 0x0f;
  assert(!imu.begin());
  Wire.truncateReg = -1;
  assert(imu.begin());
  Wire.failWriteReg = 0x11;
  assert(!imu.initialize() && !imu.isConfigured() && std::isnan(imu.readTempC()));
  Wire.failWriteReg = -1;
  assert(imu.initialize() && imu.isConfigured());
  assert(Wire.regs[0x10] == 0x6c && Wire.regs[0x11] == 0x64 && Wire.regs[0x12] == 0x44);
  assert(imu.readFloatAccelX() == 0 && imu.readFloatGyroY() == 0 && imu.readTempC() == 25);
  Wire.regs[0x21] = 0xe7;
  assert(imu.readTempC() == 0 && imu.getLastReadStatus() == IMU_SUCCESS);
  Wire.regs[0x28] = 0x00; Wire.regs[0x29] = 0xf0;
  assert(std::abs(imu.readFloatAccelX() + 0.999424f) < 0.00001f);
  int16_t word = 123;
  Wire.truncateReg = 0x28;
  assert(imu.readRegisterInt16(&word, 0x28) == IMU_HW_ERROR && word == 123);
  assert(std::isnan(imu.readFloatAccelX()) && imu.getLastReadStatus() == IMU_HW_ERROR);
  Wire.truncateReg = 0x10;
  assert(std::isnan(imu.readFloatAccelX()));
  Wire.truncateReg = -1; Wire.failedReadByte = 1;
  assert(std::isnan(imu.readTempC()));
  Wire.failedReadByte = -1; Wire.failQueueAfter = 1;
  assert(!imu.setBlockDataUpdate(false));
  Wire.failQueueAfter = -1;
  assert(imu.setIncrement(false) && Wire.regs[0x12] == 0x40);
  assert(imu.setBlockDataUpdate(false) && Wire.regs[0x12] == 0);
  Wire.online = false;
  assert(std::isnan(imu.readFloatAccelY()) && std::isnan(imu.readTempF()) && imu.readRawGyroZ() == 0 && imu.getLastReadStatus() == IMU_HW_ERROR);
  Wire.online = true; Wire.deviceAddress = 0x6a;
  assert(!imu.begin(0x6b) && imu.begin(0x6a) && imu.initialize());
  assert(imu.readFloatGyroX() == 0 && imu.readFloatGyroZ() == 0 && imu.readTempC() == 0);
  Wire.deviceAddress = 0x1d;
  assert(imu.beginCore(0x1d, Wire) == IMU_SUCCESS && imu.initialize());
  assert(!imu.begin(0x1d) && !imu.isConfigured());
  std::puts("LSM6DSO identity, configuration, short transfer, signed/zero readings and recovery passed");
}
