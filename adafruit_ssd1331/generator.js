// SSD1331 0.96寸16位彩色OLED屏幕 Generator.js

// 初始化SSD1331屏幕
Arduino.forBlock['ssd1331_init'] = function(block, generator) {
  var cs = generator.valueToCode(block, 'CS', generator.ORDER_ATOMIC) || '10';
  var dc = generator.valueToCode(block, 'DC', generator.ORDER_ATOMIC) || '9';
  var rst = generator.valueToCode(block, 'RST', generator.ORDER_ATOMIC) || '8';

  generator.addLibrary('SPI', '#include <SPI.h>');
  generator.addLibrary('Adafruit_GFX', '#include <Adafruit_GFX.h>');
  generator.addLibrary('Adafruit_SSD1331', '#include <Adafruit_SSD1331.h>');

  generator.addObject('oled', 'Adafruit_SSD1331 oled = Adafruit_SSD1331(&SPI, ' + cs + ', ' + dc + ', ' + rst + ');');
  generator.addSetupBegin('oled_begin', 'oled.begin();');

  return '';
};

// 设置旋转
Arduino.forBlock['ssd1331_set_rotation'] = function(block, generator) {
  var rotation = block.getFieldValue('ROTATION');
  return 'oled.setRotation(' + rotation + ');\n';
};

// 开启/关闭显示
Arduino.forBlock['ssd1331_enable_display'] = function(block, generator) {
  var enable = block.getFieldValue('ENABLE');
  return 'oled.enableDisplay(' + enable + ');\n';
};

// 填充屏幕
Arduino.forBlock['ssd1331_fill_screen'] = function(block, generator) {
  var color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0x0000';
  return 'oled.fillScreen(' + color + ');\n';
};

// 清空屏幕
Arduino.forBlock['ssd1331_clear_screen'] = function(block, generator) {
  return 'oled.fillScreen(0x0000);\n';
};

// 颜色选择器
Arduino.forBlock['ssd1331_preset_color'] = function(block, generator) {
  var color = block.getFieldValue('COLOR');
  var hex = color.replace('#', '');
  var r = parseInt(hex.substring(0, 2), 16);
  var g = parseInt(hex.substring(2, 4), 16);
  var b = parseInt(hex.substring(4, 6), 16);
  return ['oled.color565(' + r + ', ' + g + ', ' + b + ')', generator.ORDER_ATOMIC];
};

// 设置文字颜色
Arduino.forBlock['ssd1331_set_text_color'] = function(block, generator) {
  var color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0xFFFF';
  var bgColor = generator.valueToCode(block, 'BG_COLOR', generator.ORDER_ATOMIC);
  if (bgColor) {
    return 'oled.setTextColor(' + color + ', ' + bgColor + ');\n';
  }
  return 'oled.setTextColor(' + color + ');\n';
};

// 设置文字大小
Arduino.forBlock['ssd1331_set_text_size'] = function(block, generator) {
  var size = generator.valueToCode(block, 'SIZE', generator.ORDER_ATOMIC) || '1';
  return 'oled.setTextSize(' + size + ');\n';
};

// 打印文本
Arduino.forBlock['ssd1331_print'] = function(block, generator) {
  var x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  var y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  var text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '""';
  var code = 'oled.setCursor(' + x + ', ' + y + ');\n';
  code += 'oled.print(' + text + ');\n';
  return code;
};

// 图形绘制块 - 统一处理
['draw_pixel', 'draw_line', 'draw_fast_h_line', 'draw_fast_v_line',
 'draw_rect', 'fill_rect', 'draw_round_rect', 'fill_round_rect',
 'draw_circle', 'fill_circle', 'draw_triangle', 'fill_triangle'].forEach(function(cmd) {
  Arduino.forBlock['ssd1331_' + cmd] = function(block, generator) {
    var code = '';
    switch(cmd) {
      case 'draw_pixel': {
        var x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
        var y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
        var color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0xFFFF';
        code = 'oled.drawPixel(' + x + ', ' + y + ', ' + color + ');';
        break;
      }
      case 'draw_line': {
        var x0 = generator.valueToCode(block, 'X0', generator.ORDER_ATOMIC) || '0';
        var y0 = generator.valueToCode(block, 'Y0', generator.ORDER_ATOMIC) || '0';
        var x1 = generator.valueToCode(block, 'X1', generator.ORDER_ATOMIC) || '0';
        var y1 = generator.valueToCode(block, 'Y1', generator.ORDER_ATOMIC) || '0';
        var color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0xFFFF';
        code = 'oled.drawLine(' + x0 + ', ' + y0 + ', ' + x1 + ', ' + y1 + ', ' + color + ');';
        break;
      }
      case 'draw_fast_h_line': {
        var x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
        var y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
        var w = generator.valueToCode(block, 'W', generator.ORDER_ATOMIC) || '0';
        var color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0xFFFF';
        code = 'oled.drawFastHLine(' + x + ', ' + y + ', ' + w + ', ' + color + ');';
        break;
      }
      case 'draw_fast_v_line': {
        var x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
        var y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
        var h = generator.valueToCode(block, 'H', generator.ORDER_ATOMIC) || '0';
        var color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0xFFFF';
        code = 'oled.drawFastVLine(' + x + ', ' + y + ', ' + h + ', ' + color + ');';
        break;
      }
      case 'draw_rect': {
        var x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
        var y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
        var w = generator.valueToCode(block, 'W', generator.ORDER_ATOMIC) || '0';
        var h = generator.valueToCode(block, 'H', generator.ORDER_ATOMIC) || '0';
        var color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0xFFFF';
        code = 'oled.drawRect(' + x + ', ' + y + ', ' + w + ', ' + h + ', ' + color + ');';
        break;
      }
      case 'fill_rect': {
        var x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
        var y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
        var w = generator.valueToCode(block, 'W', generator.ORDER_ATOMIC) || '0';
        var h = generator.valueToCode(block, 'H', generator.ORDER_ATOMIC) || '0';
        var color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0xFFFF';
        code = 'oled.fillRect(' + x + ', ' + y + ', ' + w + ', ' + h + ', ' + color + ');';
        break;
      }
      case 'draw_round_rect': {
        var x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
        var y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
        var w = generator.valueToCode(block, 'W', generator.ORDER_ATOMIC) || '0';
        var h = generator.valueToCode(block, 'H', generator.ORDER_ATOMIC) || '0';
        var r = generator.valueToCode(block, 'R', generator.ORDER_ATOMIC) || '0';
        var color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0xFFFF';
        code = 'oled.drawRoundRect(' + x + ', ' + y + ', ' + w + ', ' + h + ', ' + r + ', ' + color + ');';
        break;
      }
      case 'fill_round_rect': {
        var x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
        var y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
        var w = generator.valueToCode(block, 'W', generator.ORDER_ATOMIC) || '0';
        var h = generator.valueToCode(block, 'H', generator.ORDER_ATOMIC) || '0';
        var r = generator.valueToCode(block, 'R', generator.ORDER_ATOMIC) || '0';
        var color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0xFFFF';
        code = 'oled.fillRoundRect(' + x + ', ' + y + ', ' + w + ', ' + h + ', ' + r + ', ' + color + ');';
        break;
      }
      case 'draw_circle': {
        var x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
        var y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
        var r = generator.valueToCode(block, 'R', generator.ORDER_ATOMIC) || '0';
        var color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0xFFFF';
        code = 'oled.drawCircle(' + x + ', ' + y + ', ' + r + ', ' + color + ');';
        break;
      }
      case 'fill_circle': {
        var x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
        var y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
        var r = generator.valueToCode(block, 'R', generator.ORDER_ATOMIC) || '0';
        var color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0xFFFF';
        code = 'oled.fillCircle(' + x + ', ' + y + ', ' + r + ', ' + color + ');';
        break;
      }
      case 'draw_triangle': {
        var x0 = generator.valueToCode(block, 'X0', generator.ORDER_ATOMIC) || '0';
        var y0 = generator.valueToCode(block, 'Y0', generator.ORDER_ATOMIC) || '0';
        var x1 = generator.valueToCode(block, 'X1', generator.ORDER_ATOMIC) || '0';
        var y1 = generator.valueToCode(block, 'Y1', generator.ORDER_ATOMIC) || '0';
        var x2 = generator.valueToCode(block, 'X2', generator.ORDER_ATOMIC) || '0';
        var y2 = generator.valueToCode(block, 'Y2', generator.ORDER_ATOMIC) || '0';
        var color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0xFFFF';
        code = 'oled.drawTriangle(' + x0 + ', ' + y0 + ', ' + x1 + ', ' + y1 + ', ' + x2 + ', ' + y2 + ', ' + color + ');';
        break;
      }
      case 'fill_triangle': {
        var x0 = generator.valueToCode(block, 'X0', generator.ORDER_ATOMIC) || '0';
        var y0 = generator.valueToCode(block, 'Y0', generator.ORDER_ATOMIC) || '0';
        var x1 = generator.valueToCode(block, 'X1', generator.ORDER_ATOMIC) || '0';
        var y1 = generator.valueToCode(block, 'Y1', generator.ORDER_ATOMIC) || '0';
        var x2 = generator.valueToCode(block, 'X2', generator.ORDER_ATOMIC) || '0';
        var y2 = generator.valueToCode(block, 'Y2', generator.ORDER_ATOMIC) || '0';
        var color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0xFFFF';
        code = 'oled.fillTriangle(' + x0 + ', ' + y0 + ', ' + x1 + ', ' + y1 + ', ' + x2 + ', ' + y2 + ', ' + color + ');';
        break;
      }
    }
    return code + '\n';
  };
});
