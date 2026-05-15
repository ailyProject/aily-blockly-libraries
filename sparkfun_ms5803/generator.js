function ms5803EnsureLibrary(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('MS5803', '#include <SparkFun_MS5803-14BA_Breakout_Arduino_Library/SparkFun_MS5803_I2C.h>');
}

function ms5803GetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'ms5803');
}

function ms5803AttachVar(block) {
  if (block._ms5803VarAttached) return;
  block._ms5803VarAttached = true;
  block._ms5803VarLastName = block.getFieldValue('VAR') || 'ms5803';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._ms5803VarLastName, 'MS5803');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._ms5803VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._ms5803VarLastName, newName, 'MS5803');
      block._ms5803VarLastName = newName;
    }
  };
}

Arduino.forBlock['ms5803_init'] = function(block, generator) {
  ms5803AttachVar(block);
  ms5803EnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'ms5803';
  var address = block.getFieldValue('ADDRESS') || 'ADDRESS_HIGH';
  generator.addVariable(varName, 'MS5803 ' + varName + '(' + address + ');');
  return 'Wire.begin();\n' + varName + '.reset();\n' + varName + '.begin();\n';
};

Arduino.forBlock['ms5803_get_temperature'] = function(block, generator) {
  ms5803EnsureLibrary(generator);
  var varName = ms5803GetVar(block);
  var unit = block.getFieldValue('UNIT') || 'CELSIUS';
  var prec = block.getFieldValue('PREC') || 'ADC_512';
  return [varName + '.getTemperature(' + unit + ', ' + prec + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['ms5803_get_pressure'] = function(block, generator) {
  ms5803EnsureLibrary(generator);
  var varName = ms5803GetVar(block);
  var prec = block.getFieldValue('PREC') || 'ADC_512';
  return [varName + '.getPressure(' + prec + ')', generator.ORDER_FUNCTION_CALL];
};
