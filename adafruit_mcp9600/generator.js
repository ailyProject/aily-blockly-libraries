// _varMonitorAttached: the init field hook below monitors variable renames.
function adafruit_mcp9600EnsureLibrary(generator) {
  generator.addLibrary('adafruit_mcp9600_0', '#include <Adafruit_MCP9600.h>');
}

function adafruit_mcp9600Variable(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'mcp9600');
}

function adafruit_mcp9600AttachVariable(block) {
  if (block._adafruit_mcp9600VariableAttached) return;
  block._adafruit_mcp9600VariableAttached = true;
  block._adafruit_mcp9600LastName = block.getFieldValue('VAR') || 'mcp9600';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._adafruit_mcp9600LastName, 'Adafruit_MCP9600');
  var field = block.getField('VAR');
  if (!field) return;
  var originalFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinish === 'function') originalFinish.call(this, newName);
    if (newName && newName !== block._adafruit_mcp9600LastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._adafruit_mcp9600LastName, newName, 'Adafruit_MCP9600');
      block._adafruit_mcp9600LastName = newName;
    }
  };
}

function adafruit_mcp9600EnsureExtras(generator, varName) {
  // No cached data objects required.
}

Arduino.forBlock['adafruit_mcp9600_init'] = function(block, generator) {
  adafruit_mcp9600AttachVariable(block);
  adafruit_mcp9600EnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'mcp9600';
  var wire = block.getFieldValue('WIRE') || "Wire";
  var addr = block.getFieldValue('ADDR') || "0x67";
  var objectCode = "Adafruit_MCP9600 " + String(varName) + ";";
  generator.addObject('adafruit_mcp9600_object_' + varName, objectCode);
  adafruit_mcp9600EnsureExtras(generator, varName);
  generator.addSetupBegin('adafruit_mcp9600_wire_' + wire, wire + '.begin();');
  var beginCall = String(varName) + ".begin(" + String(addr) + ", &" + String(wire) + ")";
  generator.addSetupBegin('adafruit_mcp9600_begin_' + varName, 'while (!(' + beginCall + ')) { delay(100); }');
  generator.addSetupBegin('adafruit_mcp9600_after_' + varName, String(varName) + ".enable(true);");
  return '';
};

Arduino.forBlock['adafruit_mcp9600_read'] = function(block, generator) {
  adafruit_mcp9600EnsureLibrary(generator);
  var varName = adafruit_mcp9600Variable(block);
  adafruit_mcp9600EnsureExtras(generator, varName);
  var data = block.getFieldValue('DATA') || "thermocouple";
  var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  var expressions = {
    "thermocouple": String(varName) + ".readThermocouple()",
    "ambient": String(varName) + ".readAmbient()",
    "adc": String(varName) + ".readADC()",
    "status": String(varName) + ".getStatus()"
  };
  return [expressions[data] || expressions["thermocouple"], generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['adafruit_mcp9600_action'] = function(block, generator) {
  adafruit_mcp9600EnsureLibrary(generator);
  var varName = adafruit_mcp9600Variable(block);
  adafruit_mcp9600EnsureExtras(generator, varName);
  var action = block.getFieldValue('ACTION') || "enable";
  var actions = {
    "enable": String(varName) + ".enable(true);",
    "disable": String(varName) + ".enable(false);"
  };
  return (actions[action] || actions["enable"]) + '\n';
};

Arduino.forBlock['adafruit_mcp9600_set'] = function(block, generator) {
  adafruit_mcp9600EnsureLibrary(generator);
  var varName = adafruit_mcp9600Variable(block);
  adafruit_mcp9600EnsureExtras(generator, varName);
  var setting = block.getFieldValue('SETTING') || "type";
  var value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || "0";
  var settings = {
    "type": String(varName) + ".setThermocoupleType((MCP9600_ThemocoupleType)constrain((int)" + String(value) + ", 0, 7));",
    "filter": String(varName) + ".setFilterCoefficient((uint8_t)constrain((int)" + String(value) + ", 0, 7));"
  };
  return (settings[setting] || settings["type"]) + '\n';
};

