// _varMonitorAttached: the init field hook below monitors variable renames.
function adafruit_mlx90640EnsureLibrary(generator) {
  generator.addLibrary('adafruit_mlx90640_0', '#include <Adafruit_MLX90640.h>');
}

function adafruit_mlx90640Variable(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'mlx90640');
}

function adafruit_mlx90640AttachVariable(block) {
  if (block._adafruit_mlx90640VariableAttached) return;
  block._adafruit_mlx90640VariableAttached = true;
  block._adafruit_mlx90640LastName = block.getFieldValue('VAR') || 'mlx90640';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._adafruit_mlx90640LastName, 'Adafruit_MLX90640');
  var field = block.getField('VAR');
  if (!field) return;
  var originalFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinish === 'function') originalFinish.call(this, newName);
    if (newName && newName !== block._adafruit_mlx90640LastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._adafruit_mlx90640LastName, newName, 'Adafruit_MLX90640');
      block._adafruit_mlx90640LastName = newName;
    }
  };
}

function adafruit_mlx90640EnsureExtras(generator, varName) {
  generator.addObject('adafruit_mlx90640_extra_0_' + varName, "float " + String(varName) + "Frame[768] = {0};");
}

Arduino.forBlock['adafruit_mlx90640_init'] = function(block, generator) {
  adafruit_mlx90640AttachVariable(block);
  adafruit_mlx90640EnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'mlx90640';
  var wire = block.getFieldValue('WIRE') || "Wire";
  var addr = block.getFieldValue('ADDR') || "0x33";
  var objectCode = "Adafruit_MLX90640 " + String(varName) + ";";
  generator.addObject('adafruit_mlx90640_object_' + varName, objectCode);
  adafruit_mlx90640EnsureExtras(generator, varName);
  generator.addSetupBegin('adafruit_mlx90640_wire_' + wire, wire + '.begin();');
  var beginCall = String(varName) + ".begin(" + String(addr) + ", &" + String(wire) + ")";
  generator.addSetupBegin('adafruit_mlx90640_begin_' + varName, 'while (!(' + beginCall + ')) { delay(100); }');
  generator.addSetupBegin('adafruit_mlx90640_after_' + varName, String(varName) + ".setMode(MLX90640_CHESS);\n" + String(varName) + ".setResolution(MLX90640_ADC_18BIT);\n" + String(varName) + ".setRefreshRate(MLX90640_4_HZ);");
  return '';
};

Arduino.forBlock['adafruit_mlx90640_read'] = function(block, generator) {
  adafruit_mlx90640EnsureLibrary(generator);
  var varName = adafruit_mlx90640Variable(block);
  adafruit_mlx90640EnsureExtras(generator, varName);
  var data = block.getFieldValue('DATA') || "pixel";
  var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  var expressions = {
    "pixel": "(" + String(varName) + ".getFrame(" + String(varName) + "Frame), " + String(varName) + "Frame[constrain((int)" + String(index) + ", 0, 767)])",
    "ambient": String(varName) + ".getTa(true)"
  };
  return [expressions[data] || expressions["pixel"], generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['adafruit_mlx90640_set'] = function(block, generator) {
  adafruit_mlx90640EnsureLibrary(generator);
  var varName = adafruit_mlx90640Variable(block);
  adafruit_mlx90640EnsureExtras(generator, varName);
  var setting = block.getFieldValue('SETTING') || "refresh_rate";
  var value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || "4";
  var settings = {
    "refresh_rate": String(varName) + ".setRefreshRate((mlx90640_refreshrate_t)constrain((int)" + String(value) + ", 0, 7));",
    "resolution": String(varName) + ".setResolution((mlx90640_resolution_t)constrain((int)" + String(value) + ", 0, 3));",
    "mode": String(varName) + ".setMode((bool)" + String(value) + " ? MLX90640_CHESS : MLX90640_INTERLEAVED);"
  };
  return (settings[setting] || settings["refresh_rate"]) + '\n';
};

