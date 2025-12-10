'use strict';

// BMP280 Blockly Generator for Aily Platform

Arduino.forBlock['bmp280_init'] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || 'bmp280';
  const wire = block.getFieldValue('WIRE') || 'Wire';
  
  // 添加库
  generator.addLibrary('Seeed_BMP280', '#include <Seeed_BMP280.h>');
  generator.addLibrary('Wire', '#include <Wire.h>');
  
  // 注册变量并添加对象声明
  registerVariableToBlockly(varName, 'BMP280');
  generator.addObject(varName, 'BMP280 ' + varName + ';');
  
  // 分离Wire初始化和传感器初始化
  const wireInitCode = wire + '.begin();';
  const pinComment = '// BMP280 I2C连接: 使用默认I2C引脚';
  
  // 使用动态setupKey添加Wire初始化（支持多I2C总线）
  generator.addSetup(`wire_${wire}_begin`, pinComment + '\n' + wireInitCode + '\n');
  
  const code = varName + '.init();\n';
  return code;
};

Arduino.forBlock['bmp280_get_temperature'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'bmp280';
  
  // 添加库
  generator.addLibrary('Seeed_BMP280', '#include <Seeed_BMP280.h>');
  generator.addLibrary('Wire', '#include <Wire.h>');
  
  const code = varName + '.getTemperature()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bmp280_get_pressure'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'bmp280';
  
  // 添加库
  generator.addLibrary('Seeed_BMP280', '#include <Seeed_BMP280.h>');
  generator.addLibrary('Wire', '#include <Wire.h>');
  
  const code = varName + '.getPressure()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bmp280_calc_altitude'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'bmp280';
  const pressure = generator.valueToCode(block, 'PRESSURE', Arduino.ORDER_ATOMIC) || '101325';
  
  // 添加库
  generator.addLibrary('Seeed_BMP280', '#include <Seeed_BMP280.h>');
  generator.addLibrary('Wire', '#include <Wire.h>');
  
  const code = varName + '.calcAltitude(' + pressure + ')';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};