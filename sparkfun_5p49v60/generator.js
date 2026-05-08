function p5v60EnsureLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('SparkFun5P49V60', '#include <SparkFun_Clock_5P49V60_Arduino_Library/SparkFun_5P49V60.h>');
}

function p5v60GetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'clockGen');
}

function p5v60AttachVar(block) {
  if (block._p5v60VarAttached) return;
  block._p5v60VarAttached = true;
  block._p5v60VarLastName = block.getFieldValue('VAR') || 'clockGen';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._p5v60VarLastName, '5P49V60');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._p5v60VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._p5v60VarLastName, newName, '5P49V60');
      block._p5v60VarLastName = newName;
    }
  };
}

Arduino.forBlock['5p49v60_init'] = function(block, generator) {
  p5v60AttachVar(block);
  p5v60EnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'clockGen';
  var addr = block.getFieldValue('ADDRESS') || 'DEF';
  var addrConst = (addr === 'DEF') ? '0x6A' : '0x68';
  generator.addVariable(varName, 'SparkFun_5P49V60 ' + varName + '(' + addrConst + ');');
  return 'Wire.begin();\n' + varName + '.begin();\n';
};

Arduino.forBlock['5p49v60_set_vco'] = function(block, generator) {
  p5v60EnsureLib(generator);
  var freq = generator.valueToCode(block, 'FREQ', generator.ORDER_ATOMIC) || '1600.0';
  return p5v60GetVar(block) + '.setVcoFrequency(' + freq + ');\n';
};

Arduino.forBlock['5p49v60_mux_pll_to_fod'] = function(block, generator) {
  p5v60EnsureLib(generator);
  var ch = block.getFieldValue('CHANNEL') || '1';
  var fnMap = { '1': 'muxPllToFodOne', '2': 'muxPllToFodTwo', '3': 'muxPllToFodThree', '4': 'muxPllToFodFour' };
  return p5v60GetVar(block) + '.' + (fnMap[ch] || 'muxPllToFodOne') + '();\n';
};

Arduino.forBlock['5p49v60_set_clock_freq'] = function(block, generator) {
  p5v60EnsureLib(generator);
  var ch = block.getFieldValue('CHANNEL') || '1';
  var freq = generator.valueToCode(block, 'FREQ', generator.ORDER_ATOMIC) || '16.0';
  var fnMap = {
    '1': 'setClockOneFreq',
    '2': 'setClockTwoFreq',
    '3': 'setClockThrFreq',
    '4': 'setClockFourFreq'
  };
  return p5v60GetVar(block) + '.' + (fnMap[ch] || 'setClockOneFreq') + '(' + freq + ');\n';
};

Arduino.forBlock['5p49v60_set_clock_mode'] = function(block, generator) {
  p5v60EnsureLib(generator);
  var ch = block.getFieldValue('CHANNEL') || '1';
  var mode = block.getFieldValue('MODE') || '0';
  var fnMap = {
    '1': 'clockOneConfigMode',
    '2': 'clockTwoConfigMode',
    '3': 'clockThrConfigMode',
    '4': 'clockFourConfigMode'
  };
  return p5v60GetVar(block) + '.' + (fnMap[ch] || 'clockOneConfigMode') + '(' + mode + ');\n';
};

Arduino.forBlock['5p49v60_skew_clock'] = function(block, generator) {
  p5v60EnsureLib(generator);
  var ch = block.getFieldValue('CHANNEL') || '1';
  var skew = generator.valueToCode(block, 'SKEW', generator.ORDER_ATOMIC) || '0';
  var fnMap = {
    '1': 'skewClockOne',
    '2': 'skewClockTwo',
    '3': 'skewClockThr',
    '4': 'skewClockFour'
  };
  return p5v60GetVar(block) + '.' + (fnMap[ch] || 'skewClockOne') + '(' + skew + ');\n';
};
