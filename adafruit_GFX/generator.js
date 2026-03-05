// 统一的TFT屏幕相关 Generator.js 合并文件

// 获取板卡配置
function getBoardConfig() {
  return typeof window !== 'undefined' && window['boardConfig'] ? window['boardConfig'] : null;
}

// 检测是否为ESP32核心
function isESP32Core() {
  const boardConfig = getBoardConfig();
  return boardConfig && boardConfig.core && boardConfig.core.indexOf('esp32') > -1;
}

// 检测是否为AVR核心
function isAVRCore() {
  const boardConfig = getBoardConfig();
  return boardConfig && boardConfig.core && boardConfig.core.indexOf('avr') > -1;
}

// 初始化、对象定义部分，兼容ST7735/ST7789/ST7796S/自定义
Arduino.forBlock['tft_init'] = function(block, generator) {
  var model = block.getFieldValue('MODEL'); // ST7735、ST7789或ST7796S
  
  // 获取板卡配置以设置默认引脚值
  const boardConfig = getBoardConfig();
  var defaultCS = '34', defaultDC = '35', defaultMOSI = '37', defaultSCLK = '36', defaultRST = '-1', defaultBLK = '33';
  
  // 根据板卡类型调整默认引脚值
  if (boardConfig) {
    if (isESP32Core()) {
      // ESP32默认引脚配置
      defaultCS = '5';
      defaultDC = '2';
      defaultMOSI = '23';
      defaultSCLK = '18';
      defaultRST = '4';
      defaultBLK = '22';
    } else if (isAVRCore()) {
      // AVR (如Arduino Uno) 默认引脚配置
      defaultCS = '10';
      defaultDC = '9';
      defaultMOSI = '11';
      defaultSCLK = '13';
      defaultRST = '8';
      defaultBLK = '7';
    }
  }
  
  // 从用户输入获取引脚配置，使用板卡适配的默认值
  var cs = generator.valueToCode(block, 'CS', generator.ORDER_ATOMIC) || defaultCS;
  var dc = generator.valueToCode(block, 'DC', generator.ORDER_ATOMIC) || defaultDC;
  var mosi = generator.valueToCode(block, 'MOSI', generator.ORDER_ATOMIC) || defaultMOSI;
  var sclk = generator.valueToCode(block, 'SCLK', generator.ORDER_ATOMIC) || defaultSCLK;
  var rst = generator.valueToCode(block, 'RST', generator.ORDER_ATOMIC) || defaultRST;
  
  // 获取背光引脚配置（新增）
  var blk = generator.valueToCode(block, 'BLK', generator.ORDER_ATOMIC) || defaultBLK;
  
  // 获取屏幕尺寸参数，使用与Adafruit_st7789.ino匹配的默认值
  var width = generator.valueToCode(block, 'WIDTH', generator.ORDER_ATOMIC) || '172';
  var height = generator.valueToCode(block, 'HEIGHT', generator.ORDER_ATOMIC) || '320';
  
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
    
    // 添加背光控制（如果指定了背光引脚）
    if (blk !== '-1' && blk !== 'undefined' && blk !== '') {
      generator.addSetupBegin('tft_backlight', 'pinMode('+blk+', OUTPUT);\n  digitalWrite('+blk+', HIGH);  // 开启背光');
    }
    
    // 添加串口调试信息
    generator.addSetupBegin('tft_debug', 'Serial.begin(115200);\n  Serial.println("Initializing ST7789 display...");');
    
    // ST7789初始化序列
    generator.addSetupBegin('tft_init', 'tft.init('+width+', '+height+');\n  tft.setRotation(3);\n  Serial.println("ST7789 initialized successfully!");');
    
  } else { // 默认为ST7735
    generator.addLibrary('Adafruit_ST7735', '#include <Adafruit_ST7735.h>');
    generator.addLibrary('Adafruit_GFX', '#include <Adafruit_GFX.h>');
    
    // 使用软件SPI构造函数，包含固定引脚
    generator.addObject('tft', 'Adafruit_ST7735 tft = Adafruit_ST7735('+cs+', '+dc+', '+mosi+', '+sclk+', '+rst+');');
    generator.addSetupBegin('tft_init', 'tft.initR(INITR_BLACKTAB);\n  // 如果显示异常，可尝试以下初始化参数：\n  // tft.initR(INITR_REDTAB);\n  // tft.initR(INITR_GREENTAB);\n  // tft.initR(INITR_144GREENTAB);');
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

// TFT反色显示设置
Arduino.forBlock['tft_invert_display'] = function(block, generator) {
  // 从下拉菜单获取反色设置值
  const invert = block.getFieldValue('INVERT');

  // 生成代码
  return `tft.invertDisplay(${invert});\n`;
};

Arduino.forBlock['tft_fill_screen'] = function(block, generator) {
  var v = generator.valueToCode(block, 'COLOR', Arduino.ORDER_ATOMIC) || block.getFieldValue('COLOR') || 'ST77XX_BLACK';
  return 'tft.fillScreen(' + v + ');\n';
};

Arduino.forBlock['tft_clear_screen'] = function(block, generator) {
  return 'tft.fillScreen(ST77XX_BLACK);\n';
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
  registerVariableToBlockly(name, 'GFXcanvas16');
  
  var varField = block.getField('NAME');
  if (varField) {
    const originalFinishEditing = varField.onFinishEditing_;
    varField.onFinishEditing_ = function(newName) {
      if (typeof originalFinishEditing === 'function') {
        originalFinishEditing.call(this, newName);
      }
      const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
      const oldName = block._canvas16VarLastName;
      if (workspace && newName && newName !== oldName) {
        renameVariableInBlockly(block, oldName, newName, 'GFXcanvas16');
        block._canvas16VarLastName = newName;
      }
    };
  }
  
  return '';
};

Arduino.forBlock['tft_create_canvas1'] = function(block, generator) {
  var name = Arduino.nameDB_.getName(block.getFieldValue('NAME'), "VARIABLE");
  var w = generator.valueToCode(block, 'WIDTH', Arduino.ORDER_ATOMIC) || '10';
  var h = generator.valueToCode(block, 'HEIGHT', Arduino.ORDER_ATOMIC) || '10';
  generator.addLibrary('Adafruit_GFX', '#include <Adafruit_GFX.h>');
  generator.addVariable(name, 'GFXcanvas1 ' + name + '(' + w + ', ' + h + ');');
  registerVariableToBlockly(name, 'GFXcanvas1');
  
  var varField = block.getField('NAME');
  if (varField) {
    const originalFinishEditing = varField.onFinishEditing_;
    varField.onFinishEditing_ = function(newName) {
      if (typeof originalFinishEditing === 'function') {
        originalFinishEditing.call(this, newName);
      }
      const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
      const oldName = block._canvas1VarLastName;
      if (workspace && newName && newName !== oldName) {
        renameVariableInBlockly(block, oldName, newName, 'GFXcanvas1');
        block._canvas1VarLastName = newName;
      }
    };
  }
  
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

// 图片文件处理块 - 使用新的图片预览字段
Arduino.forBlock['tft_image_file'] = function(block, generator) {
  // 获取图片预览字段的值和坐标
  const imagePreview = block.getFieldValue('IMAGE_PREVIEW');
  const x = block.getFieldValue('X') || '0';
  const y = block.getFieldValue('Y') || '0';

  // 获取尺寸输入值，如果没有则使用图片预览字段中的尺寸
  let width = block.getFieldValue('WIDTH');
  let height = block.getFieldValue('HEIGHT');

  // 解析图片预览字段的值
  let filePath = '';
  let previewWidth = 32;
  let previewHeight = 32;

  if (imagePreview && typeof imagePreview === 'object') {
    filePath = imagePreview.filePath || '';
    previewWidth = imagePreview.width || 32;
    previewHeight = imagePreview.height || 32;
  } else if (typeof imagePreview === 'string') {
    try {
      const parsed = JSON.parse(imagePreview);
      filePath = parsed.filePath || '';
      previewWidth = parsed.width || 32;
      previewHeight = parsed.height || 32;
    } catch (e) {
      filePath = imagePreview;
    }
  }

  // 如果没有外部尺寸输入，使用预览字段中的尺寸
  if (!width) width = previewWidth.toString();
  if (!height) height = previewHeight.toString();

  // 生成唯一的变量名
  const bitmapVarName = `imageFile_${block.id.replace(/[^a-zA-Z0-9]/g, '')}`;

  console.log(`[图片文件] 处理文件: ${filePath}, 尺寸: ${width}x${height}, 位置: (${x}, ${y})`);

  // 检查是否已选择文件
  if (!filePath || filePath.trim() === '') {
    console.log('使用默认占位图像');
    const defaultCode = processDefaultImage(bitmapVarName, width, height, generator);
    if (defaultCode && defaultCode[0] !== 'NULL') {
      return `tft.drawRGBBitmap(${x}, ${y}, ${bitmapVarName}, ${width}, ${height});\n`;
    }
    return '';
  }

  // 处理图片文件并生成显示代码
  const imageCode = processImageFile(filePath, width, height, bitmapVarName, generator);
  if (imageCode && imageCode[0] !== 'NULL') {
    return `tft.drawRGBBitmap(${x}, ${y}, ${bitmapVarName}, ${width}, ${height});\n`;
  }

  return '';
};

// 注释：文件选择器扩展已移除，现在使用field_image_preview字段
// 添加文件选择器扩展 - 简化版本（已废弃）
/*
if (typeof Blockly !== 'undefined' && Blockly.Extensions) {
  Blockly.Extensions.register('tft_image_file_extension_simple', function() {
    const block = this;
    const fileField = this.getField('FILE_PATH');
    
    if (fileField) {
      // 初始化全局图片缓存
      if (!window.tftImageCache) {
        window.tftImageCache = {};
      }
      
      // 创建文件选择器
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.style.display = 'none';
      
      // 显示用户友好的消息
      function showUserMessage(message, type = 'info') {
        console.log(`[${type.toUpperCase()}] ${message}`);
        // 可选：显示在页面上
        if (typeof alert !== 'undefined' && type === 'error') {
          alert(message);
        }
      }
      
      // 处理文件选择
      input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
          console.log(`🔍 [文件选择] 选择文件: ${file.name}, 类型: ${file.type}, 大小: ${file.size}`);
          showUserMessage(`正在处理图片: ${file.name}...`, 'info');
          
          // 验证文件类型和大小
          if (!file.type.startsWith('image/')) {
            showUserMessage('请选择有效的图片文件！', 'error');
            return;
          }
          
          if (file.size > 5 * 1024 * 1024) { // 5MB限制
            showUserMessage('图片文件过大，请选择小于5MB的文件', 'error');
            return;
          }
          
          // 立即更新字段显示
          fileField.setValue(file.name);
          
          // 读取文件并转换
          const reader = new FileReader();
          reader.onload = function(event) {
            console.log(`📖 文件读取完成: ${file.name}`);
            
            const img = new Image();
            img.onload = function() {
              console.log(`🖼️ 图片加载完成: ${img.width}x${img.height}`);
              showUserMessage(`图片 ${file.name} 处理中...`, 'info');
              
              try {
                // 处理所有可能用到的尺寸
                const processedSizes = {};
                const sizesToProcess = [8, 16, 24, 32, 48, 64, 96, 128];
                
                let processedCount = 0;
                sizesToProcess.forEach(size => {
                  try {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = size;
                    canvas.height = size;
                    
                    // 绘制缩放后的图片，保持宽高比
                    const aspectRatio = img.width / img.height;
                    let drawWidth = size;
                    let drawHeight = size;
                    let offsetX = 0;
                    let offsetY = 0;
                    
                    if (aspectRatio > 1) {
                      drawHeight = size / aspectRatio;
                      offsetY = (size - drawHeight) / 2;
                    } else {
                      drawWidth = size * aspectRatio;
                      offsetX = (size - drawWidth) / 2;
                    }
                    
                    ctx.fillStyle = '#000000';
                    ctx.fillRect(0, 0, size, size);
                    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
                    
                    // 获取像素数据
                    const pixelData = ctx.getImageData(0, 0, size, size);
                    const data = pixelData.data;
                    
                    // 转换为RGB565数组
                    const rgb565Array = [];
                    for (let i = 0; i < data.length; i += 4) {
                      const r = data[i];
                      const g = data[i + 1];
                      const b = data[i + 2];
                      
                      // 转换为RGB565
                      const r5 = (r >> 3) & 0x1F;
                      const g6 = (g >> 2) & 0x3F;
                      const b5 = (b >> 3) & 0x1F;
                      const rgb565 = (r5 << 11) | (g6 << 5) | b5;
                      
                      rgb565Array.push(`0x${rgb565.toString(16).padStart(4, '0').toUpperCase()}`);
                    }
                    
                    processedSizes[size] = rgb565Array;
                    processedCount++;
                    console.log(`✅ 处理尺寸 ${size}x${size}: ${rgb565Array.length} 像素`);
                    
                  } catch (sizeError) {
                    console.error(`❌ 处理尺寸 ${size} 时出错:`, sizeError);
                  }
                });
                
                // 存储到全局缓存（使用多个key确保能找到）
                const cacheKeys = [file.name, file.name.toLowerCase(), file.name.replace(/\s+/g, '_')];
                cacheKeys.forEach(key => {
                  window.tftImageCache[key] = {
                    fileName: file.name,
                    originalWidth: img.width,
                    originalHeight: img.height,
                    processedSizes: processedSizes,
                    imageElement: img,
                    processedAt: Date.now(),
                    processedCount: processedCount
                  };
                });
                
                // 设置文件选择器字段的值
                fileField.setValue(file.name);

                // 简单地标记工作区已修改，不触发复杂事件
                try {
                  if (block && block.workspace) {
                    // 只标记工作区已修改，不触发事件
                    if (block.workspace.markFocused) {
                      block.workspace.markFocused();
                    }
                    // 强制重新渲染块
                    if (block.render) {
                      block.render();
                    }
                  }
                } catch (error) {
                  console.log('工作区更新失败:', error);
                }
                
                showUserMessage(`图片 ${file.name} 处理完成！支持尺寸: ${Object.keys(processedSizes).join(', ')}`, 'success');
                console.log(`🎯 图片缓存成功: ${file.name}`);
                console.log(`📊 可用尺寸: ${Object.keys(processedSizes).join(', ')}`);
                console.log(`🗂️ 缓存键: ${cacheKeys.join(', ')}`);
                
              } catch (error) {
                showUserMessage(`图片处理失败: ${error.message}`, 'error');
                console.error(`❌ 图片处理失败:`, error);
              }
            };
            
            img.onerror = function() {
              showUserMessage(`图片加载失败: ${file.name}`, 'error');
              console.error(`❌ 图片加载失败: ${file.name}`);
            };
            
            img.src = event.target.result;
          };
          
          reader.onerror = function() {
            showUserMessage(`文件读取失败: ${file.name}`, 'error');
            console.error(`❌ 文件读取失败: ${file.name}`);
          };
          
          reader.readAsDataURL(file);
        }
      };
      
      // 改进的点击处理
      fileField.onMouseDown_ = function(e) {
        e.preventDefault();
        e.stopPropagation();

        // 清除之前的警告
        console.log('打开文件选择器...');

        input.click();
      };
       
       // 添加到DOM
       document.body.appendChild(input);
     }
   });
 }
*/

// 处理默认图像 - 改进为更实用的占位图案
function processDefaultImage(bitmapVarName, width, height, generator) {
  const w = parseInt(width);
  const h = parseInt(height);
  const size = w * h;
  let formattedData = '';
  
  // 创建"无图片"标识图案
  for (let i = 0; i < size; i++) {
    const row = Math.floor(i / w);
    const col = i % w;
    
    let pixelColor;
    
    // 边框
    if (row === 0 || col === 0 || row === h-1 || col === w-1) {
      pixelColor = '0x8410'; // 深灰色边框
    }
    // 对角线
    else if (Math.abs(row - col) < 2 || Math.abs(row + col - (h-1)) < 2) {
      pixelColor = '0xF800'; // 红色对角线
    }
    // 中心区域
    else if (row > h/4 && row < 3*h/4 && col > w/4 && col < 3*w/4) {
      // 在中心区域创建"X"图案
      const centerX = Math.abs(col - w/2);
      const centerY = Math.abs(row - h/2);
      if (Math.abs(centerX - centerY) < 2) {
        pixelColor = '0xFFE0'; // 黄色X
      } else {
        pixelColor = '0x4208'; // 浅灰色背景
      }
    }
    else {
      pixelColor = '0x4208'; // 浅灰色背景
    }
    
    formattedData += pixelColor;
    if (i < size - 1) formattedData += ', ';
    if ((i + 1) % w === 0) formattedData += '\n  ';
  }
  
  const bitmapDeclaration = `// 占位图像 (${w}x${h}) - 无图片标识
static const uint16_t ${bitmapVarName}[] PROGMEM = {
${formattedData}
};
const uint16_t ${bitmapVarName}_width = ${w};
const uint16_t ${bitmapVarName}_height = ${h};`;

  generator.addVariable(bitmapVarName, bitmapDeclaration);
  return [`${bitmapVarName}`, Arduino.ORDER_ATOMIC];
}

// 处理图片文件
function processImageFile(filePath, width, height, bitmapVarName, generator) {
  try {
    // 检查全局存储的图片数据
    if (window.tftImageCache && window.tftImageCache[filePath]) {
      // 使用缓存的图片数据
      const imageData = window.tftImageCache[filePath];
      console.log(`[图片处理] 命中缓存: ${filePath}`);
      const processedData = processImageToRGB565(imageData, width, height);
      const bitmapDeclaration = `// 从文件加载的图像: ${filePath} (${width}x${height})\nstatic const uint16_t ${bitmapVarName}[] PROGMEM = {\n  ${processedData}\n};\nconst uint16_t ${bitmapVarName}_width = ${width};\nconst uint16_t ${bitmapVarName}_height = ${height};`;
      generator.addVariable(bitmapVarName, bitmapDeclaration);
      return [`${bitmapVarName}`, Arduino.ORDER_ATOMIC];
    } else {
      // 没有图片数据，使用占位图像但不阻止代码生成
      console.warn(`[图片处理] 未命中缓存: ${filePath}，使用占位图像`);
      // 显示警告信息（如果可能的话）
      console.warn('图片未加载完成，已使用占位图像');
      return processDefaultImage(bitmapVarName, width, height, generator);
    }
  } catch (e) {
    console.error('处理图片文件时出错:', e);
    // 显示错误信息
    console.error('图片处理出错，已使用默认占位图像！');
    return processDefaultImage(bitmapVarName, width, height, generator);
  }
}

// 处理图片数据转换为RGB565
function processImageToRGB565(imageData, targetWidth, targetHeight) {
  try {
    const width = parseInt(targetWidth);
    const height = parseInt(targetHeight);
    
    // 检查是否有预处理的数据
    if (imageData.processedSizes) {
      // 查找匹配的尺寸
      const exactMatch = imageData.processedSizes[width];
      if (exactMatch && width === height) {
        // 找到完全匹配的尺寸，直接使用
        return formatRGB565Array(exactMatch, width);
      }
      
      // 找最接近的尺寸进行缩放
      const availableSizes = Object.keys(imageData.processedSizes).map(s => parseInt(s));
      const closestSize = availableSizes.reduce((prev, curr) => 
        Math.abs(curr - width) < Math.abs(prev - width) ? curr : prev
      );
      
      if (imageData.processedSizes[closestSize]) {
        // 使用最接近的尺寸数据进行重新处理
        const sourceData = imageData.processedSizes[closestSize];
        return resizeRGB565Data(sourceData, closestSize, width, height);
      }
    }
    
    // 如果没有预处理数据，使用实时处理
    if (imageData.imageElement) {
      return processImageRealTime(imageData.imageElement, width, height);
    }
    
    // 都没有，返回更友好的占位图像
    console.warn('没有可用的图片数据，使用占位图像');
    return generatePlaceholderData(width, height, '0x8410'); // 灰色占位，避免纯绿色
    
  } catch (e) {
    console.error('处理图片数据时出错:', e);
    return generatePlaceholderData(targetWidth, targetHeight, '0xF800'); // 红色错误
  }
}



// 格式化RGB565数组为C代码格式
function formatRGB565Array(rgb565Array, width) {
  let formatted = '';
  for (let i = 0; i < rgb565Array.length; i++) {
    formatted += rgb565Array[i];
    
    if (i < rgb565Array.length - 1) {
      formatted += ', ';
    }
    
    // 每行换行
    if ((i + 1) % width === 0 && i < rgb565Array.length - 1) {
      formatted += '\n  ';
    }
  }
  return formatted;
}

// 缩放RGB565数据
function resizeRGB565Data(sourceData, sourceSize, targetWidth, targetHeight) {
  try {
    // 简单的最近邻插值
    const result = [];
    const scaleX = sourceSize / targetWidth;
    const scaleY = sourceSize / targetHeight;
    
    for (let y = 0; y < targetHeight; y++) {
      for (let x = 0; x < targetWidth; x++) {
        const sourceX = Math.floor(x * scaleX);
        const sourceY = Math.floor(y * scaleY);
        const sourceIndex = sourceY * sourceSize + sourceX;
        
        if (sourceIndex < sourceData.length) {
          result.push(sourceData[sourceIndex]);
        } else {
          result.push('0x0000'); // 黑色填充
        }
      }
    }
    
    return formatRGB565Array(result, targetWidth);
  } catch (e) {
    console.error('缩放图片数据时出错:', e);
    return generatePlaceholderData(targetWidth, targetHeight, '0xFFE0'); // 黄色错误
  }
}

// 实时处理图片
function processImageRealTime(img, width, height) {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = width;
    canvas.height = height;
    
    // 绘制图片
    ctx.drawImage(img, 0, 0, width, height);
    
    // 获取像素数据
    const pixelData = ctx.getImageData(0, 0, width, height);
    const data = pixelData.data;
    
    // 转换为RGB565
    const rgb565Array = [];
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      const r5 = (r >> 3) & 0x1F;
      const g6 = (g >> 2) & 0x3F;
      const b5 = (b >> 3) & 0x1F;
      const rgb565 = (r5 << 11) | (g6 << 5) | b5;
      
      rgb565Array.push(`0x${rgb565.toString(16).padStart(4, '0').toUpperCase()}`);
    }
    
    return formatRGB565Array(rgb565Array, width);
  } catch (e) {
    console.error('实时处理图片时出错:', e);
    return generatePlaceholderData(width, height, '0xF81F'); // 紫色错误
  }
}

// 生成占位数据 - 改进为更友好的占位图案
function generatePlaceholderData(width, height, color = '0x8410') {
  const w = parseInt(width);
  const h = parseInt(height);
  const size = w * h;
  let data = '';
  
  // 使用棋盘格图案作为占位，更美观且能识别尺寸
  for (let i = 0; i < size; i++) {
    const row = Math.floor(i / w);
    const col = i % w;
    // 创建棋盘格效果，边缘高亮
    let pixelColor;
    if (row === 0 || col === 0 || row === h-1 || col === w-1) {
      pixelColor = '0xFFFF'; // 白色边框
    } else if (row === 1 || col === 1 || row === h-2 || col === w-2) {
      pixelColor = '0xF800'; // 红色内框
    } else {
      // 棋盘格图案
      pixelColor = (row + col) % 2 === 0 ? '0x8410' : '0x4208'; // 灰色棋盘
    }
    
    data += pixelColor;
    if (i < size - 1) data += ', ';
    if ((i + 1) % w === 0) data += '\n  ';
  }
  return data;
}

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


// 下载URL图片并显示到TFT屏幕
Arduino.forBlock['tft_draw_url_image'] = function(block, generator) {
  const url = generator.valueToCode(block, 'URL', Arduino.ORDER_ATOMIC) || '""';
  const x = generator.valueToCode(block, 'X', Arduino.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', Arduino.ORDER_ATOMIC) || '0';
  const width = generator.valueToCode(block, 'WIDTH', Arduino.ORDER_ATOMIC) || '240';
  const height = generator.valueToCode(block, 'HEIGHT', Arduino.ORDER_ATOMIC) || '240';

  // 添加必要的库
  generator.addLibrary('tft_wifi', '#include <WiFi.h>');
  generator.addLibrary('tft_http', '#include <HTTPClient.h>');
  generator.addLibrary('tft_tjpgd', '#include <TJpg_Decoder.h>');

  // 添加显示URL图片的函数
  generator.addFunction('tft_draw_url_image', `
// TJpgDec回调函数 - 使用Adafruit_GFX的drawRGBBitmap
bool tft_jpg_output(int16_t x, int16_t y, uint16_t w, uint16_t h, uint16_t* bitmap) {
  if (y >= tft.height()) return 0;
  tft.drawRGBBitmap(x, y, bitmap, w, h);
  return 1;
}

void tft_draw_url_image(String imageUrl, int x, int y, int maxWidth, int maxHeight) {
  Serial.println("=== 下载并显示URL图片 ===");
  Serial.println("URL: " + imageUrl);

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("错误: WiFi未连接");
    return;
  }

  HTTPClient http;
  http.begin(imageUrl);
  http.setTimeout(30000);
  int httpCode = http.GET();

  if (httpCode == HTTP_CODE_OK) {
    int len = http.getSize();
    Serial.println("图片大小: " + String(len) + " bytes");

    // 检查图片大小，避免内存溢出
    if (len > 500000) {
      Serial.println("错误: 图片太大，超过500KB限制");
      http.end();
      return;
    }

    WiFiClient* stream = http.getStreamPtr();
    uint8_t* buffer = (uint8_t*)malloc(len);
    
    if (buffer) {
      int bytesRead = 0;
      while (http.connected() && bytesRead < len) {
        size_t available = stream->available();
        if (available) {
          int readBytes = stream->readBytes(buffer + bytesRead, available);
          bytesRead += readBytes;
        }
        delay(1);
      }
      
      Serial.println("下载完成: " + String(bytesRead) + " bytes");
      Serial.println("开始解码显示...");
      
      // 获取图片尺寸并计算缩放比例
      uint16_t imgW = 0, imgH = 0;
      TJpgDec.getJpgSize(&imgW, &imgH, buffer, len);
      Serial.println("原始图片尺寸: " + String(imgW) + "x" + String(imgH));
      
      // 计算合适的缩放比例 (1, 2, 4, 8)
      uint8_t scale = 1;
      if (imgW > maxWidth * 4 || imgH > maxHeight * 4) scale = 8;
      else if (imgW > maxWidth * 2 || imgH > maxHeight * 2) scale = 4;
      else if (imgW > maxWidth || imgH > maxHeight) scale = 2;
      
      Serial.println("缩放比例: 1/" + String(scale));
      TJpgDec.setJpgScale(scale);
      TJpgDec.setCallback(tft_jpg_output);
      TJpgDec.drawJpg(x, y, buffer, len);
      
      free(buffer);
      Serial.println("图片显示完成");
    } else {
      Serial.println("内存分配失败");
    }
  } else {
    Serial.println("HTTP错误: " + String(httpCode));
  }

  http.end();
}`);

  return `tft_draw_url_image(${url}, ${x}, ${y}, ${width}, ${height});\n`;
};

function registerVariableToBlockly(varName, varType) {
  if (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace) {
    const workspace = Blockly.getMainWorkspace();
    if (workspace && workspace.createVariable) {
      const existingVar = workspace.getVariable(varName, varType);
      if (!existingVar) {
        workspace.createVariable(varName, varType);
      }
    }
  }
}

function renameVariableInBlockly(block, oldName, newName, varType) {
  if (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace) {
    const workspace = block.workspace || Blockly.getMainWorkspace();
    if (workspace && workspace.renameVariableById) {
      const variable = workspace.getVariable(oldName, varType);
      if (variable) {
        workspace.renameVariableById(variable.getId(), newName);
      }
    }
  }
}

if (typeof Blockly !== 'undefined' && Blockly.FieldVariable) {
  const originalValidator = Blockly.FieldVariable.prototype.validator;
  Blockly.FieldVariable.prototype.validator = function(newValue) {
    const oldValue = this.getValue();
    const result = originalValidator.call(this, newValue);
    if (result !== null && oldValue !== result && this.sourceBlock_) {
      const block = this.sourceBlock_;
      const varType = block.type === 'tft_create_canvas16' ? 'GFXcanvas16' : 
                     block.type === 'tft_create_canvas1' ? 'GFXcanvas1' : '';
      if (varType) {
        renameVariableInBlockly(block, oldValue, result, varType);
      }
    }
    return result;
  };
}
