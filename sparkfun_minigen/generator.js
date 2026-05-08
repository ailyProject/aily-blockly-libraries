function minigenEnsureLibrary(generator) {
  generator.addLibrary('SPI', '#include <SPI.h>');
  generator.addLibrary('MiniGen', '#include <SparkFun_MiniGen_Arduino_Library/SparkFun_MiniGen.h>');
}

function minigenGetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'minigen');
}

function minigenAttachVar(block) {
  if (block._minigenVarAttached) return;
  block._minigenVarAttached = true;
  block._minigenVarLastName = block.getFieldValue('VAR') || 'minigen';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._minigenVarLastName, 'MiniGen');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._minigenVarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._minigenVarLastName, newName, 'MiniGen');
      block._minigenVarLastName = newName;
    }
  };
}

Arduino.forBlock['minigen_init'] = function(block, generator) {
  minigenAttachVar(block);
  minigenEnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'minigen';
  var fsyncPin = block.getFieldValue('FSYNC_PIN') || '10';
  generator.addVariable(varName, 'MiniGen ' + varName + '(' + fsyncPin + ');');
  return '';
};

Arduino.forBlock['minigen_reset'] = function(block, generator) {
  minigenEnsureLibrary(generator);
  return minigenGetVar(block) + '.reset();\n';
};

Arduino.forBlock['minigen_set_mode'] = function(block, generator) {
  minigenEnsureLibrary(generator);
  var varName = minigenGetVar(block);
  var mode = block.getFieldValue('MODE') || 'MiniGen::SINE';
  return varName + '.setMode(' + mode + ');\n';
};

Arduino.forBlock['minigen_set_freq'] = function(block, generator) {
  minigenEnsureLibrary(generator);
  var varName = minigenGetVar(block);
  var reg = block.getFieldValue('REG') || 'MiniGen::FREQ0';
  var freq = generator.valueToCode(block, 'FREQ', generator.ORDER_NONE) || '1000';
  return varName + '.adjustFreq(' + reg + ', (uint32_t)(' + freq + '));\n';
};

Arduino.forBlock['minigen_select_freq_reg'] = function(block, generator) {
  minigenEnsureLibrary(generator);
  var varName = minigenGetVar(block);
  var reg = block.getFieldValue('REG') || 'MiniGen::FREQ0';
  return varName + '.selectFreqReg(' + reg + ');\n';
};

Arduino.forBlock['minigen_set_phase'] = function(block, generator) {
  minigenEnsureLibrary(generator);
  var varName = minigenGetVar(block);
  var reg = block.getFieldValue('REG') || 'MiniGen::PHASE0';
  var phase = generator.valueToCode(block, 'PHASE', generator.ORDER_NONE) || '0';
  return varName + '.adjustPhaseShift(' + reg + ', (uint16_t)(' + phase + '));\n';
};
