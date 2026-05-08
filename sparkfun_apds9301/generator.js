function apds9301EnsureLibrary(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('APDS9301', '#include <SparkFun_APDS9301_Library/Sparkfun_APDS9301_Library.h>');
}

function apds9301GetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'apds9301');
}

function apds9301AttachVar(block) {
  if (block._apds9301VarAttached) return;
  block._apds9301VarAttached = true;
  block._apds9301VarLastName = block.getFieldValue('VAR') || 'apds9301';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._apds9301VarLastName, 'APDS9301');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._apds9301VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._apds9301VarLastName, newName, 'APDS9301');
      block._apds9301VarLastName = newName;
    }
  };
}

function apds9301Value(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}

Arduino.forBlock['apds9301_init'] = function(block, generator) {
  apds9301AttachVar(block);
  apds9301EnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'apds9301';
  var address = block.getFieldValue('ADDRESS') || '0x39';
  generator.addVariable(varName, 'APDS9301 ' + varName + ';');
  generator.addVariable(varName + '_ready', 'bool ' + varName + '_ready = false;');
  return 'Wire.begin();\n' + varName + '_ready = (' + varName + '.begin(' + address + ') == APDS9301::SUCCESS);\n';
};

Arduino.forBlock['apds9301_is_ready'] = function(block, generator) {
  return [apds9301GetVar(block) + '_ready', generator.ORDER_ATOMIC];
};

Arduino.forBlock['apds9301_read_lux'] = function(block, generator) {
  return [apds9301GetVar(block) + '.readLuxLevel()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['apds9301_read_channel'] = function(block, generator) {
  return [apds9301GetVar(block) + '.' + (block.getFieldValue('CHANNEL') || 'readCH0Level') + '()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['apds9301_set_gain'] = function(block) {
  return apds9301GetVar(block) + '.setGain(' + (block.getFieldValue('GAIN') || 'APDS9301::LOW_GAIN') + ');\n';
};

Arduino.forBlock['apds9301_set_integration_time'] = function(block) {
  return apds9301GetVar(block) + '.setIntegrationTime(' + (block.getFieldValue('TIME') || 'APDS9301::INT_TIME_13_7_MS') + ');\n';
};

Arduino.forBlock['apds9301_enable_interrupt'] = function(block) {
  return apds9301GetVar(block) + '.enableInterrupt(' + (block.getFieldValue('STATE') || 'APDS9301::INT_ON') + ');\n';
};

Arduino.forBlock['apds9301_set_threshold'] = function(block, generator) {
  var method = (block.getFieldValue('BOUND') || 'LOW') === 'HIGH' ? 'setHighThreshold' : 'setLowThreshold';
  return apds9301GetVar(block) + '.' + method + '(' + apds9301Value(block, generator, 'THRESHOLD', '1000') + ');\n';
};

Arduino.forBlock['apds9301_power'] = function(block) {
  return apds9301GetVar(block) + '.powerEnable(' + (block.getFieldValue('STATE') || 'APDS9301::POW_ON') + ');\n';
};