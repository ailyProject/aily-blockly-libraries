function htu21dEnsureLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('HTU21D', '#include <SparkFun_HTU21D_Breakout_Arduino_Library/SparkFunHTU21D.h>');
}

function htu21dGetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'htu21d');
}

function htu21dAttachVar(block) {
  if (block._htu21dVarAttached) return;
  block._htu21dVarAttached = true;
  block._htu21dVarLastName = block.getFieldValue('VAR') || 'htu21d';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._htu21dVarLastName, 'HTU21D');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._htu21dVarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._htu21dVarLastName, newName, 'HTU21D');
      block._htu21dVarLastName = newName;
    }
  };
}

Arduino.forBlock['htu21d_init'] = function(block, generator) {
  htu21dAttachVar(block);
  htu21dEnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'htu21d';
  generator.addVariable(varName, 'HTU21D ' + varName + ';');
  return 'Wire.begin();\n' + varName + '.begin();\n';
};

Arduino.forBlock['htu21d_read_humidity'] = function(block, generator) {
  htu21dEnsureLib(generator);
  return [htu21dGetVar(block) + '.readHumidity()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['htu21d_read_temperature'] = function(block, generator) {
  htu21dEnsureLib(generator);
  return [htu21dGetVar(block) + '.readTemperature()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['htu21d_set_resolution'] = function(block, generator) {
  htu21dEnsureLib(generator);
  var res = block.getFieldValue('RES') || '0x00';
  return htu21dGetVar(block) + '.setResolution(' + res + ');\n';
};
