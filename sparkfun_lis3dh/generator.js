function lis3dhEnsureLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('SparkFunLIS3DH', '#include <SparkFunLIS3DH.h>');
}

function lis3dhGetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'accel');
}

function lis3dhAttachVar(block) {
  if (block._lis3dhVarAttached) return;
  block._lis3dhVarAttached = true;
  block._lis3dhVarLastName = block.getFieldValue('VAR') || 'accel';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._lis3dhVarLastName, 'LIS3DH');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._lis3dhVarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._lis3dhVarLastName, newName, 'LIS3DH');
      block._lis3dhVarLastName = newName;
    }
  };
}

Arduino.forBlock['lis3dh_init'] = function(block, generator) {
  lis3dhAttachVar(block);
  lis3dhEnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'accel';
  var addr = block.getFieldValue('ADDR') || '0x19';
  generator.addVariable(varName, 'LIS3DH ' + varName + '(I2C_MODE, ' + addr + ');');
  return varName + '.begin();\n';
};

Arduino.forBlock['lis3dh_read_accel_x'] = function(block, generator) {
  lis3dhEnsureLib(generator);
  return [lis3dhGetVar(block) + '.readFloatAccelX()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['lis3dh_read_accel_y'] = function(block, generator) {
  lis3dhEnsureLib(generator);
  return [lis3dhGetVar(block) + '.readFloatAccelY()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['lis3dh_read_accel_z'] = function(block, generator) {
  lis3dhEnsureLib(generator);
  return [lis3dhGetVar(block) + '.readFloatAccelZ()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['lis3dh_set_range'] = function(block, generator) {
  lis3dhEnsureLib(generator);
  var varName = lis3dhGetVar(block);
  var range = block.getFieldValue('RANGE') || '2';
  return varName + '.settings.accelRange = ' + range + ';\n' +
         varName + '.applySettings();\n';
};

Arduino.forBlock['lis3dh_set_sample_rate'] = function(block, generator) {
  lis3dhEnsureLib(generator);
  var varName = lis3dhGetVar(block);
  var rate = block.getFieldValue('RATE') || '25';
  return varName + '.settings.accelSampleRate = ' + rate + ';\n' +
         varName + '.applySettings();\n';
};
