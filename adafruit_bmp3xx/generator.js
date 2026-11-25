// _varMonitorAttached: the init field hook below monitors variable renames.
function adafruit_bmp3xxEnsureLibrary(generator) {
  generator.addLibrary('adafruit_bmp3xx_0', '#include <Aily_BMP3XX.h>');
}

function adafruit_bmp3xxVariable(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'bmp3xx');
}

function adafruit_bmp3xxAttachVariable(block) {
  if (block._adafruit_bmp3xxVariableAttached) return;
  block._adafruit_bmp3xxVariableAttached = true;
  block._adafruit_bmp3xxLastName = block.getFieldValue('VAR') || 'bmp3xx';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._adafruit_bmp3xxLastName, 'Adafruit_BMP3XX');
  var field = block.getField('VAR');
  if (!field) return;
  var originalFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinish === 'function') originalFinish.call(this, newName);
    if (newName && newName !== block._adafruit_bmp3xxLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._adafruit_bmp3xxLastName, newName, 'Adafruit_BMP3XX');
      block._adafruit_bmp3xxLastName = newName;
    }
  };
}

Arduino.forBlock['adafruit_bmp3xx_init'] = function(block, generator) {
  adafruit_bmp3xxAttachVariable(block);
  adafruit_bmp3xxEnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'bmp3xx';
  var wire = block.getFieldValue('WIRE') || "Wire";
  var addr = block.getFieldValue('ADDR') || "0x77";
  var objectCode = "Aily_BMP3XX " + String(varName) + ";";
  generator.addObject('adafruit_bmp3xx_object_' + varName, objectCode);
  generator.addSetupBegin('adafruit_bmp3xx_wire_' + wire, wire + '.begin();');
  generator.addSetupBegin('adafruit_bmp3xx_begin_' + varName, varName + '.beginSensor(' + addr + ', ' + wire + ');');
  return '';
};

Arduino.forBlock['adafruit_bmp3xx_read'] = function(block, generator) {
  adafruit_bmp3xxEnsureLibrary(generator);
  var varName = adafruit_bmp3xxVariable(block);
  var data = block.getFieldValue('DATA') || "temperature";
  var expressions = {
    "temperature": String(varName) + ".sampleTemperature()",
    "pressure": String(varName) + ".samplePressure()",
    "altitude": String(varName) + ".sampleAltitude()"
  };
  return [expressions[data] || expressions["temperature"], generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['adafruit_bmp3xx_set'] = function(block, generator) {
  adafruit_bmp3xxEnsureLibrary(generator);
  var varName = adafruit_bmp3xxVariable(block);
  var setting = block.getFieldValue('SETTING') || "sea_level";
  var value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || "1013.25";
  var settings = {
    "sea_level": String(varName) + ".setSeaLevelPressure((float)" + String(value) + ");",
    "temp_oversampling": String(varName) + ".configureTemperature((uint8_t)" + String(value) + ");",
    "pressure_oversampling": String(varName) + ".configurePressure((uint8_t)" + String(value) + ");"
  };
  return (settings[setting] || settings["sea_level"]) + '\n';
};

