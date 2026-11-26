#include <cassert>
#include <cmath>
#include <Wire.h>

TestWire Wire;
struct { void println(const char*) {} } Serial;
#include "generated.inc"

static void sample(int x, int y, int z, bool fast) {
    int values[] = {x, y, z};
    for (int i = 0; i < 3; ++i) {
        unsigned raw = (unsigned(values[i]) & (fast ? 255 : 1023)) << (fast ? 8 : 6);
        Wire.regs[1 + 2*i] = raw >> 8;
        Wire.regs[2 + 2*i] = raw & 255;
    }
}

int main() {
    Wire.online = false;
    generatedSetup(); mma8653_begin();
    assert(!mma8653_check_connection() && !mma8653_is_active());
    int16_t x = 1, y = 2, z = 3;
    assert(!accel.tryReadSensor(&x,&y,&z) && x == 1 && y == 2 && z == 3);
    mma8653_read_xyz();
    assert(vx == INT16_MIN && vy == INT16_MIN && vz == INT16_MIN);
    assert(mma8653_read_x() == INT16_MIN && mma8653_read_y() == INT16_MIN && mma8653_read_z() == INT16_MIN);
    assert(std::isnan(mma8653_get_roll()) && std::isnan(mma8653_get_pitch()) && std::isnan(mma8653_get_tilt()));
    Wire.online = true; Wire.regs[0x0d] = 0x2a;
    mma8653_begin(); assert(!mma8653_is_active());
    Wire.regs[0x0d] = 0x5a; Wire.rejectReg = 0x0e;
    mma8653_begin(); assert(!mma8653_is_active());
    Wire.rejectReg = -1;
    mma8653_begin();
    assert(mma8653_is_active() && mma8653_check_connection() && Wire.regs[0x0e] == 1 && Wire.regs[0x2a] == 0x21);
    for (bool fast : {false,true}) {
        accel.setResolution(!fast);
        assert(accel.getResolution() == !fast);
        assert(Wire.regs[0x2a] == (fast ? 0x23 : 0x21));
        sample(fast ? -128 : -512, -1, fast ? 127 : 511, fast);
        mma8653_read_xyz();
        assert(vx == (fast ? -128 : -512) && vy == -1 && vz == (fast ? 127 : 511));
        for (Wire.shortBurst = 0; Wire.shortBurst < (fast ? 3 : 6); ++Wire.shortBurst) {
            assert(!accel.tryReadSensor(&x,&y,&z) && x == 1 && y == 2 && z == 3);
            assert(mma8653_read_y() == INT16_MIN && std::isnan(mma8653_get_roll()));
        }
        Wire.shortBurst = 6;
        assert(mma8653_read_y() == -1);
        sample(0,64,0,fast);
        assert(std::abs(mma8653_get_roll()-90) < 0.001 && std::abs(mma8653_get_tilt()-90) < 0.001);
    }
    mma8653_set_range(); mma8653_set_resolution(); mma8653_set_data_rate(); mma8653_set_mode();
    assert(accel.getRange()==4 && Wire.regs[0x2a]==0x21 && (Wire.regs[0x2b]&3)==3);
    accel.enterStandby();
    assert(!mma8653_is_active() && Wire.regs[0x2a] == 0x20 && mma8653_read_z() == INT16_MIN);
    mma8653_begin();
    assert(accel.readREG(0x0d) == 0x5a);
    Wire.online=false; assert(mma8653_read_x()==INT16_MIN);
    assert(accel.readREG(0x0d) == 0);
    Wire.online=true; Wire.regs.fill(0); Wire.regs[0x0d]=0x5a;
    mma8653_begin(); assert(mma8653_is_active() && Wire.regs[0x2a]==0x21 && accel.getRange()==4);
}
