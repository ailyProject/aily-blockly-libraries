function tmp102EnsureLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('SparkFunTMP102', '#include <SparkFunTMP102.h>');
}

function tmp102GetVar(block) {
  var f = block.getField('VAR');
  return f ? f.getText() : (block.getFieldValue('VAR') || 'tmp');
}

function tmp102AttachVar(block) {
  if (block._tmp102VarAttached) return;
  block._tmp102VarAttached = true;
  block._tmp102VarLastName = block.getFieldValue('VAR') || 'tmp';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._tmp102VarLastName, 'TMP102');
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._tmp102VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._tmp102VarLastName, newName, 'TMP102');
      block._tmp102VarLastName = newName;
    }
  };
}

Arduino.forBlock['tmp102_init'] = function(block, generator) {
  tmp102AttachVar(block);
  tmp102EnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'tmp';
  var addr = block.getFieldValue('ADDR') || '0x48';
  generator.addVariable(varName, 'TMP102 ' + varName + ';');
  return 'Wire.begin();\n' + varName + '.begin(' + addr + ');\n';
};

Arduino.forBlock['tmp102_read_temp_c'] = function(block, generator) {
  tmp102EnsureLib(generator);
  return [tmp102GetVar(block) + '.readTempC()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['tmp102_read_temp_f'] = function(block, generator) {
  tmp102EnsureLib(generator);
  return [tmp102GetVar(block) + '.readTempF()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['tmp102_sleep'] = function(block, generator) {
  tmp102EnsureLib(generator);
  return tmp102GetVar(block) + '.sleep();\n';
};

Arduino.forBlock['tmp102_wakeup'] = function(block, generator) {
  tmp102EnsureLib(generator);
  return tmp102GetVar(block) + '.wakeup();\n';
};

Arduino.forBlock['tmp102_alert'] = function(block, generator) {
  tmp102EnsureLib(generator);
  return [tmp102GetVar(block) + '.alert()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['tmp102_set_high_temp_c'] = function(block, generator) {
  tmp102EnsureLib(generator);
  var temp = generator.valueToCode(block, 'TEMP', generator.ORDER_ATOMIC) || '75';
  return tmp102GetVar(block) + '.setHighTempC(' + temp + ');\n';
};

Arduino.forBlock['tmp102_set_low_temp_c'] = function(block, generator) {
  tmp102EnsureLib(generator);
  var temp = generator.valueToCode(block, 'TEMP', generator.ORDER_ATOMIC) || '0';
  return tmp102GetVar(block) + '.setLowTempC(' + temp + ');\n';
};
