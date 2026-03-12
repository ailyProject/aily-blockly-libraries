/**
 * BMM150 三轴磁力计代码生成器
 * 用于读取BMM150三轴磁力数据和罗盘方向角
 */

// BMM150 初始化
Arduino.forBlock['bmm150_init'] = function(block, generator) {
  generator.addLibrary('include_wire', '#include <Wire.h>');
  generator.addLibrary('include_bmm150', '#include "bmm150.h"');
  generator.addLibrary('include_bmm150_defs', '#include "bmm150_defs.h"');

  generator.addVariable('bmm150_object', 'BMM150 bmm150 = BMM150();');

  generator.addSetupBegin('serial_begin', 'Serial.begin(9600);');
  generator.addSetupBegin('bmm150_begin', 'if (bmm150.initialize() == BMM150_E_ID_NOT_CONFORM) {\n  Serial.println("BMM150 chip ID error!");\n  while (1);\n}\n');

  return '';
};

// 读取磁力 X轴
Arduino.forBlock['bmm150_read_x'] = function(block, generator) {
  var code = '(bmm150.read_mag_data(), bmm150.mag_data.x)';
  return [code, Arduino.ORDER_ATOMIC];
};

// 读取磁力 Y轴
Arduino.forBlock['bmm150_read_y'] = function(block, generator) {
  var code = '(bmm150.read_mag_data(), bmm150.mag_data.y)';
  return [code, Arduino.ORDER_ATOMIC];
};

// 读取磁力 Z轴
Arduino.forBlock['bmm150_read_z'] = function(block, generator) {
  var code = '(bmm150.read_mag_data(), bmm150.mag_data.z)';
  return [code, Arduino.ORDER_ATOMIC];
};

// 读取罗盘方向角
Arduino.forBlock['bmm150_read_heading'] = function(block, generator) {
  var functionDef = '';
  functionDef += 'float bmm150_getHeading() {\n';
  functionDef += '  bmm150.read_mag_data();\n';
  functionDef += '  float heading = atan2((float)bmm150.mag_data.x, (float)bmm150.mag_data.y);\n';
  functionDef += '  if (heading < 0) {\n';
  functionDef += '    heading += 2 * PI;\n';
  functionDef += '  }\n';
  functionDef += '  if (heading > 2 * PI) {\n';
  functionDef += '    heading -= 2 * PI;\n';
  functionDef += '  }\n';
  functionDef += '  return heading * 180.0 / M_PI;\n';
  functionDef += '}\n';

  generator.addFunction('bmm150_getHeading', functionDef, true);

  var code = 'bmm150_getHeading()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 设置预设模式
Arduino.forBlock['bmm150_set_preset_mode'] = function(block, generator) {
  var mode = block.getFieldValue('MODE') || 'BMM150_PRESETMODE_LOWPOWER';
  var code = 'bmm150.set_presetmode(' + mode + ');\n';
  return code;
};
