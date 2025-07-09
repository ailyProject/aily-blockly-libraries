// 统一的TFT屏幕相关 Generator.js 合并文件

// 初始化、对象定义部分，兼容ST7735/ST7789/ST7796S/自定义
Arduino.forBlock['tft_init'] = function(block, generator) {
  var model = block.getFieldValue('MODEL'); // ST7735、ST7789或ST7796S
  
  // 固定引脚配置
  var cs = '44';
  var dc = '43';
  var mosi = '47';
  var sclk = '21';
  var rst = '-1';
  
  // 添加SPI库
  generator.addLibrary('SPI', '#include <SPI.h>');
  
  if(model === 'ST7796S') {
    generator.addLibrary('Adafruit_ST7796S', '#include <Adafruit_ST7796S.h>');
    generator.addLibrary('Adafruit_GFX', '#include <Adafruit_GFX.h>');
    
    // 使用软件SPI构造函数，包含固定引脚
    generator.addObject('tft', 'Adafruit_ST7796S tft = Adafruit_ST7796S('+cs+', '+dc+', '+mosi+', '+sclk+', '+rst+');');
    generator.addSetupBegin('tft_init', 'tft.begin();');
    
  } else if(model === 'ST7789') {
    generator.addLibrary('Adafruit_ST7789', '#include <Adafruit_ST7789.h>');
    generator.addLibrary('Adafruit_GFX', '#include <Adafruit_GFX.h>');
    
    // 使用软件SPI构造函数，包含固定引脚
    generator.addObject('tft', 'Adafruit_ST7789 tft = Adafruit_ST7789('+cs+', '+dc+', '+mosi+', '+sclk+', '+rst+');');
    generator.addSetupBegin('tft_init', 'tft.init(240, 240);');
    
  } else { // 默认为ST7735
    generator.addLibrary('Adafruit_ST7735', '#include <Adafruit_ST7735.h>');
    generator.addLibrary('Adafruit_GFX', '#include <Adafruit_GFX.h>');
    
    // 使用软件SPI构造函数，包含固定引脚
    generator.addObject('tft', 'Adafruit_ST7735 tft = Adafruit_ST7735('+cs+', '+dc+', '+mosi+', '+sclk+', '+rst+');');
    generator.addSetupBegin('tft_init', 'tft.initR(INITR_BLACKTAB);');
  }
  
  return '';
};

// 屏幕控制函数通用
Arduino.forBlock['tft_set_rotation'] = function(block, generator) {
  // 直接从下拉菜单获取旋转值
  const rotation = block.getFieldValue('ROTATION');
  
  // 生成代码
  return `tft.setRotation(${rotation});\n`;
};

Arduino.forBlock['tft_fill_screen'] = function(block, generator) {
  var v = generator.valueToCode(block, 'COLOR', Arduino.ORDER_ATOMIC) || block.getFieldValue('COLOR') || 'ST77XX_BLACK';
  return 'tft.fillScreen(' + v + ');\n';
};

Arduino.forBlock['tft_preset_color'] = function (block, generator) {
  const color = block.getFieldValue('COLOR');

  // 解析十六进制颜色
  
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);


  return [`tft.color565(${r}, ${g}, ${b})`, generator.ORDER_ATOMIC];
};

// 文本、字体、文本属性合并
Arduino.forBlock['tft_set_text_color'] = function(block, generator) {
  var color = generator.valueToCode(block, 'COLOR', Arduino.ORDER_ATOMIC) || block.getFieldValue('COLOR') || 'ST77XX_WHITE';
  var bgColor = generator.valueToCode(block, 'BG_COLOR', Arduino.ORDER_ATOMIC) || block.getFieldValue('BG_COLOR') || 'ST77XX_BLACK';
  
  // 如果提供了背景颜色，则同时设置前景色和背景色
  if (generator.valueToCode(block, 'BG_COLOR', Arduino.ORDER_ATOMIC) || block.getFieldValue('BG_COLOR')) {
    return 'tft.setTextColor(' + color + ', ' + bgColor + ');\n';
  } else {
    // 如果没有提供背景颜色，只设置前景色
    return 'tft.setTextColor(' + color + ');\n';
  }
};

Arduino.forBlock['tft_set_text_color_bg'] = function(block, generator) {
  var fg = generator.valueToCode(block, 'FG_COLOR', Arduino.ORDER_ATOMIC) || 'ST77XX_WHITE';
  var bg = generator.valueToCode(block, 'BG_COLOR', Arduino.ORDER_ATOMIC) || 'ST77XX_BLACK';
  return 'tft.setTextColor(' + fg + ', ' + bg + ');\n';
};

Arduino.forBlock['tft_set_text_size'] = function(block, generator) {
  var size = generator.valueToCode(block, 'SIZE', Arduino.ORDER_ATOMIC) || block.getFieldValue('SIZE') || 1;
  return 'tft.setTextSize(' + size + ');\n';
};

Arduino.forBlock['tft_set_cursor'] = function(block, generator) {
  var x = generator.valueToCode(block, 'X', Arduino.ORDER_ATOMIC) || 0;
  var y = generator.valueToCode(block, 'Y', Arduino.ORDER_ATOMIC) || 0;
  return 'tft.setCursor(' + x + ', ' + y + ');\n';
};

Arduino.forBlock['tft_print'] = function(block, generator) {
var text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || block.getFieldValue('TEXT') || '""';
var newline = block.getFieldValue('NEWLINE') === 'TRUE';
var row = generator.valueToCode(block, 'ROW', Arduino.ORDER_ATOMIC);
var col = generator.valueToCode(block, 'COLUMN', Arduino.ORDER_ATOMIC);

// 生成代码
var code = '';

// 如果提供了行和列，先设置光标位置
if (row && col) {
// 计算真实坐标，假设一个字符的宽度为6像素，高度为8像素
// 这些值可能需要根据当前的文本大小进行调整
code += 'tft.setCursor(' + row + ' , ' + col + ' );\n';
}

// 添加打印语句
code += 'tft.' + (newline ? 'println' : 'print') + '(' + text + ');\n';

return code;
};

// 基本图形、像素、直线、矩形等
['draw_pixel','draw_line','draw_fast_h_line','draw_fast_v_line','draw_rect','fill_rect','draw_round_rect',
 'fill_round_rect','draw_circle','fill_circle','draw_triangle','fill_triangle','draw_bitmap','draw_rgb_bitmap'].forEach(function(cmd){
  Arduino.forBlock['tft_' + cmd] = function(block, generator) {
    // 根据不同块类型获取正确的输入参数
    var code = '';
    
    switch(cmd) {
      case 'draw_pixel':
        var x = generator.valueToCode(block, 'X', Arduino.ORDER_ATOMIC) || '0';
        var y = generator.valueToCode(block, 'Y', Arduino.ORDER_ATOMIC) || '0';
        var color = generator.valueToCode(block, 'COLOR', Arduino.ORDER_ATOMIC) || 'ST77XX_WHITE';
        code = 'tft.drawPixel(' + x + ', ' + y + ', ' + color + ');';
        break;
        
      case 'draw_line':
        var x0 = generator.valueToCode(block, 'X0', Arduino.ORDER_ATOMIC) || '0';
        var y0 = generator.valueToCode(block, 'Y0', Arduino.ORDER_ATOMIC) || '0';
        var x1 = generator.valueToCode(block, 'X1', Arduino.ORDER_ATOMIC) || '0';
        var y1 = generator.valueToCode(block, 'Y1', Arduino.ORDER_ATOMIC) || '0';
        var color = generator.valueToCode(block, 'COLOR', Arduino.ORDER_ATOMIC) || 'ST77XX_WHITE';
        code = 'tft.drawLine(' + x0 + ', ' + y0 + ', ' + x1 + ', ' + y1 + ', ' + color + ');';
        break;
        
      case 'draw_fast_h_line':
        var x = generator.valueToCode(block, 'X', Arduino.ORDER_ATOMIC) || '0';
        var y = generator.valueToCode(block, 'Y', Arduino.ORDER_ATOMIC) || '0';
        var w = generator.valueToCode(block, 'W', Arduino.ORDER_ATOMIC) || '0';
        var color = generator.valueToCode(block, 'COLOR', Arduino.ORDER_ATOMIC) || 'ST77XX_WHITE';
        code = 'tft.drawFastHLine(' + x + ', ' + y + ', ' + w + ', ' + color + ');';
        break;
        
      case 'draw_fast_v_line':
        var x = generator.valueToCode(block, 'X', Arduino.ORDER_ATOMIC) || '0';
        var y = generator.valueToCode(block, 'Y', Arduino.ORDER_ATOMIC) || '0';
        var h = generator.valueToCode(block, 'H', Arduino.ORDER_ATOMIC) || '0';
        var color = generator.valueToCode(block, 'COLOR', Arduino.ORDER_ATOMIC) || 'ST77XX_WHITE';
        code = 'tft.drawFastVLine(' + x + ', ' + y + ', ' + h + ', ' + color + ');';
        break;
        
      case 'draw_rect':
        var x = generator.valueToCode(block, 'X', Arduino.ORDER_ATOMIC) || '0';
        var y = generator.valueToCode(block, 'Y', Arduino.ORDER_ATOMIC) || '0';
        var w = generator.valueToCode(block, 'W', Arduino.ORDER_ATOMIC) || '0';
        var h = generator.valueToCode(block, 'H', Arduino.ORDER_ATOMIC) || '0';
        var color = generator.valueToCode(block, 'COLOR', Arduino.ORDER_ATOMIC) || 'ST77XX_WHITE';
        code = 'tft.drawRect(' + x + ', ' + y + ', ' + w + ', ' + h + ', ' + color + ');';
        break;
        
      case 'fill_rect':
        var x = generator.valueToCode(block, 'X', Arduino.ORDER_ATOMIC) || '0';
        var y = generator.valueToCode(block, 'Y', Arduino.ORDER_ATOMIC) || '0';
        var w = generator.valueToCode(block, 'W', Arduino.ORDER_ATOMIC) || '0';
        var h = generator.valueToCode(block, 'H', Arduino.ORDER_ATOMIC) || '0';
        var color = generator.valueToCode(block, 'COLOR', Arduino.ORDER_ATOMIC) || 'ST77XX_WHITE';
        code = 'tft.fillRect(' + x + ', ' + y + ', ' + w + ', ' + h + ', ' + color + ');';
        break;
        
      case 'draw_round_rect':
        var x = generator.valueToCode(block, 'X', Arduino.ORDER_ATOMIC) || '0';
        var y = generator.valueToCode(block, 'Y', Arduino.ORDER_ATOMIC) || '0';
        var w = generator.valueToCode(block, 'W', Arduino.ORDER_ATOMIC) || '0';
        var h = generator.valueToCode(block, 'H', Arduino.ORDER_ATOMIC) || '0';
        var r = generator.valueToCode(block, 'R', Arduino.ORDER_ATOMIC) || '0';
        var color = generator.valueToCode(block, 'COLOR', Arduino.ORDER_ATOMIC) || 'ST77XX_WHITE';
        code = 'tft.drawRoundRect(' + x + ', ' + y + ', ' + w + ', ' + h + ', ' + r + ', ' + color + ');';
        break;
        
      case 'fill_round_rect':
        var x = generator.valueToCode(block, 'X', Arduino.ORDER_ATOMIC) || '0';
        var y = generator.valueToCode(block, 'Y', Arduino.ORDER_ATOMIC) || '0';
        var w = generator.valueToCode(block, 'W', Arduino.ORDER_ATOMIC) || '0';
        var h = generator.valueToCode(block, 'H', Arduino.ORDER_ATOMIC) || '0';
        var r = generator.valueToCode(block, 'R', Arduino.ORDER_ATOMIC) || '0';
        var color = generator.valueToCode(block, 'COLOR', Arduino.ORDER_ATOMIC) || 'ST77XX_WHITE';
        code = 'tft.fillRoundRect(' + x + ', ' + y + ', ' + w + ', ' + h + ', ' + r + ', ' + color + ');';
        break;
        
      case 'draw_circle':
        var x = generator.valueToCode(block, 'X', Arduino.ORDER_ATOMIC) || '0';
        var y = generator.valueToCode(block, 'Y', Arduino.ORDER_ATOMIC) || '0';
        var r = generator.valueToCode(block, 'R', Arduino.ORDER_ATOMIC) || '0';
        var color = generator.valueToCode(block, 'COLOR', Arduino.ORDER_ATOMIC) || 'ST77XX_WHITE';
        code = 'tft.drawCircle(' + x + ', ' + y + ', ' + r + ', ' + color + ');';
        break;
        
      case 'fill_circle':
        var x = generator.valueToCode(block, 'X', Arduino.ORDER_ATOMIC) || '0';
        var y = generator.valueToCode(block, 'Y', Arduino.ORDER_ATOMIC) || '0';
        var r = generator.valueToCode(block, 'R', Arduino.ORDER_ATOMIC) || '0';
        var color = generator.valueToCode(block, 'COLOR', Arduino.ORDER_ATOMIC) || 'ST77XX_WHITE';
        code = 'tft.fillCircle(' + x + ', ' + y + ', ' + r + ', ' + color + ');';
        break;
        
      case 'draw_triangle':
        var x0 = generator.valueToCode(block, 'X0', Arduino.ORDER_ATOMIC) || '0';
        var y0 = generator.valueToCode(block, 'Y0', Arduino.ORDER_ATOMIC) || '0';
        var x1 = generator.valueToCode(block, 'X1', Arduino.ORDER_ATOMIC) || '0';
        var y1 = generator.valueToCode(block, 'Y1', Arduino.ORDER_ATOMIC) || '0';
        var x2 = generator.valueToCode(block, 'X2', Arduino.ORDER_ATOMIC) || '0';
        var y2 = generator.valueToCode(block, 'Y2', Arduino.ORDER_ATOMIC) || '0';
        var color = generator.valueToCode(block, 'COLOR', Arduino.ORDER_ATOMIC) || 'ST77XX_WHITE';
        code = 'tft.drawTriangle(' + x0 + ', ' + y0 + ', ' + x1 + ', ' + y1 + ', ' + x2 + ', ' + y2 + ', ' + color + ');';
        break;
        
      case 'fill_triangle':
        var x0 = generator.valueToCode(block, 'X0', Arduino.ORDER_ATOMIC) || '0';
        var y0 = generator.valueToCode(block, 'Y0', Arduino.ORDER_ATOMIC) || '0';
        var x1 = generator.valueToCode(block, 'X1', Arduino.ORDER_ATOMIC) || '0';
        var y1 = generator.valueToCode(block, 'Y1', Arduino.ORDER_ATOMIC) || '0';
        var x2 = generator.valueToCode(block, 'X2', Arduino.ORDER_ATOMIC) || '0';
        var y2 = generator.valueToCode(block, 'Y2', Arduino.ORDER_ATOMIC) || '0';
        var color = generator.valueToCode(block, 'COLOR', Arduino.ORDER_ATOMIC) || 'ST77XX_WHITE';
        code = 'tft.fillTriangle(' + x0 + ', ' + y0 + ', ' + x1 + ', ' + y1 + ', ' + x2 + ', ' + y2 + ', ' + color + ');';
        break;
        
    }
    
    return code + '\n';
  };
});

Arduino.forBlock['tft_color565'] = function(block, generator) {
  var r = generator.valueToCode(block, 'R', Arduino.ORDER_ATOMIC) || '0';
  var g = generator.valueToCode(block, 'G', Arduino.ORDER_ATOMIC) || '0';
  var b = generator.valueToCode(block, 'B', Arduino.ORDER_ATOMIC) || '0';
  return ['tft.color565(' + r + ', ' + g + ', ' + b + ')', Arduino.ORDER_ATOMIC];
};

// 画布(canvas)相关
Arduino.forBlock['tft_create_canvas16'] = function(block, generator) {
  var name = Arduino.nameDB_.getName(block.getFieldValue('NAME'), "VARIABLE");
  var w = generator.valueToCode(block, 'WIDTH', Arduino.ORDER_ATOMIC) || '10';
  var h = generator.valueToCode(block, 'HEIGHT', Arduino.ORDER_ATOMIC) || '10';
  generator.addLibrary('Adafruit_GFX', '#include <Adafruit_GFX.h>');
  generator.addVariable(name, 'GFXcanvas16 ' + name + '(' + w + ', ' + h + ');');
  return '';
};

Arduino.forBlock['tft_create_canvas1'] = function(block, generator) {
  var name = Arduino.nameDB_.getName(block.getFieldValue('NAME'), "VARIABLE");
  var w = generator.valueToCode(block, 'WIDTH', Arduino.ORDER_ATOMIC) || '10';
  var h = generator.valueToCode(block, 'HEIGHT', Arduino.ORDER_ATOMIC) || '10';
  generator.addLibrary('Adafruit_GFX', '#include <Adafruit_GFX.h>');
  generator.addVariable(name, 'GFXcanvas1 ' + name + '(' + w + ', ' + h + ');');
  return '';
};

Arduino.forBlock['tft_get_buffer'] = function(block, generator) {
  var canvas = generator.valueToCode(block, 'CANVAS', Arduino.ORDER_ATOMIC) || 'canvas';
  return [canvas + '.getBuffer()', Arduino.ORDER_ATOMIC];
};

// 位图数据块 - 处理图像数据并创建变量
Arduino.forBlock['tft_bitmap_image'] = function(block, generator) {
  // 获取位图数据字段
  const imageData = block.getFieldValue('IMAGE_DATA');
  console.log('Processing image data...');
  
  // 生成一个唯一的变量名
  const bitmapVarName = `bitmap_${block.id.replace(/[^a-zA-Z0-9]/g, '')}`;
  
  try {
    // 解析图像数据
    let width, height, formattedData;
    
    if (imageData && imageData.trim()) {
      // 尝试解析用户提供的图像数据
      const result = convertImageToRGB565(imageData);
      
      if (!result) {
        console.error('Failed to convert image data to RGB565 format');
        // 使用一个小的默认图像数据，防止生成错误代码
        width = 8;
        height = 8;
        formattedData = '0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,\n' +
                        '0xFFFF, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0xFFFF,\n' +
                        '0xFFFF, 0x0000, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x0000, 0xFFFF,\n' +
                        '0xFFFF, 0x0000, 0xFFFF, 0x0000, 0x0000, 0xFFFF, 0x0000, 0xFFFF,\n' +
                        '0xFFFF, 0x0000, 0xFFFF, 0x0000, 0x0000, 0xFFFF, 0x0000, 0xFFFF,\n' +
                        '0xFFFF, 0x0000, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x0000, 0xFFFF,\n' +
                        '0xFFFF, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0xFFFF,\n' +
                        '0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF';
      } else {
        ({ width, height, formattedData } = result);
      }
    } else {
      // 如果没有提供图像数据，使用默认示例图像（一个简单的笑脸）
      width = 16;
      height = 16;
      
      // 简单的笑脸图像，16x16像素，RGB565格式
      formattedData = 
        '0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000,\n' +
        '0x0000, 0x0000, 0x0000, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0x0000, 0x0000, 0x0000,\n' +
        '0x0000, 0x0000, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0x0000, 0x0000,\n' +
        '0x0000, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0x0000,\n' +
        '0x0000, 0xFFE0, 0xFFE0, 0xFFE0, 0x0000, 0x0000, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0x0000, 0x0000, 0xFFE0, 0xFFE0, 0xFFE0, 0x0000,\n' +
        '0x0000, 0xFFE0, 0xFFE0, 0xFFE0, 0x0000, 0x0000, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0x0000, 0x0000, 0xFFE0, 0xFFE0, 0xFFE0, 0x0000,\n' +
        '0x0000, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0x0000,\n' +
        '0x0000, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0x0000,\n' +
        '0x0000, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0x0000,\n' +
        '0x0000, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0x0000,\n' +
        '0x0000, 0xFFE0, 0xFFE0, 0xFFE0, 0x0000, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0x0000, 0xFFE0, 0xFFE0, 0xFFE0, 0x0000,\n' +
        '0x0000, 0xFFE0, 0xFFE0, 0xFFE0, 0x0000, 0x0000, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0x0000, 0x0000, 0xFFE0, 0xFFE0, 0xFFE0, 0x0000,\n' +
        '0x0000, 0x0000, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0x0000, 0x0000,\n' +
        '0x0000, 0x0000, 0x0000, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0xFFE0, 0x0000, 0x0000, 0x0000,\n' +
        '0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000,\n' +
        '0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000';
    }
    
    // 添加位图数据到程序的全局变量部分
    const bitmapDeclaration = `// 图像数据 (${width}x${height})
static const uint16_t ${bitmapVarName}[] PROGMEM = {
${formattedData}
};
const uint16_t ${bitmapVarName}_width = ${width};
const uint16_t ${bitmapVarName}_height = ${height};`;

    generator.addVariable(bitmapVarName, bitmapDeclaration);
    
    // 返回位图变量名，用于在drawRGBBitmap中引用
    return [`${bitmapVarName}`, Arduino.ORDER_ATOMIC];
  } catch (e) {
    console.error('Error processing image data:', e);
    return ['NULL', Arduino.ORDER_ATOMIC];
  }
};

// 绘制图像到TFT屏幕
Arduino.forBlock['tft_draw_image'] = function(block, generator) {
  // 获取位图数据和位置信息
  const bitmap = generator.valueToCode(block, 'BITMAP', Arduino.ORDER_ATOMIC);
  const x = generator.valueToCode(block, 'X', Arduino.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', Arduino.ORDER_ATOMIC) || '0';
  
  if (!bitmap || bitmap === 'NULL') {
    return '// 没有有效的图像数据\n';
  }
  
  // 生成代码
  return `tft.drawRGBBitmap(${x}, ${y}, ${bitmap}, ${bitmap}_width, ${bitmap}_height);\n`;
};

// 辅助函数：将图像数据转换为RGB565格式
function convertImageToRGB565(imageData) {
  try {
    // 尝试解析图像数据，支持多种格式
    let parsedData;
    
    // 首先尝试作为JSON解析
    try {
      parsedData = JSON.parse(imageData);
    } catch(e) {
      // 如果JSON解析失败，尝试作为字符串表达的二维数组解析
      try {
        parsedData = eval(`(${imageData})`);
      } catch(e2) {
        console.error('Failed to parse image data', e2);
        return null;
      }
    }
    
    // 处理数据，提取宽度、高度和像素数据
    let width, height, pixels;
    
    // 检查数据格式
    if (Array.isArray(parsedData)) {
      // 如果是数组，假设它是二维像素数组 [rows][cols]
      height = parsedData.length;
      width = height > 0 ? parsedData[0].length : 0;
      
      // 将二维数组转为一维数组
      pixels = [];
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          pixels.push(parsedData[y][x]);
        }
      }
    } else if (parsedData && typeof parsedData === 'object') {
      // 如果是对象，查找width、height和pixels属性
      ({ width, height, pixels } = parsedData);
    }
    
    if (!width || !height || !pixels || !Array.isArray(pixels)) {
      console.error('Invalid image data format');
      return null;
    }
    
    // 将像素数据转换为RGB565格式字符串
    let formattedData = '';
    let lineCount = 0;
    
    for (let i = 0; i < pixels.length; i++) {
      const pixel = pixels[i];
      let r, g, b;
      
      // 处理不同格式的像素
      if (Array.isArray(pixel)) {
        // 像素是[r,g,b]或[r,g,b,a]格式
        [r, g, b] = pixel;
      } else if (typeof pixel === 'number') {
        // 像素是数值格式 (0xRRGGBB)
        r = (pixel >> 16) & 0xFF;
        g = (pixel >> 8) & 0xFF;
        b = pixel & 0xFF;
      } else if (typeof pixel === 'string' && pixel.startsWith('#')) {
        // 像素是HTML颜色格式 (#RRGGBB)
        const hex = pixel.substring(1);
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
      } else if (typeof pixel === 'string' && pixel.startsWith('0x')) {
        // 像素是十六进制字符串 (0xRRGGBB)
        const val = parseInt(pixel.substring(2), 16);
        r = (val >> 16) & 0xFF;
        g = (val >> 8) & 0xFF;
        b = val & 0xFF;
      } else {
        // 未知格式，使用黑色
        r = g = b = 0;
      }
      
      // 转换为RGB565格式
      const r5 = (r >> 3) & 0x1F;  // 5位红色
      const g6 = (g >> 2) & 0x3F;  // 6位绿色
      const b5 = (b >> 3) & 0x1F;  // 5位蓝色
      const rgb565 = (r5 << 11) | (g6 << 5) | b5;
      
      formattedData += `0x${rgb565.toString(16).padStart(4, '0')}`;
      
      // 添加分隔符和换行
      if (i < pixels.length - 1) {
        formattedData += ', ';
        lineCount++;
        
        if (lineCount >= width) {
          formattedData += '\n';
          lineCount = 0;
        }
      }
    }
    
    return {
      width,
      height,
      formattedData
    };
  } catch (e) {
    console.error('Error converting image data:', e);
    return null;
  }
}