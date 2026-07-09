// Helper: convert #RRGGBB to 0xRRGGBB
function colorToHex(color) {
  if (color && color.startsWith('#')) {
    return '0x' + color.substring(1).toUpperCase();
  }
  return color || '0xFFFFFF';
}

// Ensure k10 object is initialized (begin only).
function ensureK10(generator) {
  generator.addLibrary('SPIFFS', '#include <SPIFFS.h>');
  generator.addLibrary('unihiker_k10', '#include <unihiker_k10.h>');
  generator.addVariable('k10', 'UNIHIKER_K10 k10;');
  generator.addSetupBegin('k10_begin', 'k10.begin();');
}

// Ensure screen + canvas initialization. Drawing blocks pass the default
// direction ('2' = portrait). When the user adds the "init screen" block,
// its direction takes effect because addVariable / addSetupBegin de-duplicate
// by key (first-wins). Place the init block near the top of setup.
function ensureScreenInit(generator, screenDir) {
  ensureK10(generator);
  generator.addVariable('k10_screen_dir', 'uint8_t screen_dir = ' + screenDir + ';');
  generator.addSetupBegin('k10_initScreen', 'k10.initScreen(screen_dir);');
  generator.addSetupBegin('k10_creatCanvas', 'k10.creatCanvas();');
}

// ========== 初始化屏幕 ==========
Arduino.forBlock['k10_init_screen'] = function(block, generator) {
  var dir = block.getFieldValue('DIR');
  ensureScreenInit(generator, dir);
  return '';
};

// ========== 设置背景颜色 ==========
Arduino.forBlock['k10_set_background'] = function(block, generator) {
  var color = colorToHex(block.getFieldValue('COLOR'));
  ensureScreenInit(generator, '2');
  return 'k10.setScreenBackground(' + color + ');\n';
};

// ========== 画点 ==========
Arduino.forBlock['k10_draw_point'] = function(block, generator) {
  var x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  var y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  var color = colorToHex(block.getFieldValue('COLOR'));
  ensureScreenInit(generator, '2');
  return 'k10.canvas->canvasPoint(' + x + ', ' + y + ', ' + color + ');\n';
};

// ========== 画线 ==========
Arduino.forBlock['k10_draw_line'] = function(block, generator) {
  var x1 = generator.valueToCode(block, 'X1', generator.ORDER_ATOMIC) || '0';
  var y1 = generator.valueToCode(block, 'Y1', generator.ORDER_ATOMIC) || '0';
  var x2 = generator.valueToCode(block, 'X2', generator.ORDER_ATOMIC) || '240';
  var y2 = generator.valueToCode(block, 'Y2', generator.ORDER_ATOMIC) || '320';
  var color = colorToHex(block.getFieldValue('COLOR'));
  ensureScreenInit(generator, '2');
  return 'k10.canvas->canvasLine(' + x1 + ', ' + y1 + ', ' + x2 + ', ' + y2 + ', ' + color + ');\n';
};

// ========== 设置线宽 ==========
Arduino.forBlock['k10_set_line_width'] = function(block, generator) {
  var width = block.getFieldValue('WIDTH');
  ensureScreenInit(generator, '2');
  return 'k10.canvas->canvasSetLineWidth(' + width + ');\n';
};

// ========== 画圆 ==========
Arduino.forBlock['k10_draw_circle'] = function(block, generator) {
  var x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '120';
  var y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '120';
  var r = generator.valueToCode(block, 'R', generator.ORDER_ATOMIC) || '40';
  var borderColor = colorToHex(block.getFieldValue('BORDER_COLOR'));
  var fillColor = colorToHex(block.getFieldValue('FILL_COLOR'));
  var filled = block.getFieldValue('FILLED') === 'TRUE' ? 'true' : 'false';
  ensureScreenInit(generator, '2');
  return 'k10.canvas->canvasCircle(' + x + ', ' + y + ', ' + r + ', ' + borderColor + ', ' + fillColor + ', ' + filled + ');\n';
};

// ========== 画矩形 ==========
Arduino.forBlock['k10_draw_rectangle'] = function(block, generator) {
  var x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '40';
  var y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '40';
  var w = generator.valueToCode(block, 'W', generator.ORDER_ATOMIC) || '160';
  var h = generator.valueToCode(block, 'H', generator.ORDER_ATOMIC) || '240';
  var borderColor = colorToHex(block.getFieldValue('BORDER_COLOR'));
  var fillColor = colorToHex(block.getFieldValue('FILL_COLOR'));
  var filled = block.getFieldValue('FILLED') === 'TRUE' ? 'true' : 'false';
  ensureScreenInit(generator, '2');
  return 'k10.canvas->canvasRectangle(' + x + ', ' + y + ', ' + w + ', ' + h + ', ' + borderColor + ', ' + fillColor + ', ' + filled + ');\n';
};

// ========== 在指定行显示文字（简化版）==========
// API: canvasText(text, line_num, color)
// 第二参数为屏幕行号(1~7)，系统自动按行排版，无需指定 X/Y。
Arduino.forBlock['k10_draw_text_simple'] = function(block, generator) {
  var text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '""';
  var line = block.getFieldValue('LINE');
  var color = colorToHex(block.getFieldValue('COLOR'));
  ensureScreenInit(generator, '2');
  return 'k10.canvas->canvasText(' + text + ', ' + line + ', ' + color + ');\n';
};

// ========== 显示文字（完整版）==========
// API: canvasText(text, x, y, color, font, lineCharCount, fillBg)
Arduino.forBlock['k10_draw_text'] = function(block, generator) {
  var text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '""';
  var x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  var y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  var color = colorToHex(block.getFieldValue('COLOR'));
  var font = block.getFieldValue('FONT');
  var lineChars = block.getFieldValue('LINE_CHARS');
  ensureScreenInit(generator, '2');
  return 'k10.canvas->canvasText(' + text + ', ' + x + ', ' + y + ', ' + color + ', k10.canvas->' + font + ', ' + lineChars + ', true);\n';
};

// ========== 显示内置图片 ==========
Arduino.forBlock['k10_draw_bitmap'] = function(block, generator) {
  var x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  var y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  var w = generator.valueToCode(block, 'W', generator.ORDER_ATOMIC) || '100';
  var h = generator.valueToCode(block, 'H', generator.ORDER_ATOMIC) || '100';
  var imageVar = block.getFieldValue('IMAGE') || 'image_data1';
  ensureScreenInit(generator, '2');
  generator.addLibrary('arduino_image_cache', '#include "arduino_image_cache.h"');
  return 'k10.canvas->canvasDrawBitmap(' + x + ', ' + y + ', ' + w + ', ' + h + ', ' + imageVar + ');\n';
};

// ========== 显示TF卡图片 ==========
Arduino.forBlock['k10_draw_image'] = function(block, generator) {
  var path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '"S:/photo.bmp"';
  var x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  var y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  ensureScreenInit(generator, '2');
  generator.addSetupBegin('k10_initSDFile', 'k10.initSDFile();');
  return 'k10.canvas->canvasDrawImage(' + x + ', ' + y + ', ' + path + ');\n';
};

// ========== 显示二维码 ==========
Arduino.forBlock['k10_draw_qrcode'] = function(block, generator) {
  var content = generator.valueToCode(block, 'CONTENT', generator.ORDER_ATOMIC) || '"https://www.unihiker.com.cn"';
  ensureScreenInit(generator, '2');
  return 'k10.canvasDrawCode(' + content + ');\n';
};

// ========== 刷新画布 ==========
Arduino.forBlock['k10_update_canvas'] = function(block, generator) {
  ensureScreenInit(generator, '2');
  return 'k10.canvas->updateCanvas();\n';
};

// ========== 清除画布 ==========
Arduino.forBlock['k10_clear_canvas'] = function(block, generator) {
  var mode = block.getFieldValue('MODE');
  ensureScreenInit(generator, '2');
  if (mode === '0') {
    return 'k10.canvas->canvasClear();\n';
  } else {
    return 'k10.canvas->canvasClear(1);\n';
  }
};

// ========== 屏幕宽度 / 高度（常量）==========
Arduino.forBlock['k10_screen_size'] = function(block, generator) {
  var which = block.getFieldValue('WHICH');
  // K10 屏幕分辨率：240(W) x 320(H)（正向/反向）；横屏方向交换
  var value = which === 'W' ? '240' : '320';
  return [value, generator.ORDER_ATOMIC];
};
