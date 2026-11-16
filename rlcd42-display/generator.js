// @aily-project/lib-rlcd42-display

Arduino.forBlock["rlcd42_display_init"] = function (block, generator) {
  generator.addLibrary('rlcd42', '#include "Rlcd42.h"');
  const orientation = block.getFieldValue('ORIENTATION');
  return 'rlcd42.begin(' + (orientation === 'PORTRAIT' ? 'false' : 'true') + ');\n';
};

Arduino.forBlock["rlcd42_clear"] = function (block, generator) {
  generator.addLibrary('rlcd42', '#include "Rlcd42.h"');
  return 'rlcd42.clear(' + (block.getFieldValue('COLOR') === 'BLACK' ? 'true' : 'false') + ');\n';
};

Arduino.forBlock["rlcd42_draw_pixel"] = function (block, generator) {
  generator.addLibrary('rlcd42', '#include "Rlcd42.h"');
  const x = generator.valueToCode(block, 'X', Arduino.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', Arduino.ORDER_ATOMIC) || '0';
  const black = block.getFieldValue('COLOR') === 'BLACK' ? 'true' : 'false';
  return 'rlcd42.setPixel(' + x + ', ' + y + ', ' + black + ');\n';
};

Arduino.forBlock["rlcd42_draw_line"] = function (block, generator) {
  generator.addLibrary('rlcd42', '#include "Rlcd42.h"');
  const x1 = generator.valueToCode(block, 'X1', Arduino.ORDER_ATOMIC) || '0';
  const y1 = generator.valueToCode(block, 'Y1', Arduino.ORDER_ATOMIC) || '0';
  const x2 = generator.valueToCode(block, 'X2', Arduino.ORDER_ATOMIC) || '0';
  const y2 = generator.valueToCode(block, 'Y2', Arduino.ORDER_ATOMIC) || '0';
  const black = block.getFieldValue('COLOR') === 'BLACK' ? 'true' : 'false';
  return 'rlcd42.drawLine(' + x1 + ', ' + y1 + ', ' + x2 + ', ' + y2 + ', ' + black + ');\n';
};

Arduino.forBlock["rlcd42_draw_rect"] = function (block, generator) {
  generator.addLibrary('rlcd42', '#include "Rlcd42.h"');
  const x = generator.valueToCode(block, 'X', Arduino.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', Arduino.ORDER_ATOMIC) || '0';
  const w = generator.valueToCode(block, 'W', Arduino.ORDER_ATOMIC) || '0';
  const h = generator.valueToCode(block, 'H', Arduino.ORDER_ATOMIC) || '0';
  const fill = block.getFieldValue('FILL') === 'TRUE' ? 'true' : 'false';
  const black = block.getFieldValue('COLOR') === 'BLACK' ? 'true' : 'false';
  return 'rlcd42.drawRect(' + x + ', ' + y + ', ' + w + ', ' + h + ', ' + fill + ', ' + black + ');\n';
};

Arduino.forBlock["rlcd42_draw_circle"] = function (block, generator) {
  generator.addLibrary('rlcd42', '#include "Rlcd42.h"');
  const x = generator.valueToCode(block, 'X', Arduino.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', Arduino.ORDER_ATOMIC) || '0';
  const r = generator.valueToCode(block, 'R', Arduino.ORDER_ATOMIC) || '0';
  const fill = block.getFieldValue('FILL') === 'TRUE' ? 'true' : 'false';
  const black = block.getFieldValue('COLOR') === 'BLACK' ? 'true' : 'false';
  return 'rlcd42.drawCircle(' + x + ', ' + y + ', ' + r + ', ' + fill + ', ' + black + ');\n';
};

Arduino.forBlock["rlcd42_draw_str"] = function (block, generator) {
  generator.addLibrary('rlcd42', '#include "Rlcd42.h"');
  const x = generator.valueToCode(block, 'X', Arduino.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', Arduino.ORDER_ATOMIC) || '0';
  const text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';
  const scale = generator.valueToCode(block, 'SCALE', Arduino.ORDER_ATOMIC) || '1';
  const black = block.getFieldValue('COLOR') === 'BLACK' ? 'true' : 'false';
  return 'rlcd42.drawStr(' + x + ', ' + y + ', String(' + text + ').c_str(), ' + scale + ', ' + black + ');\n';
};

Arduino.forBlock["rlcd42_draw_text"] = function (block, generator) {
  generator.addLibrary('rlcd42', '#include "Rlcd42.h"');
  const x = generator.valueToCode(block, 'X', Arduino.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', Arduino.ORDER_ATOMIC) || '0';
  const text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';
  const scale = generator.valueToCode(block, 'SCALE', Arduino.ORDER_ATOMIC) || '1';
  const black = block.getFieldValue('COLOR') === 'BLACK' ? 'true' : 'false';
  return 'rlcd42.drawText(' + x + ', ' + y + ', String(' + text + ').c_str(), ' + scale + ', ' + black + ');\n';
};

Arduino.forBlock["rlcd42_draw_text_wrap"] = function (block, generator) {
  generator.addLibrary('rlcd42', '#include "Rlcd42.h"');
  const x = generator.valueToCode(block, 'X', Arduino.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', Arduino.ORDER_ATOMIC) || '0';
  const w = generator.valueToCode(block, 'W', Arduino.ORDER_ATOMIC) || '384';
  const lh = generator.valueToCode(block, 'LH', Arduino.ORDER_ATOMIC) || '18';
  const text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';
  const scale = generator.valueToCode(block, 'SCALE', Arduino.ORDER_ATOMIC) || '1';
  const black = block.getFieldValue('COLOR') === 'BLACK' ? 'true' : 'false';
  return 'rlcd42.drawTextWrap(' + x + ', ' + y + ', ' + w + ', ' + lh + ', String(' + text + ').c_str(), ' + scale + ', ' + black + ');\n';
};

Arduino.forBlock["rlcd42_draw_emotion"] = function (block, generator) {
  generator.addLibrary('rlcd42', '#include "Rlcd42.h"');
  const id = generator.valueToCode(block, 'ID', Arduino.ORDER_ATOMIC) || '0';
  const x = generator.valueToCode(block, 'X', Arduino.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', Arduino.ORDER_ATOMIC) || '0';
  const size = generator.valueToCode(block, 'SIZE', Arduino.ORDER_ATOMIC) || '64';
  const black = block.getFieldValue('COLOR') === 'BLACK' ? 'true' : 'false';
  return 'rlcd42.drawEmotion((int)(' + id + '), (int)(' + x + '), (int)(' + y + '), (int)(' + size + '), ' + black + ');\n';
};

Arduino.forBlock["rlcd42_display"] = function (block, generator) {
  generator.addLibrary('rlcd42', '#include "Rlcd42.h"');
  return 'rlcd42.display();\n';
};

Arduino.forBlock["rlcd42_width"] = function (block, generator) {
  generator.addLibrary('rlcd42', '#include "Rlcd42.h"');
  return ['rlcd42.width()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["rlcd42_height"] = function (block, generator) {
  generator.addLibrary('rlcd42', '#include "Rlcd42.h"');
  return ['rlcd42.height()', Arduino.ORDER_ATOMIC];
};
