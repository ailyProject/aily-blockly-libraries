'use strict';

// 创建编码电机
Arduino.forBlock['encoder_motor_create'] = function(block, generator) {
  if (!block._encoderMotorVarMonitorAttached) {
    block._encoderMotorVarMonitorAttached = true;
    const inputField = block.getField('VAR');
    if (inputField && typeof inputField.setValidator === 'function') {
      inputField.setValidator(function(newName) {
        const oldName = this.getValue();
        if (oldName !== newName && typeof renameVariableInBlockly === 'function') {
          renameVariableInBlockly(block, oldName, newName, 'EncoderMotor');
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'motor';
  const posPin = generator.valueToCode(block, 'POS_PIN', generator.ORDER_ATOMIC) || '0';
  const negPin = generator.valueToCode(block, 'NEG_PIN', generator.ORDER_ATOMIC) || '0';
  const aPin = generator.valueToCode(block, 'A_PIN', generator.ORDER_ATOMIC) || '0';
  const bPin = generator.valueToCode(block, 'B_PIN', generator.ORDER_ATOMIC) || '0';
  const ppr = generator.valueToCode(block, 'PPR', generator.ORDER_ATOMIC) || '12';
  const reduction = generator.valueToCode(block, 'REDUCTION', generator.ORDER_ATOMIC) || '90';
  const phase = block.getFieldValue('PHASE') || 'em::EncoderMotor::kAPhaseLeads';

  // 添加库引用
  generator.addLibrary('encoder_motor', '#include <encoder_motor.h>');
  generator.addLibrary('encoder_motor_lib', '#include <encoder_motor_lib.h>');

  // 注册变量到Blockly（使用核心库函数）
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(varName, 'EncoderMotor');
  }

  const constructCode = `em::EncoderMotor ${varName}(${posPin}, ${negPin}, ${aPin}, ${bPin}, ${ppr}, ${reduction}, ${phase});`

  generator.addVariable(varName, constructCode);

  // 添加初始化调用
  const initCode = `${varName}.Init();`;
  generator.addSetupBegin(initCode, initCode);

  return '';
};

// 设置PID参数
Arduino.forBlock['encoder_motor_set_pid'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'motor';
  // 使用和原始库相同的默认PID值：P=3.0, I=1.0, D=1.0
  const p = generator.valueToCode(block, 'P', generator.ORDER_ATOMIC) || '3.0';
  const i = generator.valueToCode(block, 'I', generator.ORDER_ATOMIC) || '1.0';
  const d = generator.valueToCode(block, 'D', generator.ORDER_ATOMIC) || '1.0';

  const code = `${varName}.SetSpeedPid(${p}, ${i}, ${d});\n`;
  return code;
};

// PWM驱动电机
Arduino.forBlock['encoder_motor_run_pwm'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'motor';
  const pwm = generator.valueToCode(block, 'PWM', generator.ORDER_ATOMIC) || '0';

  // 添加范围限制：-1023到1023
  const code = `${varName}.RunPwmDuty(constrain(${pwm}, -1023, 1023));\n`;
  return code;
};

// 速度环驱动电机
Arduino.forBlock['encoder_motor_run_speed'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'motor';
  const speed = generator.valueToCode(block, 'SPEED', generator.ORDER_ATOMIC) || '0';

  // 添加范围限制：-300到300 RPM
  const code = `${varName}.RunSpeed(constrain(${speed}, -300, 300));\n`;
  return code;
};

// 停止电机
Arduino.forBlock['encoder_motor_stop'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'motor';

  const code = `${varName}.Stop();\n`;
  return code;
};

// 获取转速
Arduino.forBlock['encoder_motor_get_speed'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'motor';

  const code = `${varName}.SpeedRpm()`;
  return [code, generator.ORDER_ATOMIC];
};

// 获取PWM占空比
Arduino.forBlock['encoder_motor_get_pwm'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'motor';

  const code = `${varName}.PwmDuty()`;
  return [code, generator.ORDER_ATOMIC];
};

// 获取编码脉冲计数
Arduino.forBlock['encoder_motor_get_pulse'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'motor';

  const code = `${varName}.EncoderPulseCount()`;
  return [code, generator.ORDER_ATOMIC];
};
