#include "SparkFun_AS3935.h"
#include <algorithm>
#include <cassert>
#include <cstdio>

TwoWire Wire;
SPIClass SPI;
static SPIClass *activeSpi = nullptr;
static unsigned long elapsedMs = 0;

void delay(unsigned long ms) { elapsedMs += ms; }
void digitalWrite(uint8_t, uint8_t level) {
    if (activeSpi) activeSpi->edges.push_back(level);
}
void SPIClass::beginTransaction(SPISettings settings) {
    assert(!active && settings.speed == 1000000 && settings.order == MSBFIRST && settings.mode == SPI_MODE1);
    active = true;
    activeSpi = this;
    transfers = 0;
    edges.clear();
}
uint8_t SPIClass::transfer(uint8_t byte) {
    assert(active && edges == std::vector<uint8_t>{LOW});
    if (++transfers == 1) { command = byte; return 0; }
    assert(transfers == 2);
    if (stuck >= 0) return uint8_t(stuck);
    uint8_t reg = command & 0x3f;
    if (command & 0x40) return regs[reg];
    regs[reg] = byte;
    return 0;
}
void SPIClass::endTransaction() {
    const bool read = (command & 0x40) != 0;
    const std::vector<uint8_t> expected = read ? std::vector<uint8_t>{LOW, HIGH, LOW, HIGH}
                                               : std::vector<uint8_t>{LOW, HIGH};
    assert(active && transfers == 2 && edges == expected);
    if (read) ++completedReads;
    activeSpi = nullptr;
    active = false;
}

static void measurements(SparkFun_AS3935 &sensor, uint8_t *regs) {
    for (uint8_t cause : {0, 1, 4, 8}) {
        regs[3] = 0xa0 | cause;
        unsigned long before = elapsedMs;
        assert(sensor.readInterruptReg() == cause && elapsedMs - before >= 2);
    }
    regs[7] = 0xff;
    regs[4] = 0xff; regs[5] = 0xff; regs[6] = 0xff;
    assert(sensor.distanceToStorm() == 63 && sensor.lightningEnergy() == 0x1fffff);
    assert(sensor.lastOperationSucceeded());
    sensor.watchdogThreshold(7);
    assert(sensor.readWatchdogThreshold() == 7);
    sensor.watchdogThreshold(255);
    assert(!sensor.lastOperationSucceeded());
    sensor.setNoiseLevel(6);
    assert(sensor.readNoiseLevel() == 6 && sensor.readWatchdogThreshold() == 7);
}

int main() {
    SparkFun_AS3935 sensor;
    assert(sensor.distanceToStorm() == 255 && !sensor.lastOperationSucceeded());
    Wire.regs[0] = OUTDOOR << 1;
    Wire.regs[1] = 0x59;
    Wire.online = false;
    assert(!sensor.begin());
    assert(sensor.lightningEnergy() == UINT32_MAX && sensor.readInterruptReg() == 255);
    Wire.online = true;
    Wire.ignoreWrites = true;
    assert(!sensor.begin() && Wire.regs[1] == 0x59);
    Wire.ignoreWrites = false;
    assert(sensor.begin() && Wire.regs[1] == 0x59);
    assert(Wire.badRequestAddress == 0);
    measurements(sensor, Wire.regs);

    for (int reg : {4, 5, 6}) {
        Wire.unreadableReg = reg;
        assert(sensor.lightningEnergy() == UINT32_MAX && !sensor.lastOperationSucceeded());
    }
    Wire.unreadableReg = -1;
    Wire.negativeReg = 7;
    assert(sensor.distanceToStorm() == 255);
    Wire.negativeReg = -1;
    Wire.shortPointer = true;
    assert(sensor.readNoiseLevel() == 255);
    Wire.shortPointer = false;
    Wire.writeLog.clear();
    Wire.nackPointer = 1;
    sensor.setNoiseLevel(3);
    assert(!sensor.lastOperationSucceeded() && Wire.writeLog.empty());
    Wire.nackPointer = -1;
    Wire.shortDataWrite = true;
    sensor.setNoiseLevel(3);
    assert(!sensor.lastOperationSucceeded() && Wire.writeLog.empty());
    Wire.shortDataWrite = false;
    Wire.readLog.clear();
    sensor.resetSettings();
    assert(sensor.lastOperationSucceeded() && Wire.regs[0x3c] == 0x96 && Wire.readLog.empty());
    Wire.regs[0x3a] = Wire.regs[0x3b] = 0;
    assert(!sensor.calibrateOsc());
    Wire.regs[0x3a] = Wire.regs[0x3b] = 0x80;
    assert(sensor.wakeUp() && !(Wire.regs[8] & 0x40) && Wire.regs[0x3d] == 0x96);
    assert(std::find(Wire.readLog.begin(), Wire.readLog.end(), 0x3d) == Wire.readLog.end());
    Wire.regs[0x3a] = 0xc0;
    assert(!sensor.calibrateOsc());
    Wire.unreadableReg = 0x3b;
    assert(!sensor.calibrateOsc());
    Wire.online = false;
    assert(sensor.readSpikeRejection() == 255 && !sensor.wakeUp());
    Wire.online = true;
    assert(sensor.begin() && sensor.readNoiseLevel() == 6);

    for (int stuck : {0x00, 0xff, 0x24}) {
        SPI.stuck = stuck;
        assert(!sensor.beginSPI(10) && sensor.lightningEnergy() == UINT32_MAX);
    }
    SPI.stuck = -1;
    SPI.regs[0] = INDOOR << 1;
    SPI.regs[1] = 0x42;
    assert(sensor.beginSPI(10) && SPI.regs[1] == 0x42);
    measurements(sensor, SPI.regs);
    for (int stuck : {0x00, 0xff}) {
        SPI.stuck = stuck;
        assert(sensor.distanceToStorm() == 255 && sensor.lightningEnergy() == UINT32_MAX);
    }
    SPI.stuck = -1;
    assert(sensor.distanceToStorm() == 63 && sensor.lastOperationSucceeded());
    assert(SPI.completedReads > 0 && !SPI.active);
    std::puts("AS3935 I2C and SPI probes, transfer errors, calibration and recovery passed");
}
