// _varMonitorAttached: the init field hook below monitors variable renames.
function adafruit_mcp4728EnsureLibrary(generator) {
  generator.addLibrary('adafruit_mcp4728_0', '#include <Adafruit_MCP4728.h>');
}

function adafruit_mcp4728Variable(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'mcp4728');
}

function adafruit_mcp4728AttachVariable(block) {
  if (block._adafruit_mcp4728VariableAttached) return;
  block._adafruit_mcp4728VariableAttached = true;
  block._adafruit_mcp4728LastName = block.getFieldValue('VAR') || 'mcp4728';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._adafruit_mcp4728LastName, 'Adafruit_MCP4728');
  var field = block.getField('VAR');
  if (!field) return;
  var originalFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinish === 'function') originalFinish.call(this, newName);
    if (newName && newName !== block._adafruit_mcp4728LastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._adafruit_mcp4728LastName, newName, 'Adafruit_MCP4728');
      block._adafruit_mcp4728LastName = newName;
    }
  };
}

function adafruit_mcp4728EnsureExtras(generator, varName) {
  // No cached data objects required.
}

Arduino.forBlock['adafruit_mcp4728_init'] = function(block, generator) {
  adafruit_mcp4728AttachVariable(block);
  adafruit_mcp4728EnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'mcp4728';
  var wire = block.getFieldValue('WIRE') || "Wire";
  var addr = block.getFieldValue('ADDR') || "0x60";
  var objectCode = "Adafruit_MCP4728 " + String(varName) + ";";
  generator.addObject('adafruit_mcp4728_object_' + varName, objectCode);
  adafruit_mcp4728EnsureExtras(generator, varName);
  generator.addSetupBegin('adafruit_mcp4728_wire_' + wire, wire + '.begin();');
  var beginCall = String(varName) + ".begin(" + String(addr) + ", &" + String(wire) + ")";
  generator.addSetupBegin('adafruit_mcp4728_begin_' + varName, 'while (!(' + beginCall + ')) { delay(100); }');
  return '';
};

Arduino.forBlock['adafruit_mcp4728_read'] = function(block, generator) {
  adafruit_mcp4728EnsureLibrary(generator);
  var varName = adafruit_mcp4728Variable(block);
  adafruit_mcp4728EnsureExtras(generator, varName);
  var data = block.getFieldValue('DATA') || "value";
  var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  var expressions = {
    "value": String(varName) + ".getChannelValue((MCP4728_channel_t)constrain((int)" + String(index) + ", 0, 3))"
  };
  return [expressions[data] || expressions["value"], generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['adafruit_mcp4728_action'] = function(block, generator) {
  adafruit_mcp4728EnsureLibrary(generator);
  var varName = adafruit_mcp4728Variable(block);
  adafruit_mcp4728EnsureExtras(generator, varName);
  var action = block.getFieldValue('ACTION') || "save";
  var actions = {
    "save": String(varName) + ".saveToEEPROM();"
  };
  return (actions[action] || actions["save"]) + '\n';
};

Arduino.forBlock['adafruit_mcp4728_write'] = function(block, generator) {
  adafruit_mcp4728EnsureLibrary(generator);
  var varName = adafruit_mcp4728Variable(block);
  var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  var value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';
  return String(varName) + ".setChannelValue((MCP4728_channel_t)constrain((int)" + String(index) + ", 0, 3), (uint16_t)constrain((int)" + String(value) + ", 0, 4095));" + '\n';
};
