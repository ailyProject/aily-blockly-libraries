/**
 * DM11 Motor Driver Library Generator
 * @brief 生成DM11电机驱动模块的Arduino代码
 */

// 初始化块
Arduino.forBlock['dm11_init'] = function(block, generator) {
  // 变量重命名监听器
  if (!block._dm11VarMonitorAttached) {
    block._dm11VarMonitorAttached = true;
    block._dm11VarLastName = block.getFieldValue('VAR') || 'dm11';
    registerVariableToBlockly(block._dm11VarLastName, 'Dm11');
    
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._dm11VarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'Dm11');
          block._dm11VarLastName = newName;
        }
      };
    }
  }

  const varName = block.getFieldValue('VAR') || 'dm11';
  const i2cAddr = block.getFieldValue('I2C_ADDR') || '0x15';
  const frequency = generator.valueToCode(block, 'FREQUENCY', generator.ORDER_ATOMIC) || '1000';

  // 添加库和变量
  generator.addLibrary('Dm11', '#include <dm11.h>');
  generator.addVariable(varName, 'em::Dm11 ' + varName + '(' + i2cAddr + ');');

  // 确保Wire初始化
  generator.addSetupBegin('Wire.begin()', 'Wire.begin();');

  // 生成初始化代码
  const code = 'if (' + varName + '.Init(' + frequency + ') != em::Dm11::kOK) {\n  Serial.println("DM11 init failed");\n}\n';
  
  return code;
};

// PWM占空比设置块
Arduino.forBlock['dm11_pwm_duty'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'dm11';
  const channel = block.getFieldValue('CHANNEL');
  const duty = generator.valueToCode(block, 'DUTY', generator.ORDER_ATOMIC) || '0';

  const code = varName + '.PwmDuty(em::Dm11::kPwmChannel' + channel + ', ' + duty + ');\n';
  return code;
};

// 电机控制块（简化操作）
Arduino.forBlock['dm11_motor_control'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'dm11';
  const motor = block.getFieldValue('MOTOR');
  const speed = generator.valueToCode(block, 'SPEED', generator.ORDER_ATOMIC) || '0';

  // 根据电机选择通道
  let channel0, channel1;
  if (motor === 'A') {
    channel0 = 'em::Dm11::kPwmChannel0';
    channel1 = 'em::Dm11::kPwmChannel1';
  } else {
    channel0 = 'em::Dm11::kPwmChannel2';
    channel1 = 'em::Dm11::kPwmChannel3';
  }

  // 生成电机控制代码
  let code = '';
  code += 'if (' + speed + ' >= 0) {\n';
  code += '  ' + varName + '.PwmDuty(' + channel0 + ', 0);\n';
  code += '  ' + varName + '.PwmDuty(' + channel1 + ', constrain(' + speed + ', 0, 4095));\n';
  code += '} else {\n';
  code += '  ' + varName + '.PwmDuty(' + channel0 + ', constrain(-' + speed + ', 0, 4095));\n';
  code += '  ' + varName + '.PwmDuty(' + channel1 + ', 0);\n';
  code += '}\n';

  return code;
};

// 电机停止块
Arduino.forBlock['dm11_motor_stop'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'dm11';
  const motor = block.getFieldValue('MOTOR');

  let code = '';
  if (motor === 'A') {
    code = varName + '.PwmDuty(em::Dm11::kPwmChannel0, 0);\n' +
           varName + '.PwmDuty(em::Dm11::kPwmChannel1, 0);\n';
  } else if (motor === 'B') {
    code = varName + '.PwmDuty(em::Dm11::kPwmChannel2, 0);\n' +
           varName + '.PwmDuty(em::Dm11::kPwmChannel3, 0);\n';
  } else {
    code = varName + '.PwmDuty(em::Dm11::kPwmChannel0, 0);\n' +
           varName + '.PwmDuty(em::Dm11::kPwmChannel1, 0);\n' +
           varName + '.PwmDuty(em::Dm11::kPwmChannel2, 0);\n' +
           varName + '.PwmDuty(em::Dm11::kPwmChannel3, 0);\n';
  }

  return code;
};