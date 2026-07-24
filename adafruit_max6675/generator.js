// _varMonitorAttached: the init field hook below monitors variable renames.
function adafruit_max6675EnsureLibrary(generator) {
  generator.addLibrary('adafruit_max6675_0', '#include <max6675.h>');
}

function adafruit_max6675Variable(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'max6675');
}

function adafruit_max6675AttachVariable(block) {
  if (block._adafruit_max6675VariableAttached) return;
  block._adafruit_max6675VariableAttached = true;
  block._adafruit_max6675LastName = block.getFieldValue('VAR') || 'max6675';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._adafruit_max6675LastName, 'MAX6675');
  var field = block.getField('VAR');
  if (!field) return;
  var originalFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinish === 'function') originalFinish.call(this, newName);
    if (newName && newName !== block._adafruit_max6675LastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._adafruit_max6675LastName, newName, 'MAX6675');
      block._adafruit_max6675LastName = newName;
    }
  };
}

function adafruit_max6675EnsureExtras(generator, varName) {
  // No cached data objects required.
}

Arduino.forBlock['adafruit_max6675_init'] = function(block, generator) {
  adafruit_max6675AttachVariable(block);
  adafruit_max6675EnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'max6675';
  var sclk = block.getFieldValue('SCLK') || "13";
  var cs = block.getFieldValue('CS') || "10";
  var miso = block.getFieldValue('MISO') || "12";
  var objectCode = "MAX6675 " + String(varName) + "(" + String(sclk) + ", " + String(cs) + ", " + String(miso) + ");";
  generator.addObject('adafruit_max6675_object_' + varName, objectCode);
  adafruit_max6675EnsureExtras(generator, varName);
  return '';
};

Arduino.forBlock['adafruit_max6675_read'] = function(block, generator) {
  adafruit_max6675EnsureLibrary(generator);
  var varName = adafruit_max6675Variable(block);
  adafruit_max6675EnsureExtras(generator, varName);
  var data = block.getFieldValue('DATA') || "celsius";
  var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  var expressions = {
    "celsius": String(varName) + ".readCelsius()",
    "fahrenheit": String(varName) + ".readFahrenheit()"
  };
  return [expressions[data] || expressions["celsius"], generator.ORDER_FUNCTION_CALL];
};

