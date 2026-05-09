function qwiicOpenLogEnsureLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('SparkFun_Qwiic_OpenLog', '#include <SparkFun_Qwiic_OpenLog_Arduino_Library.h>');
}

function qwiicOpenLogGetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'logger');
}

function qwiicOpenLogAttachVar(block) {
  if (block._openlogVarAttached) return;
  block._openlogVarAttached = true;
  block._openlogVarLastName = block.getFieldValue('VAR') || 'logger';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._openlogVarLastName, 'QwiicOpenLog');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._openlogVarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._openlogVarLastName, newName, 'QwiicOpenLog');
      block._openlogVarLastName = newName;
    }
  };
}

Arduino.forBlock['qwiic_openlog_init'] = function(block, generator) {
  qwiicOpenLogAttachVar(block);
  qwiicOpenLogEnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'logger';
  generator.addVariable(varName, 'OpenLog ' + varName + ';');
  return varName + '.begin();\n';
};

Arduino.forBlock['qwiic_openlog_append'] = function(block, generator) {
  qwiicOpenLogEnsureLib(generator);
  var varName = qwiicOpenLogGetVar(block);
  var filename = generator.valueToCode(block, 'FILENAME', generator.ORDER_NONE) || '"log.txt"';
  return varName + '.append(' + filename + ');\n';
};

Arduino.forBlock['qwiic_openlog_print'] = function(block, generator) {
  qwiicOpenLogEnsureLib(generator);
  var varName = qwiicOpenLogGetVar(block);
  var data = generator.valueToCode(block, 'DATA', generator.ORDER_NONE) || '""';
  return varName + '.print(' + data + ');\n';
};

Arduino.forBlock['qwiic_openlog_println'] = function(block, generator) {
  qwiicOpenLogEnsureLib(generator);
  var varName = qwiicOpenLogGetVar(block);
  var data = generator.valueToCode(block, 'DATA', generator.ORDER_NONE) || '""';
  return varName + '.println(' + data + ');\n';
};

Arduino.forBlock['qwiic_openlog_sync'] = function(block, generator) {
  qwiicOpenLogEnsureLib(generator);
  return qwiicOpenLogGetVar(block) + '.syncFile();\n';
};

Arduino.forBlock['qwiic_openlog_mkdir'] = function(block, generator) {
  qwiicOpenLogEnsureLib(generator);
  var varName = qwiicOpenLogGetVar(block);
  var dirname = generator.valueToCode(block, 'DIRNAME', generator.ORDER_NONE) || '"newdir"';
  return varName + '.makeDirectory(' + dirname + ');\n';
};

Arduino.forBlock['qwiic_openlog_cd'] = function(block, generator) {
  qwiicOpenLogEnsureLib(generator);
  var varName = qwiicOpenLogGetVar(block);
  var dirname = generator.valueToCode(block, 'DIRNAME', generator.ORDER_NONE) || '"/"';
  return varName + '.changeDirectory(' + dirname + ');\n';
};
