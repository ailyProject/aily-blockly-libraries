function hapticDA7280EnsureLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('Haptic_Driver', '#include <Haptic_Driver.h>');
}

function hapticDA7280GetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'haptic');
}

function hapticDA7280AttachVar(block) {
  if (block._hapticVarAttached) return;
  block._hapticVarAttached = true;
  block._hapticVarLastName = block.getFieldValue('VAR') || 'haptic';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._hapticVarLastName, 'HapticDA7280');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._hapticVarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._hapticVarLastName, newName, 'HapticDA7280');
      block._hapticVarLastName = newName;
    }
  };
}

Arduino.forBlock['haptic_da7280_init'] = function(block, generator) {
  hapticDA7280AttachVar(block);
  hapticDA7280EnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'haptic';
  var motorType = block.getFieldValue('MOTOR_TYPE') || '0';
  generator.addVariable(varName, 'Haptic_Driver ' + varName + ';');
  return varName + '.begin();\n' +
         varName + '.setActuatorType(' + motorType + ');\n' +
         varName + '.setOperationMode(DRO_MODE);\n' +
         varName + '.defaultMotor();\n';
};

Arduino.forBlock['haptic_da7280_set_mode'] = function(block, generator) {
  hapticDA7280EnsureLib(generator);
  var varName = hapticDA7280GetVar(block);
  var mode = block.getFieldValue('MODE') || '1';
  return varName + '.setOperationMode(' + mode + ');\n';
};

Arduino.forBlock['haptic_da7280_enable_accel'] = function(block, generator) {
  hapticDA7280EnsureLib(generator);
  var varName = hapticDA7280GetVar(block);
  var state = block.getFieldValue('STATE') || 'true';
  return varName + '.enableAcceleration(' + state + ');\n';
};
