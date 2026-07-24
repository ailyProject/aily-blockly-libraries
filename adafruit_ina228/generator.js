// _varMonitorAttached: the init field hook below monitors variable renames.
function adafruit_ina228EnsureLibrary(generator) {
  generator.addLibrary('adafruit_ina228_0', '#include <Adafruit_INA228.h>');
}

function adafruit_ina228Variable(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'ina228');
}

function adafruit_ina228AttachVariable(block) {
  if (block._adafruit_ina228VariableAttached) return;
  block._adafruit_ina228VariableAttached = true;
  block._adafruit_ina228LastName = block.getFieldValue('VAR') || 'ina228';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._adafruit_ina228LastName, 'Adafruit_INA228');
  var field = block.getField('VAR');
  if (!field) return;
  var originalFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinish === 'function') originalFinish.call(this, newName);
    if (newName && newName !== block._adafruit_ina228LastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._adafruit_ina228LastName, newName, 'Adafruit_INA228');
      block._adafruit_ina228LastName = newName;
    }
  };
}

function adafruit_ina228EnsureExtras(generator, varName) {
  // No cached data objects required.
}

Arduino.forBlock['adafruit_ina228_init'] = function(block, generator) {
  adafruit_ina228AttachVariable(block);
  adafruit_ina228EnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'ina228';
  var wire = block.getFieldValue('WIRE') || "Wire";
  var addr = block.getFieldValue('ADDR') || "0x40";
  var objectCode = "Adafruit_INA228 " + String(varName) + ";";
  generator.addObject('adafruit_ina228_object_' + varName, objectCode);
  adafruit_ina228EnsureExtras(generator, varName);
  generator.addSetupBegin('adafruit_ina228_wire_' + wire, wire + '.begin();');
  var beginCall = String(varName) + ".begin(" + String(addr) + ", &" + String(wire) + ")";
  generator.addSetupBegin('adafruit_ina228_begin_' + varName, 'while (!(' + beginCall + ')) { delay(100); }');
  return '';
};

Arduino.forBlock['adafruit_ina228_read'] = function(block, generator) {
  adafruit_ina228EnsureLibrary(generator);
  var varName = adafruit_ina228Variable(block);
  adafruit_ina228EnsureExtras(generator, varName);
  var data = block.getFieldValue('DATA') || "bus_voltage";
  var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  var expressions = {
    "bus_voltage": String(varName) + ".getBusVoltage_V()",
    "shunt_voltage": String(varName) + ".getShuntVoltage_mV()",
    "current": String(varName) + ".getCurrent_mA()",
    "power": String(varName) + ".getPower_mW()",
    "energy": String(varName) + ".readEnergy()",
    "charge": String(varName) + ".readCharge()",
    "temperature": String(varName) + ".readDieTemp()",
    "ready": String(varName) + ".conversionReady()"
  };
  return [expressions[data] || expressions["bus_voltage"], generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['adafruit_ina228_adjust'] = function(block, generator) {
  adafruit_ina228EnsureLibrary(generator);
  var varName = adafruit_ina228Variable(block);
  var value1 = generator.valueToCode(block, 'VALUE1', generator.ORDER_ATOMIC) || "0.1";
  var value2 = generator.valueToCode(block, 'VALUE2', generator.ORDER_ATOMIC) || "3.2";
  return String(varName) + ".setShunt((float)" + String(value1) + ", (float)" + String(value2) + ");" + '\n';
};

