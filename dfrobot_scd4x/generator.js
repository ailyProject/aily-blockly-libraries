// _varMonitorAttached: the init field hook below monitors variable renames.
function dfrobot_scd4xEnsureLibrary(generator) {
  generator.addLibrary('dfrobot_scd4x_0', '#include <DFRobot_SCD4X.h>');
}

function dfrobot_scd4xVariable(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'scd4x');
}

function dfrobot_scd4xAttachVariable(block) {
  if (block._dfrobot_scd4xVariableAttached) return;
  block._dfrobot_scd4xVariableAttached = true;
  block._dfrobot_scd4xLastName = block.getFieldValue('VAR') || 'scd4x';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._dfrobot_scd4xLastName, 'DFRobot_SCD4X');
  var field = block.getField('VAR');
  if (!field) return;
  var originalFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinish === 'function') originalFinish.call(this, newName);
    if (newName && newName !== block._dfrobot_scd4xLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._dfrobot_scd4xLastName, newName, 'DFRobot_SCD4X');
      block._dfrobot_scd4xLastName = newName;
    }
  };
}

function dfrobot_scd4xEnsureExtras(generator, varName) {
  generator.addObject('dfrobot_scd4x_extra_0_' + varName, "DFRobot_SCD4X::sSensorMeasurement_t " + String(varName) + "Data;");
}

Arduino.forBlock['dfrobot_scd4x_init'] = function(block, generator) {
  dfrobot_scd4xAttachVariable(block);
  dfrobot_scd4xEnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'scd4x';
  var wire = block.getFieldValue('WIRE') || "Wire";
  var addr = block.getFieldValue('ADDR') || "0x62";
  var objectCode = "DFRobot_SCD4X " + String(varName) + "(&" + String(wire) + ", " + String(addr) + ");";
  generator.addObject('dfrobot_scd4x_object_' + varName, objectCode);
  dfrobot_scd4xEnsureExtras(generator, varName);
  generator.addSetupBegin('dfrobot_scd4x_wire_' + wire, wire + '.begin();');
  var beginCall = String(varName) + ".begin()";
  generator.addSetupBegin('dfrobot_scd4x_begin_' + varName, 'while (!(' + beginCall + ')) { delay(100); }');
  generator.addSetupBegin('dfrobot_scd4x_after_' + varName, String(varName) + ".enablePeriodMeasure(SCD4X_START_PERIODIC_MEASURE);");
  return '';
};

Arduino.forBlock['dfrobot_scd4x_read'] = function(block, generator) {
  dfrobot_scd4xEnsureLibrary(generator);
  var varName = dfrobot_scd4xVariable(block);
  dfrobot_scd4xEnsureExtras(generator, varName);
  var data = block.getFieldValue('DATA') || "co2";
  var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  var expressions = {
    "co2": "(" + String(varName) + ".readMeasurement(&" + String(varName) + "Data), " + String(varName) + "Data.CO2ppm)",
    "temperature": "(" + String(varName) + ".readMeasurement(&" + String(varName) + "Data), " + String(varName) + "Data.temp)",
    "humidity": "(" + String(varName) + ".readMeasurement(&" + String(varName) + "Data), " + String(varName) + "Data.humidity)",
    "ready": String(varName) + ".getDataReadyStatus()"
  };
  return [expressions[data] || expressions["co2"], generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['dfrobot_scd4x_action'] = function(block, generator) {
  dfrobot_scd4xEnsureLibrary(generator);
  var varName = dfrobot_scd4xVariable(block);
  dfrobot_scd4xEnsureExtras(generator, varName);
  var action = block.getFieldValue('ACTION') || "start";
  var actions = {
    "start": String(varName) + ".enablePeriodMeasure(SCD4X_START_PERIODIC_MEASURE);",
    "low_power": String(varName) + ".enablePeriodMeasure(SCD4X_START_LOW_POWER_MEASURE);",
    "stop": String(varName) + ".enablePeriodMeasure(SCD4X_STOP_PERIODIC_MEASURE);",
    "persist": String(varName) + ".persistSettings();",
    "reset": String(varName) + ".performFactoryReset();"
  };
  return (actions[action] || actions["start"]) + '\n';
};

Arduino.forBlock['dfrobot_scd4x_set'] = function(block, generator) {
  dfrobot_scd4xEnsureLibrary(generator);
  var varName = dfrobot_scd4xVariable(block);
  dfrobot_scd4xEnsureExtras(generator, varName);
  var setting = block.getFieldValue('SETTING') || "temperature_offset";
  var value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || "0";
  var settings = {
    "temperature_offset": String(varName) + ".setTempComp((float)" + String(value) + ");",
    "altitude": String(varName) + ".setSensorAltitude((uint16_t)" + String(value) + ");",
    "pressure": String(varName) + ".setAmbientPressure((uint32_t)" + String(value) + ");",
    "auto_calibration": String(varName) + ".setAutoCalibMode((bool)" + String(value) + ");"
  };
  return (settings[setting] || settings["temperature_offset"]) + '\n';
};

