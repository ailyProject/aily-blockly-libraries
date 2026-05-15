function kwhEnsureLibrary(generator) {
  generator.addLibrary('SPI', '#include <SPI.h>');
  generator.addLibrary('HyperDisplay_KWH018ST01_4WSPI', '#include <HyperDisplay_KWH018ST01_4WSPI.h>');
}

function kwhGetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'tft');
}

function kwhAttachVar(block) {
  if (block._kwhVarAttached) return;
  block._kwhVarAttached = true;
  block._kwhVarLastName = block.getFieldValue('VAR') || 'tft';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._kwhVarLastName, 'KWH018ST01_4WSPI');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._kwhVarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._kwhVarLastName, newName, 'KWH018ST01_4WSPI');
      block._kwhVarLastName = newName;
    }
  };
}

function kwhValue(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}

function kwhColorBlock(block, generator) {
  var r = kwhValue(block, generator, 'R', '255');
  var g = kwhValue(block, generator, 'G', '255');
  var b = kwhValue(block, generator, 'B', '255');
  return 'ILI9163C_color_16_t color = ILI9163C::rgbTo16b((uint8_t)constrain(' + r + ', 0, 255), (uint8_t)constrain(' + g + ', 0, 255), (uint8_t)constrain(' + b + ', 0, 255));\n';
}

Arduino.forBlock['kwh018_init'] = function(block, generator) {
  kwhAttachVar(block);
  kwhEnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'tft';
  var spi = block.getFieldValue('SPI') || 'SPI';
  var dc = kwhValue(block, generator, 'DC', '8');
  var cs = kwhValue(block, generator, 'CS', '10');
  var bl = kwhValue(block, generator, 'BL', '9');
  var freq = kwhValue(block, generator, 'FREQ', '24000000');
  generator.addVariable(varName, 'KWH018ST01_4WSPI ' + varName + ';');
  return spi + '.begin();\n' + varName + '.begin(' + dc + ', ' + cs + ', ' + bl + ', ' + spi + ', ' + freq + ');\n' + varName + '.clearDisplay();\n';
};

Arduino.forBlock['kwh018_clear'] = function(block) {
  return kwhGetVar(block) + '.clearDisplay();\n';
};

Arduino.forBlock['kwh018_set_backlight'] = function(block, generator) {
  var brightness = kwhValue(block, generator, 'BRIGHTNESS', '255');
  return kwhGetVar(block) + '.setBacklight((uint8_t)constrain(' + brightness + ', 0, 255));\n';
};

Arduino.forBlock['kwh018_pixel'] = function(block, generator) {
  var x = kwhValue(block, generator, 'X', '0');
  var y = kwhValue(block, generator, 'Y', '0');
  return '{\n  ' + kwhColorBlock(block, generator) + '  ' + kwhGetVar(block) + '.pixel(' + x + ', ' + y + ', (color_t)&color);\n}\n';
};

Arduino.forBlock['kwh018_line'] = function(block, generator) {
  var x0 = kwhValue(block, generator, 'X0', '0');
  var y0 = kwhValue(block, generator, 'Y0', '0');
  var x1 = kwhValue(block, generator, 'X1', '127');
  var y1 = kwhValue(block, generator, 'Y1', '159');
  var width = kwhValue(block, generator, 'WIDTH', '1');
  return '{\n  ' + kwhColorBlock(block, generator) + '  ' + kwhGetVar(block) + '.line(' + x0 + ', ' + y0 + ', ' + x1 + ', ' + y1 + ', ' + width + ', (color_t)&color);\n}\n';
};

Arduino.forBlock['kwh018_rectangle'] = function(block, generator) {
  var x0 = kwhValue(block, generator, 'X0', '0');
  var y0 = kwhValue(block, generator, 'Y0', '0');
  var x1 = kwhValue(block, generator, 'X1', '50');
  var y1 = kwhValue(block, generator, 'Y1', '50');
  var filled = block.getFieldValue('FILLED') || 'false';
  return '{\n  ' + kwhColorBlock(block, generator) + '  ' + kwhGetVar(block) + '.rectangle(' + x0 + ', ' + y0 + ', ' + x1 + ', ' + y1 + ', ' + filled + ', (color_t)&color);\n}\n';
};

Arduino.forBlock['kwh018_fill'] = function(block, generator) {
  return '{\n  ' + kwhColorBlock(block, generator) + '  ' + kwhGetVar(block) + '.fillWindow((color_t)&color);\n}\n';
};

Arduino.forBlock['kwh018_print'] = function(block, generator) {
  var x = kwhValue(block, generator, 'X', '0');
  var y = kwhValue(block, generator, 'Y', '0');
  var text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '"Hello"';
  return '{\n  ' + kwhColorBlock(block, generator) + '  ' + kwhGetVar(block) + '.setCurrentWindowColorSequence((color_t)&color);\n  ' + kwhGetVar(block) + '.setTextCursor(' + x + ', ' + y + ');\n  ' + kwhGetVar(block) + '.print(String(' + text + '));\n}\n';
};