Arduino.forBlock['led_matrix_init'] = function(block, generator) {
  generator.addLibrary('ArduinoGraphics', '#include "ArduinoGraphics.h"');
  generator.addLibrary('Arduino_LED_Matrix', '#include "Arduino_LED_Matrix.h"');
  generator.addObject('matrix', 'ArduinoLEDMatrix matrix;');
  
  var code = 'matrix.begin();\n';
  return code;
};

Arduino.forBlock['led_matrix_clear'] = function(block, generator) {
  var code = 'matrix.clear();\n';
  return code;
};

Arduino.forBlock['led_matrix_display_text'] = function(block, generator) {
  var text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';
  var direction = block.getFieldValue('DIRECTION');
  var speed = generator.valueToCode(block, 'SPEED', Arduino.ORDER_ATOMIC) || '100';
  
  var code = 'matrix.beginDraw();\n';
  code += 'matrix.textFont(Font_5x7);\n';
  code += 'matrix.beginText(0, 1, 0xFFFFFF);\n';
  code += 'matrix.println(' + text + ');\n';
  code += 'matrix.textScrollSpeed(' + speed + ');\n';
  code += 'matrix.endText(' + direction + ');\n';
  
  return code;
};

Arduino.forBlock['led_matrix_display_frame'] = function(block, generator) {
  var frame = block.getFieldValue('FRAME');
  
  // 🔧 修正：使用官方示例的格式和内置图案
  generator.addMacro('LED_FRAMES', `
// 自定义图案 - 12x8 LED矩阵
const uint32_t SMILE[] = {
  0x19819,
	0x80000001,
	0x81f8000
};

const uint32_t HEART[] = {
  0x3184a444,
	0x44042081,
	0x100a0040  
};

const uint32_t CHIP[] = {
	0x1503f811,
	0x3181103,
	0xf8150000
};

const uint32_t DANGER[] = {
	0x400a015,
	0x1502082,
	0x484047fc
};
`);
  
  // 🔧 直接使用 loadFrame，就像官方示例
  var code = 'matrix.loadFrame(' + frame + ');\n';
  return code;
};
