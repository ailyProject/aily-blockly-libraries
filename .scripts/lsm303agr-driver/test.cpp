#include "Arduino.h"
#include "LSM303AGR_ACC_Sensor.h"
#include "LSM303AGR_MAG_Sensor.h"
#include "MadgwickAHRS.h"
#include <cassert>
#include <cstdio>

#include "generated-test.inc"

unsigned long testTimeMs = 0;

template<class Sensor>
void checkTransfers(Sensor& sensor, TwoWire& bus, int die, uint8_t expectedId) {
    const uint8_t reg = die == 0 ? 0x0f : 0x4f;
    bus.regs[die][reg] = expectedId;
    uint8_t data[2] = {0xfa, 0xbc};
    assert(sensor.ReadID(data) == 0 && data[0] == expectedId);
    bus.present[die] = false;
    assert(sensor.ReadID(data) != 0);
    assert(sensor.IO_Write(data, 0x20, 1) != 0);
    int32_t axes[3] = {7, 8, 9};
    assert(sensor.GetAxes(axes) != 0);
    assert(axes[0] == 7 && axes[1] == 8 && axes[2] == 9);
    bus.present[die] = true;
    bus.limit = 1;
    assert(sensor.IO_Read(data, reg, 2) != 0 && data[0] == expectedId && data[1] == 0xbc);
    bus.limit = 32;
    bus.capacity = 1;
    assert(sensor.IO_Write(data, 0x20, 1) != 0);
    bus.capacity = 0;
    assert(sensor.IO_Read(data, reg, 1) != 0);
    bus.capacity = 32;
    assert(sensor.ReadID(data) == 0 && data[0] == expectedId);
}

int main() {
    TwoWire bus;
    LSM303AGR_ACC_Sensor acc(&bus);
    LSM303AGR_MAG_Sensor mag(&bus);
    checkTransfers(acc,bus,0,0x33);
    checkTransfers(mag,bus,1,0x40);
    bus.present[0] = false;
    uint8_t id;
    assert(mag.ReadID(&id) == 0 && id == 0x40);
    bus.present[0] = true;
    bus.present[1] = false;
    assert(acc.ReadID(&id) == 0 && id == 0x33);
    bus.present[1] = true;

    float temp = 91;
    assert(acc.GetTemperature(&temp) != 0 && temp == 91 && testTimeMs == 1100);
    bus.regs[0][7] = 4;
    bus.regs[0][0x0d] = static_cast<uint8_t>(-12);
    bus.regs[0][0x0c] = 0x7f;
    assert(acc.GetTemperature(&temp) == 0 && temp == 13);
    bus.regs[1][0x68] = 0x02;
    bus.regs[1][0x6a] = 0xfe;
    bus.regs[1][0x6b] = 0xff;
    int32_t axes[3] = {};
    assert(mag.GetAxes(axes) == 0 && axes[0] == 3 && axes[1] == -3);
    Madgwick filter;
    filter.begin(100);
    for (int i=0; i<16; ++i) {
        filter.update(0,0,0,0,0,1,1,0,0);
        filter.updateIMU(0,0,0,0,0,1);
    }
    assert(filter.getRoll() == 0 && filter.getPitch() == 0 && filter.getYaw() == 0);
    testGeneratedCode();
    std::puts("PASS LSM303AGR two addresses, NACK, short read/write, recovery, temperature, axes and aligned AHRS");
}
