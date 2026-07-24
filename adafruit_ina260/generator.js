// _varMonitorAttached: the init field hook below monitors variable renames.
function adafruit_ina260EnsureLibrary(generator) {
  generator.addLibrary('adafruit_ina260_0', '#include <Adafruit_INA260.h>');
}

function adafruit_ina260Variable(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'ina260');
}

function adafruit_ina260AttachVariable(block) {
  if (block._adafruit_ina260VariableAttached) return;
  block._adafruit_ina260VariableAttached = true;
  block._adafruit_ina260LastName = block.getFieldValue('VAR') || 'ina260';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._adafruit_ina260LastName, 'Adafruit_INA260');
  var field = block.getField('VAR');
  if (!field) return;
  var originalFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinish === 'function') originalFinish.call(this, newName);
    if (newName && newName !== block._adafruit_ina260LastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._adafruit_ina260LastName, newName, 'Adafruit_INA260');
      block._adafruit_ina260LastName = newName;
    }
  };
}

function adafruit_ina260EnsureExtras(generator, varName) {
  // No cached data objects required.
}

Arduino.forBlock['adafruit_ina260_init'] = function(block, generator) {
  adafruit_ina260AttachVariable(block);
  adafruit_ina260EnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'ina260';
  var wire = block.getFieldValue('WIRE') || "Wire";
  var addr = block.getFieldValue('ADDR') || "0x40";
  var objectCode = "Adafruit_INA260 " + String(varName) + ";";
  generator.addObject('adafruit_ina260_object_' + varName, objectCode);
  adafruit_ina260EnsureExtras(generator, varName);
  generator.addSetupBegin('adafruit_ina260_wire_' + wire, wire + '.begin();');
  var beginCall = String(varName) + ".begin(" + String(addr) + ", &" + String(wire) + ")";
  generator.addSetupBegin('adafruit_ina260_begin_' + varName, 'while (!(' + beginCall + ')) { delay(100); }');
  return '';
};

Arduino.forBlock['adafruit_ina260_read'] = function(block, generator) {
  adafruit_ina260EnsureLibrary(generator);
  var varName = adafruit_ina260Variable(block);
  adafruit_ina260EnsureExtras(generator, varName);
  var data = block.getFieldValue('DATA') || "current";
  var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  var expressions = {
    "current": String(varName) + ".readCurrent()",
    "voltage": String(varName) + ".readBusVoltage()",
    "power": String(varName) + ".readPower()"
  };
  return [expressions[data] || expressions["current"], generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['adafruit_ina260_action'] = function(block, generator) {
  adafruit_ina260EnsureLibrary(generator);
  var varName = adafruit_ina260Variable(block);
  adafruit_ina260EnsureExtras(generator, varName);
  var action = block.getFieldValue('ACTION') || "reset";
  var actions = {
    "reset": String(varName) + ".reset();"
  };
  return (actions[action] || actions["reset"]) + '\n';
};

