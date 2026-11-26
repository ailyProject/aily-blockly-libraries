#include "AS726X.h"
#include <cassert>
#include <cmath>
#include <cstdio>
#include <cstring>
#include <limits>

TwoWire Wire;
static uint32_t clockMs = 0;
uint32_t millis() { return clockMs; }
void delay(uint32_t ms) { clockMs += ms; }

int main() {
    AS726X sensor;
    assert(!sensor.dataAvailable());
    assert(sensor.getRed() == -1);
    for (uint8_t id : {0x3d, 0x3e, 0x3f}) {
        Wire.regs[1] = id;
        assert(sensor.begin(Wire));
        assert(sensor.getVersion() == id);
    }
    Wire.regs[1] = 0x41;
    assert(!sensor.begin(Wire));
    assert(!sensor.dataAvailable() && !sensor.lastOperationSucceeded());
    Wire.regs[1] = 0x3e;
    Wire.nackAddress = 5;
    assert(!sensor.begin(Wire));
    assert(sensor.begin(Wire));
    Wire.nackData = 5;
    assert(!sensor.begin(Wire));
    assert(sensor.begin(Wire) && Wire.regs[5] == 50);

    using Raw = int32_t (AS726X::*)();
    using Cal = float (AS726X::*)();
    Raw raw[] = {&AS726X::getViolet,&AS726X::getBlue,&AS726X::getGreen,&AS726X::getYellow,&AS726X::getOrange,&AS726X::getRed};
    Cal cal[] = {&AS726X::getCalibratedViolet,&AS726X::getCalibratedBlue,&AS726X::getCalibratedGreen,
                 &AS726X::getCalibratedYellow,&AS726X::getCalibratedOrange,&AS726X::getCalibratedRed};
    const uint16_t counts[] = {0,0x12ff,0xff01,0x8000,0xffff,477};
    for (int i=0;i<6;++i) {
        Wire.regs[8+2*i] = counts[i] >> 8;
        Wire.regs[9+2*i] = uint8_t(counts[i]);
        assert((sensor.*raw[i])() == counts[i] && sensor.lastOperationSucceeded());
        const float value=2.75f*i; uint32_t bits;
        std::memcpy(&bits,&value,sizeof(bits));
        for (int j=0;j<4;++j) Wire.regs[0x14+4*i+j]=uint8_t(bits>>(8*(3-j)));
        assert((sensor.*cal[i])() == value);
    }
    Wire.shortAt=9;
    assert(sensor.getViolet()==-1 && !sensor.lastOperationSucceeded());
    Wire.shortAt=0x16;
    assert(std::isnan(sensor.getCalibratedViolet()) && !sensor.lastOperationSucceeded());
    Wire.lateRead=true;
    assert(sensor.readTemperatureCelsius()==-1);
    Wire.regs[6]=255;
    assert(sensor.readTemperatureCelsius()==255 && sensor.lastOperationSucceeded());
    Wire.regs[6]=0;
    assert(sensor.readTemperatureCelsius()==0 && sensor.lastOperationSucceeded());

    Wire.stuck=true; uint32_t start=millis();
    assert(sensor.setIntegrationTime(90)!=0 && millis()-start<=25);
    Wire.stuck=false; Wire.ready=true;
    assert(sensor.takeMeasurementsWithBulb()==0);
    assert(!(Wire.regs[7]&8) && Wire.lit>0);
    Wire.ready=false; clockMs=std::numeric_limits<uint32_t>::max()-10; start=millis();
    assert(sensor.takeMeasurementsWithBulb()!=0);
    assert(uint32_t(millis()-start)>=3000 && uint32_t(millis()-start)<=3020);
    assert(!(Wire.regs[7]&8) && !sensor.lastOperationSucceeded());
    Wire.nackData=4;
    assert(sensor.takeMeasurementsWithBulb()!=0 && !(Wire.regs[7]&8) && Wire.pending==-1);
    Wire.lost=true;
    assert(!sensor.begin(Wire) && sensor.getViolet()==-1 && std::isnan(sensor.getCalibratedRed()));
    Wire.lost=false; Wire.ready=true;
    assert(sensor.begin(Wire) && sensor.takeMeasurements()==0);
    std::puts("AS726X six channels, identity, error propagation, mailbox recovery and lamp cleanup passed");
}
