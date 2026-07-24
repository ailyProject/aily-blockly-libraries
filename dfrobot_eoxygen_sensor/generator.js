// _varMonitorAttached: the init field hook below monitors variable renames.
function dfrobot_eoxygen_sensorEnsureLibrary(generator) {
  generator.addLibrary('dfrobot_eoxygen_sensor_0', '#include <DFRobot_EOxygenSensor.h>');
}

function dfrobot_eoxygen_sensorVariable(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'oxygen');
}

function dfrobot_eoxygen_sensorAttachVariable(block) {
  if (block._dfrobot_eoxygen_sensorVariableAttached) return;
  block._dfrobot_eoxygen_sensorVariableAttached = true;
  block._dfrobot_eoxygen_sensorLastName = block.getFieldValue('VAR') || 'oxygen';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._dfrobot_eoxygen_sensorLastName, 'DFRobot_EOxygenSensor_I2C');
  var field = block.getField('VAR');
  if (!field) return;
  var originalFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinish === 'function') originalFinish.call(this, newName);
    if (newName && newName !== block._dfrobot_eoxygen_sensorLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._dfrobot_eoxygen_sensorLastName, newName, 'DFRobot_EOxygenSensor_I2C');
      block._dfrobot_eoxygen_sensorLastName = newName;
    }
  };
}

function dfrobot_eoxygen_sensorEnsureExtras(generator, varName) {
  // No cached data objects required.
}

Arduino.forBlock['dfrobot_eoxygen_sensor_init'] = function(block, generator) {
  dfrobot_eoxygen_sensorAttachVariable(block);
  dfrobot_eoxygen_sensorEnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'oxygen';
  var wire = block.getFieldValue('WIRE') || "Wire";
  var addr = block.getFieldValue('ADDR') || "0x30";
  var objectCode = "DFRobot_EOxygenSensor_I2C " + String(varName) + "(&" + String(wire) + ", " + String(addr) + ");";
  generator.addObject('dfrobot_eoxygen_sensor_object_' + varName, objectCode);
  dfrobot_eoxygen_sensorEnsureExtras(generator, varName);
  generator.addSetupBegin('dfrobot_eoxygen_sensor_wire_' + wire, wire + '.begin();');
  var beginCall = String(varName) + ".begin()";
  generator.addSetupBegin('dfrobot_eoxygen_sensor_begin_' + varName, 'while (!(' + beginCall + ')) { delay(100); }');
  return '';
};

Arduino.forBlock['dfrobot_eoxygen_sensor_read'] = function(block, generator) {
  dfrobot_eoxygen_sensorEnsureLibrary(generator);
  var varName = dfrobot_eoxygen_sensorVariable(block);
  dfrobot_eoxygen_sensorEnsureExtras(generator, varName);
  var data = block.getFieldValue('DATA') || "oxygen";
  var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  var expressions = {
    "oxygen": String(varName) + ".readOxygenConcentration()",
    "calibration": String(varName) + ".readCalibrationState()"
  };
  return [expressions[data] || expressions["oxygen"], generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['dfrobot_eoxygen_sensor_action'] = function(block, generator) {
  dfrobot_eoxygen_sensorEnsureLibrary(generator);
  var varName = dfrobot_eoxygen_sensorVariable(block);
  dfrobot_eoxygen_sensorEnsureExtras(generator, varName);
  var action = block.getFieldValue('ACTION') || "calibrate_air";
  var actions = {
    "calibrate_air": String(varName) + ".calibration_20_9();",
    "calibrate_high": String(varName) + ".calibration_99_5();",
    "clear": String(varName) + ".clearCalibration();"
  };
  return (actions[action] || actions["calibrate_air"]) + '\n';
};

