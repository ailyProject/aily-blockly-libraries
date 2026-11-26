#include "MT6701.h"
#include "Wire.h"
#include <cmath>
#include <cstdio>

unsigned long clockMs = 0;
unsigned long millis() { return clockMs; }
TestWire Wire;

void invalid(MT6701& sensor) {
    assert(!sensor.isValid() && sensor.getCount() == -1);
    assert(std::isnan(sensor.getRPM()) && std::isnan(sensor.getTurns()));
    assert(std::isnan(sensor.getAngleRadians()) && std::isnan(sensor.getAngleDegrees()));
    assert(sensor.getAccumulator() == INT_MIN && sensor.getFullTurns() == INT_MIN);
}

int main() {
    MT6701 sensor(6, 100, 1000, 3);
    invalid(sensor);
    Wire.angle = 16380;
    assert(sensor.begin());
    assert(Wire.reads == (std::vector<int>{3,4}));
    assert(sensor.getCount() == 16380 && sensor.getAccumulator() == 0);
    assert(sensor.begin() && sensor.getAccumulator() == 0);
    Wire.angle = 4;
    clockMs += 99;
    sensor.poll();
    assert(sensor.getCount() == 16380);
    ++clockMs;
    sensor.poll();
    assert(sensor.getCount() == 4 && sensor.getAccumulator() == 8 && sensor.getRPM() > 0);
    Wire.angle = 16376; clockMs += 100;
    assert(sensor.getCount() == 16376 && sensor.getAccumulator() == -4 && sensor.getRPM() < 0);
    for (int reg : {3,4}) {
        for (auto fault : {&TestWire::shortRead, &TestWire::missingByte, &TestWire::nack}) {
            Wire.*fault = reg; sensor.updateCount(); invalid(sensor);
            Wire.*fault = -1; Wire.angle = 4096;
            sensor.updateCount();
            assert(sensor.isValid() && sensor.getAccumulator() == -4 && sensor.getRPM() == 0);
            assert(sensor.getAngleDegrees() == 90 && std::fabs(sensor.getAngleRadians()-1.57079633f) < 0.00001);
        }
    }
    Wire.present = false; clockMs += 100; invalid(sensor);
    Wire.present = true; Wire.angle = 0; clockMs += 100;
    assert(sensor.getCount() == 0 && sensor.getAccumulator() == -4);
    for (int i=1;i<=12;++i) {
        Wire.angle = (4096*i) % 16384; clockMs += 100;
        sensor.poll();
        assert(sensor.getAccumulator() == 4096*i - 4);
        assert(std::fabs(sensor.getRPM() - 150.0f) < 0.001f);
    }
    assert(sensor.getFullTurns() == 2 && sensor.getTurns() > 2.99f);
    // Roll the custom three-sample filter across the sign change.
    for (int i=1;i<=3;++i) {
        Wire.angle = (16384 - 4096*i) % 16384; clockMs += 100;
        sensor.poll();
        assert(std::fabs(sensor.getRPM() - (150.0f - 100.0f*i)) < 0.001f);
    }
    sensor.end(); sensor.end(); unsigned closed = Wire.accesses;
    clockMs += 1000; sensor.poll(); sensor.updateCount(); invalid(sensor);
    assert(closed == Wire.accesses);
    assert(sensor.begin() && sensor.getAccumulator() == 0);
    sensor.end();
    for (uint8_t addr : {7,8,9}) {
        MT6701 legacy(addr);
        closed=Wire.accesses; assert(!legacy.begin()); invalid(legacy); assert(closed==Wire.accesses);
    }
    Wire.address = 0x46; MT6701 alternate(0x46, 0, 1000, 0);
    assert(alternate.begin()); Wire.angle = 4097; ++clockMs; alternate.poll();
    assert(alternate.getCount() == 4097);
    std::puts("PASS MT6701 angle registers, short reads, NACK, polling, wrap, filter, rebaseline, end and address selection");
}
