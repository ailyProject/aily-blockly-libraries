function veml6075EnsureLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('SparkFun_VEML6075', '#include <SparkFun_VEML6075_Arduino_Library.h>');
}

function veml6075GetVar(block) {
  var f = block.getField('VAR');
  return f ? f.getText() : (block.getFieldValue('VAR') || 'uv');
}

function veml6075AttachVar(block) {
  if (block._veml6075VarAttached) return;
  block._veml6075VarAttached = true;
  block._veml6075VarLastName = block.getFieldValue('VAR') || 'uv';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._veml6075VarLastName, 'VEML6075');
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._veml6075VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._veml6075VarLastName, newName, 'VEML6075');
      block._veml6075VarLastName = newName;
    }
  };
}

Arduino.forBlock['veml6075_init'] = function(block, generator) {
  veml6075AttachVar(block);
  veml6075EnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'uv';
  generator.addVariable(varName, 'VEML6075 ' + varName + ';');
  return 'Wire.begin();\n' + varName + '.begin();\n';
};

Arduino.forBlock['veml6075_uva'] = function(block, generator) {
  veml6075EnsureLib(generator);
  return [veml6075GetVar(block) + '.uva()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['veml6075_uvb'] = function(block, generator) {
  veml6075EnsureLib(generator);
  return [veml6075GetVar(block) + '.uvb()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['veml6075_index'] = function(block, generator) {
  veml6075EnsureLib(generator);
  return [veml6075GetVar(block) + '.index()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['veml6075_raw_uva'] = function(block, generator) {
  veml6075EnsureLib(generator);
  return [veml6075GetVar(block) + '.rawUva()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['veml6075_raw_uvb'] = function(block, generator) {
  veml6075EnsureLib(generator);
  return [veml6075GetVar(block) + '.rawUvb()', generator.ORDER_FUNCTION_CALL];
};
