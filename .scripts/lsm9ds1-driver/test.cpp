#include "SparkFunLSM9DS1.h"
#include "SPI.h"
#include <cassert>
#include <cmath>
#include <cstdio>
TwoWire Wire;
SPIClass SPI;
int main() {
  LSM9DS1 imu;
  imu.readAccel();
  assert(!imu.lastReadSucceeded() && std::isnan(imu.accelerationG(X_AXIS)));
  Wire.ag.regs[15] = 0x6c; Wire.mag.regs[15] = 0x3d;
  assert(!imu.begin() && !imu.isConfigured() && Wire.ag.writes == 0 && Wire.mag.writes == 0);
  Wire.ag.regs[15] = 0x68; Wire.mag.regs[15] = 0;
  assert(!imu.begin() && Wire.ag.writes == 0);
  Wire.mag.regs[15] = 0x3d; Wire.failWriteReg = 0x23;
  assert(!imu.begin() && !imu.isConfigured());
  Wire.failWriteReg = -1;
  assert(imu.begin() == 0x683d && imu.isConfigured());
  assert(std::isnan(imu.accelerationG(X_AXIS)) && std::isnan(imu.magneticFieldGauss(Z_AXIS)));
  imu.readAccel(); imu.readGyro(); imu.readMag();
  assert(imu.lastReadSucceeded() && imu.accelerationG(X_AXIS) == 0 && imu.angularRateDps(Y_AXIS) == 0 && imu.magneticFieldGauss(Z_AXIS) == 0);
  Wire.ag.regs[0x29] = 0xf0; Wire.mag.regs[0x2d] = 0x10;
  imu.readAccel(); imu.readMag();
  assert(imu.ax == -4096 && imu.mz == 4096);
  assert(std::abs(imu.accelerationG(X_AXIS) + 0.249856f) < 0.00001f);
  assert(std::abs(imu.magneticFieldGauss(Z_AXIS) - imu.calcMag(4096)) < 0.00001f);
  Wire.mag.online = false; imu.readMag();
  assert(!imu.lastReadSucceeded() && std::isnan(imu.magneticFieldGauss(Z_AXIS)) && imu.mz == 4096);
  imu.readAccel(); assert(imu.lastReadSucceeded() && imu.ax == -4096);
  Wire.mag.online = true; Wire.ag.regs[0x29] = 0x10; Wire.shortRegister = 0x28; imu.readAccel();
  assert(!imu.lastReadSucceeded() && std::isnan(imu.accelerationG(Y_AXIS)) && imu.ax == -4096);
  Wire.shortRegister = -1; Wire.badReadIndex = 5; imu.readAccel();
  assert(!imu.lastReadSucceeded() && imu.ax == -4096);
  Wire.badReadIndex = -1; imu.readAccel(); assert(imu.lastReadSucceeded() && imu.ax == 4096);
  assert(imu.readAccel(X_AXIS) == 4096 && imu.lastReadSucceeded());
  assert(imu.readAccel(ALL_AXIS) == 0 && !imu.lastReadSucceeded());
  Wire.ag.regs[0x15] = 0x20; Wire.ag.regs[0x16] = 0xfe; // -480 LSB = -5 C
  imu.readTemp(); assert(imu.lastReadSucceeded() && imu.temperature == -5);
  Wire.shortRegister = 0x15; imu.readTemp(); assert(!imu.lastReadSucceeded() && imu.temperature == -5);
  Wire.shortRegister = -1;
  Wire.queueLimit = 1;
  assert(!imu.begin() && std::isnan(imu.accelerationG(X_AXIS)));
  Wire.queueLimit = -1; Wire.magAddress = 0x1c; Wire.agAddress = 0x6a;
  assert(imu.begin(0x6a, 0x1c, Wire) == 0x683d);
  assert(!imu.beginSPI(9, 10) && !imu.isConfigured() && std::isnan(imu.magneticFieldGauss(X_AXIS)));
  std::puts("LSM9DS1 dual identity, complete configuration, per-group validity, raw conversion and recovery passed");
}
