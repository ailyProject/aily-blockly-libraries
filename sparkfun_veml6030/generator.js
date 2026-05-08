function veml6030EnsureLibrary(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('VEML6030', '#include <SparkFun_VEML6030_Ambient_Light_Sensor.h>');
}

function veml6030GetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'veml6030');
}

function veml6030AttachVar(block) {
  if (block._veml6030VarAttached) return;
  block._veml6030VarAttached = true;
  block._veml6030VarLastName = block.getFieldValue('VAR') || 'veml6030';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._veml6030VarLastName, 'SparkFun_Ambient_Light');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._veml6030VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._veml6030VarLastName, newName, 'SparkFun_Ambient_Light');
      block._veml6030VarLastName = newName;
    }
  };
}

function veml6030Value(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}

Arduino.forBlock['veml6030_init'] = function(block, generator) {
  veml6030AttachVar(block);
  veml6030EnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'veml6030';
  var address = block.getFieldValue('ADDRESS') || '0x48';
  generator.addVariable(varName, 'SparkFun_Ambient_Light ' + varName + '(' + address + ');');
  generator.addVariable(varName + '_ready', 'bool ' + varName + '_ready = false;');
  return 'Wire.begin();\n' + varName + '_ready = ' + varName + '.begin(Wire);\n';
};

Arduino.forBlock['veml6030_is_ready'] = function(block, generator) {
  return [veml6030GetVar(block) + '_ready', generator.ORDER_ATOMIC];
};

Arduino.forBlock['veml6030_read_light'] = function(block, generator) {
  return [veml6030GetVar(block) + '.readLight()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['veml6030_read_white'] = function(block, generator) {
  return [veml6030GetVar(block) + '.readWhiteLight()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['veml6030_set_gain'] = function(block) {
  return veml6030GetVar(block) + '.setGain(' + (block.getFieldValue('GAIN') || '0.125') + ');\n';
};

Arduino.forBlock['veml6030_set_integration_time'] = function(block) {
  return veml6030GetVar(block) + '.setIntegTime(' + (block.getFieldValue('TIME') || '100') + ');\n';
};

Arduino.forBlock['veml6030_set_interrupt_threshold'] = function(block, generator) {
  var method = (block.getFieldValue('BOUND') || 'LOW') === 'HIGH' ? 'setIntHighThresh' : 'setIntLowThresh';
  return veml6030GetVar(block) + '.' + method + '(' + veml6030Value(block, generator, 'LUX', '1000') + ');\n';
};

Arduino.forBlock['veml6030_enable_interrupt'] = function(block) {
  var method = (block.getFieldValue('STATE') || 'ENABLE') === 'ENABLE' ? 'enableInt' : 'disableInt';
  return veml6030GetVar(block) + '.' + method + '();\n';
};

Arduino.forBlock['veml6030_read_interrupt'] = function(block, generator) {
  return [veml6030GetVar(block) + '.readInterrupt()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['veml6030_power'] = function(block) {
  var method = (block.getFieldValue('STATE') || 'ON') === 'ON' ? 'powerOn' : 'shutDown';
  return veml6030GetVar(block) + '.' + method + '();\n';
};