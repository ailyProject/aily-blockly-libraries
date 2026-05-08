function max30105EnsureLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('MAX30105', '#include <MAX30105.h>');
}

function max30105GetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'heartSensor');
}

function max30105AttachVar(block) {
  if (block._max30105VarAttached) return;
  block._max30105VarAttached = true;
  block._max30105VarLastName = block.getFieldValue('VAR') || 'heartSensor';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._max30105VarLastName, 'MAX30105');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._max30105VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._max30105VarLastName, newName, 'MAX30105');
      block._max30105VarLastName = newName;
    }
  };
}

Arduino.forBlock['max30105_init'] = function(block, generator) {
  max30105AttachVar(block);
  max30105EnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'heartSensor';
  generator.addVariable(varName, 'MAX30105 ' + varName + ';');
  return 'Wire.begin();\n' + varName + '.begin();\n';
};

Arduino.forBlock['max30105_setup'] = function(block, generator) {
  max30105EnsureLib(generator);
  var varName = max30105GetVar(block);
  var ledPwr = block.getFieldValue('LED_PWR') || '60';
  var sampleAvg = block.getFieldValue('SAMPLE_AVG') || '4';
  var ledMode = block.getFieldValue('LED_MODE') || '2';
  var sampleRate = block.getFieldValue('SAMPLE_RATE') || '100';
  var pulseWidth = block.getFieldValue('PULSE_WIDTH') || '411';
  var adcRange = block.getFieldValue('ADC_RANGE') || '16384';
  return varName + '.setup(' + ledPwr + ', ' + sampleAvg + ', ' + ledMode + ', ' + sampleRate + ', ' + pulseWidth + ', ' + adcRange + ');\n';
};

Arduino.forBlock['max30105_safe_check'] = function(block, generator) {
  max30105EnsureLib(generator);
  var varName = max30105GetVar(block);
  var timeout = generator.valueToCode(block, 'TIMEOUT', generator.ORDER_ATOMIC) || '250';
  return [varName + '.safeCheck(' + timeout + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['max30105_get_red'] = function(block, generator) {
  max30105EnsureLib(generator);
  return [max30105GetVar(block) + '.getRed()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['max30105_get_ir'] = function(block, generator) {
  max30105EnsureLib(generator);
  return [max30105GetVar(block) + '.getIR()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['max30105_get_green'] = function(block, generator) {
  max30105EnsureLib(generator);
  return [max30105GetVar(block) + '.getGreen()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['max30105_shutdown'] = function(block, generator) {
  max30105EnsureLib(generator);
  return max30105GetVar(block) + '.shutDown();\n';
};

Arduino.forBlock['max30105_wakeup'] = function(block, generator) {
  max30105EnsureLib(generator);
  return max30105GetVar(block) + '.wakeUp();\n';
};
