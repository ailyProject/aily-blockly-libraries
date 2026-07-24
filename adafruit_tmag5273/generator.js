// _varMonitorAttached: the init field hook below monitors variable renames.
function adafruit_tmag5273EnsureLibrary(generator) {
  generator.addLibrary('adafruit_tmag5273_0', '#include <Adafruit_TMAG5273.h>');
}

function adafruit_tmag5273Variable(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'tmag5273');
}

function adafruit_tmag5273AttachVariable(block) {
  if (block._adafruit_tmag5273VariableAttached) return;
  block._adafruit_tmag5273VariableAttached = true;
  block._adafruit_tmag5273LastName = block.getFieldValue('VAR') || 'tmag5273';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._adafruit_tmag5273LastName, 'Adafruit_TMAG5273');
  var field = block.getField('VAR');
  if (!field) return;
  var originalFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinish === 'function') originalFinish.call(this, newName);
    if (newName && newName !== block._adafruit_tmag5273LastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._adafruit_tmag5273LastName, newName, 'Adafruit_TMAG5273');
      block._adafruit_tmag5273LastName = newName;
    }
  };
}

function adafruit_tmag5273EnsureExtras(generator, varName) {
  // No cached data objects required.
}

Arduino.forBlock['adafruit_tmag5273_init'] = function(block, generator) {
  adafruit_tmag5273AttachVariable(block);
  adafruit_tmag5273EnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'tmag5273';
  var wire = block.getFieldValue('WIRE') || "Wire";
  var addr = block.getFieldValue('ADDR') || "0x35";
  var objectCode = "Adafruit_TMAG5273 " + String(varName) + ";";
  generator.addObject('adafruit_tmag5273_object_' + varName, objectCode);
  adafruit_tmag5273EnsureExtras(generator, varName);
  generator.addSetupBegin('adafruit_tmag5273_wire_' + wire, wire + '.begin();');
  var beginCall = String(varName) + ".begin(" + String(addr) + ", &" + String(wire) + ")";
  generator.addSetupBegin('adafruit_tmag5273_begin_' + varName, 'while (!(' + beginCall + ')) { delay(100); }');
  generator.addSetupBegin('adafruit_tmag5273_after_' + varName, String(varName) + ".enableTemperature(true);\n" + String(varName) + ".setOperatingMode(TMAG5273_MODE_CONTINUOUS);");
  return '';
};

Arduino.forBlock['adafruit_tmag5273_read'] = function(block, generator) {
  adafruit_tmag5273EnsureLibrary(generator);
  var varName = adafruit_tmag5273Variable(block);
  adafruit_tmag5273EnsureExtras(generator, varName);
  var data = block.getFieldValue('DATA') || "x";
  var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  var expressions = {
    "x": String(varName) + ".readMagneticX()",
    "y": String(varName) + ".readMagneticY()",
    "z": String(varName) + ".readMagneticZ()",
    "magnitude": String(varName) + ".readMagnitudeMT()",
    "angle": String(varName) + ".readAngle()",
    "temperature": String(varName) + ".getTemperature()"
  };
  return [expressions[data] || expressions["x"], generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['adafruit_tmag5273_set'] = function(block, generator) {
  adafruit_tmag5273EnsureLibrary(generator);
  var varName = adafruit_tmag5273Variable(block);
  adafruit_tmag5273EnsureExtras(generator, varName);
  var setting = block.getFieldValue('SETTING') || "xy_range";
  var value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || "0";
  var settings = {
    "xy_range": String(varName) + ".setXYRangeWide((bool)" + String(value) + ");",
    "z_range": String(varName) + ".setZRangeWide((bool)" + String(value) + ");",
    "low_noise": String(varName) + ".setLowNoiseMode((bool)" + String(value) + ");"
  };
  return (settings[setting] || settings["xy_range"]) + '\n';
};

