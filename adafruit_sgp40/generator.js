// _varMonitorAttached: the init field hook below monitors variable renames.
function adafruit_sgp40EnsureLibrary(generator) {
  generator.addLibrary('adafruit_sgp40_0', '#include <Adafruit_SGP40.h>');
}

function adafruit_sgp40Variable(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'sgp40');
}

function adafruit_sgp40AttachVariable(block) {
  if (block._adafruit_sgp40VariableAttached) return;
  block._adafruit_sgp40VariableAttached = true;
  block._adafruit_sgp40LastName = block.getFieldValue('VAR') || 'sgp40';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._adafruit_sgp40LastName, 'Adafruit_SGP40');
  var field = block.getField('VAR');
  if (!field) return;
  var originalFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinish === 'function') originalFinish.call(this, newName);
    if (newName && newName !== block._adafruit_sgp40LastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._adafruit_sgp40LastName, newName, 'Adafruit_SGP40');
      block._adafruit_sgp40LastName = newName;
    }
  };
}

function adafruit_sgp40EnsureExtras(generator, varName) {
  // No cached data objects required.
}

Arduino.forBlock['adafruit_sgp40_init'] = function(block, generator) {
  adafruit_sgp40AttachVariable(block);
  adafruit_sgp40EnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'sgp40';
  var wire = block.getFieldValue('WIRE') || "Wire";
  var objectCode = "Adafruit_SGP40 " + String(varName) + ";";
  generator.addObject('adafruit_sgp40_object_' + varName, objectCode);
  adafruit_sgp40EnsureExtras(generator, varName);
  generator.addSetupBegin('adafruit_sgp40_wire_' + wire, wire + '.begin();');
  var beginCall = String(varName) + ".begin(&" + String(wire) + ")";
  generator.addSetupBegin('adafruit_sgp40_begin_' + varName, 'while (!(' + beginCall + ')) { delay(100); }');
  return '';
};

Arduino.forBlock['adafruit_sgp40_read'] = function(block, generator) {
  adafruit_sgp40EnsureLibrary(generator);
  var varName = adafruit_sgp40Variable(block);
  adafruit_sgp40EnsureExtras(generator, varName);
  var data = block.getFieldValue('DATA') || "raw";
  var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  var expressions = {
    "raw": String(varName) + ".measureRaw()",
    "voc_index": String(varName) + ".measureVocIndex()",
    "self_test": String(varName) + ".selfTest()"
  };
  return [expressions[data] || expressions["raw"], generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['adafruit_sgp40_measure'] = function(block, generator) {
  adafruit_sgp40EnsureLibrary(generator);
  var varName = adafruit_sgp40Variable(block);
  adafruit_sgp40EnsureExtras(generator, varName);
  var value1 = generator.valueToCode(block, 'VALUE1', generator.ORDER_ATOMIC) || "25";
  var value2 = generator.valueToCode(block, 'VALUE2', generator.ORDER_ATOMIC) || "50";
  var expression = String(varName) + ".measureVocIndex(" + String(value1) + ", " + String(value2) + ")";
  return [expression, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['adafruit_sgp40_action'] = function(block, generator) {
  adafruit_sgp40EnsureLibrary(generator);
  var varName = adafruit_sgp40Variable(block);
  adafruit_sgp40EnsureExtras(generator, varName);
  var action = block.getFieldValue('ACTION') || "reset";
  var actions = {
    "reset": String(varName) + ".softReset();",
    "heater_off": String(varName) + ".heaterOff();"
  };
  return (actions[action] || actions["reset"]) + '\n';
};

