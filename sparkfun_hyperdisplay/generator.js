function hyperDisplayEnsureLib(generator) {
  generator.addLibrary('HyperDisplay', '#include <SparkFun_HyperDisplay/hyperdisplay.h>');
}

Arduino.forBlock['hyperdisplay_include'] = function(block, generator) {
  hyperDisplayEnsureLib(generator);
  return '';
};

Arduino.forBlock['hyperdisplay_fill_window'] = function(block, generator) {
  hyperDisplayEnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'myDisplay';
  return varName + '.fillWindow();\n';
};

Arduino.forBlock['hyperdisplay_pixel'] = function(block, generator) {
  hyperDisplayEnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'myDisplay';
  var x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  var y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  return varName + '.pixel(' + x + ', ' + y + ');\n';
};

Arduino.forBlock['hyperdisplay_line'] = function(block, generator) {
  hyperDisplayEnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'myDisplay';
  var x0 = generator.valueToCode(block, 'X0', generator.ORDER_ATOMIC) || '0';
  var y0 = generator.valueToCode(block, 'Y0', generator.ORDER_ATOMIC) || '0';
  var x1 = generator.valueToCode(block, 'X1', generator.ORDER_ATOMIC) || '0';
  var y1 = generator.valueToCode(block, 'Y1', generator.ORDER_ATOMIC) || '0';
  var width = block.getFieldValue('WIDTH') || '1';
  return varName + '.line(' + x0 + ', ' + y0 + ', ' + x1 + ', ' + y1 + ', ' + width + ');\n';
};

Arduino.forBlock['hyperdisplay_rectangle'] = function(block, generator) {
  hyperDisplayEnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'myDisplay';
  var x0 = generator.valueToCode(block, 'X0', generator.ORDER_ATOMIC) || '0';
  var y0 = generator.valueToCode(block, 'Y0', generator.ORDER_ATOMIC) || '0';
  var x1 = generator.valueToCode(block, 'X1', generator.ORDER_ATOMIC) || '0';
  var y1 = generator.valueToCode(block, 'Y1', generator.ORDER_ATOMIC) || '0';
  var filled = block.getFieldValue('FILLED') || 'false';
  return varName + '.rectangle(' + x0 + ', ' + y0 + ', ' + x1 + ', ' + y1 + ', ' + filled + ');\n';
};

Arduino.forBlock['hyperdisplay_circle'] = function(block, generator) {
  hyperDisplayEnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'myDisplay';
  var x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  var y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  var r = generator.valueToCode(block, 'R', generator.ORDER_ATOMIC) || '10';
  var filled = block.getFieldValue('FILLED') || 'false';
  return varName + '.circle(' + x + ', ' + y + ', ' + r + ', ' + filled + ');\n';
};

Arduino.forBlock['hyperdisplay_print'] = function(block, generator) {
  hyperDisplayEnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'myDisplay';
  var x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  var y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  var text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '""';
  return varName + '.setTextCursor(' + x + ', ' + y + ');\n' +
         varName + '.print(' + text + ');\n';
};
