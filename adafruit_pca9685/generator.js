// PCA9685 Blockly Generator for Aily Platform

// 注意：registerVariableToBlockly 和 renameVariableInBlockly 由核心库提供

// PCA9685 舵机参数存储（每个对象的配置）
if (typeof Arduino._pca9685Configs === 'undefined') {
  Arduino._pca9685Configs = {};
}

// PCA9685 创建块
Arduino.forBlock['pca9685_create'] = function(block, generator) {
  // 设置变量重命名监听
  if (!block._pca9685VarMonitorAttached) {
    block._pca9685VarMonitorAttached = true;
    block._pca9685VarLastName = block.getFieldValue('VAR') || 'pwm';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._pca9685VarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'Adafruit_PWMServoDriver');
          block._pca9685VarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'pwm';
  
  // 初始化配置存储
  if (!Arduino._pca9685Configs[varName]) {
    Arduino._pca9685Configs[varName] = {
      minPWM: 100,
      maxPWM: 700
    };
  }
  
  // 添加库和变量
  generator.addLibrary('Adafruit_PWMServoDriver', '#include <Adafruit_PWMServoDriver.h>');
  generator.addLibrary('Wire', '#include <Wire.h>');
  registerVariableToBlockly(varName, 'Adafruit_PWMServoDriver');
  generator.addVariable(varName, 'Adafruit_PWMServoDriver ' + varName + ' = Adafruit_PWMServoDriver();');
  
  return '';
};

// PCA9685 初始化块
Arduino.forBlock['pca9685_begin'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'pwm';
  const address = generator.valueToCode(block, 'ADDRESS', generator.ORDER_ATOMIC) || '40';
  
  // 添加库引用
  generator.addLibrary('Adafruit_PWMServoDriver', '#include <Adafruit_PWMServoDriver.h>');
  generator.addLibrary('Wire', '#include <Wire.h>');
  
  // 添加变量声明
  generator.addVariable(varName, 'Adafruit_PWMServoDriver ' + varName + ';');
  
  // 动态获取Wire（支持Wire/Wire1等）
  const wire = block.getFieldValue('WIRE') || 'Wire'; // 从字段读取，默认Wire
  
  // 使用动态setupKey添加Wire初始化（支持多I2C总线）
  generator.addSetup(`wire_${wire}_begin`, wire + '.begin();');
  
  // 智能处理地址格式：输入40视为十六进制简写，输出0x40
  let addressHex;
  const addressStr = address.toString().trim();
  
  if (addressStr.startsWith('0x') || addressStr.startsWith('0X')) {
    // 已经是0x格式，直接使用
    addressHex = address;
  } else {
    // 将输入数字视为十六进制简写（40 → 0x40, 41 → 0x41）
    // 直接在前面加0x，不做进制转换
    addressHex = '0x' + addressStr.toUpperCase();
  }
  
  // 生成PCA9685初始化代码
  const code = varName + ' = Adafruit_PWMServoDriver(' + addressHex + ');\n' +
    varName + '.begin();\n';
  
  return code;
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
  
  // 获取配置
  const config = Arduino._pca9685Configs[varName] || { minPWM: 100, maxPWM: 700 };
  
  // 直接使用map()函数内联计算，不使用辅助函数
  const code = varName + '.setPWM(' + channel + ', 0, map(' + angle + ', 0, 180, ' + config.minPWM + ', ' + config.maxPWM + '));\n';
  return code;
};

// PCA9685 设置PWM值块
Arduino.forBlock['pca9685_set_pwm'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'pwm';
  const channel = generator.valueToCode(block, 'CHANNEL', generator.ORDER_ATOMIC) || '0';
  const on = generator.valueToCode(block, 'ON', generator.ORDER_ATOMIC) || '0';
  const off = generator.valueToCode(block, 'OFF', generator.ORDER_ATOMIC) || '300';
  
  const code = varName + '.setPWM(' + channel + ', ' + on + ', ' + off + ');\n';
  return code;
};

// PCA9685 设置微秒脉宽块
Arduino.forBlock['pca9685_set_microseconds'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'pwm';
  const channel = generator.valueToCode(block, 'CHANNEL', generator.ORDER_ATOMIC) || '0';
  const microseconds = generator.valueToCode(block, 'MICROSECONDS', generator.ORDER_ATOMIC) || '1500';
  
  const code = varName + '.writeMicroseconds(' + channel + ', ' + microseconds + ');\n';
  return code;
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
  
  const code = '// 通道 ' + channel + ' 自定义映射: ' + minAngle + '度=' + minPWM + ', ' + maxAngle + '度=' + maxPWM + '\n';
  return code;
};

// PCA9685 角度转PWM值块
Arduino.forBlock['pca9685_angle_to_pwm'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'pwm';
  const angle = generator.valueToCode(block, 'ANGLE', generator.ORDER_ATOMIC) || '90';
  
  // 获取配置
  const config = Arduino._pca9685Configs[varName] || { minPWM: 100, maxPWM: 700 };
  
  // 直接使用map()函数内联计算
  const code = 'map(' + angle + ', 0, 180, ' + config.minPWM + ', ' + config.maxPWM + ')';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};