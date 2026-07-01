'use strict';

// 初始化：创建小车对象
Arduino.forBlock['beginner_a1_init'] = function (block, generator) {
  const CAR_TYPE = 'BeginnerA1Car';

  // 变量重命名监听
  if (!block._varMonitorAttached) {
    block._varMonitorAttached = true;
    block._varLastName = block.getFieldValue('VAR') || 'car';
    registerVariableToBlockly(block._varLastName, CAR_TYPE);
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function (newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const oldName = block._varLastName;
        if (newName && newName !== oldName && typeof renameVariableInBlockly === 'function') {
          renameVariableInBlockly(block, oldName, newName, CAR_TYPE);
          block._varLastName = newName;
        }
      };
    }
  }

  const varName = block.getFieldValue('VAR') || 'car';

  // 本库仅适用于 Beginner A1（基于 ESP32-C3）开发板
  const boardConfig = window['boardConfig'];
  if (boardConfig && boardConfig.core && boardConfig.core.indexOf('esp32') > -1) {
    generator.addLibrary('beginner_a1', '#include <BeginnerA1.h>');
  }

  registerVariableToBlockly(varName, CAR_TYPE);
  generator.addObject(varName, 'BeginnerA1Class ' + varName + ';');

  // 调试串口（核心库函数，自动去重、避免与其他库波特率冲突）
  ensureSerialBegin("Serial", generator);
  // 初始化与主循环刷新（刷新电机平滑、舵机、LED 状态机、电池、配对；含断连保护）
  const maxSpeed = block.getFieldValue('MAXSPEED');
  generator.addSetupBegin('ba1_begin_' + varName, varName + '.begin(' + maxSpeed + ');');
  generator.addLoopBegin('ba1_loop_' + varName, varName + '.update();');

  return '';
};

// 遥控按键是否按下（值块）
Arduino.forBlock['beginner_a1_button'] = function (block, generator) {
  generator.addLibrary('beginner_a1', '#include <BeginnerA1.h>');
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'car';
  const index = block.getFieldValue('INDEX');
  return [`${varName}.remoteButton(${index})`, generator.ORDER_ATOMIC];
};

// 读取遥控摇杆（值块）
Arduino.forBlock['beginner_a1_joystick'] = function (block, generator) {
  generator.addLibrary('beginner_a1', '#include <BeginnerA1.h>');
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'car';
  const channel = block.getFieldValue('CHANNEL');
  return [`${varName}.joystick(${channel})`, generator.ORDER_ATOMIC];
};

// 差速行驶（语句块）
Arduino.forBlock['beginner_a1_drive'] = function (block, generator) {
  generator.addLibrary('beginner_a1', '#include <BeginnerA1.h>');
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'car';
  const forward = generator.valueToCode(block, 'FORWARD', generator.ORDER_ATOMIC) || '0';
  const turn = generator.valueToCode(block, 'TURN', generator.ORDER_ATOMIC) || '0';
  return `${varName}.drive(${forward}, ${turn});\n`;
};

// 单独设置左/右电机速度（语句块）
Arduino.forBlock['beginner_a1_motor'] = function (block, generator) {
  generator.addLibrary('beginner_a1', '#include <BeginnerA1.h>');
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'car';
  const which = block.getFieldValue('WHICH');
  const speed = generator.valueToCode(block, 'SPEED', generator.ORDER_ATOMIC) || '0';
  return `${varName}.setMotor(${which}, ${speed});\n`;
};

// 停止小车（语句块）
Arduino.forBlock['beginner_a1_stop'] = function (block, generator) {
  generator.addLibrary('beginner_a1', '#include <BeginnerA1.h>');
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'car';
  return `${varName}.stop();\n`;
};

// 定位舵机转到角度（语句块）
Arduino.forBlock['beginner_a1_servo'] = function (block, generator) {
  generator.addLibrary('beginner_a1', '#include <BeginnerA1.h>');
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'car';
  const which = block.getFieldValue('WHICH');
  const angle = block.getFieldValue('ANGLE');
  return `${varName}.setServo(${which}, ${angle});\n`;
};

// 连续旋转舵机转 N 秒（语句块）
Arduino.forBlock['beginner_a1_servo_rotate'] = function (block, generator) {
  generator.addLibrary('beginner_a1', '#include <BeginnerA1.h>');
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'car';
  const which = block.getFieldValue('WHICH');
  const dir = block.getFieldValue('DIR');
  const speed = block.getFieldValue('SPEED');
  const seconds = block.getFieldValue('SECONDS');
  return `${varName}.rotate(${which}, (${dir}) * (${speed}), (unsigned long)((${seconds}) * 1000));\n`;
};
