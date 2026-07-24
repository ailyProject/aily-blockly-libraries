// _varMonitorAttached: the init field hook below monitors variable renames.
function adafruit_vl53l7cxEnsureLibrary(generator) {
  generator.addLibrary('adafruit_vl53l7cx_0', '#include <Adafruit_VL53L7CX.h>');
}

function adafruit_vl53l7cxVariable(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'vl53l7cx');
}

function adafruit_vl53l7cxAttachVariable(block) {
  if (block._adafruit_vl53l7cxVariableAttached) return;
  block._adafruit_vl53l7cxVariableAttached = true;
  block._adafruit_vl53l7cxLastName = block.getFieldValue('VAR') || 'vl53l7cx';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._adafruit_vl53l7cxLastName, 'Adafruit_VL53L7CX');
  var field = block.getField('VAR');
  if (!field) return;
  var originalFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinish === 'function') originalFinish.call(this, newName);
    if (newName && newName !== block._adafruit_vl53l7cxLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._adafruit_vl53l7cxLastName, newName, 'Adafruit_VL53L7CX');
      block._adafruit_vl53l7cxLastName = newName;
    }
  };
}

function adafruit_vl53l7cxEnsureExtras(generator, varName) {
  generator.addObject('adafruit_vl53l7cx_extra_0_' + varName, "VL53L7CX_ResultsData " + String(varName) + "Data;");
}

Arduino.forBlock['adafruit_vl53l7cx_init'] = function(block, generator) {
  adafruit_vl53l7cxAttachVariable(block);
  adafruit_vl53l7cxEnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'vl53l7cx';
  var wire = block.getFieldValue('WIRE') || "Wire";
  var addr = block.getFieldValue('ADDR') || "0x29";
  var objectCode = "Adafruit_VL53L7CX " + String(varName) + ";";
  generator.addObject('adafruit_vl53l7cx_object_' + varName, objectCode);
  adafruit_vl53l7cxEnsureExtras(generator, varName);
  generator.addSetupBegin('adafruit_vl53l7cx_wire_' + wire, wire + '.begin();');
  var beginCall = String(varName) + ".begin(" + String(addr) + ", &" + String(wire) + ")";
  generator.addSetupBegin('adafruit_vl53l7cx_begin_' + varName, 'while (!(' + beginCall + ')) { delay(100); }');
  generator.addSetupBegin('adafruit_vl53l7cx_after_' + varName, String(varName) + ".setResolution(VL53L7CX_RESOLUTION_8X8);\n" + String(varName) + ".setRangingFrequency(10);\n" + String(varName) + ".startRanging();");
  return '';
};

Arduino.forBlock['adafruit_vl53l7cx_read'] = function(block, generator) {
  adafruit_vl53l7cxEnsureLibrary(generator);
  var varName = adafruit_vl53l7cxVariable(block);
  adafruit_vl53l7cxEnsureExtras(generator, varName);
  var data = block.getFieldValue('DATA') || "distance";
  var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  var expressions = {
    "distance": "(" + String(varName) + ".isDataReady() && " + String(varName) + ".getRangingData(&" + String(varName) + "Data), " + String(varName) + "Data.distance_mm[constrain((int)" + String(index) + ", 0, 63) * VL53L7CX_NB_TARGET_PER_ZONE])",
    "targets": "(" + String(varName) + ".isDataReady() && " + String(varName) + ".getRangingData(&" + String(varName) + "Data), " + String(varName) + "Data.nb_target_detected[constrain((int)" + String(index) + ", 0, 63)])",
    "reflectance": "(" + String(varName) + ".isDataReady() && " + String(varName) + ".getRangingData(&" + String(varName) + "Data), " + String(varName) + "Data.reflectance[constrain((int)" + String(index) + ", 0, 63) * VL53L7CX_NB_TARGET_PER_ZONE])",
    "status": "(" + String(varName) + ".isDataReady() && " + String(varName) + ".getRangingData(&" + String(varName) + "Data), " + String(varName) + "Data.target_status[constrain((int)" + String(index) + ", 0, 63) * VL53L7CX_NB_TARGET_PER_ZONE])"
  };
  return [expressions[data] || expressions["distance"], generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['adafruit_vl53l7cx_action'] = function(block, generator) {
  adafruit_vl53l7cxEnsureLibrary(generator);
  var varName = adafruit_vl53l7cxVariable(block);
  adafruit_vl53l7cxEnsureExtras(generator, varName);
  var action = block.getFieldValue('ACTION') || "start";
  var actions = {
    "start": String(varName) + ".startRanging();",
    "stop": String(varName) + ".stopRanging();"
  };
  return (actions[action] || actions["start"]) + '\n';
};

Arduino.forBlock['adafruit_vl53l7cx_set'] = function(block, generator) {
  adafruit_vl53l7cxEnsureLibrary(generator);
  var varName = adafruit_vl53l7cxVariable(block);
  adafruit_vl53l7cxEnsureExtras(generator, varName);
  var setting = block.getFieldValue('SETTING') || "frequency";
  var value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || "10";
  var settings = {
    "frequency": String(varName) + ".setRangingFrequency((uint8_t)" + String(value) + ");",
    "resolution": String(varName) + ".setResolution(((int)" + String(value) + " == 16) ? VL53L7CX_RESOLUTION_4X4 : VL53L7CX_RESOLUTION_8X8);"
  };
  return (settings[setting] || settings["frequency"]) + '\n';
};

