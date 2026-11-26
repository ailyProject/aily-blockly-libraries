#include <LTR308.h>
#include <cassert>
#include <cmath>
#include <cstdio>
TwoWire Wire;

int main() {
    LTR308 light;
    assert(light.getRawData()==UINT32_MAX && std::isnan(light.getLux()) && !light.isDataReady());
    assert(!light.begin(nullptr));
    Wire.regs[6]=0xB0;
    assert(!light.begin() && Wire.writes==0);
    Wire.regs[6]=0xB1;
    for (int reg:{0,4,5}) {
        Wire.failReg=reg;
        assert(!light.begin() && light.getRawData()==UINT32_MAX);
    }
    Wire.failReg=-1;
    assert(light.begin() && Wire.regs[0]==2 && Wire.regs[4]==0x23 && Wire.regs[5]==0);
    assert(light.getRawData()==0 && light.getLux()==0);
    Wire.regs[7]=8;
    assert(light.isDataReady());
    Wire.regs[13]=0x56; Wire.regs[14]=0x34; Wire.regs[15]=0xF2;
    assert(light.getRawData()==0x23456);
    for (unsigned n:{0,1,2}) {
        Wire.limit=n;
        assert(light.getRawData()==UINT32_MAX && std::isnan(light.getLux()));
        assert(!Wire.available());
    }
    Wire.limit=3; Wire.readable=2;
    assert(light.getRawData()==UINT32_MAX);
    Wire.readable=3; Wire.present=false;
    auto before=Wire.requests;
    assert(light.getRawData()==UINT32_MAX && !light.isDataReady() && Wire.requests==before);
    Wire.present=true;
    for (unsigned t=0;t<5;++t) {
        for (unsigned rate:{0,1,2,4,5,6}) {
            assert(light.beginConfigured(&Wire, LTR308_GAIN_6, t, rate));
            assert(Wire.regs[4]==((4-t)*16+(rate==4?3:rate)));
            Wire.regs[13]=100;
            assert(std::fabs(light.getLux()-40.f/(1u<<t))<0.001f);
        }
    }
    light.setMeasurementRate(LTR308_RATE_50MS);
    light.setIntegrationTime(LTR308_INTEGRATION_25MS);
    assert(Wire.regs[4]==0x41);
    light.setMeasurementRate(LTR308_RATE_1000MS);
    light.setIntegrationTime(LTR308_INTEGRATION_400MS);
    assert(Wire.regs[4]==0x05);
    Wire.failReg=5; light.setGain(LTR308_GAIN_18);
    assert(std::fabs(light.getLux()-2.5f)<0.001f);
    Wire.failReg=-1;
    for (uint8_t g=0;g<5;++g) {
        static const int gain[]={1,3,6,9,18};
        light.setGain(g);
        assert(Wire.regs[5]==g && std::fabs(light.getLux()-15.f/gain[g])<0.001f);
    }
    before=Wire.writes;
    light.setMeasurementRate(3); light.setGain(5); light.setIntegrationTime(5);
    assert(Wire.writes==before && !light.beginConfigured(&Wire,0,2,3));
    assert(!light.beginConfigured(&Wire,5,2,0) && !light.beginConfigured(&Wire,0,5,0));
    assert(Wire.writes==before && std::isnan(light.getLux()));
    assert(light.begin() && Wire.regs[4]==0x05 && Wire.regs[5]==4);
    light.reset();
    assert(Wire.regs[4]==0x22 && Wire.regs[5]==1 && Wire.regs[0]==0);
    Wire.regs[13]=100;
    assert(std::fabs(light.getLux()-20.f)<0.001f);
    puts("PASS: identity, NACK, incomplete transfers, darkness, 30 timing combinations, gain, conversion, recovery, reset");
}
