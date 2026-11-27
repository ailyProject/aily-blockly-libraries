#include "EspReceive.h"
#include <cassert>
static_assert(A0==54 && A7==61, "Sensor indices must preserve board pin aliases");
int main() {
  EspReceive sensor;
  assert(sensor.begin() && Wire.begins==1);
  TwoWire other;
  assert(sensor.begin(other) && other.begins==0 && other.speed==0);
  for(int i=0;i<16;++i){other.data.push_back(2);other.data.push_back(i<8?0:i==15?0:255);}
  SensorData sample{};
  assert(sensor.readSensorData(sample));
  assert(other.address==0x27 && other.tx==std::vector<uint8_t>({1}) && Wire.reads==0);
  assert(sample.reference[3]==512 && sample.current[3]==767 && sample.digital==255);
  assert(sensor.setModuleFrequency(300) && other.tx==std::vector<uint8_t>({2,1,44}));
  assert(sensor.setModuleRGB(RGB_COLOR_CYAN) && other.tx==std::vector<uint8_t>({3,6}));
  sensor.disableAutoUpload();
  const int prior=other.reads;other.data.resize(2);
  assert(sensor.getLatestData().current[3]==767 && other.reads==prior);
  sample.digital=7;
  assert(!sensor.readSensorData(sample) && sample.digital==7 && other.reads==prior+2);
  other.data.assign(32,0); other.data.front()=16;
  assert(!sensor.readSensorData(sample) && sample.digital==7 && sensor.getLatestData().digital==255);
  other.error=2;
  assert(!sensor.testI2CConnection() && !sensor.setModuleRGB(RGB_COLOR_BLUE));
  other.error=0;other.data.assign(32,0);other.data[1]=1;
  assert(sensor.readSensorData(sample) && sample.digital==254);
}
