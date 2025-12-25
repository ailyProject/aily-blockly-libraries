// Helper function to get variable name from field_variable
function getStepperVarName(block) {
  const varField = block.getField('VAR');
  return varField ? varField.getText() : 'stepper';
}

// Register variable to Blockly
function registerStepperVariable(generator, varName) {
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(varName, 'AccelStepper');
  }
  generator.addLibrary('AccelStepper', '#include <AccelStepper.h>');
  generator.addVariable('AccelStepper ' + varName, 'AccelStepper ' + varName + ';');
}

// Setup block for 2-4 wire steppers
Arduino.forBlock['accelstepper_setup'] = function(block, generator) {
  // 变量重命名监听
  if (!block._stepperVarMonitorAttached) {
    block._stepperVarMonitorAttached = true;
    block._stepperVarLastName = block.getFieldValue('VAR') || 'stepper';
    const varField = block.getField('VAR');
    if (varField && typeof varField.onRename === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._stepperVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'AccelStepper');
          block._stepperVarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'stepper';
  const interfaceType = block.getFieldValue('INTERFACE');
  const pin1 = generator.valueToCode(block, 'PIN1', generator.ORDER_ATOMIC) || '2';
  const pin2 = generator.valueToCode(block, 'PIN2', generator.ORDER_ATOMIC) || '3';
  const pin3 = generator.valueToCode(block, 'PIN3', generator.ORDER_ATOMIC) || '4';
  const pin4 = generator.valueToCode(block, 'PIN4', generator.ORDER_ATOMIC) || '5';

  registerStepperVariable(generator, varName);

  // Build the pin list based on interface type
  let pinList = pin1;
  if (interfaceType === '2' || interfaceType === '3' || interfaceType === '4' || interfaceType === '6' || interfaceType === '8') {
    pinList += ', ' + pin2;
  }
  if (interfaceType === '3' || interfaceType === '4' || interfaceType === '6' || interfaceType === '8') {
    pinList += ', ' + pin3;
  }
  if (interfaceType === '4' || interfaceType === '8') {
    pinList += ', ' + pin4;
  }

  let code = varName + ' = AccelStepper(' + interfaceType + ', ' + pinList + ');\n';
  return code;
};

// Setup block for driver mode (Step + Direction)
Arduino.forBlock['accelstepper_setup_driver'] = function(block, generator) {
  // 变量重命名监听
  if (!block._stepperVarMonitorAttached) {
    block._stepperVarMonitorAttached = true;
    block._stepperVarLastName = block.getFieldValue('VAR') || 'stepper';
    const varField = block.getField('VAR');
    if (varField && typeof varField.onRename === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._stepperVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'AccelStepper');
          block._stepperVarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'stepper';
  const pinStep = generator.valueToCode(block, 'PIN_STEP', generator.ORDER_ATOMIC) || '2';
  const pinDir = generator.valueToCode(block, 'PIN_DIR', generator.ORDER_ATOMIC) || '3';

  registerStepperVariable(generator, varName);

  // Driver mode uses interface type 1
  let code = varName + ' = AccelStepper(AccelStepper::DRIVER, ' + pinStep + ', ' + pinDir + ');\n';
  return code;
};

// Move to absolute position
Arduino.forBlock['accelstepper_move_to'] = function(block, generator) {
  const varName = getStepperVarName(block);
  const position = generator.valueToCode(block, 'POSITION', generator.ORDER_ATOMIC) || '0';

  let code = varName + '.moveTo(' + position + ');\n';
  return code;
};

// Move relative steps
Arduino.forBlock['accelstepper_move'] = function(block, generator) {
  const varName = getStepperVarName(block);
  const steps = generator.valueToCode(block, 'STEPS', generator.ORDER_ATOMIC) || '0';

  let code = varName + '.move(' + steps + ');\n';
  return code;
};

// Run one step with acceleration
Arduino.forBlock['accelstepper_run'] = function(block, generator) {
  const varName = getStepperVarName(block);

  let code = varName + '.run();\n';
  return code;
};

// Run one step at constant speed
Arduino.forBlock['accelstepper_run_speed'] = function(block, generator) {
  const varName = getStepperVarName(block);

  let code = varName + '.runSpeed();\n';
  return code;
};

// Stop motor
Arduino.forBlock['accelstepper_stop'] = function(block, generator) {
  const varName = getStepperVarName(block);

  let code = varName + '.stop();\n';
  return code;
};

// Set max speed
Arduino.forBlock['accelstepper_set_max_speed'] = function(block, generator) {
  const varName = getStepperVarName(block);
  const speed = generator.valueToCode(block, 'SPEED', generator.ORDER_ATOMIC) || '1000';

  let code = varName + '.setMaxSpeed(' + speed + ');\n';
  return code;
};

// Set constant speed
Arduino.forBlock['accelstepper_set_speed'] = function(block, generator) {
  const varName = getStepperVarName(block);
  const speed = generator.valueToCode(block, 'SPEED', generator.ORDER_ATOMIC) || '50';

  let code = varName + '.setSpeed(' + speed + ');\n';
  return code;
};

// Get current speed
Arduino.forBlock['accelstepper_get_speed'] = function(block, generator) {
  const varName = getStepperVarName(block);

  let code = varName + '.speed()';
  return [code, generator.ORDER_ATOMIC];
};

// Set acceleration
Arduino.forBlock['accelstepper_set_acceleration'] = function(block, generator) {
  const varName = getStepperVarName(block);
  const accel = generator.valueToCode(block, 'ACCEL', generator.ORDER_ATOMIC) || '100';

  let code = varName + '.setAcceleration(' + accel + ');\n';
  return code;
};

// Get current position
Arduino.forBlock['accelstepper_get_current_position'] = function(block, generator) {
  const varName = getStepperVarName(block);

  let code = varName + '.currentPosition()';
  return [code, generator.ORDER_ATOMIC];
};

// Set current position
Arduino.forBlock['accelstepper_set_current_position'] = function(block, generator) {
  const varName = getStepperVarName(block);
  const position = generator.valueToCode(block, 'POSITION', generator.ORDER_ATOMIC) || '0';

  let code = varName + '.setCurrentPosition(' + position + ');\n';
  return code;
};

// Get distance to go
Arduino.forBlock['accelstepper_distance_to_go'] = function(block, generator) {
  const varName = getStepperVarName(block);

  let code = varName + '.distanceToGo()';
  return [code, generator.ORDER_ATOMIC];
};

// Check if running
Arduino.forBlock['accelstepper_is_running'] = function(block, generator) {
  const varName = getStepperVarName(block);

  let code = varName + '.isRunning()';
  return [code, generator.ORDER_ATOMIC];
};

// Enable outputs
Arduino.forBlock['accelstepper_enable_outputs'] = function(block, generator) {
  const varName = getStepperVarName(block);

  let code = varName + '.enableOutputs();\n';
  return code;
};

// Disable outputs
Arduino.forBlock['accelstepper_disable_outputs'] = function(block, generator) {
  const varName = getStepperVarName(block);

  let code = varName + '.disableOutputs();\n';
  return code;
};

// Run to position (blocking)
Arduino.forBlock['accelstepper_run_to_position'] = function(block, generator) {
  const varName = getStepperVarName(block);

  let code = varName + '.runToPosition();\n';
  return code;
};

// Run to new position (blocking)
Arduino.forBlock['accelstepper_run_to_new_position'] = function(block, generator) {
  const varName = getStepperVarName(block);
  const position = generator.valueToCode(block, 'POSITION', generator.ORDER_ATOMIC) || '0';

  let code = varName + '.runToNewPosition(' + position + ');\n';
  return code;
};

// Run speed to position
Arduino.forBlock['accelstepper_run_speed_to_position'] = function(block, generator) {
  const varName = getStepperVarName(block);

  let code = varName + '.runSpeedToPosition();\n';
  return code;
};

// Set enable pin
Arduino.forBlock['accelstepper_set_enable_pin'] = function(block, generator) {
  const varName = getStepperVarName(block);
  const pin = generator.valueToCode(block, 'PIN', generator.ORDER_ATOMIC) || '255';

  let code = varName + '.setEnablePin(' + pin + ');\n';
  return code;
};

// Register MultiStepper variable
function registerMultiStepperVariable(generator, varName) {
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(varName, 'MultiStepper');
  }
  generator.addLibrary('MultiStepper', '#include <MultiStepper.h>');
  generator.addVariable('MultiStepper ' + varName, 'MultiStepper ' + varName + ';');
}

// Create MultiStepper object
Arduino.forBlock['multistepper_create'] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || 'steppers';

  registerMultiStepperVariable(generator, varName);

  let code = varName + ' = MultiStepper();\n';
  return code;
};

// Add stepper to MultiStepper
Arduino.forBlock['multistepper_add_stepper'] = function(block, generator) {
  const stepperVar = block.getField('STEPPER').getText() || 'stepper';
  const multiVarName = block.getField('VAR').getText() || 'steppers';

  generator.addLibrary('MultiStepper', '#include <MultiStepper.h>');

  let code = multiVarName + '.addStepper(' + stepperVar + ');\n';
  return code;
};

// Move multiple steppers to positions (using array)
Arduino.forBlock['multistepper_move_to'] = function(block, generator) {
  const multiVarName = block.getField('VAR').getText() || 'steppers';
  const positions = generator.valueToCode(block, 'POSITIONS', generator.ORDER_ATOMIC) || '{0}';

  let code = multiVarName + '.moveTo(' + positions + ');\n';
  return code;
};

// Move 2 steppers to positions
Arduino.forBlock['multistepper_move_to_2'] = function(block, generator) {
  // 变量重命名监听
  if (!block._stepperVarMonitorAttached) {
    block._stepperVarMonitorAttached = true;
    block._stepperVarLastName = block.getFieldValue('VAR') || 'steppers';
    const varField = block.getField('VAR');
    if (varField && typeof varField.onRename === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._stepperVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'AccelStepper');
          block._stepperVarLastName = newName;
        }
        return newName;
      });
    }
  }

  const multiVarName = block.getField('VAR').getText() || 'steppers';
  const pos1 = generator.valueToCode(block, 'POS1', generator.ORDER_ATOMIC) || '0';
  const pos2 = generator.valueToCode(block, 'POS2', generator.ORDER_ATOMIC) || '0';

  let code = 'long positions_2[] = {' + pos1 + ', ' + pos2 + '};\n';
  code += multiVarName + '.moveTo(positions_2);\n';
  return code;
};

// Move 3 steppers to positions
Arduino.forBlock['multistepper_move_to_3'] = function(block, generator) {
  const multiVarName = block.getField('VAR').getText() || 'steppers';
  const pos1 = generator.valueToCode(block, 'POS1', generator.ORDER_ATOMIC) || '0';
  const pos2 = generator.valueToCode(block, 'POS2', generator.ORDER_ATOMIC) || '0';
  const pos3 = generator.valueToCode(block, 'POS3', generator.ORDER_ATOMIC) || '0';

  let code = 'long positions_3[] = {' + pos1 + ', ' + pos2 + ', ' + pos3 + '};\n';
  code += multiVarName + '.moveTo(positions_3);\n';
  return code;
};

// Move 4 steppers to positions
Arduino.forBlock['multistepper_move_to_4'] = function(block, generator) {
  const multiVarName = block.getField('VAR').getText() || 'steppers';
  const pos1 = generator.valueToCode(block, 'POS1', generator.ORDER_ATOMIC) || '0';
  const pos2 = generator.valueToCode(block, 'POS2', generator.ORDER_ATOMIC) || '0';
  const pos3 = generator.valueToCode(block, 'POS3', generator.ORDER_ATOMIC) || '0';
  const pos4 = generator.valueToCode(block, 'POS4', generator.ORDER_ATOMIC) || '0';

  let code = 'long positions_4[] = {' + pos1 + ', ' + pos2 + ', ' + pos3 + ', ' + pos4 + '};\n';
  code += multiVarName + '.moveTo(positions_4);\n';
  return code;
};

// Create positions array
Arduino.forBlock['multistepper_positions_array'] = function(block, generator) {
  // const pos1 = generator.valueToCode(block, 'POS1', generator.ORDER_ATOMIC) || '0';
  // const pos2 = generator.valueToCode(block, 'POS2', generator.ORDER_ATOMIC) || '0';
  // const pos3 = generator.valueToCode(block, 'POS3', generator.ORDER_ATOMIC) || '0';
  // const pos4 = generator.valueToCode(block, 'POS4', generator.ORDER_ATOMIC) || '0';

  // let code = '{' + pos1 + ', ' + pos2 + ', ' + pos3 + ', ' + pos4 + '}';
  // 收集所有连接的对象块返回的代码
  let objectValues = [];

  // 遍历所有输入连接（兼容新旧mutator）
  for (let i = 0; i < block.inputList.length; i++) {
    const input = block.inputList[i];
    if (input.type === Blockly.INPUT_VALUE && input.name && input.name.startsWith('INPUT')) {
      const value = generator.valueToCode(block, input.name, Arduino.ORDER_ATOMIC);
      if (value && value !== '""') {
        objectValues.push(value);
      }
    }
  }

  let code = '{' + objectValues.join(', ') + '}';
  
  return [code, generator.ORDER_ATOMIC];
};

// Run one step for multiple steppers
Arduino.forBlock['multistepper_run'] = function(block, generator) {
  const multiVarName = block.getField('VAR').getText() || 'steppers';

  let code = multiVarName + '.run();\n';
  return code;
};

// Run multiple steppers to positions (blocking)
Arduino.forBlock['multistepper_run_speed_to_position'] = function(block, generator) {
  const multiVarName = block.getField('VAR').getText() || 'steppers';

  let code = multiVarName + '.runSpeedToPosition();\n';
  return code;
};
