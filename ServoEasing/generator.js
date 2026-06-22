'use strict';

function getServoEasingBoardCore() {
  const boardConfig = (typeof window !== 'undefined' && window['boardConfig']) ? window['boardConfig'] : null;
  return boardConfig && boardConfig.core ? String(boardConfig.core).toLowerCase() : '';
}

function isServoEasingESP32Core() {
  return getServoEasingBoardCore().indexOf('esp32') > -1;
}

function ensureServoEasingLibrary(generator) {
  if (isServoEasingESP32Core()) {
    generator.addLibrary('ESP32Servo', '#include <ESP32Servo.h>');
  }
  generator.addLibrary(
    'ServoEasing',
    '#define ENABLE_MIN_AND_MAX_CONSTRAINTS\n#include <ServoEasing.hpp>'
  );
}

function getServoEasingFieldVar(block, name, fallback) {
  const field = block.getField(name);
  if (field && typeof field.getText === 'function') {
    return field.getText() || fallback;
  }
  return block.getFieldValue(name) || fallback;
}

function getServoEasingValue(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}

function registerServoEasingObject(generator, varName) {
  ensureServoEasingLibrary(generator);
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(varName, 'ServoEasing');
  }
  generator.addObject('ServoEasing ' + varName, 'ServoEasing ' + varName + ';');
}

function attachServoEasingVarMonitor(block) {
  if (block._servoEasingVarMonitorAttached) return;
  block._servoEasingVarMonitorAttached = true;
  block._servoEasingVarLastName = block.getFieldValue('VAR') || 'servoEase';

  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._servoEasingVarLastName, 'ServoEasing');
  }

  const varField = block.getField('VAR');
  if (!varField) return;

  const originalFinishEditing = varField.onFinishEditing_;
  varField.onFinishEditing_ = function(newName) {
    if (typeof originalFinishEditing === 'function') {
      originalFinishEditing.call(this, newName);
    }
    const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
    const oldName = block._servoEasingVarLastName;
    if (
      workspace &&
      newName &&
      newName !== oldName &&
      typeof renameVariableInBlockly === 'function'
    ) {
      renameVariableInBlockly(block, oldName, newName, 'ServoEasing');
      block._servoEasingVarLastName = newName;
    }
  };
}

function sanitizeServoEasingName(value) {
  return String(value || 'servo')
    .replace(/[^A-Za-z0-9_]/g, '_')
    .replace(/^[0-9]/, '_$&');
}

function getServoEasingVar(block, generator) {
  const varName = getServoEasingFieldVar(block, 'VAR', 'servoEase');
  registerServoEasingObject(generator, varName);
  return varName;
}

Arduino.forBlock['servoeasing_create'] = function(block, generator) {
  attachServoEasingVarMonitor(block);
  const varName = block.getFieldValue('VAR') || 'servoEase';
  const pin = block.getFieldValue('PIN') || '9';
  const initial = getServoEasingValue(block, generator, 'INITIAL', '90');

  registerServoEasingObject(generator, varName);
  return varName + '.attach(' + pin + ', ' + initial + ');\n';
};

Arduino.forBlock['servoeasing_create_custom'] = function(block, generator) {
  attachServoEasingVarMonitor(block);
  const varName = block.getFieldValue('VAR') || 'servoEase';
  const pin = block.getFieldValue('PIN') || '9';
  const initial = getServoEasingValue(block, generator, 'INITIAL', '90');
  const lowUs = getServoEasingValue(block, generator, 'LOW_US', '544');
  const highUs = getServoEasingValue(block, generator, 'HIGH_US', '2400');
  const lowDegree = getServoEasingValue(block, generator, 'LOW_DEGREE', '0');
  const highDegree = getServoEasingValue(block, generator, 'HIGH_DEGREE', '180');

  registerServoEasingObject(generator, varName);
  return varName + '.attach(' + pin + ', ' + initial + ', ' + lowUs + ', ' + highUs + ', ' + lowDegree + ', ' + highDegree + ');\n';
};

Arduino.forBlock['servoeasing_set_easing'] = function(block, generator) {
  const varName = getServoEasingVar(block, generator);
  const easing = block.getFieldValue('EASING') || 'EASE_LINEAR';
  return varName + '.setEasingType(' + easing + ');\n';
};

Arduino.forBlock['servoeasing_set_speed'] = function(block, generator) {
  const varName = getServoEasingVar(block, generator);
  const speed = getServoEasingValue(block, generator, 'SPEED', '40');
  return varName + '.setSpeed(' + speed + ');\n';
};

Arduino.forBlock['servoeasing_write'] = function(block, generator) {
  const varName = getServoEasingVar(block, generator);
  const target = getServoEasingValue(block, generator, 'TARGET', '90');
  return varName + '.write(' + target + ');\n';
};

Arduino.forBlock['servoeasing_ease_to'] = function(block, generator) {
  const varName = getServoEasingVar(block, generator);
  const target = getServoEasingValue(block, generator, 'TARGET', '90');
  const speed = getServoEasingValue(block, generator, 'SPEED', '40');
  return varName + '.easeTo(' + target + ', ' + speed + ');\n';
};

Arduino.forBlock['servoeasing_ease_to_duration'] = function(block, generator) {
  const varName = getServoEasingVar(block, generator);
  const target = getServoEasingValue(block, generator, 'TARGET', '90');
  const duration = getServoEasingValue(block, generator, 'DURATION', '1000');
  return varName + '.easeToD(' + target + ', ' + duration + ');\n';
};

Arduino.forBlock['servoeasing_start_ease_to'] = function(block, generator) {
  const varName = getServoEasingVar(block, generator);
  const target = getServoEasingValue(block, generator, 'TARGET', '90');
  const speed = getServoEasingValue(block, generator, 'SPEED', '40');
  const updateMode = block.getFieldValue('UPDATE') || 'START_UPDATE_BY_INTERRUPT';
  return varName + '.startEaseTo(' + target + ', ' + speed + ', ' + updateMode + ');\n';
};

Arduino.forBlock['servoeasing_start_ease_to_duration'] = function(block, generator) {
  const varName = getServoEasingVar(block, generator);
  const target = getServoEasingValue(block, generator, 'TARGET', '90');
  const duration = getServoEasingValue(block, generator, 'DURATION', '1000');
  const updateMode = block.getFieldValue('UPDATE') || 'START_UPDATE_BY_INTERRUPT';
  return varName + '.startEaseToD(' + target + ', ' + duration + ', ' + updateMode + ');\n';
};

Arduino.forBlock['servoeasing_update'] = function(block, generator) {
  const varName = getServoEasingVar(block, generator);
  return [varName + '.update()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['servoeasing_is_moving'] = function(block, generator) {
  const varName = getServoEasingVar(block, generator);
  return [varName + '.isMoving()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['servoeasing_read'] = function(block, generator) {
  const varName = getServoEasingVar(block, generator);
  return [varName + '.read()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['servoeasing_current_microseconds'] = function(block, generator) {
  const varName = getServoEasingVar(block, generator);
  return [varName + '.getCurrentMicroseconds()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['servoeasing_get_speed'] = function(block, generator) {
  const varName = getServoEasingVar(block, generator);
  return [varName + '.getSpeed()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['servoeasing_get_move_duration'] = function(block, generator) {
  const varName = getServoEasingVar(block, generator);
  return [varName + '.getMillisForCompleteMove()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['servoeasing_stop'] = function(block, generator) {
  const varName = getServoEasingVar(block, generator);
  return varName + '.stop();\n';
};

Arduino.forBlock['servoeasing_pause'] = function(block, generator) {
  const varName = getServoEasingVar(block, generator);
  return varName + '.pause();\n';
};

Arduino.forBlock['servoeasing_resume'] = function(block, generator) {
  const varName = getServoEasingVar(block, generator);
  const mode = block.getFieldValue('MODE') || 'INTERRUPTS';
  const method = mode === 'MANUAL' ? 'resumeWithoutInterrupts' : 'resumeWithInterrupts';
  return varName + '.' + method + '();\n';
};

Arduino.forBlock['servoeasing_detach'] = function(block, generator) {
  const varName = getServoEasingVar(block, generator);
  return varName + '.detach();\n';
};

Arduino.forBlock['servoeasing_reattach'] = function(block, generator) {
  const varName = getServoEasingVar(block, generator);
  return varName + '.reattach();\n';
};

Arduino.forBlock['servoeasing_set_trim'] = function(block, generator) {
  const varName = getServoEasingVar(block, generator);
  const trim = getServoEasingValue(block, generator, 'TRIM', '0');
  const writeNow = block.getFieldValue('WRITE_NOW') === 'TRUE' ? 'true' : 'false';
  return varName + '.setTrim(' + trim + ', ' + writeNow + ');\n';
};

Arduino.forBlock['servoeasing_set_reverse'] = function(block, generator) {
  const varName = getServoEasingVar(block, generator);
  const enabled = block.getFieldValue('ENABLE') === 'TRUE' ? 'true' : 'false';
  return varName + '.setReverseOperation(' + enabled + ');\n';
};

Arduino.forBlock['servoeasing_set_min_max'] = function(block, generator) {
  const varName = getServoEasingVar(block, generator);
  const minimum = getServoEasingValue(block, generator, 'MINIMUM', '0');
  const maximum = getServoEasingValue(block, generator, 'MAXIMUM', '180');
  return varName + '.setMinMaxConstraint(' + minimum + ', ' + maximum + ');\n';
};

Arduino.forBlock['servoeasing_on_reached'] = function(block, generator) {
  const varName = getServoEasingVar(block, generator);
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = 'servoeasing_reached_' + sanitizeServoEasingName(varName);
  const functionDef = 'void ' + callbackName + '(ServoEasing *servo) {\n' + handlerCode + '}\n';
  const setupCode = varName + '.setTargetPositionReachedHandler(' + callbackName + ');';

  generator.addFunction(callbackName, functionDef);
  generator.addSetupEnd('servoeasing_reached_' + varName, setupCode);
  return '';
};

Arduino.forBlock['servoeasing_all_set_easing'] = function(block, generator) {
  ensureServoEasingLibrary(generator);
  const easing = block.getFieldValue('EASING') || 'EASE_LINEAR';
  return 'setEasingTypeForAllServos(' + easing + ');\n';
};

Arduino.forBlock['servoeasing_all_set_speed'] = function(block, generator) {
  ensureServoEasingLibrary(generator);
  const speed = getServoEasingValue(block, generator, 'SPEED', '40');
  return 'setSpeedForAllServos(' + speed + ');\n';
};

Arduino.forBlock['servoeasing_all_set_targets_2'] = function(block, generator) {
  ensureServoEasingLibrary(generator);
  const target1 = getServoEasingValue(block, generator, 'TARGET1', '45');
  const target2 = getServoEasingValue(block, generator, 'TARGET2', '135');
  return 'setFloatDegreeForAllServos(2, ' + target1 + ', ' + target2 + ');\n';
};

Arduino.forBlock['servoeasing_all_set_targets_3'] = function(block, generator) {
  ensureServoEasingLibrary(generator);
  const target1 = getServoEasingValue(block, generator, 'TARGET1', '45');
  const target2 = getServoEasingValue(block, generator, 'TARGET2', '90');
  const target3 = getServoEasingValue(block, generator, 'TARGET3', '135');
  return 'setFloatDegreeForAllServos(3, ' + target1 + ', ' + target2 + ', ' + target3 + ');\n';
};

Arduino.forBlock['servoeasing_all_set_targets_4'] = function(block, generator) {
  ensureServoEasingLibrary(generator);
  const target1 = getServoEasingValue(block, generator, 'TARGET1', '45');
  const target2 = getServoEasingValue(block, generator, 'TARGET2', '90');
  const target3 = getServoEasingValue(block, generator, 'TARGET3', '135');
  const target4 = getServoEasingValue(block, generator, 'TARGET4', '180');
  return 'setFloatDegreeForAllServos(4, ' + target1 + ', ' + target2 + ', ' + target3 + ', ' + target4 + ');\n';
};

Arduino.forBlock['servoeasing_all_start_synchronized'] = function(block, generator) {
  ensureServoEasingLibrary(generator);
  const speed = getServoEasingValue(block, generator, 'SPEED', '40');
  return 'setEaseToForAllServosSynchronizeAndStartInterrupt(' + speed + ');\n';
};

Arduino.forBlock['servoeasing_all_wait_synchronized'] = function(block, generator) {
  ensureServoEasingLibrary(generator);
  const speed = getServoEasingValue(block, generator, 'SPEED', '40');
  return 'setEaseToForAllServosSynchronizeAndWaitForAllServosToStop(' + speed + ');\n';
};

Arduino.forBlock['servoeasing_all_update'] = function(block, generator) {
  ensureServoEasingLibrary(generator);
  return ['updateAllServos()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['servoeasing_all_is_moving'] = function(block, generator) {
  ensureServoEasingLibrary(generator);
  return ['isOneServoMoving()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['servoeasing_all_stop'] = function(block, generator) {
  ensureServoEasingLibrary(generator);
  return 'stopAllServos();\n';
};
