#include "LIDARLite_v4LED.h"
#include <cassert>

TwoWire Wire;
uint32_t nowMs = 0;

int main() {
    LIDARLite_v4LED lidar;
    TwoWire alternate;
    assert(!lidar.isConnected() && lidar.getDistanceCm() == -1);
    assert(lidar.begin(0x62, alternate));
    for (uint16_t cm : {0, 1, 255, 256, 513, 65535}) {
        alternate.registers[0x10] = cm & 255;
        alternate.registers[0x11] = cm >> 8;
        assert(lidar.getDistanceCm() == cm && lidar.getDistance() == cm);
    }
    assert(Wire.polls == 0);
    uint8_t counts[] = {255,128,24,128,255,4};
    uint8_t quick[] = {8,8,0,0,0,0};
    for (uint8_t i = 0; i < 6; ++i) {
        assert(lidar.tryConfigure(i));
        assert(alternate.registers[5] == counts[i] && alternate.registers[0xe5] == quick[i]);
    }
    assert(!lidar.tryConfigure(6));
    alternate.rejectPayload = true;
    assert(lidar.getDistanceCm() == -1 && !lidar.tryConfigure(0));
    alternate.rejectPayload = false;
    for (int reg : {0, 1, 0x10}) {
        alternate.nack = reg;
        assert(lidar.getDistanceCm() == -1);
    }
    alternate.nack = 0xe5; assert(!lidar.tryConfigure(0)); alternate.nack = -1;
    for (int reg : {1, 0x10}) {
        alternate.shortRegister = reg; assert(lidar.getDistanceCm() == -1);
        alternate.shortRegister = -1; alternate.emptyRegister = reg;
        assert(lidar.getDistanceCm() == -1); alternate.emptyRegister = -1;
    }
    nowMs = UINT32_MAX - 2;
    alternate.stuck = true;
    assert(lidar.getDistanceCm(5) == -2 && nowMs == 2);
    assert(lidar.getDistanceCm(0) == -2 && nowMs == 2);
    alternate.stuck = false;
    alternate.online = false;
    assert(!lidar.isConnected() && lidar.getDistanceCm() == -1 && lidar.getDistance() == 0);
    alternate.online = true;
    assert(lidar.getDistanceCm() == 65535);
}
