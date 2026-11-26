#include "QMI8658.h"
#include "OJoy_QMI8658C.h"
#include <cassert>

TwoWire Wire;

void checkOnboard() {
  TwoWire bus;
  OJoy_QMI8658C sensor;
  bus.registers[0] = 0x42;
  assert(!sensor.begin(0x6b, 5, 4, bus) && bus.writes == 0);

  bus.registers[0] = 0x05;
  bus.registers[0x36] = 0x10;
  bus.registers[0x34] = 25;
  assert(sensor.begin(0x6b, 5, 4, bus) && sensor.read());
  assert(sensor.ax() == 1 && sensor.temperature() == 25);

  bus.registers[0x36] = 0x20;
  for (int first : {0x35, 0x33}) {
    bus.shortReadRegister = first;
    assert(!sensor.read());
    assert(sensor.ax() == 1 && sensor.temperature() == 25);
  }
  bus.attached = false;
  assert(!sensor.present() && !sensor.read() && sensor.ax() == 1);
  bus.attached = true;
  bus.shortReadRegister = -1;
  assert(sensor.present() && sensor.read() && sensor.ax() == 2);
}

void checkAddressAndByteOrder() {
  TwoWire bus;
  bus.deviceAddress = 0x6a;
  bus.registers[0] = 0x42;
  QMI8658 sensor;
  assert(!sensor.begin(bus, 0x6b, 5, 4, 400000) && bus.writes == 0);
  bus.registers[0] = 0x05;
  assert(sensor.begin(bus, 0x6b, 5, 4, 400000) && sensor.isConnected());
  bus.registers[0x36] = 0x40;
  bus.registers[0x37] = 0xff;
  bus.registers[0x38] = 0xfe;
  QMI8658Data data{};
  assert(sensor.read(data));
  assert(data.ax == 16384 && data.ay == -257 && data.axg == 1);
  bus.shortReadRegister = 0x35;
  assert(!sensor.read(data));
  bus.registers[0] = 0x42;
  assert(!sensor.isConnected());
  bus.attached = false;
  assert(!sensor.read(data));
}

int main() {
  checkOnboard();
  checkAddressAndByteOrder();
}
