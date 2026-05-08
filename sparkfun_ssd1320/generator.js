function ssd1320EnsureLib(generator) {
  generator.addLibrary('SPI', '#include <SPI.h>');
  generator.addLibrary('SparkFun_SSD1320', '#include <SFE_SSD1320.h>');
}

function ssd1320GetVar(block) {
  var f = block.getField('VAR');
  return f ? f.getText() : (block.getFieldValue('VAR') || 'oled');
}

function ssd1320AttachVar(block) {
  if (block._ssd1320VarAttached) return;
  block._ssd1320VarAttached = true;
  block._ssd1320VarLastName = block.getFieldValue('VAR') || 'oled';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._ssd1320VarLastName, 'SSD1320_OLED');
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._ssd1320VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._ssd1320VarLastName, newName, 'SSD1320_OLED');
      block._ssd1320VarLastName = newName;
    }
  };
}

Arduino.forBlock['ssd1320_init'] = function(block, generator) {
  ssd1320AttachVar(block);
  ssd1320EnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'oled';
  var rst = generator.valueToCode(block, 'RST', generator.ORDER_NONE) || '9';
  var dc = generator.valueToCode(block, 'DC', generator.ORDER_NONE) || '8';
  var cs = generator.valueToCode(block, 'CS', generator.ORDER_NONE) || '10';
  generator.addVariable(varName, 'SSD1320_OLED ' + varName + '(' + rst + ', ' + dc + ', ' + cs + ');');
  return varName + '.begin();\n' + varName + '.clear(PAGE);\n' + varName + '.display();\n';
};

Arduino.forBlock['ssd1320_clear'] = function(block, generator) {
  ssd1320EnsureLib(generator);
  var varName = ssd1320GetVar(block);
  return varName + '.clear(PAGE);\n' + varName + '.display();\n';
};

Arduino.forBlock['ssd1320_print'] = function(block, generator) {
  ssd1320EnsureLib(generator);
  var varName = ssd1320GetVar(block);
  var x = generator.valueToCode(block, 'X', generator.ORDER_NONE) || '0';
  var y = generator.valueToCode(block, 'Y', generator.ORDER_NONE) || '0';
  var text = generator.valueToCode(block, 'TEXT', generator.ORDER_NONE) || '""';
  return varName + '.setCursor(' + x + ', ' + y + ');\n' + varName + '.print(' + text + ');\n' + varName + '.display();\n';
};

Arduino.forBlock['ssd1320_draw_rect'] = function(block, generator) {
  ssd1320EnsureLib(generator);
  var varName = ssd1320GetVar(block);
  var x = generator.valueToCode(block, 'X', generator.ORDER_NONE) || '0';
  var y = generator.valueToCode(block, 'Y', generator.ORDER_NONE) || '0';
  var w = generator.valueToCode(block, 'W', generator.ORDER_NONE) || '10';
  var h = generator.valueToCode(block, 'H', generator.ORDER_NONE) || '10';
  return varName + '.rect(' + x + ', ' + y + ', ' + w + ', ' + h + ');\n' + varName + '.display();\n';
};
