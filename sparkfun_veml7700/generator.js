function veml7700EnsureLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('SparkFun_Toolkit', '#include <SparkFun_Toolkit.h>');
  generator.addLibrary('SparkFun_VEML7700', '#include <SparkFun_VEML7700_Arduino_Library.h>');
}

function veml7700GetVar(block) {
  var f = block.getField('VAR');
  return f ? f.getText() : (block.getFieldValue('VAR') || 'als');
}

function veml7700AttachVar(block) {
  if (block._veml7700VarAttached) return;
  block._veml7700VarAttached = true;
  block._veml7700VarLastName = block.getFieldValue('VAR') || 'als';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._veml7700VarLastName, 'SparkFunVEML7700');
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._veml7700VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._veml7700VarLastName, newName, 'SparkFunVEML7700');
      block._veml7700VarLastName = newName;
    }
  };
}

Arduino.forBlock['veml7700_init'] = function(block, generator) {
  veml7700AttachVar(block);
  veml7700EnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'als';
  generator.addVariable(varName, 'SparkFunVEML7700 ' + varName + ';');
  return 'Wire.begin();\n' + varName + '.begin();\n';
};

Arduino.forBlock['veml7700_get_lux'] = function(block, generator) {
  veml7700EnsureLib(generator);
  return [veml7700GetVar(block) + '.getLux()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['veml7700_get_ambient'] = function(block, generator) {
  veml7700EnsureLib(generator);
  return [veml7700GetVar(block) + '.getAmbientLight()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['veml7700_get_white'] = function(block, generator) {
  veml7700EnsureLib(generator);
  return [veml7700GetVar(block) + '.getWhiteLevel()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['veml7700_power'] = function(block, generator) {
  veml7700EnsureLib(generator);
  var varName = veml7700GetVar(block);
  var state = block.getFieldValue('STATE') || 'ON';
  return varName + (state === 'ON' ? '.powerOn()' : '.shutdown()') + ';\n';
};
