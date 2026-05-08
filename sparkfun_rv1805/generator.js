function rv1805EnsureLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('SparkFun_RV1805', '#include <SparkFun_RV1805.h>');
}

function rv1805GetVar(block) {
  var f = block.getField('VAR');
  return f ? f.getText() : (block.getFieldValue('VAR') || 'rtc');
}

function rv1805AttachVar(block) {
  if (block._rv1805VarAttached) return;
  block._rv1805VarAttached = true;
  block._rv1805VarLastName = block.getFieldValue('VAR') || 'rtc';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._rv1805VarLastName, 'RV1805');
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._rv1805VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._rv1805VarLastName, newName, 'RV1805');
      block._rv1805VarLastName = newName;
    }
  };
}

Arduino.forBlock['rv1805_init'] = function(block, generator) {
  rv1805AttachVar(block);
  rv1805EnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'rtc';
  generator.addVariable(varName, 'RV1805 ' + varName + ';');
  return 'Wire.begin();\n' + varName + '.begin();\n';
};

Arduino.forBlock['rv1805_set_time'] = function(block, generator) {
  rv1805EnsureLib(generator);
  var varName = rv1805GetVar(block);
  var year = generator.valueToCode(block, 'YEAR', generator.ORDER_NONE) || '25';
  var month = generator.valueToCode(block, 'MONTH', generator.ORDER_NONE) || '1';
  var date = generator.valueToCode(block, 'DATE', generator.ORDER_NONE) || '1';
  var hour = generator.valueToCode(block, 'HOUR', generator.ORDER_NONE) || '0';
  var min = generator.valueToCode(block, 'MINUTE', generator.ORDER_NONE) || '0';
  var sec = generator.valueToCode(block, 'SECOND', generator.ORDER_NONE) || '0';
  return varName + '.setTime(0, ' + sec + ', ' + min + ', ' + hour + ', ' + date + ', ' + month + ', ' + year + ', 0);\n';
};

Arduino.forBlock['rv1805_update_time'] = function(block, generator) {
  rv1805EnsureLib(generator);
  return rv1805GetVar(block) + '.updateTime();\n';
};

Arduino.forBlock['rv1805_get_time_field'] = function(block, generator) {
  rv1805EnsureLib(generator);
  var field = block.getFieldValue('FIELD') || 'Seconds';
  return [rv1805GetVar(block) + '.get' + field + '()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['rv1805_string_time'] = function(block, generator) {
  rv1805EnsureLib(generator);
  return [rv1805GetVar(block) + '.stringTime()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['rv1805_string_date'] = function(block, generator) {
  rv1805EnsureLib(generator);
  return [rv1805GetVar(block) + '.stringDate()', generator.ORDER_FUNCTION_CALL];
};
