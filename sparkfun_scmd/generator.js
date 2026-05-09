function scmdEnsureLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('SparkFun_SCMD', '#include <SCMD.h>');
  generator.addLibrary('SparkFun_SCMD_Config', '#include <SCMD_config.h>');
}

function scmdGetVar(block) {
  var f = block.getField('VAR');
  return f ? f.getText() : (block.getFieldValue('VAR') || 'scmd');
}

function scmdAttachVar(block) {
  if (block._scmdVarAttached) return;
  block._scmdVarAttached = true;
  block._scmdVarLastName = block.getFieldValue('VAR') || 'scmd';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._scmdVarLastName, 'SCMD');
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._scmdVarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._scmdVarLastName, newName, 'SCMD');
      block._scmdVarLastName = newName;
    }
  };
}

Arduino.forBlock['scmd_init'] = function(block, generator) {
  scmdAttachVar(block);
  scmdEnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'scmd';
  generator.addVariable(varName, 'SCMD ' + varName + ';');
  return varName + '.settings.commInterface = I2C_MODE;\n' + varName + '.settings.I2CAddress = 0x5D;\n' + varName + '.begin();\n';
};

Arduino.forBlock['scmd_set_drive'] = function(block, generator) {
  scmdEnsureLib(generator);
  var motor = generator.valueToCode(block, 'MOTOR', generator.ORDER_NONE) || '0';
  var dir = block.getFieldValue('DIR') || '0';
  var level = generator.valueToCode(block, 'LEVEL', generator.ORDER_NONE) || '128';
  return scmdGetVar(block) + '.setDrive(' + motor + ', ' + dir + ', ' + level + ');\n';
};

Arduino.forBlock['scmd_enable'] = function(block, generator) {
  scmdEnsureLib(generator);
  return scmdGetVar(block) + '.enable();\n';
};
