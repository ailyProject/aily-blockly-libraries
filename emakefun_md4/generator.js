'use strict';

// ==================== MD40 初始化 ====================

Arduino.forBlock['md40_init'] = function(block, generator) {
  // 变量重命名监听
  if (!block._md40VarMonitorAttached) {
    block._md40VarMonitorAttached = true;
    block._md40VarLastName = block.getFieldValue('VAR') || 'md40';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._md40VarLastName;
        if (workspace && newName && newName !== oldName) {
          if (typeof renameVariableInBlockly === 'function') {
            renameVariableInBlockly(block, oldName, newName, 'Md40');
          }
          block._md40VarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'md40';
  const i2cAddr = block.getFieldValue('I2C_ADDR') || '0x16';

  // 添加库引用
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('md40', '#include <md40.h>');

  // 注册变量到Blockly
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(varName, 'Md40');
  }

  // 声明全局对象
  generator.addVariable(varName, 'em::Md40 ' + varName + '(' + i2cAddr + ', Wire);');

  // 初始化Wire和MD40
  generator.addSetupBegin('Wire_begin', 'Wire.begin();');
  generator.addSetupBegin(varName + '_init', varName + '.Init();');

  return '';
};

// ==================== 电机模式设置 ====================

// 设置直流模式
Arduino.forBlock['md40_set_dc_mode'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'md40';
  const motorIndex = block.getFieldValue('MOTOR_INDEX') || '0';

  return varName + '[' + motorIndex + '].SetDcMode();\n';
};

// 设置编码器模式
Arduino.forBlock['md40_set_encoder_mode'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'md40';
  const motorIndex = block.getFieldValue('MOTOR_INDEX') || '0';
  const ppr = generator.valueToCode(block, 'PPR', generator.ORDER_ATOMIC) || '12';
  const reduction = generator.valueToCode(block, 'REDUCTION', generator.ORDER_ATOMIC) || '90';
  const phase = block.getFieldValue('PHASE') || 'em::Md40::Motor::PhaseRelation::kAPhaseLeads';

  return varName + '[' + motorIndex + '].SetEncoderMode(' + ppr + ', ' + reduction + ', ' + phase + ');\n';
};

// ==================== PID参数设置 ====================

// 设置速度PID
Arduino.forBlock['md40_set_speed_pid'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'md40';
  const motorIndex = block.getFieldValue('MOTOR_INDEX') || '0';
  const p = generator.valueToCode(block, 'P', generator.ORDER_ATOMIC) || '1.5';
  const i = generator.valueToCode(block, 'I', generator.ORDER_ATOMIC) || '1.5';
  const d = generator.valueToCode(block, 'D', generator.ORDER_ATOMIC) || '1.0';

  let code = '';
  code += varName + '[' + motorIndex + '].set_speed_pid_p(' + p + ');\n';
  code += varName + '[' + motorIndex + '].set_speed_pid_i(' + i + ');\n';
  code += varName + '[' + motorIndex + '].set_speed_pid_d(' + d + ');\n';
  return code;
};

// 设置位置PID
Arduino.forBlock['md40_set_position_pid'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'md40';
  const motorIndex = block.getFieldValue('MOTOR_INDEX') || '0';
  const p = generator.valueToCode(block, 'P', generator.ORDER_ATOMIC) || '10.0';
  const i = generator.valueToCode(block, 'I', generator.ORDER_ATOMIC) || '1.0';
  const d = generator.valueToCode(block, 'D', generator.ORDER_ATOMIC) || '1.0';

  let code = '';
  code += varName + '[' + motorIndex + '].set_position_pid_p(' + p + ');\n';
  code += varName + '[' + motorIndex + '].set_position_pid_i(' + i + ');\n';
  code += varName + '[' + motorIndex + '].set_position_pid_d(' + d + ');\n';
  return code;
};

// ==================== 电机运行控制 ====================

// PWM占空比驱动
Arduino.forBlock['md40_run_pwm_duty'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'md40';
  const motorIndex = block.getFieldValue('MOTOR_INDEX') || '0';
  const pwmDuty = generator.valueToCode(block, 'PWM_DUTY', generator.ORDER_ATOMIC) || '0';

  return varName + '[' + motorIndex + '].RunPwmDuty(constrain(' + pwmDuty + ', -1023, 1023));\n';
};

// 速度驱动
Arduino.forBlock['md40_run_speed'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'md40';
  const motorIndex = block.getFieldValue('MOTOR_INDEX') || '0';
  const rpm = generator.valueToCode(block, 'RPM', generator.ORDER_ATOMIC) || '0';

  return varName + '[' + motorIndex + '].RunSpeed(' + rpm + ');\n';
};

// 转到绝对位置
Arduino.forBlock['md40_move_to'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'md40';
  const motorIndex = block.getFieldValue('MOTOR_INDEX') || '0';
  const position = generator.valueToCode(block, 'POSITION', generator.ORDER_ATOMIC) || '0';
  const speed = generator.valueToCode(block, 'SPEED', generator.ORDER_ATOMIC) || '60';

  return varName + '[' + motorIndex + '].MoveTo(' + position + ', ' + speed + ');\n';
};

// 相对转动
Arduino.forBlock['md40_move'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'md40';
  const motorIndex = block.getFieldValue('MOTOR_INDEX') || '0';
  const offset = generator.valueToCode(block, 'OFFSET', generator.ORDER_ATOMIC) || '0';
  const speed = generator.valueToCode(block, 'SPEED', generator.ORDER_ATOMIC) || '60';

  return varName + '[' + motorIndex + '].Move(' + offset + ', ' + speed + ');\n';
};

// 停止电机
Arduino.forBlock['md40_stop'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'md40';
  const motorIndex = block.getFieldValue('MOTOR_INDEX') || '0';

  return varName + '[' + motorIndex + '].Stop();\n';
};

// 重置电机
Arduino.forBlock['md40_reset'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'md40';
  const motorIndex = block.getFieldValue('MOTOR_INDEX') || '0';

  return varName + '[' + motorIndex + '].Reset();\n';
};

// ==================== 位置和脉冲设置 ====================

// 设置电机位置值
Arduino.forBlock['md40_set_position'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'md40';
  const motorIndex = block.getFieldValue('MOTOR_INDEX') || '0';
  const position = generator.valueToCode(block, 'POSITION', generator.ORDER_ATOMIC) || '0';

  return varName + '[' + motorIndex + '].set_position(' + position + ');\n';
};

// 设置脉冲计数
Arduino.forBlock['md40_set_pulse_count'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'md40';
  const motorIndex = block.getFieldValue('MOTOR_INDEX') || '0';
  const pulseCount = generator.valueToCode(block, 'PULSE_COUNT', generator.ORDER_ATOMIC) || '0';

  return varName + '[' + motorIndex + '].set_pulse_count(' + pulseCount + ');\n';
};

// ==================== 状态查询 ====================

// 获取当前转速
Arduino.forBlock['md40_get_speed'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'md40';
  const motorIndex = block.getFieldValue('MOTOR_INDEX') || '0';

  return [varName + '[' + motorIndex + '].speed()', generator.ORDER_ATOMIC];
};

// 获取当前位置
Arduino.forBlock['md40_get_position'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'md40';
  const motorIndex = block.getFieldValue('MOTOR_INDEX') || '0';

  return [varName + '[' + motorIndex + '].position()', generator.ORDER_ATOMIC];
};

// 获取脉冲计数
Arduino.forBlock['md40_get_pulse_count'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'md40';
  const motorIndex = block.getFieldValue('MOTOR_INDEX') || '0';

  return [varName + '[' + motorIndex + '].pulse_count()', generator.ORDER_ATOMIC];
};

// 获取PWM占空比
Arduino.forBlock['md40_get_pwm_duty'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'md40';
  const motorIndex = block.getFieldValue('MOTOR_INDEX') || '0';

  return [varName + '[' + motorIndex + '].pwm_duty()', generator.ORDER_ATOMIC];
};

// 获取电机状态
Arduino.forBlock['md40_get_state'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'md40';
  const motorIndex = block.getFieldValue('MOTOR_INDEX') || '0';

  return ['static_cast<uint8_t>(' + varName + '[' + motorIndex + '].state())', generator.ORDER_ATOMIC];
};
