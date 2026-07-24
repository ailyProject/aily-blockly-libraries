// _varMonitorAttached: the init field hook below monitors variable renames.
function adafruit_sgp41EnsureLibrary(generator) {
  generator.addLibrary('adafruit_sgp41_0', '#include <Adafruit_SGP41.h>');
}

function adafruit_sgp41Variable(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'sgp41');
}

function adafruit_sgp41AttachVariable(block) {
  if (block._adafruit_sgp41VariableAttached) return;
  block._adafruit_sgp41VariableAttached = true;
  block._adafruit_sgp41LastName = block.getFieldValue('VAR') || 'sgp41';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._adafruit_sgp41LastName, 'Adafruit_SGP41');
  var field = block.getField('VAR');
  if (!field) return;
  var originalFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinish === 'function') originalFinish.call(this, newName);
    if (newName && newName !== block._adafruit_sgp41LastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._adafruit_sgp41LastName, newName, 'Adafruit_SGP41');
      block._adafruit_sgp41LastName = newName;
    }
  };
}

function adafruit_sgp41EnsureExtras(generator, varName) {
  generator.addObject('adafruit_sgp41_extra_0_' + varName, "uint16_t " + String(varName) + "VocRaw = 0;");
  generator.addObject('adafruit_sgp41_extra_1_' + varName, "uint16_t " + String(varName) + "NoxRaw = 0;");
}

Arduino.forBlock['adafruit_sgp41_init'] = function(block, generator) {
  adafruit_sgp41AttachVariable(block);
  adafruit_sgp41EnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'sgp41';
  var wire = block.getFieldValue('WIRE') || "Wire";
  var objectCode = "Adafruit_SGP41 " + String(varName) + ";";
  generator.addObject('adafruit_sgp41_object_' + varName, objectCode);
  adafruit_sgp41EnsureExtras(generator, varName);
  generator.addSetupBegin('adafruit_sgp41_wire_' + wire, wire + '.begin();');
  var beginCall = String(varName) + ".begin(SGP41_DEFAULT_ADDR, &" + String(wire) + ")";
  generator.addSetupBegin('adafruit_sgp41_begin_' + varName, 'while (!(' + beginCall + ')) { delay(100); }');
  return '';
};

Arduino.forBlock['adafruit_sgp41_read'] = function(block, generator) {
  adafruit_sgp41EnsureLibrary(generator);
  var varName = adafruit_sgp41Variable(block);
  adafruit_sgp41EnsureExtras(generator, varName);
  var data = block.getFieldValue('DATA') || "voc_raw";
  var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  var expressions = {
    "voc_raw": "(" + String(varName) + ".measureRawSignals(&" + String(varName) + "VocRaw, &" + String(varName) + "NoxRaw), " + String(varName) + "VocRaw)",
    "nox_raw": "(" + String(varName) + ".measureRawSignals(&" + String(varName) + "VocRaw, &" + String(varName) + "NoxRaw), " + String(varName) + "NoxRaw)",
    "self_test": String(varName) + ".executeSelfTest()"
  };
  return [expressions[data] || expressions["voc_raw"], generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['adafruit_sgp41_action'] = function(block, generator) {
  adafruit_sgp41EnsureLibrary(generator);
  var varName = adafruit_sgp41Variable(block);
  adafruit_sgp41EnsureExtras(generator, varName);
  var action = block.getFieldValue('ACTION') || "conditioning";
  var actions = {
    "conditioning": String(varName) + ".executeConditioning(&" + String(varName) + "VocRaw);",
    "reset": String(varName) + ".softReset();",
    "heater_off": String(varName) + ".turnHeaterOff();"
  };
  return (actions[action] || actions["conditioning"]) + '\n';
};

Arduino.forBlock['adafruit_sgp41_adjust'] = function(block, generator) {
  adafruit_sgp41EnsureLibrary(generator);
  var varName = adafruit_sgp41Variable(block);
  var value1 = generator.valueToCode(block, 'VALUE1', generator.ORDER_ATOMIC) || "50";
  var value2 = generator.valueToCode(block, 'VALUE2', generator.ORDER_ATOMIC) || "25";
  return String(varName) + ".measureRawSignals(&" + String(varName) + "VocRaw, &" + String(varName) + "NoxRaw, " + String(value1) + ", " + String(value2) + ");" + '\n';
};

