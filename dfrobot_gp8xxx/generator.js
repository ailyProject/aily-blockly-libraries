// _varMonitorAttached: the init field hook below monitors variable renames.
function dfrobot_gp8xxxEnsureLibrary(generator) {
  generator.addLibrary('dfrobot_gp8xxx_0', '#include <DFRobot_GP8XXX.h>');
}

function dfrobot_gp8xxxVariable(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'gp8xxx');
}

function dfrobot_gp8xxxAttachVariable(block) {
  if (block._dfrobot_gp8xxxVariableAttached) return;
  block._dfrobot_gp8xxxVariableAttached = true;
  block._dfrobot_gp8xxxLastName = block.getFieldValue('VAR') || 'gp8xxx';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._dfrobot_gp8xxxLastName, 'DFRobot_GP8XXX_IIC');
  var field = block.getField('VAR');
  if (!field) return;
  var originalFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinish === 'function') originalFinish.call(this, newName);
    if (newName && newName !== block._dfrobot_gp8xxxLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._dfrobot_gp8xxxLastName, newName, 'DFRobot_GP8XXX_IIC');
      block._dfrobot_gp8xxxLastName = newName;
    }
  };
}

function dfrobot_gp8xxxEnsureExtras(generator, varName) {
  // No cached data objects required.
}

Arduino.forBlock['dfrobot_gp8xxx_init'] = function(block, generator) {
  dfrobot_gp8xxxAttachVariable(block);
  dfrobot_gp8xxxEnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'gp8xxx';
  var wire = block.getFieldValue('WIRE') || "Wire";
  var model = block.getFieldValue('MODEL') || "12";
  var addr = block.getFieldValue('ADDR') || "0x58";
  var constructorMap = {
  "12": "DFRobot_GP8XXX_IIC $VAR(RESOLUTION_12_BIT, $ADDR, &$WIRE);",
  "15": "DFRobot_GP8XXX_IIC $VAR(RESOLUTION_15_BIT, $ADDR, &$WIRE);",
  "16": "DFRobot_GP8XXX_IIC $VAR(RESOLUTION_16_BIT, $ADDR, &$WIRE);"
};
  var objectCode = constructorMap[model] || constructorMap[Object.keys(constructorMap)[0]];
  objectCode = objectCode.replace(/\$VAR/g, varName);
  objectCode = objectCode.replace(/\$WIRE/g, wire);
  objectCode = objectCode.replace(/\$MODEL/g, model);
  objectCode = objectCode.replace(/\$ADDR/g, addr);
  generator.addObject('dfrobot_gp8xxx_object_' + varName, objectCode);
  dfrobot_gp8xxxEnsureExtras(generator, varName);
  generator.addSetupBegin('dfrobot_gp8xxx_wire_' + wire, wire + '.begin();');
  var beginCall = String(varName) + ".begin()";
  generator.addSetupBegin('dfrobot_gp8xxx_begin_' + varName, 'while ((' + beginCall + ') != 0) { delay(100); }');
  return '';
};

Arduino.forBlock['dfrobot_gp8xxx_action'] = function(block, generator) {
  dfrobot_gp8xxxEnsureLibrary(generator);
  var varName = dfrobot_gp8xxxVariable(block);
  dfrobot_gp8xxxEnsureExtras(generator, varName);
  var action = block.getFieldValue('ACTION') || "store";
  var actions = {
    "store": String(varName) + ".store();"
  };
  return (actions[action] || actions["store"]) + '\n';
};

Arduino.forBlock['dfrobot_gp8xxx_set'] = function(block, generator) {
  dfrobot_gp8xxxEnsureLibrary(generator);
  var varName = dfrobot_gp8xxxVariable(block);
  dfrobot_gp8xxxEnsureExtras(generator, varName);
  var setting = block.getFieldValue('SETTING') || "range";
  var value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || "1";
  var settings = {
    "range": String(varName) + ".setDACOutRange((DFRobot_GP8XXX::eOutPutRange_t)constrain((int)" + String(value) + ", 0, 3));"
  };
  return (settings[setting] || settings["range"]) + '\n';
};

Arduino.forBlock['dfrobot_gp8xxx_write'] = function(block, generator) {
  dfrobot_gp8xxxEnsureLibrary(generator);
  var varName = dfrobot_gp8xxxVariable(block);
  var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  var value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';
  return String(varName) + ".setDACOutVoltage((uint16_t)" + String(value) + ", (uint8_t)constrain((int)" + String(index) + ", 0, 2));" + '\n';
};
