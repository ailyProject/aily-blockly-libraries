function dmxEnsureLibrary(generator) {
  generator.addLibrary('SparkFunDMX', '#include <SparkFunDMX/SparkFunDMX.h>');
}

function dmxGetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'dmx');
}

function dmxAttachVar(block) {
  if (block._dmxVarAttached) return;
  block._dmxVarAttached = true;
  block._dmxVarLastName = block.getFieldValue('VAR') || 'dmx';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._dmxVarLastName, 'SparkFunDMX');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._dmxVarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._dmxVarLastName, newName, 'SparkFunDMX');
      block._dmxVarLastName = newName;
    }
  };
}

function dmxValue(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}

Arduino.forBlock['dmx_init'] = function(block, generator) {
  dmxAttachVar(block);
  dmxEnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'dmx';
  var uart = block.getFieldValue('UART') || '2';
  var enPin = dmxValue(block, generator, 'EN', '21');
  var channels = dmxValue(block, generator, 'CHANNELS', '1');
  var dir = block.getFieldValue('DIR') || 'DMX_WRITE_DIR';
  var serialName = varName + 'Serial';
  generator.addVariable(varName, 'SparkFunDMX ' + varName + ';');
  generator.addVariable(serialName, 'HardwareSerial ' + serialName + '(' + uart + ');');
  return serialName + '.begin(DMX_BAUD, DMX_FORMAT);\n' + varName + '.begin(' + serialName + ', ' + enPin + ', ' + channels + ');\n' + varName + '.setComDir(' + dir + ');\n';
};

Arduino.forBlock['dmx_set_dir'] = function(block) {
  return dmxGetVar(block) + '.setComDir(' + (block.getFieldValue('DIR') || 'DMX_WRITE_DIR') + ');\n';
};

Arduino.forBlock['dmx_write_byte'] = function(block, generator) {
  dmxEnsureLibrary(generator);
  var channel = dmxValue(block, generator, 'CHANNEL', '1');
  var value = dmxValue(block, generator, 'VALUE', '0');
  return dmxGetVar(block) + '.writeByte((uint8_t)constrain(' + value + ', 0, 255), ' + channel + ');\n';
};

Arduino.forBlock['dmx_read_byte'] = function(block, generator) {
  dmxEnsureLibrary(generator);
  var channel = dmxValue(block, generator, 'CHANNEL', '1');
  return [dmxGetVar(block) + '.readByte(' + channel + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['dmx_data_available'] = function(block, generator) {
  dmxEnsureLibrary(generator);
  return [dmxGetVar(block) + '.dataAvailable()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['dmx_update'] = function(block) {
  return dmxGetVar(block) + '.update();\n';
};

Arduino.forBlock['dmx_update_ok'] = function(block, generator) {
  return [dmxGetVar(block) + '.update()', generator.ORDER_FUNCTION_CALL];
};