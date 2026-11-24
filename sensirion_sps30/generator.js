// _varMonitorAttached: the init field hook below monitors variable renames.
function sensirion_sps30EnsureLibrary(generator) {
  generator.addLibrary('sensirion_sps30_0', '#include <Aily_SPS30.h>');
}

function sensirion_sps30Variable(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'sps30');
}

function sensirion_sps30AttachVariable(block) {
  if (block._sensirion_sps30VariableAttached) return;
  block._sensirion_sps30VariableAttached = true;
  block._sensirion_sps30LastName = block.getFieldValue('VAR') || 'sps30';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._sensirion_sps30LastName, 'AilySPS30');
  var field = block.getField('VAR');
  if (!field) return;
  var originalFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinish === 'function') originalFinish.call(this, newName);
    if (newName && newName !== block._sensirion_sps30LastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._sensirion_sps30LastName, newName, 'AilySPS30');
      block._sensirion_sps30LastName = newName;
    }
  };
}

function sensirion_sps30EnsureExtras(generator, varName) {
  // No cached data objects required.
}

Arduino.forBlock['sensirion_sps30_init'] = function(block, generator) {
  sensirion_sps30AttachVariable(block);
  sensirion_sps30EnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'sps30';
  var wire = block.getFieldValue('WIRE') || "Wire";
  var objectCode = "AilySPS30 " + String(varName) + "(&" + String(wire) + ");";
  generator.addObject('sensirion_sps30_object_' + varName, objectCode);
  sensirion_sps30EnsureExtras(generator, varName);
  generator.addSetupBegin('sensirion_sps30_wire_' + wire, wire + '.begin();');
  generator.addSetupBegin('sensirion_sps30_begin_' + varName, varName + '.ensureMeasurementSession();');
  return '';
};

Arduino.forBlock['sensirion_sps30_read'] = function(block, generator) {
  sensirion_sps30EnsureLibrary(generator);
  var varName = sensirion_sps30Variable(block);
  sensirion_sps30EnsureExtras(generator, varName);
  var data = block.getFieldValue('DATA') || "pm1";
  var getters = { pm1: 'pm1', pm25: 'pm25', pm4: 'pm4', pm10: 'pm10', typical_size: 'typicalSize' };
  var sensor = String(varName);
  if (data === 'ready') {
    return ['(' + sensor + '.ensureMeasurementSession() && ' + sensor + '.dataReady())', generator.ORDER_ATOMIC];
  }
  return ['(' + sensor + '.ensureMeasurementSession() && ' + sensor + '.read() ? ' +
    sensor + '.' + (getters[data] || getters.pm1) + '() : 0.0f)', generator.ORDER_ATOMIC];
};

Arduino.forBlock['sensirion_sps30_action'] = function(block, generator) {
  sensirion_sps30EnsureLibrary(generator);
  var varName = sensirion_sps30Variable(block);
  sensirion_sps30EnsureExtras(generator, varName);
  var action = block.getFieldValue('ACTION') || "start";
  var actions = {
    "start": String(varName) + ".startMeasurement();",
    "stop": String(varName) + ".stopMeasurement();",
    "clean": String(varName) + ".startFanCleaning();",
    "sleep": String(varName) + ".sleep();",
    "wake": String(varName) + ".wake();",
    "reset": String(varName) + ".reset();"
  };
  return 'if (' + varName + '.ensureMeasurementSession()) { ' + (actions[action] || actions.start) + ' }\n';
};

