// _varMonitorAttached: the init field hook below monitors variable renames.
function adafruit_ads122c04EnsureLibrary(generator) {
  generator.addLibrary('adafruit_ads122c04_0', '#include <Adafruit_ADS122C04.h>');
}

function adafruit_ads122c04Variable(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'ads122c04');
}

function adafruit_ads122c04AttachVariable(block) {
  if (block._adafruit_ads122c04VariableAttached) return;
  block._adafruit_ads122c04VariableAttached = true;
  block._adafruit_ads122c04LastName = block.getFieldValue('VAR') || 'ads122c04';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._adafruit_ads122c04LastName, 'Adafruit_ADS122C04');
  var field = block.getField('VAR');
  if (!field) return;
  var originalFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinish === 'function') originalFinish.call(this, newName);
    if (newName && newName !== block._adafruit_ads122c04LastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._adafruit_ads122c04LastName, newName, 'Adafruit_ADS122C04');
      block._adafruit_ads122c04LastName = newName;
    }
  };
}

function adafruit_ads122c04EnsureExtras(generator, varName) {
  // No cached data objects required.
}

Arduino.forBlock['adafruit_ads122c04_init'] = function(block, generator) {
  adafruit_ads122c04AttachVariable(block);
  adafruit_ads122c04EnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'ads122c04';
  var wire = block.getFieldValue('WIRE') || "Wire";
  var addr = block.getFieldValue('ADDR') || "0x40";
  var objectCode = "Adafruit_ADS122C04 " + String(varName) + ";";
  generator.addObject('adafruit_ads122c04_object_' + varName, objectCode);
  adafruit_ads122c04EnsureExtras(generator, varName);
  generator.addSetupBegin('adafruit_ads122c04_wire_' + wire, wire + '.begin();');
  var beginCall = String(varName) + ".begin(" + String(addr) + ", &" + String(wire) + ")";
  generator.addSetupBegin('adafruit_ads122c04_begin_' + varName, 'while (!(' + beginCall + ')) { delay(100); }');
  return '';
};

Arduino.forBlock['adafruit_ads122c04_read'] = function(block, generator) {
  adafruit_ads122c04EnsureLibrary(generator);
  var varName = adafruit_ads122c04Variable(block);
  adafruit_ads122c04EnsureExtras(generator, varName);
  var data = block.getFieldValue('DATA') || "raw";
  var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  var expressions = {
    "raw": String(varName) + ".readData()",
    "voltage": String(varName) + ".readVoltage()",
    "temperature": String(varName) + ".readTemperature()",
    "ready": String(varName) + ".isDataReady()"
  };
  return [expressions[data] || expressions["raw"], generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['adafruit_ads122c04_action'] = function(block, generator) {
  adafruit_ads122c04EnsureLibrary(generator);
  var varName = adafruit_ads122c04Variable(block);
  adafruit_ads122c04EnsureExtras(generator, varName);
  var action = block.getFieldValue('ACTION') || "start";
  var actions = {
    "start": String(varName) + ".startSync();",
    "powerdown": String(varName) + ".powerdown();",
    "reset": String(varName) + ".reset();"
  };
  return (actions[action] || actions["start"]) + '\n';
};

Arduino.forBlock['adafruit_ads122c04_set'] = function(block, generator) {
  adafruit_ads122c04EnsureLibrary(generator);
  var varName = adafruit_ads122c04Variable(block);
  adafruit_ads122c04EnsureExtras(generator, varName);
  var setting = block.getFieldValue('SETTING') || "gain";
  var value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || "0";
  var settings = {
    "gain": String(varName) + ".setGain((ads122c04_gain_t)constrain((int)" + String(value) + ", 0, 7));",
    "rate": String(varName) + ".setDataRate((ads122c04_rate_t)constrain((int)" + String(value) + ", 0, 6));",
    "continuous": String(varName) + ".setContinuousMode((bool)" + String(value) + ");"
  };
  return (settings[setting] || settings["gain"]) + '\n';
};

