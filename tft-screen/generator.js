// lib-tft-screen generator.js
// TFT屏幕简化库 — 引脚预设，无需参数

// 清理值中的外层括号
function cleanValue(value) {
  if (typeof value === 'string') {
    return value.replace(/^\((.+)\)$/, '$1');
  }
  return value;
}

// 检测ESP32核心
function isESP32Core() {
  const boardConfig = window['boardConfig'];
  return boardConfig && boardConfig.core && boardConfig.core.indexOf('esp32') > -1;
}

if (!Arduino.tft_screen_init_done) {
  Arduino.tft_screen_init_done = false;
}

Arduino.forBlock['tftscr_init'] = function(block, generator) {
  // 注册 tft 变量
  registerVariableToBlockly('tft', 'TFT_eSPI');

  // 编译时宏 — 与原 tftespi_setup 相同机制
  const model = 'ST7735_DRIVER';
  const frequency = '27000000';
  const width = '128';
  const height = '160';
  const miso = '19';
  const mosi = '23';
  const sclk = '18';
  const cs = '5';
  const dc = '4';
  const rst = '19';
  const bl = '-1';
  const blLevel = 'HIGH';
  const colorMode = 'TFT_RGB';

  // 通过 projectService 注册宏（影响编译）
  if (typeof window !== 'undefined' && window['projectService']) {
    let p = Promise.resolve();
    p = p.then(() => window['projectService'].addMacro(model));
    p = p.then(() => window['projectService'].addMacro(`TFT_FREQUENCY=${frequency}`));
    p = p.then(() => window['projectService'].addMacro(`TFT_WIDTH=${width}`));
    p = p.then(() => window['projectService'].addMacro(`TFT_HEIGHT=${height}`));
    p = p.then(() => window['projectService'].addMacro(`TFT_MISO=${miso}`));
    p = p.then(() => window['projectService'].addMacro(`TFT_MOSI=${mosi}`));
    p = p.then(() => window['projectService'].addMacro(`TFT_SCLK=${sclk}`));
    p = p.then(() => window['projectService'].addMacro(`TFT_CS=${cs}`));
    p = p.then(() => window['projectService'].addMacro(`TFT_DC=${dc}`));
    p = p.then(() => window['projectService'].addMacro(`TFT_RST=${rst}`));
    p = p.then(() => window['projectService'].addMacro(`TFT_BL=${bl}`));
    p = p.then(() => window['projectService'].addMacro(`TFT_BACKLIGHT_ON=${blLevel}`));
    p = p.then(() => window['projectService'].addMacro(`TFT_RGB_ORDER=${colorMode}`));
    if (isESP32Core()) {
      p = p.then(() => window['projectService'].addMacro('USE_HSPI_PORT'));
    }
    p.then(() => console.log('TFT macros added'))
     .catch(err => console.error('Error adding TFT macros:', err));
  }

  // 生成器宏
  generator.addMacro("TFT_MODEL", `#define ${model}`);
  generator.addMacro("TFT_FREQUENCY", `#define TFT_FREQUENCY ${frequency}`);
  generator.addMacro("TFT_WIDTH", `#define TFT_WIDTH ${width}`);
  generator.addMacro("TFT_HEIGHT", `#define TFT_HEIGHT ${height}`);
  generator.addMacro("TFT_MISO", `#define TFT_MISO ${miso}`);
  generator.addMacro("TFT_MOSI", `#define TFT_MOSI ${mosi}`);
  generator.addMacro("TFT_SCLK", `#define TFT_SCLK ${sclk}`);
  generator.addMacro("TFT_CS", `#define TFT_CS ${cs}`);
  generator.addMacro("TFT_DC", `#define TFT_DC ${dc}`);
  generator.addMacro("TFT_RST", `#define TFT_RST ${rst}`);
  generator.addMacro("TFT_BL", `#define TFT_BL ${bl}`);
  generator.addMacro("TFT_BACKLIGHT_ON", `#define TFT_BACKLIGHT_ON ${blLevel}`);
  generator.addMacro("TFT_RGB_ORDER", `#define TFT_RGB_ORDER ${colorMode}`);
  if (isESP32Core()) {
    generator.addMacro("USE_HSPI_PORT", '#define USE_HSPI_PORT');
  }

  generator.addLibrary('TFT_eSPI', '#include <TFT_eSPI.h>');
  generator.addVariable('tft', 'TFT_eSPI tft = TFT_eSPI();');

  return 'tft.init();\ntft.setRotation(3);\n';
};

Arduino.forBlock['tftscr_fill_screen'] = function(block, generator) {
  const color = cleanValue(generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0');
  return 'tft.fillScreen(' + color + ');\n';
};

Arduino.forBlock['tftscr_draw_pixel'] = function(block, generator) {
  const x = cleanValue(generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0');
  const y = cleanValue(generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0');
  const color = cleanValue(generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0');
  return 'tft.drawPixel(' + x + ', ' + y + ', ' + color + ');\n';
};

Arduino.forBlock['tftscr_draw_line'] = function(block, generator) {
  const x1 = cleanValue(generator.valueToCode(block, 'X1', generator.ORDER_ATOMIC) || '0');
  const y1 = cleanValue(generator.valueToCode(block, 'Y1', generator.ORDER_ATOMIC) || '0');
  const x2 = cleanValue(generator.valueToCode(block, 'X2', generator.ORDER_ATOMIC) || '0');
  const y2 = cleanValue(generator.valueToCode(block, 'Y2', generator.ORDER_ATOMIC) || '0');
  const color = cleanValue(generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0');
  return 'tft.drawLine(' + x1 + ', ' + y1 + ', ' + x2 + ', ' + y2 + ', ' + color + ');\n';
};

Arduino.forBlock['tftscr_draw_rect'] = function(block, generator) {
  const x = cleanValue(generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0');
  const y = cleanValue(generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0');
  const w = cleanValue(generator.valueToCode(block, 'W', generator.ORDER_ATOMIC) || '10');
  const h = cleanValue(generator.valueToCode(block, 'H', generator.ORDER_ATOMIC) || '10');
  const color = cleanValue(generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0');
  return 'tft.drawRect(' + x + ', ' + y + ', ' + w + ', ' + h + ', ' + color + ');\n';
};

Arduino.forBlock['tftscr_fill_rect'] = function(block, generator) {
  const x = cleanValue(generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0');
  const y = cleanValue(generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0');
  const w = cleanValue(generator.valueToCode(block, 'W', generator.ORDER_ATOMIC) || '10');
  const h = cleanValue(generator.valueToCode(block, 'H', generator.ORDER_ATOMIC) || '10');
  const color = cleanValue(generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0');
  return 'tft.fillRect(' + x + ', ' + y + ', ' + w + ', ' + h + ', ' + color + ');\n';
};

Arduino.forBlock['tftscr_draw_circle'] = function(block, generator) {
  const x = cleanValue(generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0');
  const y = cleanValue(generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0');
  const r = cleanValue(generator.valueToCode(block, 'R', generator.ORDER_ATOMIC) || '5');
  const color = cleanValue(generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0');
  return 'tft.drawCircle(' + x + ', ' + y + ', ' + r + ', ' + color + ');\n';
};

Arduino.forBlock['tftscr_fill_circle'] = function(block, generator) {
  const x = cleanValue(generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0');
  const y = cleanValue(generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0');
  const r = cleanValue(generator.valueToCode(block, 'R', generator.ORDER_ATOMIC) || '5');
  const color = cleanValue(generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0');
  return 'tft.fillCircle(' + x + ', ' + y + ', ' + r + ', ' + color + ');\n';
};

Arduino.forBlock['tftscr_draw_string'] = function(block, generator) {
  const x = cleanValue(generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0');
  const y = cleanValue(generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0');
  const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '""';
  return 'tft.setCursor(' + x + ', ' + y + ');\ntft.print(' + text + ');\n';
};

Arduino.forBlock['tftscr_set_text_color'] = function(block, generator) {
  const color = cleanValue(generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0');
  return 'tft.setTextColor(' + color + ');\n';
};

Arduino.forBlock['tftscr_set_text_size'] = function(block, generator) {
  const size = block.getFieldValue('SIZE') || '1';
  return 'tft.setTextSize(' + size + ');\n';
};

Arduino.forBlock['tftscr_color'] = function(block, generator) {
  const color = block.getFieldValue('COLOR') || 'TFT_BLACK';
  return [color, generator.ORDER_ATOMIC];
};

Arduino.forBlock['tftscr_color_rgb'] = function(block, generator) {
  const r = cleanValue(generator.valueToCode(block, 'R', generator.ORDER_ATOMIC) || '255');
  const g = cleanValue(generator.valueToCode(block, 'G', generator.ORDER_ATOMIC) || '255');
  const b = cleanValue(generator.valueToCode(block, 'B', generator.ORDER_ATOMIC) || '255');
  return ['tft.color565(' + r + ', ' + g + ', ' + b + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['tftscr_width'] = function(block, generator) {
  return ['tft.width()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['tftscr_height'] = function(block, generator) {
  return ['tft.height()', generator.ORDER_ATOMIC];
};
