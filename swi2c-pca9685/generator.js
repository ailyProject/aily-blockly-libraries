// @aily-project/lib-swi2c-pca9685

Arduino.forBlock["swi2c_pca9685_init"] = function (block, generator) {
  const sda = generator.valueToCode(block, 'SDA', Arduino.ORDER_ATOMIC) || '17';
  const scl = generator.valueToCode(block, 'SCL', Arduino.ORDER_ATOMIC) || '18';
  const addr = generator.valueToCode(block, 'ADDR', Arduino.ORDER_ATOMIC) || '64';
  const freq = generator.valueToCode(block, 'FREQ', Arduino.ORDER_ATOMIC) || '50';
  generator.addLibrary('swi2c_pca9685', '#include "Swi2cPca9685.h"');
  return 'swi2cPca9685Init((int)(' + sda + '), (int)(' + scl + '), (uint8_t)(' + addr + '), (float)(' + freq + '));\n';
};

Arduino.forBlock["swi2c_pca9685_set_angle"] = function (block, generator) {
  const ch = generator.valueToCode(block, 'CH', Arduino.ORDER_ATOMIC) || '0';
  const angle = generator.valueToCode(block, 'ANGLE', Arduino.ORDER_ATOMIC) || '90';
  generator.addLibrary('swi2c_pca9685', '#include "Swi2cPca9685.h"');
  return 'swi2cPca9685SetServoAngle((uint8_t)(' + ch + '), (float)(' + angle + '));\n';
};

Arduino.forBlock["swi2c_pca9685_set_all_angle"] = function (block, generator) {
  const angle = generator.valueToCode(block, 'ANGLE', Arduino.ORDER_ATOMIC) || '90';
  generator.addLibrary('swi2c_pca9685', '#include "Swi2cPca9685.h"');
  return 'swi2cPca9685SetAllServoAngle((float)(' + angle + '));\n';
};

Arduino.forBlock["swi2c_pca9685_set_us"] = function (block, generator) {
  const ch = generator.valueToCode(block, 'CH', Arduino.ORDER_ATOMIC) || '0';
  const us = generator.valueToCode(block, 'US', Arduino.ORDER_ATOMIC) || '1500';
  generator.addLibrary('swi2c_pca9685', '#include "Swi2cPca9685.h"');
  return 'swi2cPca9685SetServoMicroseconds((uint8_t)(' + ch + '), (uint16_t)(' + us + '));\n';
};

Arduino.forBlock["swi2c_pca9685_is_connected"] = function (block, generator) {
  generator.addLibrary('swi2c_pca9685', '#include "Swi2cPca9685.h"');
  return ['swi2cPca9685IsConnected()', Arduino.ORDER_ATOMIC];
};
