function ct1780EnsureLib(generator) {
  generator.addLibrary('OneWire', '#include <OneWire.h>');
  generator.addLibrary('DFRobot_CT1780', '#include <DFRobot_CT1780.h>');
}

function ct1780GetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'ct1780');
}

function ct1780Value(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}

function ct1780AttachVar(block) {
  if (block._ct1780VarAttached) return;
  block._ct1780VarAttached = true;
  block._ct1780VarLastName = block.getFieldValue('VAR') || 'ct1780';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._ct1780VarLastName, 'DFRobot_CT1780');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var originalFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinish === 'function') originalFinish.call(this, newName);
    if (newName && newName !== block._ct1780VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._ct1780VarLastName, newName, 'DFRobot_CT1780');
      block._ct1780VarLastName = newName;
    }
  };
}

function ct1780EnsureAddress(generator, varName) {
  generator.addVariable(varName + '_addr', 'uint8_t ' + varName + '_addr[8] = {0};');
}

Arduino.forBlock['ct1780_init'] = function(block, generator) {
  ct1780AttachVar(block);
  ct1780EnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'ct1780';
  var pin = ct1780Value(block, generator, 'PIN', '2');
  ct1780EnsureAddress(generator, varName);
  generator.addObject(varName, 'DFRobot_CT1780 ' + varName + '(' + pin + ');');
  return '';
};

Arduino.forBlock['ct1780_reset_search'] = function(block, generator) {
  ct1780EnsureLib(generator);
  return ct1780GetVar(block) + '.reset_search();\n';
};

Arduino.forBlock['ct1780_search_device'] = function(block, generator) {
  ct1780EnsureLib(generator);
  var varName = ct1780GetVar(block);
  ct1780EnsureAddress(generator, varName);
  return [varName + '.searchDevice(' + varName + '_addr)', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['ct1780_read_temperature'] = function(block, generator) {
  ct1780EnsureLib(generator);
  var varName = ct1780GetVar(block);
  ct1780EnsureAddress(generator, varName);
  return [varName + '.getCelsius(' + varName + '_addr)', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['ct1780_config_addr'] = function(block, generator) {
  ct1780EnsureLib(generator);
  var varName = ct1780GetVar(block);
  ct1780EnsureAddress(generator, varName);
  return [varName + '.getConfigAddr(' + varName + '_addr)', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['ct1780_address_byte'] = function(block, generator) {
  ct1780EnsureLib(generator);
  var varName = ct1780GetVar(block);
  var index = ct1780Value(block, generator, 'INDEX', '0');
  ct1780EnsureAddress(generator, varName);
  return [varName + '_addr[' + index + ']', generator.ORDER_ATOMIC];
};
