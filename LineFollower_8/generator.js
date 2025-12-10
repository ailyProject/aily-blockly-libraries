'use strict';

// Line Follower 8 Library Generator for Aily Platform

// ========== 巡线传感器初始化 ==========
Arduino.forBlock['line_init'] = function(block, generator) {
  const wire = block.getFieldValue('WIRE') || 'Wire';
  
  // 添加库引用
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('EspReceive', '#include "EspReceive.h"');
  
  // 创建传感器对象
  generator.addObject('lineSensor', 'EspReceive lineSensor;');
  
  generator.addSetup(`wire_${wire}_begin`, '' + wire + '.begin(); // 初始化I2C ' + wire);
  
  // 传感器初始化代码（在积木块位置执行）
  let code = 'lineSensor.begin();\n';
  
  return code;
};

// ========== 判断线路状态 ==========
Arduino.forBlock['line_is_state'] = function(block, generator) {
  generator.addLibrary('EspReceive', '#include "EspReceive.h"');
  
  const state = block.getFieldValue('STATE');
  const code = `(lineSensor.calculateDigitalState(lineSensor.getLatestData()) == ${state})`;
  return [code, Arduino.ORDER_RELATIONAL];
};

// ========== 获取线路状态值 ==========
Arduino.forBlock['line_get_state'] = function(block, generator) {
  generator.addLibrary('EspReceive', '#include "EspReceive.h"');
  
  const code = `lineSensor.calculateDigitalState(lineSensor.getLatestData())`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// ========== 获取线路偏移量 ==========
Arduino.forBlock['line_offset'] = function(block, generator) {
  generator.addLibrary('EspReceive', '#include "EspReceive.h"');
  
  const code = `lineSensor.calculateLineOffset(lineSensor.getLatestData())`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// ========== 获取传感器当前值 ==========
Arduino.forBlock['line_sensor_value'] = function(block, generator) {
  generator.addLibrary('EspReceive', '#include "EspReceive.h"');
  
  const sensor_id = block.getFieldValue('SENSOR');
  const code = `lineSensor.getSensorCurrent(lineSensor.getLatestData(), ${sensor_id})`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// ========== 获取传感器参考值 ==========
Arduino.forBlock['line_sensor_reference'] = function(block, generator) {
  generator.addLibrary('EspReceive', '#include "EspReceive.h"');
  
  const sensor_id = block.getFieldValue('SENSOR');
  const code = `lineSensor.getSensorReference(lineSensor.getLatestData(), ${sensor_id})`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// ========== 获取传感器数字值 ==========
Arduino.forBlock['line_sensor_digital'] = function(block, generator) {
  generator.addLibrary('EspReceive', '#include "EspReceive.h"');
  
  const sensor_id = block.getFieldValue('SENSOR');
  const code = `lineSensor.getSensorColor(lineSensor.getLatestData(), ${sensor_id})`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// ========== 设置RGB灯颜色 ==========
Arduino.forBlock['line_set_rgb'] = function(block, generator) {
  generator.addLibrary('EspReceive', '#include "EspReceive.h"');
  
  const color = block.getFieldValue('COLOR');
  return `lineSensor.setModuleRGB(${color});\n`;
};

// ========== 设置上传频率 ==========
Arduino.forBlock['line_set_frequency'] = function(block, generator) {
  generator.addLibrary('EspReceive', '#include "EspReceive.h"');
  
  const interval = generator.valueToCode(block, 'INTERVAL', Arduino.ORDER_ATOMIC) || '50';
  return `lineSensor.setModuleFrequency(${interval});\n`;
};

// ========== 打印传感器数据 ==========
Arduino.forBlock['line_print_data'] = function(block, generator) {
  generator.addLibrary('EspReceive', '#include "EspReceive.h"');
  
  return `{ SensorData data = lineSensor.getLatestData(); lineSensor.printSensorData(data); }\n`;
};
