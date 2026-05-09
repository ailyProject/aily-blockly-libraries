function i2cgpsEnsureLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('SparkFunI2CGPS', '#include <SparkFun_I2C_GPS_Arduino_Library.h>');
}

function i2cgpsGetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'gps');
}

function i2cgpsAttachVar(block) {
  if (block._i2cgpsVarAttached) return;
  block._i2cgpsVarAttached = true;
  block._i2cgpsVarLastName = block.getFieldValue('VAR') || 'gps';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._i2cgpsVarLastName, 'I2CGPS');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._i2cgpsVarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._i2cgpsVarLastName, newName, 'I2CGPS');
      block._i2cgpsVarLastName = newName;
    }
  };
}

Arduino.forBlock['i2cgps_init'] = function(block, generator) {
  i2cgpsAttachVar(block);
  i2cgpsEnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'gps';
  generator.addVariable(varName, 'I2CGPS ' + varName + ';');
  return 'Wire.begin();\n' + varName + '.begin();\n';
};

Arduino.forBlock['i2cgps_available'] = function(block, generator) {
  i2cgpsEnsureLib(generator);
  var varName = i2cgpsGetVar(block);
  return [varName + '.available()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['i2cgps_read'] = function(block, generator) {
  i2cgpsEnsureLib(generator);
  var varName = i2cgpsGetVar(block);
  return [varName + '.read()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['i2cgps_check'] = function(block, generator) {
  i2cgpsEnsureLib(generator);
  var varName = i2cgpsGetVar(block);
  return varName + '.check();\n';
};
