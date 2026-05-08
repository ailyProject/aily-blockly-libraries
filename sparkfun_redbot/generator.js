function redbotEnsureLib(generator) {
  generator.addLibrary('SparkFun_RedBot', '#include <RedBot.h>');
}

function redbotGetVar(block) {
  var f = block.getField('VAR');
  return f ? f.getText() : (block.getFieldValue('VAR') || 'motors');
}

function redbotAttachVar(block, typeName) {
  var key = '_redbotVarAttached_' + typeName;
  if (block[key]) return;
  block[key] = true;
  var defaultName = typeName === 'RedBotMotors' ? 'motors' : (typeName === 'RedBotSensor' ? 'sensor1' : 'bumper1');
  block['_redbotVarLastName_' + typeName] = block.getFieldValue('VAR') || defaultName;
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block['_redbotVarLastName_' + typeName], typeName);
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    var lastName = block['_redbotVarLastName_' + typeName];
    if (newName && newName !== lastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, lastName, newName, typeName);
      block['_redbotVarLastName_' + typeName] = newName;
    }
  };
}

Arduino.forBlock['redbot_motors_init'] = function(block, generator) {
  redbotAttachVar(block, 'RedBotMotors');
  redbotEnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'motors';
  generator.addVariable(varName, 'RedBotMotors ' + varName + ';');
  return '';
};

Arduino.forBlock['redbot_motors_drive'] = function(block, generator) {
  redbotEnsureLib(generator);
  var speed = generator.valueToCode(block, 'SPEED', generator.ORDER_NONE) || '255';
  return redbotGetVar(block) + '.drive(' + speed + ');\n';
};

Arduino.forBlock['redbot_motors_pivot'] = function(block, generator) {
  redbotEnsureLib(generator);
  var speed = generator.valueToCode(block, 'SPEED', generator.ORDER_NONE) || '255';
  return redbotGetVar(block) + '.pivot(' + speed + ');\n';
};

Arduino.forBlock['redbot_motors_stop'] = function(block, generator) {
  redbotEnsureLib(generator);
  return redbotGetVar(block) + '.stop();\n';
};

Arduino.forBlock['redbot_motors_brake'] = function(block, generator) {
  redbotEnsureLib(generator);
  return redbotGetVar(block) + '.brake();\n';
};

Arduino.forBlock['redbot_sensor_init'] = function(block, generator) {
  redbotAttachVar(block, 'RedBotSensor');
  redbotEnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'sensor1';
  var pin = generator.valueToCode(block, 'PIN', generator.ORDER_NONE) || 'A0';
  generator.addVariable(varName, 'RedBotSensor ' + varName + '(' + pin + ');');
  return '';
};

Arduino.forBlock['redbot_sensor_read'] = function(block, generator) {
  redbotEnsureLib(generator);
  return [redbotGetVar(block) + '.read()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['redbot_bumper_init'] = function(block, generator) {
  redbotAttachVar(block, 'RedBotBumper');
  redbotEnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'bumper1';
  var pin = generator.valueToCode(block, 'PIN', generator.ORDER_NONE) || '3';
  generator.addVariable(varName, 'RedBotBumper ' + varName + '(' + pin + ');');
  return '';
};

Arduino.forBlock['redbot_bumper_read'] = function(block, generator) {
  redbotEnsureLib(generator);
  return [redbotGetVar(block) + '.read()', generator.ORDER_FUNCTION_CALL];
};
