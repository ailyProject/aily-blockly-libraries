function vcnl4040EnsureLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('SparkFun_VCNL4040', '#include <SparkFun_VCNL4040_Arduino_Library.h>');
}

function vcnl4040GetVar(block) {
  var f = block.getField('VAR');
  return f ? f.getText() : (block.getFieldValue('VAR') || 'prox');
}

function vcnl4040AttachVar(block) {
  if (block._vcnl4040VarAttached) return;
  block._vcnl4040VarAttached = true;
  block._vcnl4040VarLastName = block.getFieldValue('VAR') || 'prox';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._vcnl4040VarLastName, 'VCNL4040');
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._vcnl4040VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._vcnl4040VarLastName, newName, 'VCNL4040');
      block._vcnl4040VarLastName = newName;
    }
  };
}

Arduino.forBlock['vcnl4040_init'] = function(block, generator) {
  vcnl4040AttachVar(block);
  vcnl4040EnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'prox';
  generator.addVariable(varName, 'VCNL4040 ' + varName + ';');
  return 'Wire.begin();\n' + varName + '.begin();\n' +
    varName + '.powerOnProximity();\n' +
    varName + '.powerOnAmbient();\n';
};

Arduino.forBlock['vcnl4040_get_proximity'] = function(block, generator) {
  vcnl4040EnsureLib(generator);
  return [vcnl4040GetVar(block) + '.getProximity()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['vcnl4040_get_ambient'] = function(block, generator) {
  vcnl4040EnsureLib(generator);
  return [vcnl4040GetVar(block) + '.getAmbient()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['vcnl4040_get_white'] = function(block, generator) {
  vcnl4040EnsureLib(generator);
  return [vcnl4040GetVar(block) + '.getWhite()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['vcnl4040_power_proximity'] = function(block, generator) {
  vcnl4040EnsureLib(generator);
  var varName = vcnl4040GetVar(block);
  var state = block.getFieldValue('STATE') || 'ON';
  return varName + (state === 'ON' ? '.powerOnProximity()' : '.powerOffProximity()') + ';\n';
};

Arduino.forBlock['vcnl4040_power_ambient'] = function(block, generator) {
  vcnl4040EnsureLib(generator);
  var varName = vcnl4040GetVar(block);
  var state = block.getFieldValue('STATE') || 'ON';
  return varName + (state === 'ON' ? '.powerOnAmbient()' : '.powerOffAmbient()') + ';\n';
};
