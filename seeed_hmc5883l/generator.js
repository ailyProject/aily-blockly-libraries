// HMC5883L 三轴数字罗盘 generator.js

Arduino.forBlock['hmc5883l_init'] = function(block, generator) {
  generator.addLibrary('HMC5883L_H', '#include <HMC5883L.h>\n#include <Wire.h>');
  generator.addVariable('hmc5883l_compass', 'HMC5883L hmc5883l_compass;');
  generator.addVariable('hmc5883l_mag', 'MagnetometerScaled hmc5883l_mag;');

  var code = 'Wire.begin();\n';
  code += 'hmc5883l_compass.setScale(1.3);\n';
  code += 'hmc5883l_compass.setMeasurementMode(MEASUREMENT_CONTINUOUS);\n';
  return code;
};

Arduino.forBlock['hmc5883l_set_scale'] = function(block, generator) {
  generator.addLibrary('HMC5883L_H', '#include <HMC5883L.h>\n#include <Wire.h>');
  generator.addVariable('hmc5883l_compass', 'HMC5883L hmc5883l_compass;');
  var scale = block.getFieldValue('SCALE') || '1.3';
  return 'hmc5883l_compass.setScale(' + scale + ');\n';
};

Arduino.forBlock['hmc5883l_get_heading'] = function(block, generator) {
  generator.addLibrary('HMC5883L_H', '#include <HMC5883L.h>\n#include <Wire.h>');
  generator.addVariable('hmc5883l_compass', 'HMC5883L hmc5883l_compass;');
  generator.addVariable('hmc5883l_mag', 'MagnetometerScaled hmc5883l_mag;');

  generator.addFunction('hmc5883l_getHeading', [
    'float hmc5883l_getHeading() {',
    '  MagnetometerScaled scaled = hmc5883l_compass.readScaledAxis();',
    '  float heading = atan2(scaled.YAxis, scaled.XAxis);',
    '  float declinationAngle = 0.0404;',
    '  heading += declinationAngle;',
    '  if (heading < 0) heading += 2 * PI;',
    '  if (heading > 2 * PI) heading -= 2 * PI;',
    '  return heading * 180 / M_PI;',
    '}'
  ].join('\n'));

  return ['hmc5883l_getHeading()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['hmc5883l_read_axis'] = function(block, generator) {
  generator.addLibrary('HMC5883L_H', '#include <HMC5883L.h>\n#include <Wire.h>');
  generator.addVariable('hmc5883l_compass', 'HMC5883L hmc5883l_compass;');
  var axis = block.getFieldValue('AXIS') || 'X';

  generator.addFunction('hmc5883l_readAxis', [
    'float hmc5883l_readAxis(char axis) {',
    '  MagnetometerScaled scaled = hmc5883l_compass.readScaledAxis();',
    '  if (axis == \'X\') return scaled.XAxis;',
    '  if (axis == \'Y\') return scaled.YAxis;',
    '  return scaled.ZAxis;',
    '}'
  ].join('\n'));

  return ['hmc5883l_readAxis(\'' + axis + '\')', generator.ORDER_FUNCTION_CALL];
};
