function hih4030EnsureLib(generator) {
  generator.addLibrary('HIH4030', '#include <SparkFun_HIH4030_Arduino_Library/SparkFun_HIH4030.h>');
}

function hih4030GetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'hih4030');
}

function hih4030AttachVar(block) {
  if (block._hih4030VarAttached) return;
  block._hih4030VarAttached = true;
  block._hih4030VarLastName = block.getFieldValue('VAR') || 'hih4030';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._hih4030VarLastName, 'HIH4030');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._hih4030VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._hih4030VarLastName, newName, 'HIH4030');
      block._hih4030VarLastName = newName;
    }
  };
}

Arduino.forBlock['hih4030_init'] = function(block, generator) {
  hih4030AttachVar(block);
  hih4030EnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'hih4030';
  var pin = block.getFieldValue('PIN') || '0';
  var voltage = block.getFieldValue('VOLTAGE') || '5.0';
  generator.addVariable(varName, 'HIH4030 ' + varName + '(' + pin + ', ' + voltage + ');');
  return '';
};

Arduino.forBlock['hih4030_get_rh'] = function(block, generator) {
  hih4030EnsureLib(generator);
  return [hih4030GetVar(block) + '.getSensorRH()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['hih4030_get_true_rh'] = function(block, generator) {
  hih4030EnsureLib(generator);
  var temp = generator.valueToCode(block, 'TEMP', generator.ORDER_ATOMIC) || '25.0';
  return [hih4030GetVar(block) + '.getTrueRH(' + temp + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['hih4030_vout'] = function(block, generator) {
  hih4030EnsureLib(generator);
  return [hih4030GetVar(block) + '.vout()', generator.ORDER_FUNCTION_CALL];
};
