#include <cassert>
#include "Dps3xx.h"

int main() {
    TwoWire wire;
    wire.registers[0x0d] = 0x10;
    Dps3xx sensor;
    float sample;
    for (int c0 = -2048; c0 <= 2047; ++c0) {
        const unsigned encoded = static_cast<unsigned>(c0) & 0xfff;
        wire.registers[0x10] = encoded >> 4;
        wire.registers[0x11] = (encoded & 15) << 4;
        sensor.begin(wire);
        assert(sensor.measureTempOnce(sample) == 0);
        assert(sample == c0 * 0.5f);
    }

    wire.truncatedRegister = 0x10;
    for (int length = 0; length < 18; ++length) {
        wire.truncatedLength = length;
        sensor.begin(wire);
        assert(sensor.measureTempOnce(sample) < 0);
    }

    wire.truncatedRegister = -1;
    sensor.begin(wire);
    for (int reg : {0x00, 0x03}) {
        wire.truncatedRegister = reg;
        for (int length = 0; length < 3; ++length) {
            wire.truncatedLength = length;
            sample = 123.0f;
            const int status = reg == 0 ? sensor.measurePressureOnce(sample) : sensor.measureTempOnce(sample);
            assert(status < 0 && sample == 123.0f);
        }
    }

    wire.truncatedRegister = -1;
    wire.rejectedPointer = 0x03;
    assert(sensor.measureTempOnce(sample) < 0);
    wire.rejectedPointer = -1;
    wire.rejectedWrite = 0x62;
    assert(sensor.correctTemp() < 0);
    assert(wire.registers[0x0e] == 0 && wire.registers[0x0f] == 0);
    wire.rejectedWrite = 0x09;
    assert(sensor.measureTempOnce(sample, 7) < 0);
    wire.rejectedWrite = -1;
    assert(sensor.measureTempOnce(sample, 3) == 0);
    assert((wire.registers[0x07] & 7) == 3);

    wire.registers[0x0d] = 0x11;
    sensor.begin(wire);
    assert(sensor.measurePressureOnce(sample) < 0);
    wire.registers[0x0d] = 0x10;
    sensor.begin(wire);
    assert(sensor.measurePressureOnce(sample) == 0);
    // The initialized sensor must also be safe to destroy at scope exit.
}
