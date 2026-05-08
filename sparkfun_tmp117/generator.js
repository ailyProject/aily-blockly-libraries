function tmp117EnsureLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('SparkFun_TMP117', '#include <SparkFun_TMP117.h>');
}

function tmp117GetVar(block) {
  var f = block.getField('VAR');
  return f ? f.getText() : (block.getFieldValue('VAR') || 'tmp117');
}

function tmp117AttachVar(block) {
  if (block._tmp117VarAttached) return;
  block._tmp117VarAttached = true;
  block._tmp117VarLastName = block.getFieldValue('VAR') || 'tmp117';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._tmp117VarLastName, 'TMP117');
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._tmp117VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._tmp117VarLastName, newName, 'TMP117');
      block._tmp117VarLastName = newName;
    }
  };
}

Arduino.forBlock['tmp117_init'] = function(block, generator) {
  tmp117AttachVar(block);
  tmp117EnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'tmp117';
  var addr = block.getFieldValue('ADDR') || '0x48';
  generator.addVariable(varName, 'TMP117 ' + varName + ';');
  return 'Wire.begin();\n' + varName + '.begin(' + addr + ');\n';
};

Arduino.forBlock['tmp117_read_temp_c'] = function(block, generator) {
  tmp117EnsureLib(generator);
  return [tmp117GetVar(block) + '.readTempC()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['tmp117_read_temp_f'] = function(block, generator) {
  tmp117EnsureLib(generator);
  return [tmp117GetVar(block) + '.readTempF()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['tmp117_data_ready'] = function(block, generator) {
  tmp117EnsureLib(generator);
  return [tmp117GetVar(block) + '.dataReady()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['tmp117_set_conversion_mode'] = function(block, generator) {
  tmp117EnsureLib(generator);
  var varName = tmp117GetVar(block);
  var mode = block.getFieldValue('MODE') || 'CONTINUOUS';
  var modeMap = {
    'CONTINUOUS': varName + '.setContinuousConversionMode();\n',
    'ONESHOT': varName + '.setOneShotMode();\n',
    'SHUTDOWN': varName + '.setShutdownMode();\n'
  };
  return modeMap[mode] || (varName + '.setContinuousConversionMode();\n');
};

Arduino.forBlock['tmp117_set_high_limit'] = function(block, generator) {
  tmp117EnsureLib(generator);
  var temp = generator.valueToCode(block, 'TEMP', generator.ORDER_ATOMIC) || '75';
  return tmp117GetVar(block) + '.setHighLimit(' + temp + ');\n';
};

Arduino.forBlock['tmp117_set_low_limit'] = function(block, generator) {
  tmp117EnsureLib(generator);
  var temp = generator.valueToCode(block, 'TEMP', generator.ORDER_ATOMIC) || '0';
  return tmp117GetVar(block) + '.setLowLimit(' + temp + ');\n';
};
