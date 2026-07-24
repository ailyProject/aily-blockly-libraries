// _varMonitorAttached: the init field hook below monitors variable renames.
function adafruit_max31856EnsureLibrary(generator) {
  generator.addLibrary('adafruit_max31856_0', '#include <Adafruit_MAX31856.h>');
}

function adafruit_max31856Variable(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'max31856');
}

function adafruit_max31856AttachVariable(block) {
  if (block._adafruit_max31856VariableAttached) return;
  block._adafruit_max31856VariableAttached = true;
  block._adafruit_max31856LastName = block.getFieldValue('VAR') || 'max31856';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._adafruit_max31856LastName, 'Adafruit_MAX31856');
  var field = block.getField('VAR');
  if (!field) return;
  var originalFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinish === 'function') originalFinish.call(this, newName);
    if (newName && newName !== block._adafruit_max31856LastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._adafruit_max31856LastName, newName, 'Adafruit_MAX31856');
      block._adafruit_max31856LastName = newName;
    }
  };
}

function adafruit_max31856EnsureExtras(generator, varName) {
  // No cached data objects required.
}

Arduino.forBlock['adafruit_max31856_init'] = function(block, generator) {
  adafruit_max31856AttachVariable(block);
  adafruit_max31856EnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'max31856';
  var cs = block.getFieldValue('CS') || "10";
  var objectCode = "Adafruit_MAX31856 " + String(varName) + "(" + String(cs) + ", &SPI);";
  generator.addObject('adafruit_max31856_object_' + varName, objectCode);
  adafruit_max31856EnsureExtras(generator, varName);
  var beginCall = String(varName) + ".begin()";
  generator.addSetupBegin('adafruit_max31856_begin_' + varName, 'while (!(' + beginCall + ')) { delay(100); }');
  generator.addSetupBegin('adafruit_max31856_after_' + varName, String(varName) + ".setThermocoupleType(MAX31856_TCTYPE_K);\n" + String(varName) + ".setConversionMode(MAX31856_CONTINUOUS);");
  return '';
};

Arduino.forBlock['adafruit_max31856_read'] = function(block, generator) {
  adafruit_max31856EnsureLibrary(generator);
  var varName = adafruit_max31856Variable(block);
  adafruit_max31856EnsureExtras(generator, varName);
  var data = block.getFieldValue('DATA') || "thermocouple";
  var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  var expressions = {
    "thermocouple": String(varName) + ".readThermocoupleTemperature()",
    "cold_junction": String(varName) + ".readCJTemperature()",
    "fault": String(varName) + ".readFault()"
  };
  return [expressions[data] || expressions["thermocouple"], generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['adafruit_max31856_set'] = function(block, generator) {
  adafruit_max31856EnsureLibrary(generator);
  var varName = adafruit_max31856Variable(block);
  adafruit_max31856EnsureExtras(generator, varName);
  var setting = block.getFieldValue('SETTING') || "type";
  var value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || "3";
  var settings = {
    "type": String(varName) + ".setThermocoupleType((max31856_thermocoupletype_t)constrain((int)" + String(value) + ", 0, 7));",
    "mode": String(varName) + ".setConversionMode((bool)" + String(value) + " ? MAX31856_CONTINUOUS : MAX31856_ONESHOT);"
  };
  return (settings[setting] || settings["type"]) + '\n';
};

