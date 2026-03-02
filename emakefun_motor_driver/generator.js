'use strict';

// ==================== 辅助函数 ====================

// 确保直流电机指针已声明
function ensureDcMotor(varName, motorNum, generator) {
  var motorVar = varName + '_dc' + motorNum;
  generator.addObject(
    motorVar,
    'Emakefun_DCMotor *' + motorVar + ' = ' + varName + '.getMotor(M' + motorNum + ');'
  );
  return motorVar;
}

// 确保舵机指针已声明
function ensureServo(varName, servoNum, generator) {
  var servoVar = varName + '_servo' + servoNum;
  generator.addObject(
    servoVar,
    'Emakefun_Servo *' + servoVar + ' = ' + varName + '.getServo(' + servoNum + ');'
  );
  return servoVar;
}

// 确保步进电机指针已声明（默认200步/圈）
function ensureStepper(varName, stepperNum, generator) {
  var stepperVar = varName + '_stepper' + stepperNum;
  generator.addObject(
    stepperVar,
    'Emakefun_StepperMotor *' + stepperVar + ' = ' + varName + '.getStepper(STEPPER' + stepperNum + ', 200);'
  );
  return stepperVar;
}

// ==================== 初始化 ====================

Arduino.forBlock['emakefun_md_init'] = function(block, generator) {
  // 变量重命名监听
  if (!block._emakefunMdVarMonitorAttached) {
    block._emakefunMdVarMonitorAttached = true;
    block._emakefunMdVarLastName = block.getFieldValue('VAR') || 'mMotor';
    var varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        var workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        var oldName = block._emakefunMdVarLastName;
        if (workspace && newName && newName !== oldName) {
          if (typeof renameVariableInBlockly === 'function') {
            renameVariableInBlockly(block, oldName, newName, 'EmakefunMD');
          }
          block._emakefunMdVarLastName = newName;
        }
        return newName;
      });
    }
  }

  var varName = block.getFieldValue('VAR') || 'mMotor';
  var addr = block.getFieldValue('ADDR') || '0x60';
  var freq = block.getFieldValue('FREQ') || '50';

  // 添加库引用
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('Emakefun_MotorDriver', '#include <Emakefun_MotorDriver.h>');

  // 注册变量到Blockly
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(varName, 'EmakefunMD');
  }

  // 声明全局驱动对象
  generator.addVariable(varName, 'Emakefun_MotorDriver ' + varName + ' = Emakefun_MotorDriver(' + addr + ');');

  // 在setup中初始化
  generator.addSetupBegin(varName + '_begin', varName + '.begin(' + freq + ');');

  return '';
};

// ==================== 直流电机 ====================

Arduino.forBlock['emakefun_md_dc_run'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'mMotor';
  var motorNum = block.getFieldValue('MOTOR') || '1';
  var speed = generator.valueToCode(block, 'SPEED', generator.ORDER_ATOMIC) || '0';
  var dir = block.getFieldValue('DIR') || 'FORWARD';

  var motorVar = ensureDcMotor(varName, motorNum, generator);

  var code = '';
  code += motorVar + '->setSpeed(' + speed + ');\n';
  code += motorVar + '->run(' + dir + ');\n';
  return code;
};

Arduino.forBlock['emakefun_md_dc_stop'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'mMotor';
  var motorNum = block.getFieldValue('MOTOR') || '1';
  var action = block.getFieldValue('ACTION') || 'BRAKE';

  var motorVar = ensureDcMotor(varName, motorNum, generator);

  return motorVar + '->run(' + action + ');\n';
};

// ==================== 舵机 ====================

Arduino.forBlock['emakefun_md_servo_write'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'mMotor';
  var servoNum = block.getFieldValue('SERVO') || '1';
  var angle = generator.valueToCode(block, 'ANGLE', generator.ORDER_ATOMIC) || '90';

  var servoVar = ensureServo(varName, servoNum, generator);

  return servoVar + '->writeServo(' + angle + ');\n';
};

Arduino.forBlock['emakefun_md_servo_write_speed'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'mMotor';
  var servoNum = block.getFieldValue('SERVO') || '1';
  var angle = generator.valueToCode(block, 'ANGLE', generator.ORDER_ATOMIC) || '90';
  var speed = generator.valueToCode(block, 'SPEED', generator.ORDER_ATOMIC) || '5';

  var servoVar = ensureServo(varName, servoNum, generator);

  return servoVar + '->writeServo(' + angle + ', ' + speed + ');\n';
};

Arduino.forBlock['emakefun_md_servo_read'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'mMotor';
  var servoNum = block.getFieldValue('SERVO') || '1';

  var servoVar = ensureServo(varName, servoNum, generator);

  return [servoVar + '->readDegrees()', generator.ORDER_ATOMIC];
};

// ==================== 步进电机 ====================

Arduino.forBlock['emakefun_md_stepper_speed'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'mMotor';
  var stepperNum = block.getFieldValue('STEPPER') || '1';
  var rpm = generator.valueToCode(block, 'RPM', generator.ORDER_ATOMIC) || '100';

  var stepperVar = ensureStepper(varName, stepperNum, generator);

  return stepperVar + '->setSpeed(' + rpm + ');\n';
};

Arduino.forBlock['emakefun_md_stepper_step'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'mMotor';
  var stepperNum = block.getFieldValue('STEPPER') || '1';
  var steps = generator.valueToCode(block, 'STEPS', generator.ORDER_ATOMIC) || '200';
  var dir = block.getFieldValue('DIR') || 'FORWARD';
  var style = block.getFieldValue('STYLE') || 'SINGLE';

  var stepperVar = ensureStepper(varName, stepperNum, generator);

  return stepperVar + '->step(' + steps + ', ' + dir + ', ' + style + ');\n';
};

Arduino.forBlock['emakefun_md_stepper_release'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'mMotor';
  var stepperNum = block.getFieldValue('STEPPER') || '1';

  var stepperVar = ensureStepper(varName, stepperNum, generator);

  return stepperVar + '->release();\n';
};
