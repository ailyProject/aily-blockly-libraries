#include <assert.h>
#include <initializer_list>
#include <DFRobot_TFUW500.h>
TwoWire Wire;

int main() {
  DFRobot_TFUW500_I2C sensor(&Wire);
  assert(sensor.readFrame());
  assert(sensor.isValid());
  assert(sensor.getDistanceMm() == 1234);
  assert(sensor.getPeak() == 5678);
  assert(sensor.getTemperatureC() == 23.0f);
  for (int shortRead = 0; shortRead < 2; ++shortRead) {
    Wire.shortRead = shortRead;
    for (int reg : {0x3C, 0x02, 0x04}) {
      Wire.failReg = reg;
      assert(!sensor.readFrame());
      assert(!sensor.isValid());
      assert(sensor.getDistanceMm() == 1234);
      assert(sensor.getPeak() == 5678);
    }
  }
  Wire.failReg = -1;
  assert(sensor.readFrame());
  assert(sensor.isValid());
}
