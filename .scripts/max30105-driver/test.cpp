#include "MAX30105.h"
#include <cassert>
#include <cstdio>
#include <cstdlib>
TwoWire Wire;
unsigned long clockMs=0;
unsigned long millis(){return clockMs;}
void delay(unsigned long n){clockMs+=n;}
static void configure(MAX30105 &d,int channels=3){Wire=TwoWire{};Wire.mode=channels;assert(d.begin());d.setup(60,1,channels,100,411,4096);}
int main(){
  static MAX30105 sensor;
  configure(sensor);
  Wire.append(0x12345,0x23456,0x34567);
  unsigned observed=sensor.check();auto first=sensor.getFIFORed();
  printf("frame count=%u oldestRed=%u\n",observed,unsigned(first));
#ifdef FIXED
  assert(observed==1 && first==0x12345 && sensor.getFIFOIR()==0x23456 && sensor.getFIFOGreen()==0x34567);
#endif
  configure(sensor);Wire.append(10,20,30);Wire.append(11,21,31);
  bool batch=sensor.safeCheck(4);printf("two-frame safeCheck=%d\n",batch);
#ifdef FIXED
  assert(batch && sensor.available()==2 && sensor.getFIFORed()==10);
  sensor.nextSample();assert(sensor.getFIFORed()==11 && sensor.available()==1);
  sensor.nextSample();assert(sensor.available()==0);
#endif
  configure(sensor);Wire.append(0x10203,0x20405,0x30607);Wire.partial=true;
  observed=sensor.check();printf("four-of-nine byte transfer check=%u\n",observed);
#ifdef FIXED
  assert(observed==0 && sensor.available()==0 && Wire.reg[6]==0);
  assert(sensor.check()==1 && sensor.getFIFOGreen()==0x30607);
#endif
  Wire=TwoWire{}; Wire.id=0x24; bool init=sensor.begin();sensor.setup();sensor.shutDown();sensor.wakeUp();
  printf("foreign id init=%d configuration writes=%u\n",init,Wire.configWrites);
#ifdef FIXED
  assert(!init && !Wire.configWrites && !sensor.safeCheck(4));
  configure(sensor);Wire.present=false;assert(!sensor.check() && !sensor.safeCheck(5));Wire.present=true;
  Wire.append(0,262143,17);Wire.rejectSelect=true;assert(!sensor.check());assert(sensor.check()==1 && sensor.getFIFOIR()==262143);
  configure(sensor);Wire.append(123,456,789);Wire.nextReadFault=3;
  assert(!sensor.check() && !sensor.available() && sensor.check()==1 && sensor.getFIFOIR()==456);
  configure(sensor);Wire.append(0x101,0x102,0x103);Wire.denyRegister=6;assert(!sensor.check() && !sensor.available());Wire.denyRegister=-1;assert(sensor.check()==1);
  configure(sensor);Wire.append(3,4,5);Wire.partial=true;Wire.rejectRewind=true;
  assert(sensor.check()==0 && sensor.check()==0 && sensor.available()==0);
  configure(sensor);for(unsigned n=0;n<5;++n)Wire.append(1+n,11+n,21+n);
  Wire.partialOnBurst=2;assert(sensor.check()==3 && sensor.available()==3 && Wire.reg[6]==3);
  assert(sensor.check()==2 && sensor.available()==4 && Wire.reg[6]==5);
  for(unsigned n=1;n<5;++n){assert(sensor.getFIFOGreen()==21+n);sensor.nextSample();}
  for(int channels=1;channels<=3;++channels){
    configure(sensor,channels);Wire.reg[4]=Wire.reg[6]=29;
    for(unsigned j=0;j<9;++j)Wire.append(j+10,j+20,j+30);
    assert(sensor.check()==9 && sensor.available()==4);
    for(unsigned j=5;j<9;++j){
      assert(sensor.getFIFORed()==10+j && sensor.getFIFOIR()==(channels>=2?20+j:0) && sensor.getFIFOGreen()==(channels==3?30+j:0));sensor.nextSample();
    }
    assert(sensor.available()==0);
    for(auto n:Wire.bursts)assert(n<=32 && n%(channels*3)==0);
  }
  for (bool shortFirstBurst : {false, true}) {
    configure(sensor);
    for (unsigned n = 0; n < 32; ++n) Wire.append(n, n + 100, n + 200);
    Wire.reg[5] = 15;
    Wire.denyRegister = 5;
    assert(sensor.check() == 0 && sensor.available() == 0);
    Wire.denyRegister = -1;
    if (shortFirstBurst) {
      Wire.partial = true;
      assert(sensor.check() == 0 && Wire.reg[5] == 0 && Wire.reg[6] == 0);
    }
    assert(sensor.check() == 32 && Wire.reg[5] == 0 && sensor.available() == 4);
    for (unsigned n = 28; n < 32; ++n) {
      assert(sensor.getFIFORed() == n && sensor.getFIFOIR() == n + 100 &&
             sensor.getFIFOGreen() == n + 200);
      sensor.nextSample();
    }
    assert(sensor.check() == 0 && sensor.available() == 0);
  }
  configure(sensor);
  for (unsigned n = 0; n < 32; ++n) Wire.append(n, n, n);
  Wire.reg[5] = 1;
  Wire.partial = true;
  assert(sensor.check() == 0 && Wire.reg[5] == 0);
  sensor.clearFIFO();
  assert(sensor.check() == 0 && sensor.available() == 0);
  configure(sensor);Wire.address=0x55;assert(sensor.begin(Wire,100000,0x55));sensor.setup();Wire.append(3,4,5);assert(sensor.check()==1 && sensor.getFIFOIR()==4);
  configure(sensor);auto before=millis();assert(!sensor.safeCheck(300) && millis()-before>=300);
  puts("MAX30105 packaged driver passed identity, FIFO order, timeouts, partial transfers, wrap and recovery.");
#endif
}
