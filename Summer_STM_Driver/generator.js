'use strict';

// 智能小车综合控制库 Generator for Aily Platform

// ========== 按键检测 ==========
Arduino.forBlock['car_is_key_pressed'] = function(block, generator) {
  const key = block.getFieldValue('KEY');
  
  generator.addFunction('readKeyEvent', `int readKeyEvent() {
  int val = analogRead(32);
  if (val < 200) return 0;
  if (val >= 250 && val < 600) return 1;
  if (val > 700 && val < 1500) return 2;
  return -1;
}`);
  
  const code = `(readKeyEvent() == ${key})`;
  return [code, Arduino.ORDER_RELATIONAL];
};


// ========== STM32多功能板I2C控制 ==========
Arduino.ensureStm32I2c = function(generator) {
  generator.addLibrary('STM32_I2C', '#include "STM32_I2C.h"');
  generator.addSetup('stm32_i2c_init', 'STM32_I2C.begin();');
};

// ========== 舵机控制(通过STM32) ==========
Arduino.forBlock['car_servo_angle'] = function(block, generator) {
  Arduino.ensureStm32I2c(generator);
  const servoNum = block.getFieldValue('PIN');
  const angle = generator.valueToCode(block, 'ANGLE', Arduino.ORDER_ATOMIC) || '90';
  
  return `STM32_I2C.servoAngle(${servoNum}, ${angle});\n`;
};


// ========== TT马达控制(通过STM32) ==========
Arduino.forBlock['car_motor_control_single'] = function(block, generator) {
  Arduino.ensureStm32I2c(generator);
  const motorId = block.getFieldValue('MOTOR_ID');
  const direction = block.getFieldValue('DIRECTION');
  const speed = generator.valueToCode(block, 'SPEED', Arduino.ORDER_ATOMIC) || '128';
  
  return `STM32_I2C.motorControl(${motorId}, ${direction}, constrain(${speed}, 0, 255));\n`;
};


Arduino.forBlock['car_motor_stop_single'] = function(block, generator) {
  Arduino.ensureStm32I2c(generator);
  const motorId = block.getFieldValue('MOTOR_ID');
  
  return `STM32_I2C.motorStop(${motorId});\n`;
};


// ========== 步进电机控制(通过STM32) ==========
Arduino.forBlock['car_stepper_control'] = function(block, generator) {
  Arduino.ensureStm32I2c(generator);
  const stepperNum = block.getFieldValue('STEPPER_NUM');
  const direction = block.getFieldValue('DIRECTION');
  const degrees = generator.valueToCode(block, 'DEGREES', Arduino.ORDER_ATOMIC) || '360';
  
  return `STM32_I2C.stepperControl(${stepperNum}, ${direction}, ${degrees});\n`;
};


Arduino.forBlock['car_stepper_control_turns'] = function(block, generator) {
  Arduino.ensureStm32I2c(generator);
  const stepperNum = block.getFieldValue('STEPPER_NUM');
  const direction = block.getFieldValue('DIRECTION');
  const turns = generator.valueToCode(block, 'TURNS', Arduino.ORDER_ATOMIC) || '1';
  
  return `STM32_I2C.stepperControlTurns(${stepperNum}, ${direction}, ${turns});\n`;
};


// ========== JY61P六轴传感器 (通过STM32 I2C从机) ==========
Arduino.forBlock['jy61p_set_zero'] = function(block, generator) {
  Arduino.ensureStm32I2c(generator);
  return 'STM32_I2C.jy61pSetZero();\n';
};


Arduino.forBlock['jy61p_get_angle'] = function(block, generator) {
  const angleType = block.getFieldValue('ANGLE_TYPE');
  Arduino.ensureStm32I2c(generator);
  
  // 转换为轴名称
  const axisMap = {'ROLL': 'Z', 'PITCH': 'X', 'YAW': 'Y'};
  const axis = axisMap[angleType] || 'Z';
  
  const code = `STM32_I2C.jy61pGetAngle('${axis}')`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};


Arduino.forBlock['jy61p_get_acceleration'] = function(block, generator) {
  const axis = block.getFieldValue('AXIS');
  Arduino.ensureStm32I2c(generator);
  
  const code = `STM32_I2C.jy61pGetAcceleration('${axis}')`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};


Arduino.forBlock['jy61p_get_gyro'] = function(block, generator) {
  const axis = block.getFieldValue('AXIS');
  Arduino.ensureStm32I2c(generator);
  
  const code = `STM32_I2C.jy61pGetGyro('${axis}')`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
}

// ========== 舵机角度值块 ==========
Arduino.forBlock['car_servo_angle_value'] = function(block, generator) {
  const angle = block.getFieldValue('ANGLE');
  return [angle, Arduino.ORDER_ATOMIC];
};

Arduino.ensureWS2812 = function(generator) {
  generator.addLibrary('Adafruit_NeoPixel', '#include "Adafruit_NeoPixel.h"');
  generator.addLibrary('WS2812_Effects', '#include "WS2812_Effects.h"');
};

