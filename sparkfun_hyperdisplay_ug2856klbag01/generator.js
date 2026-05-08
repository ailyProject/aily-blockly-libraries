function ugEnsureLibrary(generator) {
  generator.addLibrary('HyperDisplay_UG2856KLBAG01', '#include <HyperDisplay_UG2856KLBAG01_ArduinoLibrary/HyperDisplay_UG2856KLBAG01.h>');
}

function ugGetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'oled');
}

function ugAttachVar(block) {
  if (block._ugVarAttached) return;
  block._ugVarAttached = true;
  block._ugVarLastName = block.getFieldValue('VAR') || 'oled';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._ugVarLastName, 'UG2856KLBAG01');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._ugVarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._ugVarLastName, newName, 'UG2856KLBAG01');
      block._ugVarLastName = newName;
    }
  };
}

function ugValue(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}

Arduino.forBlock['ug2856_init_i2c'] = function(block, generator) {
  ugAttachVar(block);
  ugEnsureLibrary(generator);
  generator.addLibrary('Wire', '#include <Wire.h>');
  var varName = block.getFieldValue('VAR') || 'oled';
  var wire = block.getFieldValue('WIRE') || 'Wire';
  generator.addVariable(varName, 'UG2856KLBAG01_I2C ' + varName + ';');
  return wire + '.begin();\n' + varName + '.begin(' + wire + ', false, SSD1309_ARD_UNUSED_PIN);\n' + varName + '.clearDisplay();\n';
};

Arduino.forBlock['ug2856_init_spi'] = function(block, generator) {
  ugAttachVar(block);
  ugEnsureLibrary(generator);
  generator.addLibrary('SPI', '#include <SPI.h>');
  var varName = block.getFieldValue('VAR') || 'oled';
  var spi = block.getFieldValue('SPI') || 'SPI';
  var cs = ugValue(block, generator, 'CS', '10');
  var dc = ugValue(block, generator, 'DC', '9');
  generator.addVariable(varName, 'UG2856KLBAG01_SPI ' + varName + ';');
  return spi + '.begin();\n' + varName + '.begin(' + cs + ', ' + dc + ', ' + spi + ');\n' + varName + '.clearDisplay();\n';
};

Arduino.forBlock['ug2856_clear'] = function(block) {
  return ugGetVar(block) + '.clearDisplay();\n';
};

Arduino.forBlock['ug2856_pixel'] = function(block, generator) {
  var action = block.getFieldValue('ACTION') || 'Set';
  var x = ugValue(block, generator, 'X', '0');
  var y = ugValue(block, generator, 'Y', '0');
  return ugGetVar(block) + '.pixel' + action + '(' + x + ', ' + y + ');\n';
};

Arduino.forBlock['ug2856_line'] = function(block, generator) {
  var action = block.getFieldValue('ACTION') || 'Set';
  var x0 = ugValue(block, generator, 'X0', '0');
  var y0 = ugValue(block, generator, 'Y0', '0');
  var x1 = ugValue(block, generator, 'X1', '127');
  var y1 = ugValue(block, generator, 'Y1', '63');
  var width = ugValue(block, generator, 'WIDTH', '1');
  return ugGetVar(block) + '.line' + action + '(' + x0 + ', ' + y0 + ', ' + x1 + ', ' + y1 + ', ' + width + ');\n';
};

Arduino.forBlock['ug2856_rectangle'] = function(block, generator) {
  var action = block.getFieldValue('ACTION') || 'Set';
  var x0 = ugValue(block, generator, 'X0', '0');
  var y0 = ugValue(block, generator, 'Y0', '0');
  var x1 = ugValue(block, generator, 'X1', '50');
  var y1 = ugValue(block, generator, 'Y1', '30');
  var filled = block.getFieldValue('FILLED') || 'false';
  return ugGetVar(block) + '.rectangle' + action + '(' + x0 + ', ' + y0 + ', ' + x1 + ', ' + y1 + ', ' + filled + ');\n';
};

Arduino.forBlock['ug2856_circle'] = function(block, generator) {
  var action = block.getFieldValue('ACTION') || 'Set';
  var x = ugValue(block, generator, 'X', '64');
  var y = ugValue(block, generator, 'Y', '32');
  var radius = ugValue(block, generator, 'RADIUS', '10');
  var filled = block.getFieldValue('FILLED') || 'false';
  return ugGetVar(block) + '.circle' + action + '(' + x + ', ' + y + ', ' + radius + ', ' + filled + ');\n';
};

Arduino.forBlock['ug2856_print'] = function(block, generator) {
  var color = block.getFieldValue('COLOR') || 'Set';
  var x = ugValue(block, generator, 'X', '0');
  var y = ugValue(block, generator, 'Y', '0');
  var text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '"Hello"';
  return ugGetVar(block) + '.setWindowColor' + color + '();\n' + ugGetVar(block) + '.setTextCursor(' + x + ', ' + y + ');\n' + ugGetVar(block) + '.print(String(' + text + '));\n';
};

Arduino.forBlock['ug2856_contrast'] = function(block, generator) {
  var value = ugValue(block, generator, 'VALUE', '255');
  return ugGetVar(block) + '.setContrastControl((uint8_t)constrain(' + value + ', 0, 255));\n';
};

Arduino.forBlock['ug2856_invert'] = function(block) {
  return ugGetVar(block) + '.setInversion(' + (block.getFieldValue('ON') || 'false') + ');\n';
};

Arduino.forBlock['ug2856_power'] = function(block) {
  return ugGetVar(block) + '.setPower(' + (block.getFieldValue('ON') || 'true') + ');\n';
};