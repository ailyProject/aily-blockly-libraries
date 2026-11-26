#include "SparkFunLSM303C.h"
#include <cassert>
#include <cmath>
#include <cstdio>

TwoWire Wire;
SerialConsole Serial;
static void word(TwoWire::Chip& chip, uint8_t reg, int16_t value) {
  chip.regs[reg] = static_cast<uint8_t>(value);
  chip.regs[reg + 1] = static_cast<uint16_t>(value) >> 8;
}
static bool near(float a, float b) { return std::fabs(a - b) < 0.0005f; }
static status_t beginWith(LSM303C& imu, InterfaceMode_t mode, ACC_FS_t range) {
  return imu.begin(mode, MAG_DO_40_Hz, MAG_FS_16_Ga, MAG_BDU_ENABLE, MAG_OMXY_HIGH_PERFORMANCE,
      MAG_OMZ_HIGH_PERFORMANCE, MAG_MD_CONTINUOUS, range, ACC_BDU_ENABLE, 7, ACC_ODR_100_Hz);
}
int main() {
  LSM303C imu;
  assert(std::isnan(imu.readAccelZ()) && std::isnan(imu.readMagY()) && std::isnan(imu.readTempC()));
  assert(beginWith(imu, MODE_SPI, ACC_FS_2g) == IMU_NOT_SUPPORTED);
  assert(imu.begin() == IMU_HW_ERROR);
  Wire.accel.regs[0xf] = 0x41;
  assert(imu.begin() == IMU_HW_ERROR);
  Wire.mag.regs[0xf] = 0x3d;
  Wire.mag.online = false;
  assert(imu.begin() == IMU_HW_ERROR);
  Wire.mag.online = true;
  Wire.writeErrorReg = 0x20;
  assert(imu.begin() == IMU_HW_ERROR && std::isnan(imu.readTempC()));
  Wire.writeErrorReg = -1;
  Wire.accel.regs[0x20] = 0x10;
  assert(imu.begin() == IMU_SUCCESS && imu.getStatus() == IMU_SUCCESS);
  assert(Wire.accel.regs[0x20] == 0x3f && Wire.mag.regs[0x20] == 0xd8);
  assert(Wire.mag.regs[0x21] == 0x60 && Wire.mag.regs[0x24] == 0x40);
  assert(std::isnan(imu.readAccelX()) && std::isnan(imu.readMagX()));
  Wire.accel.regs[0x27] = 7;
  word(Wire.accel, 0x28, -1000); word(Wire.accel, 0x2a, 0); word(Wire.accel, 0x2c, 500);
  assert(near(imu.readAccelX(), -61) && imu.readAccelY() == 0 && near(imu.readAccelZ(), 30.5));
  Wire.accel.regs[0x27] = 0;
  assert(near(imu.readAccelX(), -61) && imu.getStatus() == IMU_SUCCESS);
  Wire.accel.regs[0x27] = 1;
  Wire.shortReg = 0x29;
  assert(std::isnan(imu.readAccelX()));
  Wire.shortReg = -1; Wire.accel.regs[0x27] = 0;
  assert(std::isnan(imu.readAccelX()));
  Wire.mag.regs[0x27] = 8;
  word(Wire.mag, 0x28, -1000); word(Wire.mag, 0x2a, 0); word(Wire.mag, 0x2c, 2000);
  assert(near(imu.readMagX(), -0.58f));
  Wire.mag.regs[0x27] = 0;
  assert(imu.readMagY() == 0 && near(imu.readMagZ(), 1.16f));
  Wire.mag.regs[0x27] = 8; Wire.emptyReg = 0x2d;
  assert(std::isnan(imu.readMagX()));
  Wire.mag.regs[0x27] = 0; Wire.emptyReg = -1;
  assert(std::isnan(imu.readMagY()));
  word(Wire.mag, 0x2e, -240);
  assert(imu.readTempC() == -5 && imu.readTempF() == 23);
  Wire.readErrorReg = 0x2f;
  assert(std::isnan(imu.readTempC()) && imu.getStatus() == IMU_HW_ERROR);
  Wire.readErrorReg = -1;
  Wire.writeLimit = 0;
  assert(std::isnan(imu.readTempC()));
  Wire.writeLimit = 2;
  Wire.accel.online = false;
  assert(imu.begin() == IMU_HW_ERROR && std::isnan(imu.readMagX()));
  Wire.accel.online = true;
  assert(beginWith(imu, MODE_I2C, ACC_FS_4g) == IMU_SUCCESS);
  Wire.accel.regs[0x27] = 1;
  assert(near(imu.readAccelX(), -122));
  assert(beginWith(imu, MODE_I2C, ACC_FS_8g) == IMU_SUCCESS);
  assert(near(imu.readAccelX(), -244));
  puts("LSM303C identity, configuration, signed samples, cache, bus faults and recovery passed");
}
