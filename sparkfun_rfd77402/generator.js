function rfd77402EnsureLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('SparkFun_RFD77402', '#include <SparkFun_RFD77402_Arduino_Library.h>');
}

function rfd77402GetVar(block) {
  var f = block.getField('VAR');
  return f ? f.getText() : (block.getFieldValue('VAR') || 'tof');
}

function rfd77402AttachVar(block) {
  if (block._rfd77402VarAttached) return;
  block._rfd77402VarAttached = true;
  block._rfd77402VarLastName = block.getFieldValue('VAR') || 'tof';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._rfd77402VarLastName, 'RFD77402');
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._rfd77402VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._rfd77402VarLastName, newName, 'RFD77402');
      block._rfd77402VarLastName = newName;
    }
  };
}

Arduino.forBlock['rfd77402_init'] = function(block, generator) {
  rfd77402AttachVar(block);
  rfd77402EnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'tof';
  generator.addVariable(varName, 'RFD77402 ' + varName + ';');
  return 'Wire.begin();\n' + varName + '.begin();\n';
};

Arduino.forBlock['rfd77402_take_measurement'] = function(block, generator) {
  rfd77402EnsureLib(generator);
  return rfd77402GetVar(block) + '.takeMeasurement();\n';
};

Arduino.forBlock['rfd77402_get_distance'] = function(block, generator) {
  rfd77402EnsureLib(generator);
  return [rfd77402GetVar(block) + '.getDistance()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['rfd77402_get_valid_pixels'] = function(block, generator) {
  rfd77402EnsureLib(generator);
  return [rfd77402GetVar(block) + '.getValidPixels()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['rfd77402_get_confidence'] = function(block, generator) {
  rfd77402EnsureLib(generator);
  return [rfd77402GetVar(block) + '.getConfidenceValue()', generator.ORDER_FUNCTION_CALL];
};
