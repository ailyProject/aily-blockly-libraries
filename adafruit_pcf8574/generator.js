// _varMonitorAttached: the init field hook below monitors variable renames.
function adafruit_pcf8574EnsureLibrary(generator) {
  generator.addLibrary('adafruit_pcf8574_0', '#include <Adafruit_PCF8574.h>');
}

function adafruit_pcf8574Variable(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'pcf8574');
}

function adafruit_pcf8574AttachVariable(block) {
  if (block._adafruit_pcf8574VariableAttached) return;
  block._adafruit_pcf8574VariableAttached = true;
  block._adafruit_pcf8574LastName = block.getFieldValue('VAR') || 'pcf8574';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._adafruit_pcf8574LastName, 'Adafruit_PCF8574');
  var field = block.getField('VAR');
  if (!field) return;
  var originalFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinish === 'function') originalFinish.call(this, newName);
    if (newName && newName !== block._adafruit_pcf8574LastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._adafruit_pcf8574LastName, newName, 'Adafruit_PCF8574');
      block._adafruit_pcf8574LastName = newName;
    }
  };
}

function adafruit_pcf8574EnsureExtras(generator, varName) {
  // No cached data objects required.
}

Arduino.forBlock['adafruit_pcf8574_init'] = function(block, generator) {
  adafruit_pcf8574AttachVariable(block);
  adafruit_pcf8574EnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'pcf8574';
  var wire = block.getFieldValue('WIRE') || "Wire";
  var addr = block.getFieldValue('ADDR') || "0x20";
  var objectCode = "Adafruit_PCF8574 " + String(varName) + ";";
  generator.addObject('adafruit_pcf8574_object_' + varName, objectCode);
  adafruit_pcf8574EnsureExtras(generator, varName);
  generator.addSetupBegin('adafruit_pcf8574_wire_' + wire, wire + '.begin();');
  var beginCall = String(varName) + ".begin(" + String(addr) + ", &" + String(wire) + ")";
  generator.addSetupBegin('adafruit_pcf8574_begin_' + varName, 'while (!(' + beginCall + ')) { delay(100); }');
  return '';
};

Arduino.forBlock['adafruit_pcf8574_read'] = function(block, generator) {
  adafruit_pcf8574EnsureLibrary(generator);
  var varName = adafruit_pcf8574Variable(block);
  adafruit_pcf8574EnsureExtras(generator, varName);
  var data = block.getFieldValue('DATA') || "pin";
  var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  var expressions = {
    "pin": "(" + String(varName) + ".pinMode((uint8_t)" + String(index) + ", INPUT_PULLUP), " + String(varName) + ".digitalRead((uint8_t)" + String(index) + "))",
    "all": String(varName) + ".digitalReadByte()"
  };
  return [expressions[data] || expressions["pin"], generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['adafruit_pcf8574_action'] = function(block, generator) {
  adafruit_pcf8574EnsureLibrary(generator);
  var varName = adafruit_pcf8574Variable(block);
  adafruit_pcf8574EnsureExtras(generator, varName);
  var action = block.getFieldValue('ACTION') || "all_low";
  var actions = {
    "all_low": String(varName) + ".digitalWriteByte(0x00);",
    "all_high": String(varName) + ".digitalWriteByte(0xFF);"
  };
  return (actions[action] || actions["all_low"]) + '\n';
};

Arduino.forBlock['adafruit_pcf8574_write'] = function(block, generator) {
  adafruit_pcf8574EnsureLibrary(generator);
  var varName = adafruit_pcf8574Variable(block);
  var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  var value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';
  return String(varName) + ".pinMode((uint8_t)" + String(index) + ", OUTPUT); " + String(varName) + ".digitalWrite((uint8_t)" + String(index) + ", (bool)" + String(value) + ");" + '\n';
};
