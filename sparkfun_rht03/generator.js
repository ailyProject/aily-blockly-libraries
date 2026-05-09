function rht03EnsureLib(generator) {
  generator.addLibrary('SparkFun_RHT03', '#include <SparkFun_RHT03.h>');
}

function rht03GetVar(block) {
  var f = block.getField('VAR');
  return f ? f.getText() : (block.getFieldValue('VAR') || 'rht');
}

function rht03AttachVar(block) {
  if (block._rht03VarAttached) return;
  block._rht03VarAttached = true;
  block._rht03VarLastName = block.getFieldValue('VAR') || 'rht';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._rht03VarLastName, 'RHT03');
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._rht03VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._rht03VarLastName, newName, 'RHT03');
      block._rht03VarLastName = newName;
    }
  };
}

Arduino.forBlock['rht03_init'] = function(block, generator) {
  rht03AttachVar(block);
  rht03EnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'rht';
  var pin = block.getFieldValue('PIN');
  generator.addVariable(varName, 'RHT03 ' + varName + ';');
  return varName + '.begin(' + pin + ');\n';
};

Arduino.forBlock['rht03_update'] = function(block, generator) {
  rht03EnsureLib(generator);
  return [rht03GetVar(block) + '.update()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['rht03_temp_c'] = function(block, generator) {
  rht03EnsureLib(generator);
  return [rht03GetVar(block) + '.tempC()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['rht03_temp_f'] = function(block, generator) {
  rht03EnsureLib(generator);
  return [rht03GetVar(block) + '.tempF()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['rht03_humidity'] = function(block, generator) {
  rht03EnsureLib(generator);
  return [rht03GetVar(block) + '.humidity()', generator.ORDER_FUNCTION_CALL];
};
