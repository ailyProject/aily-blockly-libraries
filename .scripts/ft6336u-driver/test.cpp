#include "FT6336U.h"
#include "Wire.h"
#include <cassert>
#include <cstdio>

TestWire Wire;
static void point(int slot, uint8_t id, unsigned x, unsigned y) {
    const int base = 3 + slot * 6;
    Wire.registers[base] = 0x80 | ((x >> 8) & 15);
    Wire.registers[base+1] = x;
    Wire.registers[base+2] = (id << 4) | ((y >> 8) & 15);
    Wire.registers[base+3] = y;
}
int main() {
    FT6336U first(1, 0), other(3, 2);
    first.begin();
    Wire.registers[2] = 2;
    point(0,1,17,28);
    point(1,0,263,79);
    FT6336U_TouchPointType sample{};
    assert(first.tryScan(sample) && Wire.requests == 1 && Wire.lastRequest == 13);
    assert(sample.touch_count == 2 && sample.tp[1].status == touch && sample.tp[1].x == 17);
    assert(sample.tp[0].x == 263 && sample.tp[0].y == 79 && sample.tp[0].status == touch);
    point(0,0,800,240); point(1,1,63,91);
    sample = first.scan();
    assert(sample.tp[0].status == stream && sample.tp[0].x == 800 && sample.tp[1].y == 91);
    assert(other.scan().tp[0].status == touch);
    for (int count = 0; count < 13; ++count) {
        Wire.countOverride=count;
        assert(!first.tryScan(sample) && sample.touch_count == 2 && sample.tp[0].x == 800);
        assert(!Wire.available());
        auto failed=first.scan();
        assert(failed.touch_count == 0 && failed.tp[0].status == release && failed.tp[1].y == 91);
    }
    Wire.countOverride=-1;Wire.availableLimit=4;
    assert(!first.tryScan(sample));Wire.availableLimit=-1;
    Wire.online=false;
    auto requests=Wire.requests, selects=Wire.selects;
    assert(!first.tryScan(sample) && Wire.requests == requests && Wire.selects == selects+1);
    Wire.online=true;Wire.acceptRegister=false;
    assert(first.read_touch1_x() == 0 && Wire.requests == requests && Wire.stopped);
    Wire.acceptRegister=true;
    assert(first.scan().tp[0].status == touch && other.scan().tp[0].status == stream);
    Wire.registers[2]=3;assert(!first.tryScan(sample));
    Wire.registers[2]=2;point(1,0,60,90);assert(!first.tryScan(sample));
    Wire.registers[2]=1;point(0,2,100,120);assert(!first.tryScan(sample));
    point(0,1,512,913);assert(first.tryScan(sample));
    assert(sample.touch_count==1 && sample.tp[0].status==release && sample.tp[1].status==touch);
    assert(first.read_touch1_y()==913 && Wire.lastRequest==2);
    first.write_distance_zoom(0x43);assert(first.read_distance_zoom()==0x43);
    Wire.registers[0xA1]=0x12;Wire.registers[0xA2]=0x34;assert(first.read_library_version()==0x1234);
    Wire.registers[2]=0;assert(first.tryScan(sample) && sample.touch_count==0 && sample.tp[1].status==release);
    first.begin();sample=first.scan();assert(sample.tp[0].x==0 && sample.tp[1].y==0);
    std::puts("valid two-contact frames, release, transfer failures, configuration and rebind passed");
}
