'use strict';

const CUBIC_TYPE = 'CubicRobot';

function cubicGetVar(block, fallback) {
  const f = block.getField('VAR');
  return f ? f.getText() : fallback;
}

function cubicAttachRename(block) {
  if (block._cubicVarMonitorAttached) return;
  block._cubicVarMonitorAttached = true;
  block._cubicVarLastName = block.getFieldValue('VAR') || 'robot';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._cubicVarLastName, CUBIC_TYPE);
  }
  const varField = block.getField('VAR');
  if (varField) {
    const originalFinishEditing = varField.onFinishEditing_;
    varField.onFinishEditing_ = function (newName) {
      if (typeof originalFinishEditing === 'function') {
        originalFinishEditing.call(this, newName);
      }
      const workspace =
        block.workspace ||
        (typeof Blockly !== 'undefined' &&
          Blockly.getMainWorkspace &&
          Blockly.getMainWorkspace());
      const oldName = block._cubicVarLastName;
      if (
        workspace &&
        newName &&
        newName !== oldName &&
        typeof renameVariableInBlockly === 'function'
      ) {
        renameVariableInBlockly(block, oldName, newName, CUBIC_TYPE);
        block._cubicVarLastName = newName;
      }
    };
  }
}

function cubicEnsureLib(generator) {
  // 内置依赖：ESP32Servo + encoder-motor（已打包进 cubic_robot/src.7z）
  generator.addLibrary('ESP32Servo', '#include <ESP32Servo.h>');
  generator.addLibrary('encoder_motor', '#include <encoder_motor.h>');
  generator.addLibrary('encoder_motor_lib', '#include <encoder_motor_lib.h>');
  generator.addLibrary('CubicRobot', '#include <CubicRobot.h>');
}

function cubicMotorEnum(motor) {
  return 'CubicRobot::' + (motor || 'MOTOR_A');
}

// ========== 初始化 ==========
Arduino.forBlock['cubic_robot_init'] = function (block, generator) {
  cubicAttachRename(block);
  const varName = block.getFieldValue('VAR') || 'robot';
  cubicEnsureLib(generator);
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(varName, CUBIC_TYPE);
  }
  generator.addVariable(varName, 'CubicRobot ' + varName + ';');
  // begin 放在语句顺序里，保证「设置电机引脚」积木写在初始化前面时能先生效
  return varName + '.begin();\n';
};

// ========== 设置电机/编码器引脚（begin 之前） ==========
Arduino.forBlock['cubic_robot_set_motor_pins'] = function (block, generator) {
  const varName = cubicGetVar(block, 'robot');
  const motor = block.getFieldValue('MOTOR') || 'MOTOR_A';
  const in1 = generator.valueToCode(block, 'IN1', generator.ORDER_ATOMIC) || '14';
  const in2 = generator.valueToCode(block, 'IN2', generator.ORDER_ATOMIC) || '15';
  const encA = generator.valueToCode(block, 'ENC_A', generator.ORDER_ATOMIC) || '34';
  const encB = generator.valueToCode(block, 'ENC_B', generator.ORDER_ATOMIC) || '35';
  cubicEnsureLib(generator);
  if (motor === 'MOTOR_B') {
    return (
      varName + '.pinMB_IN1 = ' + in1 + ';\n' +
      varName + '.pinMB_IN2 = ' + in2 + ';\n' +
      varName + '.pinEncB1 = ' + encA + ';\n' +
      varName + '.pinEncB2 = ' + encB + ';\n'
    );
  }
  return (
    varName + '.pinMA_IN1 = ' + in1 + ';\n' +
    varName + '.pinMA_IN2 = ' + in2 + ';\n' +
    varName + '.pinEncA1 = ' + encA + ';\n' +
    varName + '.pinEncA2 = ' + encB + ';\n'
  );
};

// ========== PID ==========
Arduino.forBlock['cubic_robot_set_pid'] = function (block, generator) {
  const varName = cubicGetVar(block, 'robot');
  const motor = block.getFieldValue('MOTOR') || 'MOTOR_A';
  const p = generator.valueToCode(block, 'P', generator.ORDER_ATOMIC) || '3.0';
  const i = generator.valueToCode(block, 'I', generator.ORDER_ATOMIC) || '1.0';
  const d = generator.valueToCode(block, 'D', generator.ORDER_ATOMIC) || '1.0';
  cubicEnsureLib(generator);
  return varName + '.setPid(' + cubicMotorEnum(motor) + ', ' + p + ', ' + i + ', ' + d + ');\n';
};

// ========== PWM ==========
Arduino.forBlock['cubic_robot_run_pwm'] = function (block, generator) {
  const varName = cubicGetVar(block, 'robot');
  const motor = block.getFieldValue('MOTOR') || 'MOTOR_A';
  const pwm = generator.valueToCode(block, 'PWM', generator.ORDER_ATOMIC) || '0';
  cubicEnsureLib(generator);
  return varName + '.runPwm(' + cubicMotorEnum(motor) + ', ' + pwm + ');\n';
};

// ========== 速度环 ==========
Arduino.forBlock['cubic_robot_run_speed'] = function (block, generator) {
  const varName = cubicGetVar(block, 'robot');
  const motor = block.getFieldValue('MOTOR') || 'MOTOR_A';
  const speed = generator.valueToCode(block, 'SPEED', generator.ORDER_ATOMIC) || '0';
  cubicEnsureLib(generator);
  return varName + '.runSpeed(' + cubicMotorEnum(motor) + ', ' + speed + ');\n';
};

// ========== 差速 ==========
Arduino.forBlock['cubic_robot_drive'] = function (block, generator) {
  const varName = cubicGetVar(block, 'robot');
  const forward = generator.valueToCode(block, 'FORWARD', generator.ORDER_ATOMIC) || '0';
  const turn = generator.valueToCode(block, 'TURN', generator.ORDER_ATOMIC) || '0';
  cubicEnsureLib(generator);
  return varName + '.drive(' + forward + ', ' + turn + ');\n';
};

// ========== 快捷运动 ==========
Arduino.forBlock['cubic_robot_move'] = function (block, generator) {
  const varName = cubicGetVar(block, 'robot');
  const dir = block.getFieldValue('DIR') || 'STOP';
  const speed = generator.valueToCode(block, 'SPEED', generator.ORDER_ATOMIC) || '600';
  cubicEnsureLib(generator);
  if (dir === 'FORWARD') return varName + '.forward(' + speed + ');\n';
  if (dir === 'BACKWARD') return varName + '.backward(' + speed + ');\n';
  if (dir === 'LEFT') return varName + '.turnLeft(' + speed + ');\n';
  if (dir === 'RIGHT') return varName + '.turnRight(' + speed + ');\n';
  return varName + '.stop();\n';
};

// ========== 停止 ==========
Arduino.forBlock['cubic_robot_stop'] = function (block, generator) {
  const varName = cubicGetVar(block, 'robot');
  cubicEnsureLib(generator);
  return varName + '.stopAll();\n';
};

// ========== 状态读取 ==========
Arduino.forBlock['cubic_robot_get_speed'] = function (block, generator) {
  const varName = cubicGetVar(block, 'robot');
  const motor = block.getFieldValue('MOTOR') || 'MOTOR_A';
  cubicEnsureLib(generator);
  return [varName + '.speedRpm(' + cubicMotorEnum(motor) + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['cubic_robot_get_pulse'] = function (block, generator) {
  const varName = cubicGetVar(block, 'robot');
  const motor = block.getFieldValue('MOTOR') || 'MOTOR_A';
  cubicEnsureLib(generator);
  return [varName + '.pulse(' + cubicMotorEnum(motor) + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['cubic_robot_get_revolutions'] = function (block, generator) {
  const varName = cubicGetVar(block, 'robot');
  const motor = block.getFieldValue('MOTOR') || 'MOTOR_A';
  cubicEnsureLib(generator);
  return [varName + '.revolutions(' + cubicMotorEnum(motor) + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['cubic_robot_reset_pulse'] = function (block, generator) {
  const varName = cubicGetVar(block, 'robot');
  const motor = block.getFieldValue('MOTOR') || 'MOTOR_A';
  cubicEnsureLib(generator);
  return varName + '.resetPulse(' + cubicMotorEnum(motor) + ');\n';
};

// ========== 舵机 ==========
Arduino.forBlock['cubic_robot_servo'] = function (block, generator) {
  const varName = cubicGetVar(block, 'robot');
  const servo = block.getFieldValue('SERVO') || 'SERVO_1';
  const angle = generator.valueToCode(block, 'ANGLE', generator.ORDER_ATOMIC) || '90';
  cubicEnsureLib(generator);
  return varName + '.setServoAngle(CubicRobot::' + servo + ', ' + angle + ');\n';
};

// ========== 按键 ==========
Arduino.forBlock['cubic_robot_button'] = function (block, generator) {
  const varName = cubicGetVar(block, 'robot');
  const btn = block.getFieldValue('BTN') || '0';
  cubicEnsureLib(generator);
  return [varName + '.buttonPressed(' + btn + ')', generator.ORDER_ATOMIC];
};

// ========== RGB ==========
Arduino.forBlock['cubic_robot_rgb'] = function (block, generator) {
  const varName = cubicGetVar(block, 'robot');
  const state = block.getFieldValue('STATE') || 'false';
  cubicEnsureLib(generator);
  return varName + '.setRgb(' + state + ');\n';
};

// ========== 说明 ==========
Arduino.forBlock['cubic_robot_pin_info'] = function () {
  return '// Cubic: MA=14/15 ENC34/35; MB=12/17 ENC36/39; SERVO=2/25; uses lib-encoder-motor\n';
};
