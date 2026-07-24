// _varMonitorAttached: the init field hook below monitors variable renames.
function adafruit_ina237_ina238EnsureLibrary(generator) {
  generator.addLibrary('adafruit_ina237_ina238_0', '#include <Adafruit_INA237.h>');
  generator.addLibrary('adafruit_ina237_ina238_1', '#include <Adafruit_INA238.h>');
}

function adafruit_ina237_ina238Variable(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'ina23x');
}

function adafruit_ina237_ina238AttachVariable(block) {
  if (block._adafruit_ina237_ina238VariableAttached) return;
  block._adafruit_ina237_ina238VariableAttached = true;
  block._adafruit_ina237_ina238LastName = block.getFieldValue('VAR') || 'ina23x';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._adafruit_ina237_ina238LastName, 'Adafruit_INA237_INA238');
  var field = block.getField('VAR');
  if (!field) return;
  var originalFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinish === 'function') originalFinish.call(this, newName);
    if (newName && newName !== block._adafruit_ina237_ina238LastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._adafruit_ina237_ina238LastName, newName, 'Adafruit_INA237_INA238');
      block._adafruit_ina237_ina238LastName = newName;
    }
  };
}

function adafruit_ina237_ina238EnsureExtras(generator, varName) {
  // No cached data objects required.
}

Arduino.forBlock['adafruit_ina237_ina238_init'] = function(block, generator) {
  adafruit_ina237_ina238AttachVariable(block);
  adafruit_ina237_ina238EnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'ina23x';
  var wire = block.getFieldValue('WIRE') || "Wire";
  var model = block.getFieldValue('MODEL') || "INA237";
  var addr = block.getFieldValue('ADDR') || "0x40";
  var constructorMap = {
  "INA237": "Adafruit_INA237 $VAR;",
  "INA238": "Adafruit_INA238 $VAR;"
};
  var objectCode = constructorMap[model] || constructorMap[Object.keys(constructorMap)[0]];
  objectCode = objectCode.replace(/\$VAR/g, varName);
  objectCode = objectCode.replace(/\$WIRE/g, wire);
  objectCode = objectCode.replace(/\$MODEL/g, model);
  objectCode = objectCode.replace(/\$ADDR/g, addr);
  generator.addObject('adafruit_ina237_ina238_object_' + varName, objectCode);
  adafruit_ina237_ina238EnsureExtras(generator, varName);
  generator.addSetupBegin('adafruit_ina237_ina238_wire_' + wire, wire + '.begin();');
  var beginCall = String(varName) + ".begin(" + String(addr) + ", &" + String(wire) + ")";
  generator.addSetupBegin('adafruit_ina237_ina238_begin_' + varName, 'while (!(' + beginCall + ')) { delay(100); }');
  return '';
};

Arduino.forBlock['adafruit_ina237_ina238_read'] = function(block, generator) {
  adafruit_ina237_ina238EnsureLibrary(generator);
  var varName = adafruit_ina237_ina238Variable(block);
  adafruit_ina237_ina238EnsureExtras(generator, varName);
  var data = block.getFieldValue('DATA') || "bus_voltage";
  var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  var expressions = {
    "bus_voltage": String(varName) + ".getBusVoltage_V()",
    "shunt_voltage": String(varName) + ".getShuntVoltage_mV()",
    "current": String(varName) + ".getCurrent_mA()",
    "power": String(varName) + ".getPower_mW()",
    "temperature": String(varName) + ".readDieTemp()",
    "ready": String(varName) + ".conversionReady()"
  };
  return [expressions[data] || expressions["bus_voltage"], generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['adafruit_ina237_ina238_adjust'] = function(block, generator) {
  adafruit_ina237_ina238EnsureLibrary(generator);
  var varName = adafruit_ina237_ina238Variable(block);
  var value1 = generator.valueToCode(block, 'VALUE1', generator.ORDER_ATOMIC) || "0.1";
  var value2 = generator.valueToCode(block, 'VALUE2', generator.ORDER_ATOMIC) || "3.2";
  return String(varName) + ".setShunt((float)" + String(value1) + ", (float)" + String(value2) + ");" + '\n';
};

