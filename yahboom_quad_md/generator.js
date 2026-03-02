'use strict';

// ==================== I2C 模式 ====================

Arduino.forBlock['yahboom_md_iic_init'] = function(block, generator) {
  // 变量重命名监听
  if (!block._yahboomIICVarMonitorAttached) {
    block._yahboomIICVarMonitorAttached = true;
    block._yahboomIICVarLastName = block.getFieldValue('VAR') || 'motor';
    var varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        var workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        var oldName = block._yahboomIICVarLastName;
        if (workspace && newName && newName !== oldName) {
          if (typeof renameVariableInBlockly === 'function') {
            renameVariableInBlockly(block, oldName, newName, 'YahboomMD_IIC');
          }
          block._yahboomIICVarLastName = newName;
        }
        return newName;
      });
    }
  }

  var varName = block.getFieldValue('VAR') || 'motor';
  var addr = block.getFieldValue('ADDR') || '0x26';
  var motorType = block.getFieldValue('MOTOR_TYPE') || 'MOTOR_310';

  // 添加库引用
  generator.addLibrary('MotorDriver', '#include <MotorDriver.h>');

  // 注册变量到Blockly
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(varName, 'YahboomMD_IIC');
  }

  // 声明全局对象
  generator.addVariable(varName, 'MotorDriverIIC ' + varName + '(' + addr + ');');

  // 生成初始化代码
  var code = varName + '.begin();\n';
  code += 'delay(100);\n';
  code += varName + '.setMotorType(' + motorType + ');\n';
  code += 'delay(100);\n';
  return code;
};

// ==================== I2C 配置 ====================

Arduino.forBlock['yahboom_md_iic_set_deadzone'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'motor';
  var deadzone = generator.valueToCode(block, 'DEADZONE', generator.ORDER_ATOMIC) || '1000';

  return varName + '.setDeadzone(' + deadzone + ');\ndelay(100);\n';
};

Arduino.forBlock['yahboom_md_iic_set_pulse_line'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'motor';
  var line = generator.valueToCode(block, 'LINE', generator.ORDER_ATOMIC) || '13';

  return varName + '.setPulseLine(' + line + ');\ndelay(100);\n';
};

Arduino.forBlock['yahboom_md_iic_set_pulse_phase'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'motor';
  var phase = generator.valueToCode(block, 'PHASE', generator.ORDER_ATOMIC) || '20';

  return varName + '.setPulsePhase(' + phase + ');\ndelay(100);\n';
};

Arduino.forBlock['yahboom_md_iic_set_wheel_diameter'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'motor';
  var diameter = generator.valueToCode(block, 'DIAMETER', generator.ORDER_ATOMIC) || '48.00';

  return varName + '.setWheelDiameter(' + diameter + ');\ndelay(100);\n';
};

// ==================== I2C 控制 ====================

Arduino.forBlock['yahboom_md_iic_control_speed'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'motor';
  var m1 = generator.valueToCode(block, 'M1', generator.ORDER_ATOMIC) || '0';
  var m2 = generator.valueToCode(block, 'M2', generator.ORDER_ATOMIC) || '0';
  var m3 = generator.valueToCode(block, 'M3', generator.ORDER_ATOMIC) || '0';
  var m4 = generator.valueToCode(block, 'M4', generator.ORDER_ATOMIC) || '0';

  return varName + '.controlSpeed(' + m1 + ', ' + m2 + ', ' + m3 + ', ' + m4 + ');\n';
};

Arduino.forBlock['yahboom_md_iic_control_pwm'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'motor';
  var m1 = generator.valueToCode(block, 'M1', generator.ORDER_ATOMIC) || '0';
  var m2 = generator.valueToCode(block, 'M2', generator.ORDER_ATOMIC) || '0';
  var m3 = generator.valueToCode(block, 'M3', generator.ORDER_ATOMIC) || '0';
  var m4 = generator.valueToCode(block, 'M4', generator.ORDER_ATOMIC) || '0';

  return varName + '.controlPWM(' + m1 + ', ' + m2 + ', ' + m3 + ', ' + m4 + ');\n';
};

// ==================== I2C 编码器 ====================

Arduino.forBlock['yahboom_md_iic_encoder_offset'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'motor';
  var motorIndex = block.getFieldValue('MOTOR') || '0';

  // 生成辅助函数：读取并返回编码器偏移值
  var funcName = 'readEncoderOffset_' + varName;
  var funcDef = 'int32_t ' + funcName + '(int index) {\n' +
    '  ' + varName + '.readEncoderOffset();\n' +
    '  return ' + varName + '.encoderOffset[index];\n' +
    '}\n';
  generator.addFunction(funcName, funcDef);

  return [funcName + '(' + motorIndex + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['yahboom_md_iic_encoder_total'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'motor';
  var motorIndex = block.getFieldValue('MOTOR') || '0';

  // 生成辅助函数：读取并返回总编码器计数
  var funcName = 'readEncoderTotal_' + varName;
  var funcDef = 'int32_t ' + funcName + '(int index) {\n' +
    '  ' + varName + '.readEncoderTotal();\n' +
    '  return ' + varName + '.encoderNow[index];\n' +
    '}\n';
  generator.addFunction(funcName, funcDef);

  return [funcName + '(' + motorIndex + ')', generator.ORDER_FUNCTION_CALL];
};

// ==================== 串口模式 ====================

Arduino.forBlock['yahboom_md_usart_init'] = function(block, generator) {
  // 变量重命名监听
  if (!block._yahboomUSARTVarMonitorAttached) {
    block._yahboomUSARTVarMonitorAttached = true;
    block._yahboomUSARTVarLastName = block.getFieldValue('VAR') || 'motor';
    var varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        var workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        var oldName = block._yahboomUSARTVarLastName;
        if (workspace && newName && newName !== oldName) {
          if (typeof renameVariableInBlockly === 'function') {
            renameVariableInBlockly(block, oldName, newName, 'YahboomMD_USART');
          }
          block._yahboomUSARTVarLastName = newName;
        }
        return newName;
      });
    }
  }

  var varName = block.getFieldValue('VAR') || 'motor';
  var serialPort = block.getFieldValue('SERIAL') || 'Serial';
  var motorType = block.getFieldValue('MOTOR_TYPE') || 'MOTOR_310';

  // 添加库引用
  generator.addLibrary('MotorDriver', '#include <MotorDriver.h>');

  // 注册变量到Blockly
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(varName, 'YahboomMD_USART');
  }

  // 声明全局对象
  generator.addVariable(varName, 'MotorDriverUSART ' + varName + '(' + serialPort + ');');

  // 自动在循环中接收数据
  generator.addLoopBegin(varName + '_receive', varName + '.receive();');

  // 生成初始化代码
  var code = serialPort + '.begin(115200);\n';
  code += varName + '.setUploadData(false, false, false);\n';
  code += 'delay(100);\n';
  code += varName + '.setMotorType(' + motorType + ');\n';
  code += 'delay(100);\n';
  return code;
};

// ==================== 串口配置 ====================

Arduino.forBlock['yahboom_md_usart_set_deadzone'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'motor';
  var deadzone = generator.valueToCode(block, 'DEADZONE', generator.ORDER_ATOMIC) || '1000';

  return varName + '.setDeadzone(' + deadzone + ');\ndelay(100);\n';
};

Arduino.forBlock['yahboom_md_usart_set_pulse_line'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'motor';
  var line = generator.valueToCode(block, 'LINE', generator.ORDER_ATOMIC) || '13';

  return varName + '.setPulseLine(' + line + ');\ndelay(100);\n';
};

Arduino.forBlock['yahboom_md_usart_set_pulse_phase'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'motor';
  var phase = generator.valueToCode(block, 'PHASE', generator.ORDER_ATOMIC) || '20';

  return varName + '.setPulsePhase(' + phase + ');\ndelay(100);\n';
};

Arduino.forBlock['yahboom_md_usart_set_wheel_diameter'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'motor';
  var diameter = generator.valueToCode(block, 'DIAMETER', generator.ORDER_ATOMIC) || '48.00';

  return varName + '.setWheelDiameter(' + diameter + ');\ndelay(100);\n';
};

Arduino.forBlock['yahboom_md_usart_set_pid'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'motor';
  var p = generator.valueToCode(block, 'P', generator.ORDER_ATOMIC) || '0.1';
  var i = generator.valueToCode(block, 'I', generator.ORDER_ATOMIC) || '0.01';
  var d = generator.valueToCode(block, 'D', generator.ORDER_ATOMIC) || '0.001';

  return varName + '.setPID(' + p + ', ' + i + ', ' + d + ');\ndelay(100);\n';
};

Arduino.forBlock['yahboom_md_usart_set_upload_data'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'motor';
  var allEncoder = block.getFieldValue('ALL_ENCODER') || 'false';
  var tenEncoder = block.getFieldValue('TEN_ENCODER') || 'false';
  var speed = block.getFieldValue('SPEED') || 'false';

  return varName + '.setUploadData(' + allEncoder + ', ' + tenEncoder + ', ' + speed + ');\ndelay(100);\n';
};

// ==================== 串口控制 ====================

Arduino.forBlock['yahboom_md_usart_control_speed'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'motor';
  var m1 = generator.valueToCode(block, 'M1', generator.ORDER_ATOMIC) || '0';
  var m2 = generator.valueToCode(block, 'M2', generator.ORDER_ATOMIC) || '0';
  var m3 = generator.valueToCode(block, 'M3', generator.ORDER_ATOMIC) || '0';
  var m4 = generator.valueToCode(block, 'M4', generator.ORDER_ATOMIC) || '0';

  return varName + '.controlSpeed(' + m1 + ', ' + m2 + ', ' + m3 + ', ' + m4 + ');\n';
};

Arduino.forBlock['yahboom_md_usart_control_pwm'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'motor';
  var m1 = generator.valueToCode(block, 'M1', generator.ORDER_ATOMIC) || '0';
  var m2 = generator.valueToCode(block, 'M2', generator.ORDER_ATOMIC) || '0';
  var m3 = generator.valueToCode(block, 'M3', generator.ORDER_ATOMIC) || '0';
  var m4 = generator.valueToCode(block, 'M4', generator.ORDER_ATOMIC) || '0';

  return varName + '.controlPWM(' + m1 + ', ' + m2 + ', ' + m3 + ', ' + m4 + ');\n';
};

// ==================== 串口数据 ====================

Arduino.forBlock['yahboom_md_usart_data_available'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'motor';

  return [varName + '.recvFlag == 1', generator.ORDER_EQUALITY];
};

Arduino.forBlock['yahboom_md_usart_parse_data'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'motor';

  return varName + '.recvFlag = 0;\n' + varName + '.parseData();\n';
};

Arduino.forBlock['yahboom_md_usart_encoder_offset'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'motor';
  var motorIndex = block.getFieldValue('MOTOR') || '0';

  return [varName + '.encoderOffset[' + motorIndex + ']', generator.ORDER_MEMBER];
};

Arduino.forBlock['yahboom_md_usart_encoder_total'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'motor';
  var motorIndex = block.getFieldValue('MOTOR') || '0';

  return [varName + '.encoderNow[' + motorIndex + ']', generator.ORDER_MEMBER];
};

Arduino.forBlock['yahboom_md_usart_speed'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'motor';
  var motorIndex = block.getFieldValue('MOTOR') || '0';

  return [varName + '.speed[' + motorIndex + ']', generator.ORDER_MEMBER];
};
