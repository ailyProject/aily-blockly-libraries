/**
 * mBrick DC Motor Library - Blockly Generator
 * 支持单电机、两轮车、四轮车控制
 */

const MOTOR_PINS = {
  'M1': { in1: 4, in2: 5 },
  'M2': { in1: 6, in2: 7 },
  'M3': { in1: 9, in2: 10 },
  'M4': { in1: 21, in2: 20 }
};

// ========== 单电机块 ==========

Arduino.forBlock['mbrick_motor_init'] = function(block, generator) {
  if (!block._varMonitorAttached) {
    block._varMonitorAttached = true;
    block._varLastName = block.getFieldValue('VAR') || 'motor1';
    registerVariableToBlockly(block._varLastName, 'mBrickMotor');
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const oldName = block._varLastName;
        if (newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'mBrickMotor');
          block._varLastName = newName;
        }
      };
    }
  }

  const varName = block.getFieldValue('VAR') || 'motor1';
  const motor = block.getFieldValue('MOTOR') || 'M1';
  const pins = MOTOR_PINS[motor];

  generator.addLibrary('mBrick_DCmotor', '#include <mBrick_DCmotor.h>');
  generator.addObject(varName, 'mBrickMotor ' + varName + '(' + pins.in1 + ', ' + pins.in2 + ');');

  return varName + '.begin();\n';
};

Arduino.forBlock['mbrick_motor_forward'] = function(block, generator) {
  const varName = block.getField('VAR').getText();
  const pwm = generator.valueToCode(block, 'PWM', generator.ORDER_ATOMIC) || '128';
  return varName + '.forward(' + pwm + ');\n';
};

Arduino.forBlock['mbrick_motor_backward'] = function(block, generator) {
  const varName = block.getField('VAR').getText();
  const pwm = generator.valueToCode(block, 'PWM', generator.ORDER_ATOMIC) || '128';
  return varName + '.backward(' + pwm + ');\n';
};

Arduino.forBlock['mbrick_motor_stop'] = function(block, generator) {
  const varName = block.getField('VAR').getText();
  const mode = block.getFieldValue('MODE') || 'COAST';
  return varName + '.stop(' + mode + ');\n';
};

Arduino.forBlock['mbrick_motor_set_speed'] = function(block, generator) {
  const varName = block.getField('VAR').getText();
  const pwm = generator.valueToCode(block, 'PWM', generator.ORDER_ATOMIC) || '128';
  return varName + '.setSpeedPWM(' + pwm + ');\n';
};

Arduino.forBlock['mbrick_motor_is_running'] = function(block, generator) {
  const varName = block.getField('VAR').getText();
  return [varName + '.isRunning()', generator.ORDER_ATOMIC];
};

// ========== 两轮车块 ==========

Arduino.forBlock['mbrick_car_init'] = function(block, generator) {
  if (!block._varMonitorAttached) {
    block._varMonitorAttached = true;
    block._varLastName = block.getFieldValue('VAR') || 'car';
    registerVariableToBlockly(block._varLastName, 'mBrickCar');
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const oldName = block._varLastName;
        if (newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'mBrickCar');
          block._varLastName = newName;
        }
      };
    }
  }

  const varName = block.getFieldValue('VAR') || 'car';
  const leftMotor = block.getField('LEFT_MOTOR').getText();
  const rightMotor = block.getField('RIGHT_MOTOR').getText();

  generator.addLibrary('mBrick_DCmotor', '#include <mBrick_DCmotor.h>');
  generator.addObject(varName, 'mBrickCar ' + varName + '(' + leftMotor + ', ' + rightMotor + ');');

  return varName + '.begin();\n';
};

Arduino.forBlock['mbrick_car_forward'] = function(block, generator) {
  const varName = block.getField('VAR').getText();
  const speed = generator.valueToCode(block, 'SPEED', generator.ORDER_ATOMIC) || '50';
  return varName + '.forward(' + speed + ');\n';
};

Arduino.forBlock['mbrick_car_backward'] = function(block, generator) {
  const varName = block.getField('VAR').getText();
  const speed = generator.valueToCode(block, 'SPEED', generator.ORDER_ATOMIC) || '50';
  return varName + '.backward(' + speed + ');\n';
};

Arduino.forBlock['mbrick_car_turn_left'] = function(block, generator) {
  const varName = block.getField('VAR').getText();
  const speed = generator.valueToCode(block, 'SPEED', generator.ORDER_ATOMIC) || '50';
  return varName + '.turnLeft(' + speed + ');\n';
};

Arduino.forBlock['mbrick_car_turn_right'] = function(block, generator) {
  const varName = block.getField('VAR').getText();
  const speed = generator.valueToCode(block, 'SPEED', generator.ORDER_ATOMIC) || '50';
  return varName + '.turnRight(' + speed + ');\n';
};

Arduino.forBlock['mbrick_car_stop'] = function(block, generator) {
  const varName = block.getField('VAR').getText();
  const mode = block.getFieldValue('MODE') || 'COAST';
  return varName + '.stop(' + mode + ');\n';
};

Arduino.forBlock['mbrick_car_set_speed'] = function(block, generator) {
  const varName = block.getField('VAR').getText();
  const speed = generator.valueToCode(block, 'SPEED', generator.ORDER_ATOMIC) || '50';
  return varName + '.setSpeed(' + speed + ');\n';
};

Arduino.forBlock['mbrick_car_set_min_pwm'] = function(block, generator) {
  const varName = block.getField('VAR').getText();
  const minPwm = generator.valueToCode(block, 'MIN_PWM', generator.ORDER_ATOMIC) || '50';
  return varName + '.setMinPWM(' + minPwm + ');\n';
};

// ========== 四轮车块 ==========

Arduino.forBlock['mbrick_car4wd_init'] = function(block, generator) {
  if (!block._varMonitorAttached) {
    block._varMonitorAttached = true;
    block._varLastName = block.getFieldValue('VAR') || 'car4wd';
    registerVariableToBlockly(block._varLastName, 'mBrickCar4WD');
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const oldName = block._varLastName;
        if (newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'mBrickCar4WD');
          block._varLastName = newName;
        }
      };
    }
  }

  const varName = block.getFieldValue('VAR') || 'car4wd';
  const lf = block.getField('LF').getText();
  const lr = block.getField('LR').getText();
  const rf = block.getField('RF').getText();
  const rr = block.getField('RR').getText();

  generator.addLibrary('mBrick_DCmotor', '#include <mBrick_DCmotor.h>');
  generator.addObject(varName, 'mBrickCar4WD ' + varName + '(' + lf + ', ' + lr + ', ' + rf + ', ' + rr + ');');

  return varName + '.begin();\n';
};

Arduino.forBlock['mbrick_car4wd_forward'] = function(block, generator) {
  const varName = block.getField('VAR').getText();
  const speed = generator.valueToCode(block, 'SPEED', generator.ORDER_ATOMIC) || '50';
  return varName + '.forward(' + speed + ');\n';
};

Arduino.forBlock['mbrick_car4wd_backward'] = function(block, generator) {
  const varName = block.getField('VAR').getText();
  const speed = generator.valueToCode(block, 'SPEED', generator.ORDER_ATOMIC) || '50';
  return varName + '.backward(' + speed + ');\n';
};

Arduino.forBlock['mbrick_car4wd_turn_left'] = function(block, generator) {
  const varName = block.getField('VAR').getText();
  const speed = generator.valueToCode(block, 'SPEED', generator.ORDER_ATOMIC) || '50';
  return varName + '.turnLeft(' + speed + ');\n';
};

Arduino.forBlock['mbrick_car4wd_turn_right'] = function(block, generator) {
  const varName = block.getField('VAR').getText();
  const speed = generator.valueToCode(block, 'SPEED', generator.ORDER_ATOMIC) || '50';
  return varName + '.turnRight(' + speed + ');\n';
};

Arduino.forBlock['mbrick_car4wd_stop'] = function(block, generator) {
  const varName = block.getField('VAR').getText();
  const mode = block.getFieldValue('MODE') || 'COAST';
  return varName + '.stop(' + mode + ');\n';
};

Arduino.forBlock['mbrick_car4wd_set_speed'] = function(block, generator) {
  const varName = block.getField('VAR').getText();
  const speed = generator.valueToCode(block, 'SPEED', generator.ORDER_ATOMIC) || '50';
  return varName + '.setSpeed(' + speed + ');\n';
};

Arduino.forBlock['mbrick_car4wd_set_min_pwm'] = function(block, generator) {
  const varName = block.getField('VAR').getText();
  const minPwm = generator.valueToCode(block, 'MIN_PWM', generator.ORDER_ATOMIC) || '50';
  return varName + '.setMinPWM(' + minPwm + ');\n';
};