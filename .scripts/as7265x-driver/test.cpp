#include "SparkFun_AS7265X.h"
#include <cassert>
#include <cmath>
#include <cstdio>
#include <cstring>

TwoWire Wire;
static uint32_t clockMs;
uint32_t millis() { return clockMs; }
void delay(uint32_t ms) { clockMs += ms; }

int main() {
    AS7265X s;
    assert(!s.isConnected() && !s.dataAvailable());
    assert(s.getA()==-1 && s.readTemperatureCelsius()==-128 && std::isnan(s.getCalibratedA()));
    Wire.online=false; assert(!s.begin(Wire)); Wire.online=true;
    Wire.common[0]=0x40; Wire.common[1]=0x3e;
    assert(!s.begin(Wire) && s.isConnected() && s.getA()==-1);
    Wire.common[1]=0x41;
    for (uint8_t mask : {0x00,0x10,0x20}) {
        Wire.companions=mask; assert(!s.begin(Wire)); assert(Wire.configWrites==0);
    }
    Wire.companions=0x30;
    Wire.failAddress=5; assert(!s.begin(Wire));
    Wire.failPayload=5; assert(!s.begin(Wire));
    assert(s.begin(Wire) && Wire.common[5]==49);

    using Raw = int32_t (AS7265X::*)();
    using Cal = float (AS7265X::*)();
    const Raw raw[]={&AS7265X::getR,&AS7265X::getS,&AS7265X::getT,&AS7265X::getU,&AS7265X::getV,&AS7265X::getW,
                     &AS7265X::getG,&AS7265X::getH,&AS7265X::getI,&AS7265X::getJ,&AS7265X::getK,&AS7265X::getL,
                     &AS7265X::getA,&AS7265X::getB,&AS7265X::getC,&AS7265X::getD,&AS7265X::getE,&AS7265X::getF};
    const Cal cal[]={&AS7265X::getCalibratedR,&AS7265X::getCalibratedS,&AS7265X::getCalibratedT,&AS7265X::getCalibratedU,&AS7265X::getCalibratedV,&AS7265X::getCalibratedW,
                     &AS7265X::getCalibratedG,&AS7265X::getCalibratedH,&AS7265X::getCalibratedI,&AS7265X::getCalibratedJ,&AS7265X::getCalibratedK,&AS7265X::getCalibratedL,
                     &AS7265X::getCalibratedA,&AS7265X::getCalibratedB,&AS7265X::getCalibratedC,&AS7265X::getCalibratedD,&AS7265X::getCalibratedE,&AS7265X::getCalibratedF};
    for (int i=0;i<18;++i) {
        auto &bank=Wire.devices[i/6];
        const uint16_t value=i==17?65535:uint16_t(i*1021);
        const int offset=i%6;
        bank[8+2*offset]=value>>8; bank[9+2*offset]=uint8_t(value);
        const float reading=i+0.125f; uint32_t word; std::memcpy(&word,&reading,sizeof(word));
        for(int j=0;j<4;++j) bank[0x14+4*offset+j]=uint8_t(word>>(24-8*j));
    }
    for(int i=17;i>=0;--i) {
        assert((s.*raw[i])()==(i==17?65535:i*1021));
        assert((s.*cal[i])()==i+0.125f && s.lastOperationSucceeded());
    }
    Wire.devices[0][6]=129; Wire.devices[1][6]=255; Wire.devices[2][6]=127;
    assert(s.readTemperatureCelsius(0)==-127 && s.readTemperatureCelsius(1)==-1 && s.lastOperationSucceeded());
    assert(s.getTemperature(1)==255 && s.readTemperatureCelsius(2)==127);
    assert(std::fabs(s.getTemperatureAverage()+1.0f/3)<0.00001f);
    Wire.devices[1][6]=128; assert(std::isnan(s.getTemperatureAverage()) && !s.lastOperationSucceeded());
    assert(s.readTemperatureCelsius(3)==-128);
    Wire.failRead=9; assert(s.getA()==-1); Wire.failRead=0x16; assert(std::isnan(s.getCalibratedA()));
    Wire.shortRead=true; assert(s.getR()==-1); Wire.refuseSelection=true;
    assert(s.getA()==-1); Wire.refuseSelection=false;
    s.setIntegrationCycles(255); clockMs=0xffffff00u;
    const auto start=clockMs; s.takeMeasurementsWithBulb();
    assert(s.lastOperationSucceeded() && uint32_t(clockMs-start)>=1433 && Wire.bulbTransitions==6);
    Wire.failPayload=7; Wire.failDevice=1;
    s.takeMeasurementsWithBulb(); assert(!s.lastOperationSucceeded());
    for(const auto &bank:Wire.devices) assert(!(bank[7]&8));
    Wire.neverReady=true; s.setIntegrationCycles(0); s.takeMeasurementsWithBulb();
    assert(!s.lastOperationSucceeded()); for(const auto &bank:Wire.devices) assert(!(bank[7]&8));
    Wire.busy=true; const auto before=clockMs; assert(s.getA()==-1 && uint32_t(clockMs-before)==1000);
    Wire.busy=false; s.softReset(); assert(s.getA()==-1); assert(s.begin(Wire));
    std::puts("AS7265x identity, both companions, 18 channels, signed temperature, mailbox and lighting recovery passed");
}
