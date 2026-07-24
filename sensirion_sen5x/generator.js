// _varMonitorAttached: the init field hook below monitors variable renames.
function sensirion_sen5xEnsureLibrary(generator) {
  generator.addLibrary('sensirion_sen5x_0', '#include <Aily_SEN5X.h>');
}

function sensirion_sen5xVariable(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'sen5x');
}

function sensirion_sen5xAttachVariable(block) {
  if (block._sensirion_sen5xVariableAttached) return;
  block._sensirion_sen5xVariableAttached = true;
  block._sensirion_sen5xLastName = block.getFieldValue('VAR') || 'sen5x';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._sensirion_sen5xLastName, 'AilySEN5X');
  var field = block.getField('VAR');
  if (!field) return;
  var originalFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinish === 'function') originalFinish.call(this, newName);
    if (newName && newName !== block._sensirion_sen5xLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._sensirion_sen5xLastName, newName, 'AilySEN5X');
      block._sensirion_sen5xLastName = newName;
    }
  };
}

function sensirion_sen5xEnsureExtras(generator, varName) {
  // No cached data objects required.
}

Arduino.forBlock['sensirion_sen5x_init'] = function(block, generator) {
  sensirion_sen5xAttachVariable(block);
  sensirion_sen5xEnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'sen5x';
  var wire = block.getFieldValue('WIRE') || "Wire";
  var objectCode = "AilySEN5X " + String(varName) + "(&" + String(wire) + ");";
  generator.addObject('sensirion_sen5x_object_' + varName, objectCode);
  sensirion_sen5xEnsureExtras(generator, varName);
  generator.addSetupBegin('sensirion_sen5x_wire_' + wire, wire + '.begin();');
  var beginCall = String(varName) + ".begin()";
  generator.addSetupBegin('sensirion_sen5x_begin_' + varName, 'while (!(' + beginCall + ')) { delay(100); }');
  generator.addSetupBegin('sensirion_sen5x_after_' + varName, String(varName) + ".startMeasurement();");
  return '';
};

Arduino.forBlock['sensirion_sen5x_read'] = function(block, generator) {
  sensirion_sen5xEnsureLibrary(generator);
  var varName = sensirion_sen5xVariable(block);
  sensirion_sen5xEnsureExtras(generator, varName);
  var data = block.getFieldValue('DATA') || "pm1";
  var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  var expressions = {
    "pm1": "(" + String(varName) + ".read(), " + String(varName) + ".pm1())",
    "pm25": "(" + String(varName) + ".read(), " + String(varName) + ".pm25())",
    "pm4": "(" + String(varName) + ".read(), " + String(varName) + ".pm4())",
    "pm10": "(" + String(varName) + ".read(), " + String(varName) + ".pm10())",
    "humidity": "(" + String(varName) + ".read(), " + String(varName) + ".humidity())",
    "temperature": "(" + String(varName) + ".read(), " + String(varName) + ".temperature())",
    "voc": "(" + String(varName) + ".read(), " + String(varName) + ".vocIndex())",
    "nox": "(" + String(varName) + ".read(), " + String(varName) + ".noxIndex())",
    "ready": String(varName) + ".dataReady()"
  };
  return [expressions[data] || expressions["pm1"], generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['sensirion_sen5x_action'] = function(block, generator) {
  sensirion_sen5xEnsureLibrary(generator);
  var varName = sensirion_sen5xVariable(block);
  sensirion_sen5xEnsureExtras(generator, varName);
  var action = block.getFieldValue('ACTION') || "start";
  var actions = {
    "start": String(varName) + ".startMeasurement();",
    "stop": String(varName) + ".stopMeasurement();",
    "clean": String(varName) + ".startFanCleaning();",
    "reset": String(varName) + ".reset();"
  };
  return (actions[action] || actions["start"]) + '\n';
};

