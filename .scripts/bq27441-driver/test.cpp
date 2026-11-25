#include "Wire.h"
#include "SparkFunBQ27441.h"
#include <cassert>
#include <cstdio>
TestWire Wire;

int main() {
    BQ27441 gauge;
    assert(!gauge.lastOperationSucceeded());
    assert(gauge.begin() && gauge.lastOperationSucceeded());
    assert(gauge.voltage() == 4248 && gauge.lastOperationSucceeded());
    Wire.voltage = 0;
    assert(gauge.voltage() == 0 && gauge.lastOperationSucceeded());
    assert(gauge.current() == -123 && gauge.power() == -500);
    assert(gauge.soh(PERCENT) == 80 && gauge.soh(SOH_STAT) == 3);
    assert(gauge.temperature(INTERNAL_TEMP) == 2982);
    Wire.deviceId = 0x0521;
    assert(!gauge.begin() && !gauge.lastOperationSucceeded());
    Wire.online = false;
    assert(!gauge.begin() && !gauge.setCapacity(850));
    assert(!gauge.voltage() && !gauge.lastOperationSucceeded());
    assert(!gauge.setGPOUTPolarity(false) && !gauge.setGPOUTFunction(SOC_INT));
    Wire.online = true;
    Wire.voltage = 4248;
    Wire.shortReply = true;
    assert(!gauge.voltage() && !gauge.lastOperationSucceeded());
    Wire.shortReply = false;
    Wire.missingByte = true;
    assert(!gauge.voltage() && !gauge.lastOperationSucceeded());
    Wire.missingByte = false;
    Wire.queueFull = true;
    assert(!gauge.voltage() && !gauge.lastOperationSucceeded());
    Wire.queueFull = false;
    assert(gauge.voltage() == 4248 && gauge.lastOperationSucceeded());

    Wire = TestWire{};
    assert(gauge.setCapacity(850) && gauge.lastOperationSucceeded());
    const int transactions = Wire.transfers;
    assert(Wire.memory[82][10] == 3 && Wire.memory[82][11] == 82);
    assert(Wire.sealed && !Wire.configuring);
    for (int failure=1; failure<=transactions; ++failure) {
        Wire = TestWire{};
        BQ27441 interrupted;
        Wire.nackAt = failure;
        assert(!interrupted.setCapacity(850) && !interrupted.lastOperationSucceeded());
        assert(interrupted.setCapacity(1200) && interrupted.lastOperationSucceeded());
        assert(Wire.memory[82][10] == 4 && Wire.memory[82][11] == 176);
        assert(!Wire.configuring && Wire.sealed);
    }
    Wire = TestWire{};
    Wire.discardCommit = true;
    assert(!gauge.setCapacity(850) && !gauge.lastOperationSucceeded());
    assert(!Wire.configuring && Wire.sealed);
    Wire.discardCommit = false;
    Wire.collideOnReadback = true;
    assert(!gauge.setCapacity(850) && !gauge.lastOperationSucceeded());
    Wire.collideOnReadback = false;
    Wire.holdConfig = true;
    assert(!gauge.enterConfig() && !gauge.lastOperationSucceeded());
    assert(!Wire.configuring && Wire.sealed);
    Wire.holdConfig = false;
    assert(gauge.enterConfig() && Wire.configuring);
    assert(gauge.setCapacity(1200) && Wire.configuring && !Wire.sealed);
    assert(gauge.exitConfig(false) && !Wire.configuring && Wire.sealed);
    assert(gauge.setCapacity(1800) && !Wire.configuring && Wire.sealed);
    Wire.sealed = false;
    assert(gauge.setCapacity(2000) && !Wire.configuring && !Wire.sealed);
    std::printf("{\"nackPositions\":%d,\"allNackRetriesPassed\":true,\"shortRead\":true,\"absent\":true,\"validZero\":true,\"checksumCollision\":true,\"exitAndReseal\":true}\n",transactions);
}
