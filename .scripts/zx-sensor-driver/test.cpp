#include "Wire.h"
#include "ZX_Sensor.h"

TwoWire Wire;
void attach() {
    Wire = TwoWire{};
    Wire.bytes[ZX_MODEL] = ZX_MODEL_VER;
    Wire.bytes[ZX_REGVER] = ZX_REG_MAP_VER;
    Wire.bytes[ZX_DRCFG] = 0x81;
    Wire.bytes[ZX_STATUS] = 5;
    Wire.bytes[ZX_XPOS] = 37; Wire.bytes[ZX_ZPOS] = 140;
    Wire.bytes[ZX_GESTURE] = 2; Wire.bytes[ZX_GSPEED] = 71;
}
void checkFailure(ZX_Sensor& zx) {
    assert(!zx.init());
    assert(!zx.positionAvailable() && !zx.gestureAvailable());
    assert(zx.readX() == ZX_ERROR && zx.readZ() == ZX_ERROR);
    assert(zx.readGesture() == NO_GESTURE && zx.readGestureSpeed() == ZX_ERROR);
}
int main() {
    for (const int address : {0x10, 0x11}) {
        attach();
        Wire.address = address;
        ZX_Sensor zx(address);
        assert(zx.init() && Wire.bytes[ZX_DRCFG] == 1 && Wire.bytes[ZX_DRE] == 0);
        assert(zx.positionAvailable() && zx.gestureAvailable());
        assert(zx.readX() == 37 && zx.readZ() == 140);
        for (int code = 1; code <= 3; ++code) {
            Wire.bytes[ZX_GESTURE] = code;
            assert(static_cast<int>(zx.readGesture()) == code && zx.readGestureSpeed() == 71);
        }
        Wire.bytes[ZX_STATUS] = 0; Wire.bytes[ZX_XPOS] = 0; Wire.bytes[ZX_ZPOS] = 240;
        assert(!zx.positionAvailable() && !zx.gestureAvailable() && zx.readX() == 0 && zx.readZ() == 240);
        Wire.bytes[ZX_XPOS] = 241; assert(zx.readX() == ZX_ERROR);
        Wire.absent = true; checkFailure(zx);
        Wire.absent = false; assert(zx.init(ALL_INTERRUPTS, false));
        assert(Wire.bytes[ZX_DRE] == 0x3f && Wire.bytes[ZX_DRCFG] == 0x80);
        for (auto fault : {TwoWire::Fault::queue, TwoWire::Fault::nack, TwoWire::Fault::shortRead,
                           TwoWire::Fault::unavailable, TwoWire::Fault::invalidByte}) {
            Wire.fault = fault;
            checkFailure(zx);
            Wire.fault = TwoWire::Fault::none;
            assert(zx.init());
        }
        Wire.bytes[ZX_REGVER] = 2; assert(!zx.init());
        Wire.bytes[ZX_REGVER] = 1; Wire.bytes[ZX_MODEL] = 0; assert(!zx.init());
    }
    ZX_Sensor zx(0x10);
    for (auto mode : {NO_INTERRUPTS, POSITION_INTERRUPTS, GESTURE_INTERRUPTS, ALL_INTERRUPTS}) {
        attach(); assert(zx.init(mode));
        const int total = Wire.transfers;
        // Every pointer write, register write and single-byte read must propagate a failure.
        for (int index = 1; index <= total; ++index) {
            attach(); Wire.failAt = index; Wire.fault = TwoWire::Fault::nack;
            if (zx.init(mode)) {
                attach(); Wire.failAt = index; Wire.fault = TwoWire::Fault::shortRead;
                assert(!zx.init(mode));
            }
            Wire.fault = TwoWire::Fault::none;
            assert(zx.init(mode));
        }
    }
}
