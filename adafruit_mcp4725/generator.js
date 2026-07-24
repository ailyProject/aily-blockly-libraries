// _varMonitorAttached: the init field hook below monitors variable renames.
function adafruit_mcp4725EnsureLibrary(generator) {
  generator.addLibrary('adafruit_mcp4725_0', '#include <Adafruit_MCP4725.h>');
}

function adafruit_mcp4725Variable(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'mcp4725');
}

function adafruit_mcp4725AttachVariable(block) {
  if (block._adafruit_mcp4725VariableAttached) return;
  block._adafruit_mcp4725VariableAttached = true;
  block._adafruit_mcp4725LastName = block.getFieldValue('VAR') || 'mcp4725';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._adafruit_mcp4725LastName, 'Adafruit_MCP4725');
  var field = block.getField('VAR');
  if (!field) return;
  var originalFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinish === 'function') originalFinish.call(this, newName);
    if (newName && newName !== block._adafruit_mcp4725LastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._adafruit_mcp4725LastName, newName, 'Adafruit_MCP4725');
      block._adafruit_mcp4725LastName = newName;
    }
  };
}

function adafruit_mcp4725EnsureExtras(generator, varName) {
  // No cached data objects required.
}

Arduino.forBlock['adafruit_mcp4725_init'] = function(block, generator) {
  adafruit_mcp4725AttachVariable(block);
  adafruit_mcp4725EnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'mcp4725';
  var wire = block.getFieldValue('WIRE') || "Wire";
  var addr = block.getFieldValue('ADDR') || "0x60";
  var objectCode = "Adafruit_MCP4725 " + String(varName) + ";";
  generator.addObject('adafruit_mcp4725_object_' + varName, objectCode);
  adafruit_mcp4725EnsureExtras(generator, varName);
  generator.addSetupBegin('adafruit_mcp4725_wire_' + wire, wire + '.begin();');
  var beginCall = String(varName) + ".begin(" + String(addr) + ", &" + String(wire) + ")";
  generator.addSetupBegin('adafruit_mcp4725_begin_' + varName, 'while (!(' + beginCall + ')) { delay(100); }');
  return '';
};

Arduino.forBlock['adafruit_mcp4725_set'] = function(block, generator) {
  adafruit_mcp4725EnsureLibrary(generator);
  var varName = adafruit_mcp4725Variable(block);
  adafruit_mcp4725EnsureExtras(generator, varName);
  var setting = block.getFieldValue('SETTING') || "volatile";
  var value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || "2048";
  var settings = {
    "volatile": String(varName) + ".setVoltage((uint16_t)constrain((int)" + String(value) + ", 0, 4095), false);",
    "eeprom": String(varName) + ".setVoltage((uint16_t)constrain((int)" + String(value) + ", 0, 4095), true);"
  };
  return (settings[setting] || settings["volatile"]) + '\n';
};

