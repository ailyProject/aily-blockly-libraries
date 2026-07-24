// _varMonitorAttached: the init field hook below monitors variable renames.
function dfrobot_rainfall_sensorEnsureLibrary(generator) {
  generator.addLibrary('dfrobot_rainfall_sensor_0', '#include <DFRobot_RainfallSensor.h>');
}

function dfrobot_rainfall_sensorVariable(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'rainfall');
}

function dfrobot_rainfall_sensorAttachVariable(block) {
  if (block._dfrobot_rainfall_sensorVariableAttached) return;
  block._dfrobot_rainfall_sensorVariableAttached = true;
  block._dfrobot_rainfall_sensorLastName = block.getFieldValue('VAR') || 'rainfall';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._dfrobot_rainfall_sensorLastName, 'DFRobot_RainfallSensor_I2C');
  var field = block.getField('VAR');
  if (!field) return;
  var originalFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinish === 'function') originalFinish.call(this, newName);
    if (newName && newName !== block._dfrobot_rainfall_sensorLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._dfrobot_rainfall_sensorLastName, newName, 'DFRobot_RainfallSensor_I2C');
      block._dfrobot_rainfall_sensorLastName = newName;
    }
  };
}

function dfrobot_rainfall_sensorEnsureExtras(generator, varName) {
  // No cached data objects required.
}

Arduino.forBlock['dfrobot_rainfall_sensor_init'] = function(block, generator) {
  dfrobot_rainfall_sensorAttachVariable(block);
  dfrobot_rainfall_sensorEnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'rainfall';
  var wire = block.getFieldValue('WIRE') || "Wire";
  var objectCode = "DFRobot_RainfallSensor_I2C " + String(varName) + "(&" + String(wire) + ");";
  generator.addObject('dfrobot_rainfall_sensor_object_' + varName, objectCode);
  dfrobot_rainfall_sensorEnsureExtras(generator, varName);
  generator.addSetupBegin('dfrobot_rainfall_sensor_wire_' + wire, wire + '.begin();');
  var beginCall = String(varName) + ".begin()";
  generator.addSetupBegin('dfrobot_rainfall_sensor_begin_' + varName, 'while (!(' + beginCall + ')) { delay(100); }');
  return '';
};

Arduino.forBlock['dfrobot_rainfall_sensor_read'] = function(block, generator) {
  dfrobot_rainfall_sensorEnsureLibrary(generator);
  var varName = dfrobot_rainfall_sensorVariable(block);
  dfrobot_rainfall_sensorEnsureExtras(generator, varName);
  var data = block.getFieldValue('DATA') || "period";
  var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  var expressions = {
    "period": String(varName) + ".getRainfall((uint8_t)constrain((int)" + String(index) + ", 1, 24))",
    "total": String(varName) + ".getRainfall()",
    "raw": String(varName) + ".getRawData()",
    "working_time": String(varName) + ".getSensorWorkingTime()"
  };
  return [expressions[data] || expressions["period"], generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['dfrobot_rainfall_sensor_set'] = function(block, generator) {
  dfrobot_rainfall_sensorEnsureLibrary(generator);
  var varName = dfrobot_rainfall_sensorVariable(block);
  dfrobot_rainfall_sensorEnsureExtras(generator, varName);
  var setting = block.getFieldValue('SETTING') || "bucket";
  var value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || "0.2794";
  var settings = {
    "bucket": String(varName) + ".setRainAccumulatedValue((float)" + String(value) + ");"
  };
  return (settings[setting] || settings["bucket"]) + '\n';
};

