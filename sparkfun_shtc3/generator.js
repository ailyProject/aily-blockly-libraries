function shtc3EnsureLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('SparkFun_SHTC3', '#include <SparkFun_SHTC3.h>');
}

function shtc3GetVar(block) {
  var f = block.getField('VAR');
  return f ? f.getText() : (block.getFieldValue('VAR') || 'shtc3');
}

function shtc3AttachVar(block) {
  if (block._shtc3VarAttached) return;
  block._shtc3VarAttached = true;
  block._shtc3VarLastName = block.getFieldValue('VAR') || 'shtc3';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._shtc3VarLastName, 'SHTC3');
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._shtc3VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._shtc3VarLastName, newName, 'SHTC3');
      block._shtc3VarLastName = newName;
    }
  };
}

Arduino.forBlock['shtc3_init'] = function(block, generator) {
  shtc3AttachVar(block);
  shtc3EnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'shtc3';
  generator.addVariable(varName, 'SHTC3 ' + varName + ';');
  return 'Wire.begin();\n' + varName + '.begin();\n';
};

Arduino.forBlock['shtc3_update'] = function(block, generator) {
  shtc3EnsureLib(generator);
  return shtc3GetVar(block) + '.update();\n';
};

Arduino.forBlock['shtc3_temp_c'] = function(block, generator) {
  shtc3EnsureLib(generator);
  return [shtc3GetVar(block) + '.toDegC()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['shtc3_temp_f'] = function(block, generator) {
  shtc3EnsureLib(generator);
  return [shtc3GetVar(block) + '.toDegF()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['shtc3_humidity'] = function(block, generator) {
  shtc3EnsureLib(generator);
  return [shtc3GetVar(block) + '.toPercent()', generator.ORDER_FUNCTION_CALL];
};
