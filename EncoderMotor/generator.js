'use strict';

// Encoder Motor Library Generator for Aily Platform

// 配置变量
if (typeof Arduino._encoderMotorConfig === 'undefined') {
  Arduino._encoderMotorConfig = {
    ppr: 3,
    reduction: 48
  };
}

// 工具函数
Arduino.ensureEncoderMotor = function(generator) {
  const config = Arduino._encoderMotorConfig;
  generator.addLibrary('encoder_motor_wrapper', '#include "EncoderMotor_Wrapper.h"');
  generator.addSetup('encoder_motor_init', `EncoderMotor.begin(${config.ppr}, ${config.reduction});`);
};

// ========== 编码电机配置 ==========
Arduino.forBlock['encoder_config'] = function(block, generator) {
  // 读取用户设置的PPR和减速比，更新配置
  Arduino._encoderMotorConfig.ppr = block.getFieldValue('PPR');
  Arduino._encoderMotorConfig.reduction = block.getFieldValue('REDUCTION');
  
  // 调用 ensureEncoderMotor 确保配置生效
  Arduino.ensureEncoderMotor(generator);
  
  return '';
};

// ========== 编码电机IO配置 ==========
Arduino.forBlock['encoder_setpin'] = function(block, generator) {
  // 读取用户设置的PPR和减速比，更新配置
  Arduino._encoderMotorConfig.motor_id = block.getFieldValue('MOTOR_ID');
  Arduino._encoderMotorConfig.pin_positive = block.getFieldValue('PIN_POSITIVE');
  Arduino._encoderMotorConfig.pin_negative = block.getFieldValue('PIN_NEGATIVE');
  Arduino._encoderMotorConfig.pin_encoder_a = block.getFieldValue('PIN_ENCODER_A');
  Arduino._encoderMotorConfig.pin_encoder_b = block.getFieldValue('PIN_ENCODER_B');
  
  // 调用 ensureEncoderMotor 确保配置生效
  //Arduino.ensureEncoderMotor(generator);
  let motorId = block.getFieldValue('MOTOR_ID');
  let pin_pos;
  let pin_neg;
  let pin_enc_a;
  let pin_enc_b;
  if( motorId === '0') {
    pin_pos = generator.valueToCode(block, 'PIN_POSITIVE', generator.ORDER_ATOMIC) || '12';
    pin_neg = generator.valueToCode(block, 'PIN_NEGATIVE', generator.ORDER_ATOMIC) || '14';
    pin_enc_a = generator.valueToCode(block, 'PIN_ENCODER_A', generator.ORDER_ATOMIC) || '35';
    pin_enc_b = generator.valueToCode(block, 'PIN_ENCODER_B', generator.ORDER_ATOMIC) || '36';
  } else if( motorId === '1') {
    pin_pos = generator.valueToCode(block, 'PIN_POSITIVE', generator.ORDER_ATOMIC) || '15';
    pin_neg = generator.valueToCode(block, 'PIN_NEGATIVE', generator.ORDER_ATOMIC) || '17';
    pin_enc_a = generator.valueToCode(block, 'PIN_ENCODER_A', generator.ORDER_ATOMIC) || '34';
    pin_enc_b = generator.valueToCode(block, 'PIN_ENCODER_B', generator.ORDER_ATOMIC) || '39';
  }
  generator.addObject(`encoder_p_pos${motorId}`, '#define E' + motorId + '_MOTOR_PIN_POSITIVE ' + pin_pos + ';');
  generator.addObject(`encoder_p_neg${motorId}`, '#define E' + motorId + '_MOTOR_PIN_NEGATIVE ' + pin_neg + ';');
  generator.addObject(`encoder_enc_a${motorId}`, '#define E' + motorId + '_ENCODER_PIN_A ' + pin_enc_a + ';');
  generator.addObject(`encoder_enc_b${motorId}`, '#define E' + motorId + '_ENCODER_PIN_B ' + pin_enc_b + ';');

  return '';
};

// ========== 设置PID参数 ==========
Arduino.forBlock['encoder_set_pid'] = function(block, generator) {
  Arduino.ensureEncoderMotor(generator);
  const motorId = block.getFieldValue('MOTOR_ID');
  const p = generator.valueToCode(block, 'P', Arduino.ORDER_ATOMIC) || '5.0';
  const i = generator.valueToCode(block, 'I', Arduino.ORDER_ATOMIC) || '2.0';
  const d = generator.valueToCode(block, 'D', Arduino.ORDER_ATOMIC) || '1.0';
  
  if (motorId === '-1') {
    return `g_encoder_motor_0.SetSpeedPid(${p}, ${i}, ${d});\ng_encoder_motor_1.SetSpeedPid(${p}, ${i}, ${d});\n`;
  } else {
    return `g_encoder_motor_${motorId}.SetSpeedPid(${p}, ${i}, ${d});\n`;
  }
};

// ========== 速度闭环控制 ==========
Arduino.forBlock['encoder_run_speed'] = function(block, generator) {
  Arduino.ensureEncoderMotor(generator);
  const motorId = block.getFieldValue('MOTOR_ID');
  const speed = generator.valueToCode(block, 'SPEED', Arduino.ORDER_ATOMIC) || '0';
  
  if (motorId === '-1') {
    return `g_encoder_motor_0.RunSpeed(constrain(${speed}, -500, 500));\ng_encoder_motor_1.RunSpeed(constrain(${speed}, -500, 500));\n`;
  } else {
    return `g_encoder_motor_${motorId}.RunSpeed(constrain(${speed}, -500, 500));\n`;
  }
};

// ========== PWM开环控制 ==========
Arduino.forBlock['encoder_run_pwm'] = function(block, generator) {
  Arduino.ensureEncoderMotor(generator);
  const motorId = block.getFieldValue('MOTOR_ID');
  const duty = generator.valueToCode(block, 'DUTY', Arduino.ORDER_ATOMIC) || '0';
  const mappedDuty = `map(constrain(${duty}, -100, 100), -100, 100, -1023, 1023)`;
  
  if (motorId === '-1') {
    return `g_encoder_motor_0.RunPwmDuty(${mappedDuty});\ng_encoder_motor_1.RunPwmDuty(${mappedDuty});\n`;
  } else {
    return `g_encoder_motor_${motorId}.RunPwmDuty(${mappedDuty});\n`;
  }
};

// ========== 停止电机 ==========
Arduino.forBlock['encoder_stop'] = function(block, generator) {
  Arduino.ensureEncoderMotor(generator);
  const motorId = block.getFieldValue('MOTOR_ID');
  
  if (motorId === '-1') {
    return `g_encoder_motor_0.Stop();\ng_encoder_motor_1.Stop();\n`;
  } else {
    return `g_encoder_motor_${motorId}.Stop();\n`;
  }
};

// ========== 获取转过角度 ==========
Arduino.forBlock['encoder_get_degree'] = function(block, generator) {
  Arduino.ensureEncoderMotor(generator);
  const motorId = block.getFieldValue('MOTOR_ID');
  const code = `EncoderMotor.pulseToDegree(g_encoder_motor_${motorId}.EncoderPulseCount())`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// ========== 重置角度 ==========
Arduino.forBlock['encoder_reset_degree'] = function(block, generator) {
  Arduino.ensureEncoderMotor(generator);
  const motorId = block.getFieldValue('MOTOR_ID');
  return `g_encoder_motor_${motorId}.ResetPulseCount();\n`;
};

// ========== 获取当前转速 ==========
Arduino.forBlock['encoder_get_speed'] = function(block, generator) {
  Arduino.ensureEncoderMotor(generator);
  const motorId = block.getFieldValue('MOTOR_ID');
  const code = `g_encoder_motor_${motorId}.SpeedRpm()`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};
