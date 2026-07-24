// _varMonitorAttached: the init field hook below monitors variable renames.
function dfrobot_human_detectionEnsureLibrary(generator) {
  generator.addLibrary('dfrobot_human_detection_0', '#include <DFRobot_HumanDetection.h>');
}

function dfrobot_human_detectionVariable(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'human');
}

function dfrobot_human_detectionAttachVariable(block) {
  if (block._dfrobot_human_detectionVariableAttached) return;
  block._dfrobot_human_detectionVariableAttached = true;
  block._dfrobot_human_detectionLastName = block.getFieldValue('VAR') || 'human';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._dfrobot_human_detectionLastName, 'DFRobot_HumanDetection');
  var field = block.getField('VAR');
  if (!field) return;
  var originalFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinish === 'function') originalFinish.call(this, newName);
    if (newName && newName !== block._dfrobot_human_detectionLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._dfrobot_human_detectionLastName, newName, 'DFRobot_HumanDetection');
      block._dfrobot_human_detectionLastName = newName;
    }
  };
}

function dfrobot_human_detectionEnsureExtras(generator, varName) {
  // No cached data objects required.
}

Arduino.forBlock['dfrobot_human_detection_init'] = function(block, generator) {
  dfrobot_human_detectionAttachVariable(block);
  dfrobot_human_detectionEnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'human';
  var serial = block.getFieldValue('SERIAL') || "Serial1";
  var objectCode = "DFRobot_HumanDetection " + String(varName) + "(&" + String(serial) + ");";
  generator.addObject('dfrobot_human_detection_object_' + varName, objectCode);
  dfrobot_human_detectionEnsureExtras(generator, varName);
  generator.addSetupBegin('dfrobot_human_detection_serial_' + serial, serial + '.begin(115200);');
  var beginCall = String(varName) + ".begin()";
  generator.addSetupBegin('dfrobot_human_detection_begin_' + varName, 'while ((' + beginCall + ') != 0) { delay(100); }');
  generator.addSetupBegin('dfrobot_human_detection_after_' + varName, String(varName) + ".configWorkMode(" + String(varName) + ".eSleepMode);");
  return '';
};

Arduino.forBlock['dfrobot_human_detection_read'] = function(block, generator) {
  dfrobot_human_detectionEnsureLibrary(generator);
  var varName = dfrobot_human_detectionVariable(block);
  dfrobot_human_detectionEnsureExtras(generator, varName);
  var data = block.getFieldValue('DATA') || "presence";
  var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  var expressions = {
    "presence": String(varName) + ".smHumanData(" + String(varName) + ".eHumanPresence)",
    "movement": String(varName) + ".smHumanData(" + String(varName) + ".eHumanMovement)",
    "range": String(varName) + ".smHumanData(" + String(varName) + ".eHumanMovingRange)",
    "distance": String(varName) + ".smHumanData(" + String(varName) + ".eHumanDistance)",
    "heart_rate": String(varName) + ".getHeartRate()",
    "breathing": String(varName) + ".getBreatheValue()",
    "mode": String(varName) + ".getWorkMode()"
  };
  return [expressions[data] || expressions["presence"], generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['dfrobot_human_detection_action'] = function(block, generator) {
  dfrobot_human_detectionEnsureLibrary(generator);
  var varName = dfrobot_human_detectionVariable(block);
  dfrobot_human_detectionEnsureExtras(generator, varName);
  var action = block.getFieldValue('ACTION') || "sleep_mode";
  var actions = {
    "sleep_mode": String(varName) + ".configWorkMode(" + String(varName) + ".eSleepMode);",
    "fall_mode": String(varName) + ".configWorkMode(" + String(varName) + ".eFallingMode);"
  };
  return (actions[action] || actions["sleep_mode"]) + '\n';
};

