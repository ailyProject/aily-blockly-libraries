function microviewEnsureLibrary(generator) {
  generator.addLibrary('MicroView', '#include <SparkFun_MicroView_Arduino_Library/MicroView.h>');
}

Arduino.forBlock['microview_begin'] = function(block, generator) {
  microviewEnsureLibrary(generator);
  return 'uView.begin();\n';
};

Arduino.forBlock['microview_clear'] = function(block, generator) {
  microviewEnsureLibrary(generator);
  var mode = block.getFieldValue('MODE') || 'PAGE';
  return 'uView.clear(' + mode + ');\n';
};

Arduino.forBlock['microview_display'] = function(block, generator) {
  microviewEnsureLibrary(generator);
  return 'uView.display();\n';
};

Arduino.forBlock['microview_set_cursor'] = function(block, generator) {
  microviewEnsureLibrary(generator);
  var x = generator.valueToCode(block, 'X', generator.ORDER_NONE) || '0';
  var y = generator.valueToCode(block, 'Y', generator.ORDER_NONE) || '0';
  return 'uView.setCursor(' + x + ', ' + y + ');\n';
};

Arduino.forBlock['microview_print'] = function(block, generator) {
  microviewEnsureLibrary(generator);
  var text = generator.valueToCode(block, 'TEXT', generator.ORDER_NONE) || '""';
  return 'uView.print(' + text + ');\n';
};

Arduino.forBlock['microview_set_font'] = function(block, generator) {
  microviewEnsureLibrary(generator);
  var font = block.getFieldValue('FONT') || '0';
  return 'uView.setFontType(' + font + ');\n';
};

Arduino.forBlock['microview_pixel'] = function(block, generator) {
  microviewEnsureLibrary(generator);
  var x = generator.valueToCode(block, 'X', generator.ORDER_NONE) || '0';
  var y = generator.valueToCode(block, 'Y', generator.ORDER_NONE) || '0';
  return 'uView.pixel(' + x + ', ' + y + ');\n';
};

Arduino.forBlock['microview_line'] = function(block, generator) {
  microviewEnsureLibrary(generator);
  var x0 = generator.valueToCode(block, 'X0', generator.ORDER_NONE) || '0';
  var y0 = generator.valueToCode(block, 'Y0', generator.ORDER_NONE) || '0';
  var x1 = generator.valueToCode(block, 'X1', generator.ORDER_NONE) || '0';
  var y1 = generator.valueToCode(block, 'Y1', generator.ORDER_NONE) || '0';
  return 'uView.line(' + x0 + ', ' + y0 + ', ' + x1 + ', ' + y1 + ');\n';
};

Arduino.forBlock['microview_rect'] = function(block, generator) {
  microviewEnsureLibrary(generator);
  var x = generator.valueToCode(block, 'X', generator.ORDER_NONE) || '0';
  var y = generator.valueToCode(block, 'Y', generator.ORDER_NONE) || '0';
  var w = generator.valueToCode(block, 'W', generator.ORDER_NONE) || '10';
  var h = generator.valueToCode(block, 'H', generator.ORDER_NONE) || '10';
  var fill = block.getFieldValue('FILL') || '0';
  if (fill === '1') {
    return 'uView.rectFill(' + x + ', ' + y + ', ' + w + ', ' + h + ');\n';
  } else {
    return 'uView.rect(' + x + ', ' + y + ', ' + w + ', ' + h + ');\n';
  }
};

Arduino.forBlock['microview_circle'] = function(block, generator) {
  microviewEnsureLibrary(generator);
  var x = generator.valueToCode(block, 'X', generator.ORDER_NONE) || '0';
  var y = generator.valueToCode(block, 'Y', generator.ORDER_NONE) || '0';
  var r = generator.valueToCode(block, 'R', generator.ORDER_NONE) || '5';
  var fill = block.getFieldValue('FILL') || '0';
  if (fill === '1') {
    return 'uView.circleFill(' + x + ', ' + y + ', ' + r + ');\n';
  } else {
    return 'uView.circle(' + x + ', ' + y + ', ' + r + ');\n';
  }
};

Arduino.forBlock['microview_invert'] = function(block, generator) {
  microviewEnsureLibrary(generator);
  var inv = block.getFieldValue('INV') || 'false';
  return 'uView.invert(' + inv + ');\n';
};
