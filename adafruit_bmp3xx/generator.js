// _varMonitorAttached: the init field hook below monitors variable renames.
function adafruit_bmp3xxEnsureLibrary(generator) {
  generator.addLibrary('adafruit_bmp3xx_0', '#include <Adafruit_BMP3XX.h>');
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

function adafruit_bmp3xxEnsureExtras(generator, varName) {
  // No cached data objects required.
}

Arduino.forBlock['adafruit_bmp3xx_init'] = function(block, generator) {
  adafruit_bmp3xxAttachVariable(block);
  adafruit_bmp3xxEnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'bmp3xx';
  var wire = block.getFieldValue('WIRE') || "Wire";
  var addr = block.getFieldValue('ADDR') || "0x77";
  var objectCode = "Adafruit_BMP3XX " + String(varName) + ";";
  generator.addObject('adafruit_bmp3xx_object_' + varName, objectCode);
  adafruit_bmp3xxEnsureExtras(generator, varName);
  generator.addSetupBegin('adafruit_bmp3xx_wire_' + wire, wire + '.begin();');
  var beginCall = String(varName) + ".begin_I2C(" + String(addr) + ", &" + String(wire) + ")";
  generator.addSetupBegin('adafruit_bmp3xx_begin_' + varName, 'while (!(' + beginCall + ')) { delay(100); }');
  generator.addSetupBegin('adafruit_bmp3xx_after_' + varName, String(varName) + ".setTemperatureOversampling(BMP3_OVERSAMPLING_8X);\n" + String(varName) + ".setPressureOversampling(BMP3_OVERSAMPLING_4X);\n" + String(varName) + ".setIIRFilterCoeff(BMP3_IIR_FILTER_COEFF_3);\n" + String(varName) + ".setOutputDataRate(BMP3_ODR_50_HZ);");
  return '';
};

Arduino.forBlock['adafruit_bmp3xx_read'] = function(block, generator) {
  adafruit_bmp3xxEnsureLibrary(generator);
  var varName = adafruit_bmp3xxVariable(block);
  adafruit_bmp3xxEnsureExtras(generator, varName);
  var data = block.getFieldValue('DATA') || "temperature";
  var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  var expressions = {
    "temperature": String(varName) + ".readTemperature()",
    "pressure": String(varName) + ".readPressure()",
    "altitude": String(varName) + ".readAltitude(1013.25)"
  };
  return [expressions[data] || expressions["temperature"], generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['adafruit_bmp3xx_set'] = function(block, generator) {
  adafruit_bmp3xxEnsureLibrary(generator);
  var varName = adafruit_bmp3xxVariable(block);
  adafruit_bmp3xxEnsureExtras(generator, varName);
  var setting = block.getFieldValue('SETTING') || "sea_level";
  var value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || "1013.25";
  var settings = {
    "sea_level": "(void)" + String(varName) + ".readAltitude((float)" + String(value) + ");",
    "temp_oversampling": String(varName) + ".setTemperatureOversampling((uint8_t)" + String(value) + ");",
    "pressure_oversampling": String(varName) + ".setPressureOversampling((uint8_t)" + String(value) + ");"
  };
  return (settings[setting] || settings["sea_level"]) + '\n';
};

