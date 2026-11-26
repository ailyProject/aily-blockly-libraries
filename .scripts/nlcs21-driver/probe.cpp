#include "color_sensor_nlcs21.h"
#include <Arduino.h>
#include <cassert>

TwoWire Wire;
SerialStub Serial;
static uint32_t tick;
uint32_t millis() { return tick; }
void delay(unsigned long ms) { tick += ms; }
using Sensor = emakefun::ColorSensorNlcs21;

int main() {
  constexpr uint8_t periods[] = {3, 9, 34, 133};
  for (int gain = 0; gain < 6; ++gain) {
    for (int time = 0; time < 4; ++time) {
      TwoWire bus;
      Sensor sensor(static_cast<Sensor::Gain>(gain), static_cast<Sensor::IntegrationTime>(time), bus);
      assert(sensor.Initialize() == Sensor::kOK && bus.address == 0x38 && Wire.history.empty());
      assert(bus.history.size() == 8);
      assert((bus.history[6] == std::vector<uint8_t>{4, static_cast<uint8_t>(128 | 1 << gain)}));
      assert((bus.history[7] == std::vector<uint8_t>{5, static_cast<uint8_t>(time)}));
      tick = time % 2 ? UINT32_MAX - 1 : 0;
      Sensor::Color sample;
      sample.b = 999;
      assert(!sensor.GetColor(&sample));
      tick += periods[time] - 1;
      assert(!sensor.GetColor(&sample) && sample.b == 999 && bus.requests == 0);
      ++tick;
      assert(sensor.GetColor(&sample) && bus.requests == 1);
      assert(sample.r == 63 && sample.g == 127 && sample.b == 191 && sample.c == 100);
    }
  }
  for (size_t i = 1; i <= 8; ++i) {
    TwoWire bus;
    bus.failAt = i;
    Sensor sensor(Sensor::kGain1X, Sensor::kIntegrationTime2ms, 0x39, bus);
    assert(sensor.Initialize() == Sensor::kI2cReceivedNackOnTransmitOfAddress);
    assert(bus.history.size() == i && bus.address == 0x39);
    assert(sensor.Initialize() == Sensor::kOK && bus.history.size() == i + 8);
  }
  TwoWire bus;
  Sensor sensor(Sensor::kGain4X, Sensor::kIntegrationTime2ms, bus);
  Sensor::Color sample;
  assert(!sensor.GetColor(&sample));
  auto fail = [&] {
    sample.r = sample.g = sample.b = sample.c = 1234;
    tick += 3;
    assert(!sensor.GetColor(&sample));
    assert(sample.r == 0 && sample.g == 0 && sample.b == 0 && sample.c == 0);
  };
  bus.status = 2; fail(); assert(bus.requests == 0 && sensor.LastError() == Sensor::kI2cReceivedNackOnTransmitOfAddress);
  bus.status = 0; bus.capacity = 0; fail(); assert(bus.requests == 0 && sensor.LastError() == Sensor::kI2cDataTooLongToFitInTransmitBuffer);
  bus.capacity = 8;
  for (size_t n = 0; n < 8; ++n) {
    bus.advertised=n; fail(); bus.advertised=8;
    bus.readable=n; fail(); bus.readable=8;
    bus.received=n; fail(); bus.received=8;
    assert(sensor.LastError()==Sensor::kI2cOtherError);
  }
  bus.frame={255,255,0,0,1,0,0,0}; fail(); assert(sensor.LastError()==Sensor::kOK);
  bus.frame[6]=1; tick+=3; assert(sensor.GetColor(&sample) && sample.r==UINT16_MAX && sample.c==1);
  bus.history.clear(); bus.failAt=3;
  sensor.SetThreshold(0x1234,0xabcd);
  assert(bus.history.size()==3 && sensor.LastError()==Sensor::kI2cReceivedNackOnTransmitOfAddress);
  bus.history.clear(); bus.failAt=0; sensor.SetThreshold(0x1234,0xabcd);
  assert((bus.history==std::vector<std::vector<uint8_t>>{{12,52},{13,18},{14,205},{15,171}}));
  bus.advertised=bus.readable=bus.received=1; bus.frame={0x81};
  assert(sensor.GetInterruptStatus()==1 && sensor.LastError()==Sensor::kOK);
  bus.received=0; assert(sensor.GetInterruptStatus()==0 && sensor.LastError()==Sensor::kI2cOtherError);
  sensor.ClearInterrupt(); assert((bus.sent==std::vector<uint8_t>{2,128}) && sensor.LastError()==Sensor::kOK);
  Sensor invalid(static_cast<Sensor::Gain>(6), Sensor::kIntegrationTime2ms);
  assert(invalid.Initialize()==Sensor::kInvalidParameter && !invalid.GetColor(&sample));
}
