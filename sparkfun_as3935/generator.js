function as3935EnsureLibrary(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('SPI', '#include <SPI.h>');
  generator.addLibrary('AS3935', '#include <SparkFun_AS3935_Lightning_Detector_Arduino_Library/SparkFun_AS3935.h>');
}

function as3935GetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'as3935');
}

function as3935AttachVar(block) {
  if (block._as3935VarAttached) return;
  block._as3935VarAttached = true;
  block._as3935VarLastName = block.getFieldValue('VAR') || 'as3935';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._as3935VarLastName, 'SparkFun_AS3935');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._as3935VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._as3935VarLastName, newName, 'SparkFun_AS3935');
      block._as3935VarLastName = newName;
    }
  };
}

function as3935Value(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}

Arduino.forBlock['as3935_init_i2c'] = function(block, generator) {
  as3935AttachVar(block);
  as3935EnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'as3935';
  var address = block.getFieldValue('ADDRESS') || '0x03';
  generator.addVariable(varName, 'SparkFun_AS3935 ' + varName + '(' + address + ');');
  generator.addVariable(varName + '_ready', 'bool ' + varName + '_ready = false;');
  return 'Wire.begin();\n' + varName + '_ready = ' + varName + '.begin(Wire);\n';
};

Arduino.forBlock['as3935_init_spi'] = function(block, generator) {
  as3935AttachVar(block);
  as3935EnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'as3935';
  var cs = block.getFieldValue('CS') || '10';
  generator.addVariable(varName, 'SparkFun_AS3935 ' + varName + ';');
  generator.addVariable(varName + '_ready', 'bool ' + varName + '_ready = false;');
  return 'SPI.begin();\n' + varName + '_ready = ' + varName + '.beginSPI(' + cs + ');\n';
};

Arduino.forBlock['as3935_is_ready'] = function(block, generator) {
  return [as3935GetVar(block) + '_ready', generator.ORDER_ATOMIC];
};

Arduino.forBlock['as3935_set_environment'] = function(block) {
  return as3935GetVar(block) + '.setIndoorOutdoor(' + (block.getFieldValue('ENV') || 'INDOOR') + ');\n';
};

Arduino.forBlock['as3935_read_interrupt'] = function(block, generator) {
  return [as3935GetVar(block) + '.readInterruptReg()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['as3935_distance'] = function(block, generator) {
  return [as3935GetVar(block) + '.distanceToStorm()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['as3935_energy'] = function(block, generator) {
  return [as3935GetVar(block) + '.lightningEnergy()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['as3935_set_watchdog'] = function(block, generator) {
  return as3935GetVar(block) + '.watchdogThreshold(' + as3935Value(block, generator, 'VALUE', '2') + ');\n';
};

Arduino.forBlock['as3935_set_noise'] = function(block, generator) {
  return as3935GetVar(block) + '.setNoiseLevel(' + as3935Value(block, generator, 'VALUE', '2') + ');\n';
};

Arduino.forBlock['as3935_set_spike'] = function(block, generator) {
  return as3935GetVar(block) + '.spikeRejection(' + as3935Value(block, generator, 'VALUE', '2') + ');\n';
};

Arduino.forBlock['as3935_set_lightning_threshold'] = function(block) {
  return as3935GetVar(block) + '.lightningThreshold(' + (block.getFieldValue('STRIKES') || '1') + ');\n';
};

Arduino.forBlock['as3935_mask_disturber'] = function(block) {
  return as3935GetVar(block) + '.maskDisturber(' + (block.getFieldValue('STATE') || 'true') + ');\n';
};

Arduino.forBlock['as3935_calibrate'] = function(block) {
  return as3935GetVar(block) + '.calibrateOsc();\n';
};