function microOledEnsureLibrary(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('SPI', '#include <SPI.h>');
  generator.addLibrary('SFE_MicroOLED', '#include <SparkFun_Micro_OLED_Arduino_Library/SFE_MicroOLED.h>');
}

function microOledGetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'oled');
}

function microOledAttachVar(block) {
  if (block._microOledVarAttached) return;
  block._microOledVarAttached = true;
  block._microOledVarLastName = block.getFieldValue('VAR') || 'oled';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._microOledVarLastName, 'MicroOLED');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._microOledVarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._microOledVarLastName, newName, 'MicroOLED');
      block._microOledVarLastName = newName;
    }
  };
}

Arduino.forBlock['micro_oled_init'] = function(block, generator) {
  microOledAttachVar(block);
  microOledEnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'oled';
  var rstPin = block.getFieldValue('RST_PIN') || '9';
  var dcPin = block.getFieldValue('DC_PIN') || '1';
  generator.addVariable(varName, 'MicroOLED ' + varName + '(' + rstPin + ', ' + dcPin + ');');
  return 'Wire.begin();\n' + varName + '.begin();\n' + varName + '.clear(ALL);\n' + varName + '.display();\n';
};

Arduino.forBlock['micro_oled_clear'] = function(block, generator) {
  microOledEnsureLibrary(generator);
  var varName = microOledGetVar(block);
  var mode = block.getFieldValue('MODE') || 'PAGE';
  return varName + '.clear(' + mode + ');\n';
};

Arduino.forBlock['micro_oled_display'] = function(block, generator) {
  microOledEnsureLibrary(generator);
  return microOledGetVar(block) + '.display();\n';
};

Arduino.forBlock['micro_oled_set_cursor'] = function(block, generator) {
  microOledEnsureLibrary(generator);
  var varName = microOledGetVar(block);
  var x = generator.valueToCode(block, 'X', generator.ORDER_NONE) || '0';
  var y = generator.valueToCode(block, 'Y', generator.ORDER_NONE) || '0';
  return varName + '.setCursor(' + x + ', ' + y + ');\n';
};

Arduino.forBlock['micro_oled_print'] = function(block, generator) {
  microOledEnsureLibrary(generator);
  var varName = microOledGetVar(block);
  var text = generator.valueToCode(block, 'TEXT', generator.ORDER_NONE) || '""';
  return varName + '.print(' + text + ');\n';
};

Arduino.forBlock['micro_oled_set_font'] = function(block, generator) {
  microOledEnsureLibrary(generator);
  var varName = microOledGetVar(block);
  var font = block.getFieldValue('FONT') || '0';
  return varName + '.setFontType(' + font + ');\n';
};

Arduino.forBlock['micro_oled_pixel'] = function(block, generator) {
  microOledEnsureLibrary(generator);
  var varName = microOledGetVar(block);
  var x = generator.valueToCode(block, 'X', generator.ORDER_NONE) || '0';
  var y = generator.valueToCode(block, 'Y', generator.ORDER_NONE) || '0';
  return varName + '.pixel(' + x + ', ' + y + ');\n';
};

Arduino.forBlock['micro_oled_line'] = function(block, generator) {
  microOledEnsureLibrary(generator);
  var varName = microOledGetVar(block);
  var x0 = generator.valueToCode(block, 'X0', generator.ORDER_NONE) || '0';
  var y0 = generator.valueToCode(block, 'Y0', generator.ORDER_NONE) || '0';
  var x1 = generator.valueToCode(block, 'X1', generator.ORDER_NONE) || '0';
  var y1 = generator.valueToCode(block, 'Y1', generator.ORDER_NONE) || '0';
  return varName + '.line(' + x0 + ', ' + y0 + ', ' + x1 + ', ' + y1 + ');\n';
};

Arduino.forBlock['micro_oled_rect'] = function(block, generator) {
  microOledEnsureLibrary(generator);
  var varName = microOledGetVar(block);
  var x = generator.valueToCode(block, 'X', generator.ORDER_NONE) || '0';
  var y = generator.valueToCode(block, 'Y', generator.ORDER_NONE) || '0';
  var w = generator.valueToCode(block, 'W', generator.ORDER_NONE) || '10';
  var h = generator.valueToCode(block, 'H', generator.ORDER_NONE) || '10';
  var fill = block.getFieldValue('FILL') || '0';
  if (fill === '1') {
    return varName + '.rectFill(' + x + ', ' + y + ', ' + w + ', ' + h + ');\n';
  } else {
    return varName + '.rect(' + x + ', ' + y + ', ' + w + ', ' + h + ');\n';
  }
};

Arduino.forBlock['micro_oled_circle'] = function(block, generator) {
  microOledEnsureLibrary(generator);
  var varName = microOledGetVar(block);
  var x = generator.valueToCode(block, 'X', generator.ORDER_NONE) || '0';
  var y = generator.valueToCode(block, 'Y', generator.ORDER_NONE) || '0';
  var r = generator.valueToCode(block, 'R', generator.ORDER_NONE) || '5';
  var fill = block.getFieldValue('FILL') || '0';
  if (fill === '1') {
    return varName + '.circleFill(' + x + ', ' + y + ', ' + r + ');\n';
  } else {
    return varName + '.circle(' + x + ', ' + y + ', ' + r + ');\n';
  }
};

Arduino.forBlock['micro_oled_invert'] = function(block, generator) {
  microOledEnsureLibrary(generator);
  var varName = microOledGetVar(block);
  var inv = block.getFieldValue('INV') || 'false';
  return varName + '.invert(' + inv + ');\n';
};

Arduino.forBlock['micro_oled_contrast'] = function(block, generator) {
  microOledEnsureLibrary(generator);
  var varName = microOledGetVar(block);
  var contrast = generator.valueToCode(block, 'CONTRAST', generator.ORDER_NONE) || '100';
  return varName + '.contrast(' + contrast + ');\n';
};
