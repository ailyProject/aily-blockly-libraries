#include "SparkFun_RFD77402_Arduino_Library.h"
#include <cassert>
TwoWire Wire;
unsigned long delayedMs = 0;

static void invalid(RFD77402 &sensor, uint8_t status) {
  assert(sensor.takeMeasurement() == status);
  assert(sensor.getMeasurementStatus() == status);
  assert(sensor.getDistanceOrError() == -1);
  assert(sensor.getValidPixelsOrError() == -1);
  assert(sensor.getConfidenceOrError() == -1);
}

int main() {
  RFD77402 sensor;
  assert(sensor.getDistance() == 0 && sensor.getDistanceOrError() == -1);
  invalid(sensor, CODE_FAILED_TRANSFER);
  TwoWire bus;
  bus.regs[0x0c] = 0x56;
  bus.nackWrite = 0x24;
  assert(!sensor.begin(bus));
  invalid(sensor, CODE_FAILED_TRANSFER);
  bus.nackWrite = -1;
  assert(sensor.begin(bus, 400000) && bus.clock == 400000 && !Wire.transactions);
  assert(bus.regs[0x0c] == 0xe156 && bus.regs[0x26] == 0x45d4);
  assert(sensor.getMeasurementStatus() == CODE_FAILED_NOT_NEW);
  bus.result = 0x8000;
  bus.confidence = 0;
  assert(sensor.takeMeasurement() == 0 && sensor.getDistanceOrError() == 0 && sensor.getConfidenceOrError() == 0);
  bus.result = 0x8000 | (321 << 2);
  bus.confidence = (456 << 4) | 7;
  assert(sensor.takeMeasurement() == 0);
  assert(sensor.getDistanceOrError() == 321 && sensor.getValidPixelsOrError() == 7 && sensor.getConfidenceOrError() == 456);
  bus.result = 0x8000 | (1000 << 2);
  bus.shortRead = 10;
  invalid(sensor, CODE_FAILED_TRANSFER);
  assert(sensor.getDistance() == 321 && sensor.getValidPixels() == 7 && sensor.getConfidenceValue() == 456);
  bus.shortRead = -1;
  for (int reg : {0, 8, 10}) {
    bus.nackReadPointer = reg; invalid(sensor, CODE_FAILED_TRANSFER); bus.nackReadPointer = -1;
    bus.shortRead = reg; invalid(sensor, CODE_FAILED_TRANSFER); bus.shortRead = -1;
    bus.negativeByte = reg; invalid(sensor, CODE_FAILED_TRANSFER); bus.negativeByte = -1;
  }
  bus.failQueue = true; invalid(sensor, CODE_FAILED_TRANSFER); bus.failQueue = false;
  bus.nackWrite = 4; invalid(sensor, CODE_FAILED_TRANSFER); bus.nackWrite = -1;
  bus.result = 321 << 2; invalid(sensor, CODE_FAILED_NOT_NEW);
  for (uint8_t code = 1; code <= 3; ++code) {
    bus.result = 0x8000 | (code << 13); invalid(sensor, code);
  }
  bus.ready = false; delayedMs = 0; invalid(sensor, CODE_FAILED_TIMEOUT); assert(delayedMs == 100);
  bus.ready = true; bus.present = false; invalid(sensor, CODE_FAILED_TRANSFER); bus.present = true;
  bus.result = 0x8000 | (2047 << 2); bus.confidence = (2047 << 4) | 9;
  assert(sensor.takeMeasurement() == 0 && sensor.getDistanceOrError() == 2047 && sensor.getConfidenceOrError() == 2047);
  assert(sensor.getCalibrationData() && bus.mailboxWords == 27);
  for (int i=0;i<27;++i) assert(sensor.calibrationData[i*2] == 0xab && sensor.calibrationData[i*2+1] == i);
  sensor.reset(); assert(sensor.getDistanceOrError() == -1);
  bus.chipId = 0xffff; assert(!sensor.begin(bus));
  bus.chipId = 0xad02; assert(sensor.begin(bus) && sensor.takeMeasurement() == 0);
}
