if (typeof Arduino === 'undefined') var Arduino = {};

// ==================== Init ====================
Arduino.forBlock['stepper_ctrl_init'] = function(block, generator) {
  if (!block._varMonitorAttached) {
    block._varMonitorAttached = true;
    block._varLastName = block.getFieldValue('VAR') || 'stepper1';
    registerVariableToBlockly(block._varLastName, 'StepperController');
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._varLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'StepperController');
          block._varLastName = newName;
        }
      };
    }
  }

  const varName = block.getFieldValue('VAR') || 'stepper1';
  const stepPin = block.getFieldValue('STEP_PIN') || 'PA8';
  const dirPin = block.getFieldValue('DIR_PIN') || 'PA9';
  const speed = generator.valueToCode(block, 'SPEED', generator.ORDER_ATOMIC) || '1000';
  const frontLimit = block.getFieldValue('FRONT_LIMIT_PIN') || 'PA0';
  const backLimit = block.getFieldValue('BACK_LIMIT_PIN') || 'PA1';

  generator.addLibrary('StepperController', '#include <StepperController.h>');
  generator.addObject(varName, 'StepperController ' + varName + ';');

  return varName + '.begin(' + stepPin + ', ' + dirPin + ', ' + speed + ', ' + frontLimit + ', ' + backLimit + ');\n';
};

// ==================== Start ====================
Arduino.forBlock['stepper_ctrl_start'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'stepper1';
  const target = generator.valueToCode(block, 'TARGET', generator.ORDER_ATOMIC) || '800';
  const dir = block.getFieldValue('DIR') || 'FORWARD';

  generator.addLibrary('StepperController', '#include <StepperController.h>');

  let code = varName + '.setTarget(' + target + ');\n';
  code += varName + '.setDirection(' + (dir === 'FORWARD' ? 'true' : 'false') + ');\n';
  code += varName + '.start();\n';
  return code;
};

// ==================== Stop ====================
Arduino.forBlock['stepper_ctrl_stop'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'stepper1';
  return varName + '.stop();\n';
};

// ==================== Set Speed ====================
Arduino.forBlock['stepper_ctrl_set_speed'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'stepper1';
  const speed = generator.valueToCode(block, 'SPEED', generator.ORDER_ATOMIC) || '1000';
  return varName + '.setSpeed(' + speed + ');\n';
};

// ==================== Set RPM ====================
Arduino.forBlock['stepper_ctrl_set_rpm'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'stepper1';
  const rpm = generator.valueToCode(block, 'RPM', generator.ORDER_ATOMIC) || '60';
  const spr = generator.valueToCode(block, 'SPR', generator.ORDER_ATOMIC) || '200';
  return varName + '.setRPM(' + rpm + ', ' + spr + ');\n';
};

// ==================== Set Direction ====================
Arduino.forBlock['stepper_ctrl_set_direction'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'stepper1';
  const dir = block.getFieldValue('DIR') || 'FORWARD';
  return varName + '.setDirection(' + (dir === 'FORWARD' ? 'true' : 'false') + ');\n';
};

// ==================== Tick ====================
Arduino.forBlock['stepper_ctrl_tick'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'stepper1';
  return varName + '.tick();\n';
};

// ==================== Is Running (Value) ====================
Arduino.forBlock['stepper_ctrl_is_running'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'stepper1';
  return [varName + '.isRunning()', generator.ORDER_FUNCTION_CALL];
};

// ==================== Get Steps (Value) ====================
Arduino.forBlock['stepper_ctrl_get_steps'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'stepper1';
  return [varName + '.getSteps()', generator.ORDER_FUNCTION_CALL];
};

// ==================== Reset Steps ====================
Arduino.forBlock['stepper_ctrl_reset_steps'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'stepper1';
  return varName + '.resetSteps();\n';
};

// ==================== Is Front Limit (Value) ====================
Arduino.forBlock['stepper_ctrl_is_front_limit'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'stepper1';
  return [varName + '.isFrontLimit()', generator.ORDER_FUNCTION_CALL];
};

// ==================== Is Back Limit (Value) ====================
Arduino.forBlock['stepper_ctrl_is_back_limit'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'stepper1';
  return [varName + '.isBackLimit()', generator.ORDER_FUNCTION_CALL];
};

// ==================== Event: Target Done (Hat) ====================
Arduino.forBlock['stepper_ctrl_on_target_done'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'stepper1';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = varName + '_on_target_done';

  const functionDef = 'void ' + callbackName + '() {\n' + handlerCode + '}\n';
  generator.addFunction(callbackName, functionDef);

  const setupCode = varName + '.onTargetDone(' + callbackName + ');\n';
  generator.addSetupEnd(callbackName + '_setup', setupCode);

  return '';
};

// ==================== Event: Front Limit (Hat) ====================
Arduino.forBlock['stepper_ctrl_on_front_limit'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'stepper1';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = varName + '_on_front_limit';

  const functionDef = 'void ' + callbackName + '() {\n' + handlerCode + '}\n';
  generator.addFunction(callbackName, functionDef);

  const setupCode = varName + '.onFrontLimit(' + callbackName + ');\n';
  generator.addSetupEnd(callbackName + '_setup', setupCode);

  return '';
};

// ==================== Event: Back Limit (Hat) ====================
Arduino.forBlock['stepper_ctrl_on_back_limit'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'stepper1';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = varName + '_on_back_limit';

  const functionDef = 'void ' + callbackName + '() {\n' + handlerCode + '}\n';
  generator.addFunction(callbackName, functionDef);

  const setupCode = varName + '.onBackLimit(' + callbackName + ');\n';
  generator.addSetupEnd(callbackName + '_setup', setupCode);

  return '';
};
