// _varMonitorAttached: the init field hook below monitors variable renames.
function dfrobot_ens160EnsureLibrary(generator) {
  generator.addLibrary('dfrobot_ens160_0', '#include <DFRobot_ENS160.h>');
}

function dfrobot_ens160Variable(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'ens160');
}

function dfrobot_ens160AttachVariable(block) {
  if (block._dfrobot_ens160VariableAttached) return;
  block._dfrobot_ens160VariableAttached = true;
  block._dfrobot_ens160LastName = block.getFieldValue('VAR') || 'ens160';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._dfrobot_ens160LastName, 'DFRobot_ENS160_I2C');
  var field = block.getField('VAR');
  if (!field) return;
  var originalFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinish === 'function') originalFinish.call(this, newName);
    if (newName && newName !== block._dfrobot_ens160LastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._dfrobot_ens160LastName, newName, 'DFRobot_ENS160_I2C');
      block._dfrobot_ens160LastName = newName;
    }
  };
}

function dfrobot_ens160EnsureExtras(generator, varName) {
  // No cached data objects required.
}

Arduino.forBlock['dfrobot_ens160_init'] = function(block, generator) {
  dfrobot_ens160AttachVariable(block);
  dfrobot_ens160EnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'ens160';
  var wire = block.getFieldValue('WIRE') || "Wire";
  var addr = block.getFieldValue('ADDR') || "0x53";
  var objectCode = "DFRobot_ENS160_I2C " + String(varName) + "(&" + String(wire) + ", " + String(addr) + ");";
  generator.addObject('dfrobot_ens160_object_' + varName, objectCode);
  dfrobot_ens160EnsureExtras(generator, varName);
  generator.addSetupBegin('dfrobot_ens160_wire_' + wire, wire + '.begin();');
  var beginCall = String(varName) + ".begin()";
  generator.addSetupBegin('dfrobot_ens160_begin_' + varName, 'while ((' + beginCall + ') != 0) { delay(100); }');
  generator.addSetupBegin('dfrobot_ens160_after_' + varName, String(varName) + ".setPWRMode(ENS160_STANDARD_MODE);");
  return '';
};

Arduino.forBlock['dfrobot_ens160_read'] = function(block, generator) {
  dfrobot_ens160EnsureLibrary(generator);
  var varName = dfrobot_ens160Variable(block);
  dfrobot_ens160EnsureExtras(generator, varName);
  var data = block.getFieldValue('DATA') || "aqi";
  var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  var expressions = {
    "aqi": String(varName) + ".getAQI()",
    "tvoc": String(varName) + ".getTVOC()",
    "eco2": String(varName) + ".getECO2()",
    "status": String(varName) + ".getENS160Status()"
  };
  return [expressions[data] || expressions["aqi"], generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['dfrobot_ens160_action'] = function(block, generator) {
  dfrobot_ens160EnsureLibrary(generator);
  var varName = dfrobot_ens160Variable(block);
  dfrobot_ens160EnsureExtras(generator, varName);
  var action = block.getFieldValue('ACTION') || "standard";
  var actions = {
    "standard": String(varName) + ".setPWRMode(ENS160_STANDARD_MODE);",
    "idle": String(varName) + ".setPWRMode(ENS160_IDLE_MODE);",
    "sleep": String(varName) + ".setPWRMode(ENS160_SLEEP_MODE);"
  };
  return (actions[action] || actions["standard"]) + '\n';
};

Arduino.forBlock['dfrobot_ens160_adjust'] = function(block, generator) {
  dfrobot_ens160EnsureLibrary(generator);
  var varName = dfrobot_ens160Variable(block);
  var value1 = generator.valueToCode(block, 'VALUE1', generator.ORDER_ATOMIC) || "25";
  var value2 = generator.valueToCode(block, 'VALUE2', generator.ORDER_ATOMIC) || "50";
  return String(varName) + ".setTempAndHum(" + String(value1) + ", " + String(value2) + ");" + '\n';
};

