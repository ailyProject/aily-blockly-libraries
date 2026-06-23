/**
 * DFRobot SEN0460 空气质量传感器代码生成器
 * 支持I2C接口，可测量PM2.5/PM1.0/PM10浓度及颗粒物数量
 */

Arduino.forBlock['dfrobot_airquality_begin'] = function (block, generator) {
  generator.addLibrary('DFRobot_AirQualitySensor', '#include "DFRobot_AirQualitySensor.h"');
  generator.addObject('airquality_sensor', 'DFRobot_AirQualitySensor_I2C particle(&Wire, 0x19);');
  generator.addSetupEnd('airquality_begin', [
    'while(!particle.begin())',
    '{',
    '  delay(500);',
    '}'
  ].join('\n'));

  return '';
};

Arduino.forBlock['dfrobot_airquality_read_concentration'] = function (block, generator) {
  var environment = block.getFieldValue('ENVIRONMENT') || 'STANDARD';
  var particle = block.getFieldValue('PARTICLE') || 'PM2_5';

  generator.addLibrary('DFRobot_AirQualitySensor', '#include "DFRobot_AirQualitySensor.h"');
  generator.addObject('airquality_sensor', 'DFRobot_AirQualitySensor_I2C particle(&Wire, 0x19);');

  var code = 'particle.gainParticleConcentration_ugm3(PARTICLE_' + particle + '_' + environment + ')';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['dfrobot_airquality_read_count'] = function (block, generator) {
  var diameter = block.getFieldValue('DIAMETER') || 'PARTICLENUM_0_3_UM';

  generator.addLibrary('DFRobot_AirQualitySensor', '#include "DFRobot_AirQualitySensor.h"');
  generator.addObject('airquality_sensor', 'DFRobot_AirQualitySensor_I2C particle(&Wire, 0x19);');

  var code = 'particle.gainParticleNum_Every0_1L(' + diameter + '_EVERY0_1L_AIR)';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['dfrobot_airquality_get_version'] = function (block, generator) {
  generator.addLibrary('DFRobot_AirQualitySensor', '#include "DFRobot_AirQualitySensor.h"');
  generator.addObject('airquality_sensor', 'DFRobot_AirQualitySensor_I2C particle(&Wire, 0x19);');

  return ['particle.gainVersion()', Arduino.ORDER_FUNCTION_CALL];
};
