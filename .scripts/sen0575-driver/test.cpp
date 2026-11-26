#include "DFRobot_RainfallSensor.h"
#include <cstdio>
TwoWire Wire;
int main(){
 DFRobot_RainfallSensor_I2C sensor(&Wire);
 Wire.rx={0xc0,0,0x43,0x73};assert(sensor.begin());
 assert(sensor.setRainAccumulatedValue(0.5f)==0);
 assert((Wire.tx==std::vector<int>{0x28,0x88,0x13}));
 Wire.rx={0x10,0x27,0,0};assert(sensor.getRainfall(2)==1.0f);
 Wire.rx={60,0};assert(sensor.getSensorWorkingTime()==1.0f);
 Wire.rx={7,0,0,0};assert(sensor.getRawData()==7);
 Wire.ack=2;
 int missing=sensor.setRainAccumulatedValue(0.5f);
 assert(!sensor.begin());
 Wire.ack=0;Wire.rx={0x10};float partial=sensor.getRainfall(2);
 Wire.rx={0x10};Wire.announced=4;float falseCount=sensor.getRainfall(2);
 Wire.announced=-1;Wire.rx={0x10,0x27,0,0};Wire.statusOnce=2;
 int before=Wire.requests;float selector=sensor.getRainfall(3);int staleReads=Wire.requests-before;
 Wire.rx.clear();Wire.txLimit=1;int full=sensor.setRainAccumulatedValue(0.5f);
 Wire.txLimit=32;Wire.rx={0x10,0x27,0,0};assert(sensor.getRainfall(3)==1.0f);
 printf("%d %.2f %.2f %.2f %d %d\n",missing,partial,falseCount,selector,staleReads,full);
}
