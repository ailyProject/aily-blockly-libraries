function teensyviewEnsureLib(generator) {
  generator.addLibrary('SPI', '#include <SPI.h>');
  generator.addLibrary('SparkFun_TeensyView', '#include <TeensyView.h>');
}

function teensyviewGetVar(block) {
  var f = block.getField('VAR');
  return f ? f.getText() : (block.getFieldValue('VAR') || 'oled');
}

function teensyviewAttachVar(block) {
  if (block._teensyviewVarAttached) return;
  block._teensyviewVarAttached = true;
  block._teensyviewVarLastName = block.getFieldValue('VAR') || 'oled';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._teensyviewVarLastName, 'TeensyView');
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._teensyviewVarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._teensyviewVarLastName, newName, 'TeensyView');
      block._teensyviewVarLastName = newName;
    }
  };
}

Arduino.forBlock['teensyview_init'] = function(block, generator) {
  teensyviewAttachVar(block);
  teensyviewEnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'oled';
  var rst = generator.valueToCode(block, 'RST', generator.ORDER_NONE) || '9';
  var dc = generator.valueToCode(block, 'DC', generator.ORDER_NONE) || '8';
  var cs = generator.valueToCode(block, 'CS', generator.ORDER_NONE) || '10';
  var sck = generator.valueToCode(block, 'SCK', generator.ORDER_NONE) || '13';
  var sdi = generator.valueToCode(block, 'SDI', generator.ORDER_NONE) || '11';
  generator.addVariable(varName, 'TeensyView ' + varName + '(' + rst + ', ' + dc + ', ' + cs + ', ' + sck + ', ' + sdi + ');');
  return varName + '.begin();\n' + varName + '.clear(ALL);\n';
};

Arduino.forBlock['teensyview_clear'] = function(block, generator) {
  teensyviewEnsureLib(generator);
  return teensyviewGetVar(block) + '.clear(PAGE);\n';
};

Arduino.forBlock['teensyview_print'] = function(block, generator) {
  teensyviewEnsureLib(generator);
  var varName = teensyviewGetVar(block);
  var x = generator.valueToCode(block, 'X', generator.ORDER_NONE) || '0';
  var y = generator.valueToCode(block, 'Y', generator.ORDER_NONE) || '0';
  var text = generator.valueToCode(block, 'TEXT', generator.ORDER_NONE) || '""';
  return varName + '.setCursor(' + x + ', ' + y + ');\n' + varName + '.print(' + text + ');\n';
};

Arduino.forBlock['teensyview_pixel'] = function(block, generator) {
  teensyviewEnsureLib(generator);
  var varName = teensyviewGetVar(block);
  var x = generator.valueToCode(block, 'X', generator.ORDER_NONE) || '0';
  var y = generator.valueToCode(block, 'Y', generator.ORDER_NONE) || '0';
  var color = block.getFieldValue('COLOR') || '1';
  return varName + '.pixel(' + x + ', ' + y + ', ' + color + ');\n';
};

Arduino.forBlock['teensyview_display'] = function(block, generator) {
  teensyviewEnsureLib(generator);
  return teensyviewGetVar(block) + '.display();\n';
};
