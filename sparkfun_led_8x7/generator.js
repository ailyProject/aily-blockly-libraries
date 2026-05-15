function led8x7EnsureLib(generator) {
  generator.addLibrary('SparkFunLED8x7', '#include <SparkFun_LED_8x7.h>');
  generator.addLibrary('Chaplex', '#include <Chaplex.h>');
}

// The library uses a global singleton: Plex
// No variable management needed

Arduino.forBlock['led8x7_init'] = function(block, generator) {
  led8x7EnsureLib(generator);
  var p0 = generator.valueToCode(block, 'P0', generator.ORDER_ATOMIC) || '4';
  var p1 = generator.valueToCode(block, 'P1', generator.ORDER_ATOMIC) || '5';
  var p2 = generator.valueToCode(block, 'P2', generator.ORDER_ATOMIC) || '6';
  var p3 = generator.valueToCode(block, 'P3', generator.ORDER_ATOMIC) || '7';
  var p4 = generator.valueToCode(block, 'P4', generator.ORDER_ATOMIC) || '8';
  var p5 = generator.valueToCode(block, 'P5', generator.ORDER_ATOMIC) || '9';
  var p6 = generator.valueToCode(block, 'P6', generator.ORDER_ATOMIC) || '10';
  var p7 = generator.valueToCode(block, 'P7', generator.ORDER_ATOMIC) || '11';
  generator.addVariable('led8x7_pins', 'byte led8x7_pins[] = {' + p0 + ', ' + p1 + ', ' + p2 + ', ' + p3 + ', ' + p4 + ', ' + p5 + ', ' + p6 + ', ' + p7 + '};');
  return 'Plex.init(led8x7_pins);\n';
};

Arduino.forBlock['led8x7_clear'] = function(block, generator) {
  led8x7EnsureLib(generator);
  return 'Plex.clear();\n';
};

Arduino.forBlock['led8x7_display'] = function(block, generator) {
  led8x7EnsureLib(generator);
  return 'Plex.display();\n';
};

Arduino.forBlock['led8x7_pixel'] = function(block, generator) {
  led8x7EnsureLib(generator);
  var x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  var y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  var on = block.getFieldValue('ON') || '1';
  return 'Plex.pixel(' + x + ', ' + y + ', ' + on + ');\n';
};

Arduino.forBlock['led8x7_line'] = function(block, generator) {
  led8x7EnsureLib(generator);
  var x0 = generator.valueToCode(block, 'X0', generator.ORDER_ATOMIC) || '0';
  var y0 = generator.valueToCode(block, 'Y0', generator.ORDER_ATOMIC) || '0';
  var x1 = generator.valueToCode(block, 'X1', generator.ORDER_ATOMIC) || '7';
  var y1 = generator.valueToCode(block, 'Y1', generator.ORDER_ATOMIC) || '6';
  return 'Plex.line(' + x0 + ', ' + y0 + ', ' + x1 + ', ' + y1 + ');\n';
};

Arduino.forBlock['led8x7_rect'] = function(block, generator) {
  led8x7EnsureLib(generator);
  var x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  var y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  var w = generator.valueToCode(block, 'W', generator.ORDER_ATOMIC) || '4';
  var h = generator.valueToCode(block, 'H', generator.ORDER_ATOMIC) || '3';
  var fill = block.getFieldValue('FILL') || '0';
  if (fill === '1') {
    return 'Plex.rectFill(' + x + ', ' + y + ', ' + w + ', ' + h + ');\n';
  }
  return 'Plex.rect(' + x + ', ' + y + ', ' + w + ', ' + h + ');\n';
};

Arduino.forBlock['led8x7_scroll_text'] = function(block, generator) {
  led8x7EnsureLib(generator);
  var text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '"Hello"';
  // scrollText requires a char array; cast String if needed
  generator.addFunction('led8x7_scrollHelper', 'void led8x7_scrollText(String s) {\n  char buf[s.length()+1];\n  s.toCharArray(buf, sizeof(buf));\n  Plex.scrollText(buf);\n}');
  return 'led8x7_scrollText(' + text + ');\n';
};
