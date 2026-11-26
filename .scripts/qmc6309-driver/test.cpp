#include "QMC6309.h"
#include <cassert>
#include <cmath>
TwoWire Wire;
#include "generated.inc"
int main() {
    constexpr auto primary=QMC6309::ADDR_PRIMARY, other=QMC6309::ADDR_FALLBACK;
    Wire.identities[other]=0x18;
    assert(!qmc6309.begin(Wire) && !qmc6309.address() && Wire.writes==0);
    Wire.identities[primary]=0x90; Wire.identities[other]=0;
    assert(qmc6309.begin(Wire) && qmc6309.address()==primary && qmc6309.isConnected());
    assert(Wire.writes==2 && Wire.registers[10]==0xc3 && Wire.registers[11]==8);
    qmc6309_update(); assert(qmc6309_valid && Wire.frames==1);
    assert(qmc6309_x==100 && qmc6309_y==0 && qmc6309_z==-80 && qmc6309_heading==0);
    Wire.raw={0,100,32767}; qmc6309.setOffsets(0,50,0); qmc6309.setDeclination(-100);
    qmc6309_sampled=false; qmc6309_update();
    assert(Wire.frames==2 && qmc6309_valid && qmc6309_x==0 && qmc6309_y==100 && qmc6309_heading==350);
    qmc6309_update(); assert(Wire.frames==2);
    for (int index=0;index<6;++index) {
        Wire.failRead=index; qmc6309_sampled=false; qmc6309_update();
        assert(!qmc6309_valid && qmc6309_heading==350 && qmc6309_z==32767);
        int16_t x=7,y=8,z=9; assert(!qmc6309.readRaw(x,y,z) && x==7 && y==8 && z==9);
    }
    Wire.failRead=-1; Wire.shortTransfer=true; float heading=13;
    assert(!qmc6309.readHeading(heading) && heading==13);
    Wire.shortTransfer=false; Wire.queueFailure=true; assert(!qmc6309.readHeading(heading));
    Wire.queueFailure=false; Wire.identities[primary]=0x18; Wire.identities[other]=0x90;
    assert(!qmc6309.isConnected());
    assert(qmc6309.begin(Wire,-1,-1,100000,false) && qmc6309.address()==other);
    for(int index : {10,11}) {
        Wire.failWrite=index; assert(!qmc6309.begin(Wire) && !qmc6309.address());
        assert(!qmc6309.writeReg(11,8));
    }
    Wire.failWrite=-1; assert(qmc6309.begin(Wire));
    qmc6309.calibrateReset(); Wire.raw={-32768,-200,300}; assert(qmc6309.calibrateUpdate());
    Wire.raw={32766,100,600}; assert(qmc6309.calibrateUpdate()); qmc6309.calibrateApply();
    int16_t x,y,z; qmc6309.getOffsets(x,y,z); assert(x==-1 && y==-50 && z==450);
    Wire.raw={-1,50,450}; assert(qmc6309.readHeading(heading) && heading==350);
}
