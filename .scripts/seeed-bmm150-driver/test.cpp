#include <bmm150.h>
#include <cassert>
#include <cmath>
#include <cstdio>
#include "trim-fixture.h"

TwoWire Wire;

void put16(int reg, int value) {
    Wire.regs[reg] = value & 255;
    Wire.regs[reg + 1] = (uint16_t)value >> 8;
}

void installSensor() {
    Wire = TwoWire{};
    Wire.regs[BMM150_CHIP_ID_ADDR] = BMM150_CHIP_ID;
    bmm150_trim_registers t = {};
    SET_TRIM(t);
    Wire.regs[0x5d] = t.dig_x1; Wire.regs[0x5e] = t.dig_y1;
    put16(0x62, t.dig_z4);
    Wire.regs[0x64] = t.dig_x2; Wire.regs[0x65] = t.dig_y2;
    put16(0x68,t.dig_z2); put16(0x6a,t.dig_z1);
    put16(0x6c,t.dig_xyz1); put16(0x6e,t.dig_z3);
    Wire.regs[0x70] = t.dig_xy2; Wire.regs[0x71] = t.dig_xy1;
}

void testInitialization() {
    BMM150 chip;
    installSensor();
    Wire.present = false;
    assert(chip.initialize() == BMM150_E_IO && !chip.isInitialized() && Wire.writes == 0);
    assert(std::isnan(chip.readAxis('x')) && std::isnan(chip.headingDegrees()));
    Wire.present = true;
    Wire.regs[0x40] = 0;
    assert(chip.initialize() == BMM150_E_ID_NOT_CONFORM && Wire.writes == 1);
    for (int reg : {0x4b,0x40,0x5d,0x62,0x68,0x4c}) {
        installSensor();
        Wire.shortReg = reg;
        assert(chip.initialize() == BMM150_E_IO && !chip.isInitialized());
    }
    for (int reg : {0x4b,0x4c,0x51,0x52}) {
        installSensor();
        Wire.refusedReg = reg;
        assert(chip.initialize() == BMM150_E_IO && !chip.isInitialized());
    }
    installSensor();
    put16(0x6c,0);
    assert(chip.initialize() == BMM150_E_INVALID_CONFIG);
    installSensor();
    assert(chip.initialize() == BMM150_OK && chip.isInitialized());
    assert(chip.trim_data.dig_xyz1 == 24000 && chip.trim_data.dig_z2 == -11000);
    assert(Wire.regs[0x51] == BMM150_LOWPOWER_REPXY && Wire.regs[0x52] == BMM150_LOWPOWER_REPZ);
    chip.set_presetmode(BMM150_PRESETMODE_HIGHACCURACY);
    assert(Wire.regs[0x51] == BMM150_HIGHACCURACY_REPXY && Wire.regs[0x52] == BMM150_HIGHACCURACY_REPZ);
    Wire.shortReg = BMM150_DATA_X_LSB;
    assert(!chip.readSample() && !chip.isInitialized() && chip.mag_data.x == BMM150_OVERFLOW_OUTPUT);
    Wire.shortReg = -1;
    assert(chip.initialize() == BMM150_OK);
    Wire.refusedReg = BMM150_REP_Z_ADDR;
    chip.set_presetmode(BMM150_PRESETMODE_REGULAR);
    assert(!chip.isInitialized());
    Wire.refusedReg = -1;
    assert(chip.initialize() == BMM150_OK);
    chip.soft_reset(); assert(!chip.isInitialized());
}

int main() {
    testInitialization();
    // Expected microteslas from Bosch bmm150_aux_mag_data (integer build)
    // at 0dce0617873cda1f6d51f6b7b961fdc2641e0c7c, using trim-fixture.h.
    const int cases[][7] = {
        {0,0,0,12000, -1,2,-662}, {270,-130,190,12000, 100,-42,-1686},
        {-510,870,-1350,12000, -194,302,2047}, {125,125,511,8192, 50,50,-346},
        {125,125,511,8191, 50,50,-346}, {4095,-4095,16383,11000, 1582,-1439,-2047},
        {-4096,0,0,12000, -32768,2,-662}, {0,-4096,-16384,12000, -1,-32768,-32768},
        {40,20,200,0, 11,8,-32768}
    };
    BMM150 chip;
    installSensor(); assert(chip.initialize() == BMM150_OK);
    for (const auto& v : cases) {
        put16(0x42, v[0]*8); put16(0x44, v[1]*8); put16(0x46, v[2]*2); put16(0x48, v[3]*4);
        assert(chip.readSample() && chip.raw_mag_data.raw_data_r == v[3]);
        assert(chip.mag_data.x == v[4] && chip.mag_data.y == v[5] && chip.mag_data.z == v[6]);
        for (int a=0; a<3; ++a) {
            float value = chip.readAxis("xyz"[a]);
            if (v[a+4] == BMM150_OVERFLOW_OUTPUT) assert(std::isnan(value));
            else assert(value == v[a+4]);
        }
        const float heading = chip.headingDegrees();
        if (v[4]==BMM150_OVERFLOW_OUTPUT || v[5]==BMM150_OVERFLOW_OUTPUT) assert(std::isnan(heading));
        else {
            double expected = std::atan2(double(v[4]),double(v[5])) * 180 / std::acos(-1);
            if (expected<0) expected += 360;
            assert(std::abs(heading-expected)<0.001);
        }
    }
    puts("Packaged BMM150 transport, recovery, presets and nine Bosch compensation vectors passed");
}
