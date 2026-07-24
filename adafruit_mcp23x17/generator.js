// _varMonitorAttached: the init field hook below monitors variable renames.
function adafruit_mcp23x17EnsureLibrary(generator) {
  generator.addLibrary('adafruit_mcp23x17_0', '#include <Adafruit_MCP23X17.h>');
}

function adafruit_mcp23x17Variable(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'mcp23x17');
}

function adafruit_mcp23x17AttachVariable(block) {
  if (block._adafruit_mcp23x17VariableAttached) return;
  block._adafruit_mcp23x17VariableAttached = true;
  block._adafruit_mcp23x17LastName = block.getFieldValue('VAR') || 'mcp23x17';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._adafruit_mcp23x17LastName, 'Adafruit_MCP23X17');
  var field = block.getField('VAR');
  if (!field) return;
  var originalFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinish === 'function') originalFinish.call(this, newName);
    if (newName && newName !== block._adafruit_mcp23x17LastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._adafruit_mcp23x17LastName, newName, 'Adafruit_MCP23X17');
      block._adafruit_mcp23x17LastName = newName;
    }
  };
}

function adafruit_mcp23x17EnsureExtras(generator, varName) {
  // No cached data objects required.
}

Arduino.forBlock['adafruit_mcp23x17_init'] = function(block, generator) {
  adafruit_mcp23x17AttachVariable(block);
  adafruit_mcp23x17EnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'mcp23x17';
  var wire = block.getFieldValue('WIRE') || "Wire";
  var addr = block.getFieldValue('ADDR') || "0x20";
  var objectCode = "Adafruit_MCP23X17 " + String(varName) + ";";
  generator.addObject('adafruit_mcp23x17_object_' + varName, objectCode);
  adafruit_mcp23x17EnsureExtras(generator, varName);
  generator.addSetupBegin('adafruit_mcp23x17_wire_' + wire, wire + '.begin();');
  var beginCall = String(varName) + ".begin_I2C(" + String(addr) + ", &" + String(wire) + ")";
  generator.addSetupBegin('adafruit_mcp23x17_begin_' + varName, 'while (!(' + beginCall + ')) { delay(100); }');
  return '';
};

Arduino.forBlock['adafruit_mcp23x17_read'] = function(block, generator) {
  adafruit_mcp23x17EnsureLibrary(generator);
  var varName = adafruit_mcp23x17Variable(block);
  adafruit_mcp23x17EnsureExtras(generator, varName);
  var data = block.getFieldValue('DATA') || "pin";
  var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  var expressions = {
    "pin": "(" + String(varName) + ".pinMode((uint8_t)" + String(index) + ", INPUT), " + String(varName) + ".digitalRead((uint8_t)" + String(index) + "))",
    "all": String(varName) + ".readGPIOAB()"
  };
  return [expressions[data] || expressions["pin"], generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['adafruit_mcp23x17_action'] = function(block, generator) {
  adafruit_mcp23x17EnsureLibrary(generator);
  var varName = adafruit_mcp23x17Variable(block);
  adafruit_mcp23x17EnsureExtras(generator, varName);
  var action = block.getFieldValue('ACTION') || "clear";
  var actions = {
    "clear": String(varName) + ".writeGPIOAB(0);"
  };
  return (actions[action] || actions["clear"]) + '\n';
};

Arduino.forBlock['adafruit_mcp23x17_write'] = function(block, generator) {
  adafruit_mcp23x17EnsureLibrary(generator);
  var varName = adafruit_mcp23x17Variable(block);
  var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  var value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';
  return String(varName) + ".pinMode((uint8_t)" + String(index) + ", OUTPUT); " + String(varName) + ".digitalWrite((uint8_t)" + String(index) + ", (bool)" + String(value) + ");" + '\n';
};
