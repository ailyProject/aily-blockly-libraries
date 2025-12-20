'use strict';

// PCA9685 Blockly Generator for Aily Platform

// 注意：registerVariableToBlockly 和 renameVariableInBlockly 由核心库提供

// PCA9685 舵机参数存储（每个对象的配置）
if (typeof Arduino._pca9685Configs === 'undefined') {
  Arduino._pca9685Configs = {};
}

// PCA9685 通道参数存储（每个通道的独立配置）
if (typeof Arduino._pca9685ChannelConfigs === 'undefined') {
  Arduino._pca9685ChannelConfigs = {};
}

// PCA9685 初始化块（合并创建和初始化）
Arduino.forBlock['pca9685_begin'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'pwm';
  const address = generator.valueToCode(block, 'ADDRESS', generator.ORDER_ATOMIC) || '40';
  const wire = block.getFieldValue('WIRE') || 'Wire';
  
  // 初始化配置存储
  if (!Arduino._pca9685Configs[varName]) {
    Arduino._pca9685Configs[varName] = {
      minPWM: 100,
      maxPWM: 700
    };
  }
  
  // 添加库引用
  generator.addLibrary('Adafruit_PWMServoDriver', '#include <Adafruit_PWMServoDriver.h>');
  generator.addLibrary('Wire', '#include <Wire.h>');
  
  // 注册变量并添加对象声明
  registerVariableToBlockly(varName, 'Adafruit_PWMServoDriver');
  generator.addObject(varName, 'Adafruit_PWMServoDriver ' + varName + ';');
  
  // 变量重命名监听
  if (varField && varField.setValidator) {
    varField.setValidator(function(newName) {
      if (newName) {
        renameVariableInBlockly(varName, newName, 'Adafruit_PWMServoDriver');
      }
      return newName;
    });
  }
  
  // 使用动态setupKey添加Wire初始化（支持多I2C总线）
  generator.addSetup(`wire_${wire}_begin`, wire + '.begin();');
  
  // PCA9685初始化代码放入setup
  generator.addSetup(varName + '_init', 
    varName + ' = Adafruit_PWMServoDriver(' + address + ');\n' +
    '  ' + varName + '.begin();');
  
  return '';
};

// PCA9685 设置PWM频率块
Arduino.forBlock['pca9685_set_freq'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'pwm';
  const freq = generator.valueToCode(block, 'FREQ', generator.ORDER_ATOMIC) || '60';
  
  const code = varName + '.setPWMFreq(' + freq + ');\n';
  return code;
};

// PCA9685 设置舵机角度块
Arduino.forBlock['pca9685_set_servo_angle'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'pwm';
  const channel = generator.valueToCode(block, 'CHANNEL', generator.ORDER_ATOMIC) || '0';
  const angle = generator.valueToCode(block, 'ANGLE', generator.ORDER_ATOMIC) || '90';
  
  // 检查是否有通道特定配置
  const channelKey = varName + '_ch' + channel;
  const channelConfig = Arduino._pca9685ChannelConfigs[channelKey];
  
  if (channelConfig) {
    // 使用通道特定的配置
    const code = varName + '.setPWM(' + channel + ', 0, map(' + angle + ', ' + 
      channelConfig.minAngle + ', ' + channelConfig.maxAngle + ', ' + 
      channelConfig.minPWM + ', ' + channelConfig.maxPWM + '));\n';
    return code;
  } else {
    // 使用全局配置
    const config = Arduino._pca9685Configs[varName] || { minPWM: 100, maxPWM: 700 };
    const code = varName + '.setPWM(' + channel + ', 0, map(' + angle + ', 0, 180, ' + config.minPWM + ', ' + config.maxPWM + '));\n';
    return code;
  }
};

// PCA9685 配置舵机参数块
Arduino.forBlock['pca9685_config_servo'] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || 'pwm';
  const min = generator.valueToCode(block, 'MIN', generator.ORDER_ATOMIC) || '100';
  const max = generator.valueToCode(block, 'MAX', generator.ORDER_ATOMIC) || '700';
  
  // 更新配置
  if (!Arduino._pca9685Configs[varName]) {
    Arduino._pca9685Configs[varName] = {};
  }
  Arduino._pca9685Configs[varName].minPWM = parseInt(min);
  Arduino._pca9685Configs[varName].maxPWM = parseInt(max);
  
  // 生成注释
  const code = '// ' + varName + ' 舵机范围配置: ' + min + '-' + max + '\n';
  return code;
};

// PCA9685 批量设置所有舵机块
Arduino.forBlock['pca9685_set_all_servos'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'pwm';
  const angle = generator.valueToCode(block, 'ANGLE', generator.ORDER_ATOMIC) || '90';
  
  // 获取配置
  const config = Arduino._pca9685Configs[varName] || { minPWM: 100, maxPWM: 700 };
  
  // 直接使用map()函数内联计算
  const code = 'for (int i = 0; i < 16; i++) {\n' +
    '  ' + varName + '.setPWM(i, 0, map(' + angle + ', 0, 180, ' + config.minPWM + ', ' + config.maxPWM + '));\n' +
    '  delay(1);\n' +
    '}\n';
  return code;
};

// PCA9685 睡眠块
Arduino.forBlock['pca9685_sleep'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'pwm';
  
  const code = varName + '.sleep();\n';
  return code;
};

// PCA9685 唤醒块
Arduino.forBlock['pca9685_wakeup'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'pwm';
  
  const code = varName + '.wakeup();\n';
  return code;
};

// PCA9685 设置舵机范围块（高级）
Arduino.forBlock['pca9685_set_servo_range'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'pwm';
  const channel = generator.valueToCode(block, 'CHANNEL', generator.ORDER_ATOMIC) || '0';
  const minAngle = generator.valueToCode(block, 'MIN_ANGLE', generator.ORDER_ATOMIC) || '0';
  const minPWM = generator.valueToCode(block, 'MIN_PWM', generator.ORDER_ATOMIC) || '100';
  const maxAngle = generator.valueToCode(block, 'MAX_ANGLE', generator.ORDER_ATOMIC) || '180';
  const maxPWM = generator.valueToCode(block, 'MAX_PWM', generator.ORDER_ATOMIC) || '700';
  
  // 存储通道特定配置（仅当channel是常量时）
  const channelKey = varName + '_ch' + channel;
  Arduino._pca9685ChannelConfigs[channelKey] = {
    minAngle: parseInt(minAngle),
    maxAngle: parseInt(maxAngle),
    minPWM: parseInt(minPWM),
    maxPWM: parseInt(maxPWM)
  };
  
  // 生成配置注释
  const code = '// 通道 ' + channel + ' 自定义映射: ' + minAngle + '-' + maxAngle + '度 → ' + minPWM + '-' + maxPWM + ' PWM\n';
  return code;
};

// PCA9685 角度值块
Arduino.forBlock['pca9685_angle'] = function(block, generator) {
  const angle = block.getFieldValue('ANGLE') || '90';
  const code = angle;
  return [code, Arduino.ORDER_ATOMIC];
};