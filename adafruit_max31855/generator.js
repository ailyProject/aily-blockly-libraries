// _varMonitorAttached: the init field hook below monitors variable renames.
function adafruit_max31855EnsureLibrary(generator) {
  generator.addLibrary('adafruit_max31855_0', '#include <Adafruit_MAX31855.h>');
}

function adafruit_max31855Variable(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'max31855');
}

function adafruit_max31855AttachVariable(block) {
  if (block._adafruit_max31855VariableAttached) return;
  block._adafruit_max31855VariableAttached = true;
  block._adafruit_max31855LastName = block.getFieldValue('VAR') || 'max31855';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._adafruit_max31855LastName, 'Adafruit_MAX31855');
  var field = block.getField('VAR');
  if (!field) return;
  var originalFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinish === 'function') originalFinish.call(this, newName);
    if (newName && newName !== block._adafruit_max31855LastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._adafruit_max31855LastName, newName, 'Adafruit_MAX31855');
      block._adafruit_max31855LastName = newName;
    }
  };
}

function adafruit_max31855EnsureExtras(generator, varName) {
  // No cached data objects required.
}

Arduino.forBlock['adafruit_max31855_init'] = function(block, generator) {
  adafruit_max31855AttachVariable(block);
  adafruit_max31855EnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'max31855';
  var cs = block.getFieldValue('CS') || "10";
  var objectCode = "Adafruit_MAX31855 " + String(varName) + "(" + String(cs) + ", &SPI);";
  generator.addObject('adafruit_max31855_object_' + varName, objectCode);
  adafruit_max31855EnsureExtras(generator, varName);
  var beginCall = String(varName) + ".begin()";
  generator.addSetupBegin('adafruit_max31855_begin_' + varName, 'while (!(' + beginCall + ')) { delay(100); }');
  return '';
};

Arduino.forBlock['adafruit_max31855_read'] = function(block, generator) {
  adafruit_max31855EnsureLibrary(generator);
  var varName = adafruit_max31855Variable(block);
  adafruit_max31855EnsureExtras(generator, varName);
  var data = block.getFieldValue('DATA') || "thermocouple_c";
  var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  var expressions = {
    "thermocouple_c": String(varName) + ".readCelsius()",
    "thermocouple_f": String(varName) + ".readFahrenheit()",
    "internal": String(varName) + ".readInternal()",
    "error": String(varName) + ".readError()"
  };
  return [expressions[data] || expressions["thermocouple_c"], generator.ORDER_FUNCTION_CALL];
};

