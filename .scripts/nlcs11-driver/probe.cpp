#include "color_sensor_nlcs11.h"
#include <cassert>

TwoWire Wire;
static uint32_t clockMs = 0;
uint32_t millis() { return clockMs; }
using Sensor = emakefun::ColorSensorNlcs11;

int main() {
  const uint16_t periods[] = {10, 20, 40, 80, 100, 200, 400, 800};
  for (int gain = 0; gain < 4; ++gain) {
    for (int time = 0; time < 8; ++time) {
      TwoWire bus;
      Sensor sensor(static_cast<Sensor::Gain>(gain), static_cast<Sensor::IntegrationTime>(time), 0x42, bus);
      clockMs = time % 2 ? UINT32_MAX - 2 : 0;
      assert(sensor.Initialize() == Sensor::kOK && bus.address == 0x42);
      assert((bus.sent == std::vector<uint8_t>{0x80, 3, static_cast<uint8_t>(gain * 16 + time)}));
      Sensor::Color color;
      color.b = 999;
      assert(!sensor.GetColor(&color));
      clockMs += periods[time] - 1;
      assert(!sensor.GetColor(&color) && color.b == 999 && !bus.requests);
      ++clockMs;
      assert(sensor.GetColor(&color) && bus.requests == 1 && bus.sent == std::vector<uint8_t>{0xa0});
      assert(color.r == 63 && color.g == 127 && color.b == 191 && color.c == 100);
      assert(Wire.requests == 0);
    }
  }
  Sensor::Color color;
  Sensor sensor(Sensor::kGain1X, Sensor::kIntegrationTime10ms);
  assert(!sensor.GetColor(nullptr) && !sensor.GetColor(&color));
  auto failed = [&] {
    color.r = color.g = color.b = color.c = 1234;
    clockMs += 10;
    assert(!sensor.GetColor(&color));
    assert(color.r == 0 && color.g == 0 && color.b == 0 && color.c == 0);
  };
  Wire.status = 2; failed(); assert(Wire.requests == 0);
  Wire.status = 0; Wire.capacity = 0; failed(); assert(Wire.requests == 0);
  Wire.capacity = 8;
  for (size_t n = 0; n < 8; ++n) {
    Wire.advertised = n; failed(); Wire.advertised = 8;
    Wire.readable = n; failed(); Wire.readable = 8;
    Wire.received = n; failed(); Wire.received = 8;
  }
  Wire.frame = {255,255,2,1,0,0,0,0}; failed();
  Wire.frame[6] = 1; clockMs += 10;
  assert(sensor.GetColor(&color) && color.r == UINT16_MAX && color.g == UINT16_MAX && color.b == 0 && color.c == 1);
  Wire.capacity = 2; assert(sensor.Initialize() == Sensor::kI2cDataTooLongToFitInTransmitBuffer);
  Wire.capacity = 8; Wire.status = 3; assert(sensor.Initialize() == Sensor::kI2cReceivedNackOnTransmitOfData);
  Sensor invalid(Sensor::kGain1X, static_cast<Sensor::IntegrationTime>(8));
  assert(invalid.Initialize() == Sensor::kInvalidParameter && !invalid.GetColor(&color));
}
