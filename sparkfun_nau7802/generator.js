function nau7802EnsureLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('SparkFun_Qwiic_Scale_NAU7802', '#include <SparkFun_Qwiic_Scale_NAU7802_Arduino_Library.h>');
}

function nau7802GetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'scale');
}

function nau7802AttachVar(block) {
  if (block._nau7802VarAttached) return;
  block._nau7802VarAttached = true;
  block._nau7802VarLastName = block.getFieldValue('VAR') || 'scale';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._nau7802VarLastName, 'NAU7802Scale');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._nau7802VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._nau7802VarLastName, newName, 'NAU7802Scale');
      block._nau7802VarLastName = newName;
    }
  };
}

Arduino.forBlock['nau7802_init'] = function(block, generator) {
  nau7802AttachVar(block);
  nau7802EnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'scale';
  generator.addVariable(varName, 'NAU7802 ' + varName + ';');
  return varName + '.begin();\n';
};

Arduino.forBlock['nau7802_is_available'] = function(block, generator) {
  nau7802EnsureLib(generator);
  var code = nau7802GetVar(block) + '.available()';
  return [code, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['nau7802_get_reading'] = function(block, generator) {
  nau7802EnsureLib(generator);
  var code = nau7802GetVar(block) + '.getReading()';
  return [code, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['nau7802_get_average'] = function(block, generator) {
  nau7802EnsureLib(generator);
  var varName = nau7802GetVar(block);
  var samples = generator.valueToCode(block, 'SAMPLES', generator.ORDER_NONE) || '8';
  var code = varName + '.getAverage(' + samples + ')';
  return [code, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['nau7802_get_weight'] = function(block, generator) {
  nau7802EnsureLib(generator);
  var code = nau7802GetVar(block) + '.getWeight()';
  return [code, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['nau7802_tare'] = function(block, generator) {
  nau7802EnsureLib(generator);
  return nau7802GetVar(block) + '.calculateZeroOffset();\n';
};

Arduino.forBlock['nau7802_calibrate'] = function(block, generator) {
  nau7802EnsureLib(generator);
  var varName = nau7802GetVar(block);
  var weight = generator.valueToCode(block, 'WEIGHT', generator.ORDER_NONE) || '100.0';
  return varName + '.calculateCalibrationFactor(' + weight + ');\n';
};

Arduino.forBlock['nau7802_set_cal_factor'] = function(block, generator) {
  nau7802EnsureLib(generator);
  var varName = nau7802GetVar(block);
  var factor = generator.valueToCode(block, 'FACTOR', generator.ORDER_NONE) || '1.0';
  return varName + '.setCalibrationFactor(' + factor + ');\n';
};

Arduino.forBlock['nau7802_get_cal_factor'] = function(block, generator) {
  nau7802EnsureLib(generator);
  var code = nau7802GetVar(block) + '.getCalibrationFactor()';
  return [code, generator.ORDER_FUNCTION_CALL];
};
