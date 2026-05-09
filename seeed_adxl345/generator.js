// ADXL345三轴加速度计 generator.js

Arduino.forBlock['adxl345_init'] = function(block, generator) {
  generator.addLibrary('ADXL345_H', '#include <ADXL345.h>');
  generator.addVariable('adxl345_accel', 'ADXL345 adxl345_accel;');
  generator.addVariable('adxl345_xyz', 'double adxl345_xyz[3];');
  return 'adxl345_accel.powerOn();\n';
};

Arduino.forBlock['adxl345_read_axis'] = function(block, generator) {
  generator.addLibrary('ADXL345_H', '#include <ADXL345.h>');
  generator.addVariable('adxl345_accel', 'ADXL345 adxl345_accel;');
  generator.addVariable('adxl345_xyz', 'double adxl345_xyz[3];');
  var axis = block.getFieldValue('AXIS') || '0';

  generator.addFunction('adxl345_getAxis', [
    'double adxl345_getAxis(int axis) {',
    '  double xyz[3];',
    '  adxl345_accel.getAcceleration(xyz);',
    '  return xyz[axis];',
    '}'
  ].join('\n'));

  return ['adxl345_getAxis(' + axis + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['adxl345_read_raw'] = function(block, generator) {
  generator.addLibrary('ADXL345_H', '#include <ADXL345.h>');
  generator.addVariable('adxl345_accel', 'ADXL345 adxl345_accel;');
  generator.addVariable('adxl345_raw', 'int adxl345_raw[3];');
  var axis = block.getFieldValue('AXIS') || '0';

  generator.addFunction('adxl345_getRaw', [
    'int adxl345_getRaw(int axis) {',
    '  int raw[3];',
    '  adxl345_accel.readXYZ(raw, raw+1, raw+2);',
    '  return raw[axis];',
    '}'
  ].join('\n'));

  return ['adxl345_getRaw(' + axis + ')', generator.ORDER_FUNCTION_CALL];
};
