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
Arduino.forBlock['pca9685_begin_with_pins'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'pwm';
  const address = generator.valueToCode(block, 'ADDRESS', generator.ORDER_ATOMIC) || '40';
  const sdaPin = block.getFieldValue('SDA_PIN');
  const sclPin = block.getFieldValue('SCL_PIN');
  
  // 添加库引用
  generator.addLibrary('Adafruit_PWMServoDriver', '#include <Adafruit_PWMServoDriver.h>');
  generator.addLibrary('Wire', '#include <Wire.h>');
  
  // 智能处理地址格式
  let addressHex;
  const addressStr = address.toString().trim();
  
  if (addressStr.startsWith('0x') || addressStr.startsWith('0X')) {
    addressHex = address;
  } else {
    addressHex = '0x' + addressStr.toUpperCase();
  }
  
  // 生成初始化代码，包含自定义引脚配置
  const code = '// 使用自定义I2C引脚: SDA=' + sdaPin + ', SCL=' + sclPin + '\n' +
    'Wire.begin(' + sdaPin + ', ' + sclPin + ');\n' +
    varName + ' = Adafruit_PWMServoDriver(' + addressHex + ', Wire);\n' +
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
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'pwm';
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

// ==================== 串口命令解析器（全局对象模式）====================

// 串口命令解析器配置存储（全局单例）
if (typeof Arduino._globalSerialCommandConfig === 'undefined') {
  Arduino._globalSerialCommandConfig = {
    commands: [],
    serial: 'Serial',
    initialized: false
  };
}

// 串口命令解析器 - 初始化块（全局对象）
Arduino.forBlock['serial_command_init'] = function(block, generator) {
  const serial = block.getFieldValue('SERIAL') || 'Serial';
  const baud = block.getFieldValue('BAUD') || '9600';
  
  // 重置全局配置
  Arduino._globalSerialCommandConfig.commands = [];
  Arduino._globalSerialCommandConfig.serial = serial;
  Arduino._globalSerialCommandConfig.initialized = true;
  
  // 添加全局缓冲区变量
  generator.addVariable('_cmdBuffer', 'String _cmdBuffer = "";  // 全局串口命令缓冲区');
  
  // 板卡适配：根据boardConfig选择合适的串口引脚
  const serialPins = {
    'Serial': { rx: 0, tx: 1 },
    'Serial1': { rx: 19, tx: 18 },
    'Serial2': { rx: 17, tx: 16 },
    'Serial3': { rx: 15, tx: 14 }
  };
  
  let code = '';
  const pins = serialPins[serial];
  
  if (pins) {
    code = '// 初始化全局串口命令解析器: ' + serial + ' (RX=' + pins.rx + ', TX=' + pins.tx + ')\n' +
           serial + '.begin(' + baud + ');\n';
  } else {
    code = '// 初始化全局串口命令解析器: ' + serial + '\n' +
           serial + '.begin(' + baud + ');\n';
  }
  
  return code;
};

// 串口命令解析器 - 添加命令块（全局对象）
Arduino.forBlock['serial_command_add'] = function(block, generator) {
  const command = generator.valueToCode(block, 'COMMAND', generator.ORDER_ATOMIC) || '"CMD"';
  const code = generator.statementToCode(block, 'CODE');
  
  // 添加命令到全局配置
  const funcName = '_cmdHandle_' + Arduino._globalSerialCommandConfig.commands.length;
  Arduino._globalSerialCommandConfig.commands.push({
    command: command,
    funcName: funcName
  });
  
  const funcDef = 'void ' + funcName + '() {\n' + code + '}\n';
  generator.addFunction(funcName, funcDef);
  
  return '// 全局命令 ' + command + ' 已注册\n';
};

// 串口命令解析器 - 检查并处理命令块（全局对象）
Arduino.forBlock['serial_command_read'] = function(block, generator) {
  const config = Arduino._globalSerialCommandConfig;
  const serial = config.serial || 'Serial';
  
  // 生成全局命令处理函数
  const processFuncName = '_processSerialCommand';
  
  let funcDef = 'void ' + processFuncName + '() {\n';
  funcDef += '  // 读取串口数据到全局缓冲区\n';
  funcDef += '  while (' + serial + '.available() > 0) {\n';
  funcDef += '    char c = ' + serial + '.read();\n';
  funcDef += '    if (c == \'\\n\' || c == \'\\r\') {\n';
  funcDef += '      if (_cmdBuffer.length() > 0) {\n';
  funcDef += '        _cmdBuffer.trim();\n';
  
  // 添加所有命令的判断
  if (config.commands && config.commands.length > 0) {
    config.commands.forEach((cmd, index) => {
      if (index === 0) {
        funcDef += '        if (_cmdBuffer == ' + cmd.command + ') {\n';
      } else {
        funcDef += '        } else if (_cmdBuffer == ' + cmd.command + ') {\n';
      }
      funcDef += '          ' + cmd.funcName + '();\n';
    });
    funcDef += '        }\n';
  }
  
  funcDef += '        _cmdBuffer = "";\n';
  funcDef += '      }\n';
  funcDef += '    } else {\n';
  funcDef += '      _cmdBuffer += c;\n';
  funcDef += '    }\n';
  funcDef += '  }\n';
  funcDef += '}\n';
  
  generator.addFunction(processFuncName, funcDef);
  
  return processFuncName + '();\n';
};

// 串口命令解析器 - 有可用命令块（全局对象）
Arduino.forBlock['serial_command_available'] = function(block, generator) {
  const config = Arduino._globalSerialCommandConfig;
  const serial = config.serial || 'Serial';
  
  const code = serial + '.available()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 串口命令解析器 - 获取当前命令块（全局对象）
Arduino.forBlock['serial_command_get'] = function(block, generator) {
  const code = '_cmdBuffer';
  return [code, Arduino.ORDER_ATOMIC];
};
