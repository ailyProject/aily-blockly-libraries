function mma8452qEnsureLibrary(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('MMA8452Q', '#include <SparkFun_MMA8452Q_Arduino_Library/SparkFun_MMA8452Q.h>');
}

function mma8452qGetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'accel');
}

function mma8452qAttachVar(block) {
  if (block._mma8452qVarAttached) return;
  block._mma8452qVarAttached = true;
  block._mma8452qVarLastName = block.getFieldValue('VAR') || 'accel';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._mma8452qVarLastName, 'MMA8452Q');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._mma8452qVarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._mma8452qVarLastName, newName, 'MMA8452Q');
      block._mma8452qVarLastName = newName;
    }
  };
}

Arduino.forBlock['mma8452q_init'] = function(block, generator) {
  mma8452qAttachVar(block);
  mma8452qEnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'accel';
  var scale = block.getFieldValue('SCALE') || 'SCALE_2G';
  generator.addVariable(varName, 'MMA8452Q ' + varName + ';');
  return 'Wire.begin();\n' + varName + '.begin();\n' + varName + '.init(' + scale + ');\n';
};

Arduino.forBlock['mma8452q_available'] = function(block, generator) {
  mma8452qEnsureLibrary(generator);
  return [mma8452qGetVar(block) + '.available()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mma8452q_read'] = function(block, generator) {
  mma8452qEnsureLibrary(generator);
  return mma8452qGetVar(block) + '.read();\n';
};

Arduino.forBlock['mma8452q_get_axis_raw'] = function(block, generator) {
  mma8452qEnsureLibrary(generator);
  var varName = mma8452qGetVar(block);
  var axis = block.getFieldValue('AXIS') || 'X';
  var methodMap = { 'X': 'getX', 'Y': 'getY', 'Z': 'getZ' };
  return [varName + '.' + methodMap[axis] + '()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mma8452q_get_axis_g'] = function(block, generator) {
  mma8452qEnsureLibrary(generator);
  var varName = mma8452qGetVar(block);
  var axis = block.getFieldValue('AXIS') || 'X';
  var methodMap = { 'X': 'getCalculatedX', 'Y': 'getCalculatedY', 'Z': 'getCalculatedZ' };
  return [varName + '.' + methodMap[axis] + '()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mma8452q_set_scale'] = function(block, generator) {
  mma8452qEnsureLibrary(generator);
  var varName = mma8452qGetVar(block);
  var scale = block.getFieldValue('SCALE') || 'SCALE_2G';
  return varName + '.setScale(' + scale + ');\n';
};

Arduino.forBlock['mma8452q_set_odr'] = function(block, generator) {
  mma8452qEnsureLibrary(generator);
  var varName = mma8452qGetVar(block);
  var odr = block.getFieldValue('ODR') || 'ODR_800';
  return varName + '.setDataRate(' + odr + ');\n';
};

Arduino.forBlock['mma8452q_read_pl'] = function(block, generator) {
  mma8452qEnsureLibrary(generator);
  return [mma8452qGetVar(block) + '.readPL()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mma8452q_orientation'] = function(block, generator) {
  mma8452qEnsureLibrary(generator);
  var varName = mma8452qGetVar(block);
  var orient = block.getFieldValue('ORIENT') || 'isRight';
  return [varName + '.' + orient + '()', generator.ORDER_FUNCTION_CALL];
};
