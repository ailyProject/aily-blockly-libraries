// Generator.js for EPD_CZ04 (2.13" 104x212 four-grey e-paper, CZ04)

// 取出 field_variable 上显示的变量名，与 core-variables 的处理方式保持一致
Arduino.epdCz04VarName = function (block, fieldName, fallback) {
  const field = block.getField(fieldName);
  return (field && field.getText()) || fallback;
};

Arduino.epdCz04EnsureLibrary = function (generator) {
  generator.addLibrary('EPD_CZ04', '#include <EPD_CZ04.h>');
};

// 初始化积木的 8 个数字输入：分辨率默认 104×212，引脚默认是 linkbit 黑白版的接线
var EPD_CZ04_DEFAULTS = { WIDTH: '104', HEIGHT: '212', CS: '2', DC: '3', RST: '1', BUSY: '0', SCK: '6', MOSI: '7' };
// 积木输入 → board.json displayConfig.pins 里的信号名（《功能引脚申明规范》）
var EPD_CZ04_CONFIG_PINS = { CS: 'cs', DC: 'dc', RST: 'rst', BUSY: 'busy', SCK: 'sclk', MOSI: 'mosi' };

// 板载墨水屏按开发板配置（做法同 TFT_eSPI 读 board.json 的 displayConfig）：
// displayConfig.model 是 epd_cz04（或 cz04）时返回板卡写的分辨率和引脚，不是这块屏返回 null
Arduino.epdCz04BoardPins = function () {
  var board = null;
  try {
    board = window['boardConfig'];
  } catch (e) {
    board = null;
  }
  var config = board && board.displayConfig;
  if (!config || typeof config !== 'object') return null;
  if (config.interface && String(config.interface).toLowerCase() !== 'spi') return null;
  var model = String(config.model || '').replace(/[\s_-]+/g, '').toUpperCase();
  if (model !== 'EPDCZ04' && model !== 'CZ04') return null;
  var pins = config.pins && typeof config.pins === 'object' ? config.pins : {};
  var result = {};
  Object.keys(EPD_CZ04_CONFIG_PINS).forEach(function (input) {
    var value = pins[EPD_CZ04_CONFIG_PINS[input]];
    if (value != null && /^-?\d+$/.test(String(value))) result[input] = String(value);
  });
  // 分辨率是 JSON 数字（规范要求），只收正整数
  if (/^[1-9]\d*$/.test(String(config.width))) result.WIDTH = String(config.width);
  if (/^[1-9]\d*$/.test(String(config.height))) result.HEIGHT = String(config.height);
  return result;
};

// 只改工具箱（flyout）里的积木，拖出来的积木带着板卡的分辨率和引脚；打开已保存的程序时不改用户的值
if (Blockly.Extensions.isRegistered('epd_cz04_board_display')) {
  Blockly.Extensions.unregister('epd_cz04_board_display');
}
Blockly.Extensions.register('epd_cz04_board_display', function () {
  var block = this;
  if (!block.isInFlyout) return;
  // 工具箱里的影子积木在扩展挂上之后才接上，延后一拍再填
  setTimeout(function () {
    var disposed = typeof block.isDisposed === 'function' ? block.isDisposed() : block.disposed;
    if (!block.workspace || disposed) return;
    var pins = Arduino.epdCz04BoardPins();
    if (!pins) return;
    Object.keys(pins).forEach(function (input) {
      var target = block.getInputTargetBlock(input);
      if (target && target.isShadow() && target.getField('NUM')) target.setFieldValue(pins[input], 'NUM');
    });
    if (block.rendered && typeof block.render === 'function') block.render();
  }, 0);
});

// 刷新要等 BUSY 释放，超时一般是屏幕排线没插好，打印出来方便排查
Arduino.epdCz04Refresh = function (generator, varName) {
  ensureSerialBegin('Serial', generator);
  let code = '';
  code += 'if (!' + varName + '.display()) {\n';
  code += '  Serial.println("墨水屏刷新超时，请检查屏幕排线");\n';
  code += '}\n';
  return code;
};

// 输入口没接积木时用默认值，接了表达式就原样传给 C++
Arduino.epdCz04Value = function (block, generator, name, fallback) {
  const code = generator.valueToCode(block, name, generator.ORDER_ATOMIC);
  return code === '' || code == null ? fallback : code;
};

// 中文用 U8g2_for_Adafruit_GFX 画到同一块画布上，每块屏配一个字体引擎。
// begin() 只记下画布指针，所以放在 setup 开头即可，早于用户的初始化积木。
Arduino.epdCz04EnsureU8g2 = function (generator, varName) {
  const u8 = varName + '_u8g2';
  generator.addLibrary('U8g2_for_Adafruit_GFX', '#include <U8g2_for_Adafruit_GFX.h>');
  generator.addObject('epd_cz04_u8g2_' + varName, 'U8G2_FOR_ADAFRUIT_GFX ' + u8 + ';');
  generator.addSetupBegin('epd_cz04_u8g2_begin_' + varName, u8 + '.begin(' + varName + ');\n');
  return u8;
};

// field_bitmap_u8g2 的值是 [行][列] 的 0/1 二维数组；也兼容序列化后的字符串和
// {width, height, bitmap: XBM 字节} 形式，取不到时按块上声明的尺寸给一张空白图
Arduino.epdCz04BitmapRows = function (value, width, height) {
  let data = value;
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch (e) {
      data = null;
    }
  }
  if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0])) return data;
  if (data && typeof data === 'object' && Array.isArray(data.bitmap)) {
    const w = Number(data.width) || width;
    const h = Number(data.height) || height;
    const stride = Math.ceil(w / 8);
    const rows = [];
    for (let y = 0; y < h; y++) {
      const row = [];
      for (let x = 0; x < w; x++) row.push((data.bitmap[y * stride + (x >> 3)] >> (x & 7)) & 1);
      rows.push(row);
    }
    return rows;
  }
  const blank = [];
  for (let y = 0; y < height; y++) blank.push(new Array(width).fill(0));
  return blank;
};

// 转成 Adafruit_GFX drawBitmap() 的格式：每行补齐到整字节，高位在左
Arduino.epdCz04Image = function (block, generator, width, height) {
  Arduino.epdCz04EnsureLibrary(generator);
  const rows = Arduino.epdCz04BitmapRows(block.getFieldValue('CUSTOM_BITMAP'), width, height);
  const h = rows.length;
  const w = h > 0 ? rows[0].length : 0;
  const stride = Math.ceil(w / 8);
  const lines = [];
  for (let y = 0; y < h; y++) {
    const bytes = [];
    for (let bx = 0; bx < stride; bx++) {
      let value = 0;
      for (let bit = 0; bit < 8; bit++) {
        const x = bx * 8 + bit;
        if (x < w && rows[y][x] === 1) value |= 0x80 >> bit;
      }
      bytes.push('0x' + value.toString(16).toUpperCase().padStart(2, '0'));
    }
    lines.push('  ' + bytes.join(', '));
  }
  const name = 'epd_cz04_image_' + String(block.id || 'image').replace(/[^A-Za-z0-9]/g, '');
  let code = '';
  code += '// ' + w + 'x' + h + ' image\n';
  code += 'static const uint8_t ' + name + '_data[] PROGMEM = {\n' + lines.join(',\n') + '\n};\n';
  code += 'static const EPD_CZ04_Bitmap ' + name + ' = { ' + name + '_data, ' + w + ', ' + h + ' };';
  generator.addVariable(name, code);
  return [name, generator.ORDER_ATOMIC];
};

Arduino.forBlock['epd_cz04_init'] = function (block, generator) {
  // 变量改名监听
  if (!block._epdCz04VarMonitorAttached) {
    block._epdCz04VarMonitorAttached = true;
    block._epdCz04VarLastName = block.getFieldValue('VAR') || 'epd';
    registerVariableToBlockly(block._epdCz04VarLastName, 'EPD_CZ04');
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function (newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._epdCz04VarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'EPD_CZ04');
          block._epdCz04VarLastName = newName;
        }
      };
    }
  }

  const varName = block.getFieldValue('VAR') || 'epd';
  Arduino.epdCz04EnsureLibrary(generator);
  // 引脚和分辨率来自积木输入（工具箱里按开发板 displayConfig 预填），没接积木时用默认值；
  // 顺序同 C++ 构造函数：cs, dc, rst, busy, sck, mosi, width, height
  var args = ['CS', 'DC', 'RST', 'BUSY', 'SCK', 'MOSI', 'WIDTH', 'HEIGHT'].map(function (name) {
    return Arduino.epdCz04Value(block, generator, name, EPD_CZ04_DEFAULTS[name]);
  });
  generator.addObject('epd_cz04_' + varName, 'EPD_CZ04 ' + varName + '(' + args.join(', ') + ');');
  return varName + '.begin();\n';
};

Arduino.forBlock['epd_cz04_set_rotation'] = function (block, generator) {
  const varName = Arduino.epdCz04VarName(block, 'VAR', 'epd');
  const rotation = block.getFieldValue('ROTATION') || '0';
  Arduino.epdCz04EnsureLibrary(generator);
  return varName + '.setRotation(' + rotation + ');\n';
};

Arduino.forBlock['epd_cz04_clear_ghosting'] = function (block, generator) {
  const varName = Arduino.epdCz04VarName(block, 'VAR', 'epd');
  const rounds = Arduino.epdCz04Value(block, generator, 'ROUNDS', '1');
  Arduino.epdCz04EnsureLibrary(generator);
  return varName + '.clearGhosting(' + rounds + ');\n';
};

Arduino.forBlock['epd_cz04_frame'] = function (block, generator) {
  const varName = Arduino.epdCz04VarName(block, 'VAR', 'epd');
  const bg = block.getFieldValue('BG') || 'WHITE';
  Arduino.epdCz04EnsureLibrary(generator);
  // 语句输入会多缩进一层，这里的绘制与前后语句同级，去掉那一层
  const indent = generator.INDENT || '  ';
  const draw = (generator.statementToCode(block, 'DRAW') || '')
    .split('\n')
    .map(line => (line.startsWith(indent) ? line.slice(indent.length) : line))
    .join('\n');
  let code = '';
  if (bg !== 'KEEP') code += varName + '.fillScreen(EPD_CZ04_WHITE);\n';
  code += draw;
  code += Arduino.epdCz04Refresh(generator, varName);
  return code;
};

Arduino.forBlock['epd_cz04_display'] = function (block, generator) {
  const varName = Arduino.epdCz04VarName(block, 'VAR', 'epd');
  Arduino.epdCz04EnsureLibrary(generator);
  return Arduino.epdCz04Refresh(generator, varName);
};

Arduino.forBlock['epd_cz04_clear'] = function (block, generator) {
  const varName = Arduino.epdCz04VarName(block, 'VAR', 'epd');
  const color = Arduino.epdCz04Value(block, generator, 'COLOR', 'EPD_CZ04_WHITE');
  Arduino.epdCz04EnsureLibrary(generator);
  return varName + '.clear(' + color + ');\n';
};

Arduino.forBlock['epd_cz04_fill_screen'] = function (block, generator) {
  const varName = Arduino.epdCz04VarName(block, 'VAR', 'epd');
  const color = Arduino.epdCz04Value(block, generator, 'COLOR', 'EPD_CZ04_WHITE');
  Arduino.epdCz04EnsureLibrary(generator);
  return varName + '.fillScreen(' + color + ');\n';
};

Arduino.forBlock['epd_cz04_draw_pixel'] = function (block, generator) {
  const varName = Arduino.epdCz04VarName(block, 'VAR', 'epd');
  const x = Arduino.epdCz04Value(block, generator, 'X', '0');
  const y = Arduino.epdCz04Value(block, generator, 'Y', '0');
  const color = Arduino.epdCz04Value(block, generator, 'COLOR', 'EPD_CZ04_BLACK');
  Arduino.epdCz04EnsureLibrary(generator);
  return varName + '.drawPixel(' + x + ', ' + y + ', ' + color + ');\n';
};

Arduino.forBlock['epd_cz04_draw_line'] = function (block, generator) {
  const varName = Arduino.epdCz04VarName(block, 'VAR', 'epd');
  const x1 = Arduino.epdCz04Value(block, generator, 'X1', '0');
  const y1 = Arduino.epdCz04Value(block, generator, 'Y1', '0');
  const x2 = Arduino.epdCz04Value(block, generator, 'X2', '0');
  const y2 = Arduino.epdCz04Value(block, generator, 'Y2', '0');
  const color = Arduino.epdCz04Value(block, generator, 'COLOR', 'EPD_CZ04_BLACK');
  Arduino.epdCz04EnsureLibrary(generator);
  return varName + '.drawLine(' + x1 + ', ' + y1 + ', ' + x2 + ', ' + y2 + ', ' + color + ');\n';
};

Arduino.forBlock['epd_cz04_draw_rect'] = function (block, generator) {
  const varName = Arduino.epdCz04VarName(block, 'VAR', 'epd');
  const x = Arduino.epdCz04Value(block, generator, 'X', '0');
  const y = Arduino.epdCz04Value(block, generator, 'Y', '0');
  const w = Arduino.epdCz04Value(block, generator, 'W', '10');
  const h = Arduino.epdCz04Value(block, generator, 'H', '10');
  const color = Arduino.epdCz04Value(block, generator, 'COLOR', 'EPD_CZ04_BLACK');
  const method = block.getFieldValue('FILL') === 'FILLED' ? 'fillRect' : 'drawRect';
  Arduino.epdCz04EnsureLibrary(generator);
  return varName + '.' + method + '(' + x + ', ' + y + ', ' + w + ', ' + h + ', ' + color + ');\n';
};

Arduino.forBlock['epd_cz04_draw_circle'] = function (block, generator) {
  const varName = Arduino.epdCz04VarName(block, 'VAR', 'epd');
  const x = Arduino.epdCz04Value(block, generator, 'X', '0');
  const y = Arduino.epdCz04Value(block, generator, 'Y', '0');
  const radius = Arduino.epdCz04Value(block, generator, 'RADIUS', '10');
  const color = Arduino.epdCz04Value(block, generator, 'COLOR', 'EPD_CZ04_BLACK');
  const method = block.getFieldValue('FILL') === 'FILLED' ? 'fillCircle' : 'drawCircle';
  Arduino.epdCz04EnsureLibrary(generator);
  return varName + '.' + method + '(' + x + ', ' + y + ', ' + radius + ', ' + color + ');\n';
};

Arduino.forBlock['epd_cz04_set_text_color'] = function (block, generator) {
  const varName = Arduino.epdCz04VarName(block, 'VAR', 'epd');
  const color = Arduino.epdCz04Value(block, generator, 'COLOR', 'EPD_CZ04_BLACK');
  Arduino.epdCz04EnsureLibrary(generator);
  return varName + '.setTextColor(' + color + ');\n';
};

Arduino.forBlock['epd_cz04_set_text_size'] = function (block, generator) {
  const varName = Arduino.epdCz04VarName(block, 'VAR', 'epd');
  const size = block.getFieldValue('SIZE') || '1';
  Arduino.epdCz04EnsureLibrary(generator);
  return varName + '.setTextSize(' + size + ');\n';
};

Arduino.forBlock['epd_cz04_set_font'] = function (block, generator) {
  const varName = Arduino.epdCz04VarName(block, 'VAR', 'epd');
  const font = block.getFieldValue('FONT') || 'NULL';
  Arduino.epdCz04EnsureLibrary(generator);
  if (font === 'NULL') return varName + '.setFont();\n';
  generator.addLibrary('epd_cz04_font_' + font, '#include <Fonts/' + font + '.h>');
  return varName + '.setFont(&' + font + ');\n';
};

Arduino.forBlock['epd_cz04_set_cursor'] = function (block, generator) {
  const varName = Arduino.epdCz04VarName(block, 'VAR', 'epd');
  const x = Arduino.epdCz04Value(block, generator, 'X', '0');
  const y = Arduino.epdCz04Value(block, generator, 'Y', '0');
  Arduino.epdCz04EnsureLibrary(generator);
  return varName + '.setCursor(' + x + ', ' + y + ');\n';
};

Arduino.forBlock['epd_cz04_print'] = function (block, generator) {
  const varName = Arduino.epdCz04VarName(block, 'VAR', 'epd');
  const text = Arduino.epdCz04Value(block, generator, 'TEXT', '""');
  const mode = block.getFieldValue('MODE') === 'println' ? 'println' : 'print';
  Arduino.epdCz04EnsureLibrary(generator);
  return varName + '.' + mode + '(' + text + ');\n';
};

Arduino.forBlock['epd_cz04_cn_text'] = function (block, generator) {
  const varName = Arduino.epdCz04VarName(block, 'VAR', 'epd');
  const x = Arduino.epdCz04Value(block, generator, 'X', '0');
  const y = Arduino.epdCz04Value(block, generator, 'Y', '16');
  const text = Arduino.epdCz04Value(block, generator, 'TEXT', '""');
  const font = block.getFieldValue('FONT') || 'u8g2_font_wqy12_t_gb2312a';
  const color = Arduino.epdCz04Value(block, generator, 'COLOR', 'EPD_CZ04_BLACK');
  Arduino.epdCz04EnsureLibrary(generator);
  const u8 = Arduino.epdCz04EnsureU8g2(generator, varName);
  let code = '';
  code += u8 + '.setFont(' + font + ');\n';
  // 换字体时 U8g2 会把背景模式改回不透明，每次都重新设成透明
  code += u8 + '.setFontMode(1);\n';
  code += u8 + '.setForegroundColor(' + color + ');\n';
  code += u8 + '.setCursor(' + x + ', ' + y + ');\n';
  code += u8 + '.print(' + text + ');\n';
  return code;
};

Arduino.forBlock['epd_cz04_draw_weather'] = function (block, generator) {
  const varName = Arduino.epdCz04VarName(block, 'VAR', 'epd');
  const x = Arduino.epdCz04Value(block, generator, 'X', '0');
  const y = Arduino.epdCz04Value(block, generator, 'Y', '0');
  const icon = block.getFieldValue('ICON') || 'EPD_CZ04_WEATHER_SUNNY';
  const color = Arduino.epdCz04Value(block, generator, 'COLOR', 'EPD_CZ04_BLACK');
  Arduino.epdCz04EnsureLibrary(generator);
  return varName + '.drawWeatherIcon(' + x + ', ' + y + ', ' + icon + ', ' + color + ');\n';
};

Arduino.forBlock['epd_cz04_draw_image'] = function (block, generator) {
  const varName = Arduino.epdCz04VarName(block, 'VAR', 'epd');
  const x = Arduino.epdCz04Value(block, generator, 'X', '0');
  const y = Arduino.epdCz04Value(block, generator, 'Y', '0');
  const image = Arduino.epdCz04Value(block, generator, 'IMAGE', '');
  const color = Arduino.epdCz04Value(block, generator, 'COLOR', 'EPD_CZ04_BLACK');
  Arduino.epdCz04EnsureLibrary(generator);
  if (!image) return '';
  return varName + '.drawImage(' + x + ', ' + y + ', ' + image + ', ' + color + ');\n';
};

Arduino.forBlock['epd_cz04_image_portrait'] = function (block, generator) {
  return Arduino.epdCz04Image(block, generator, 104, 212);
};

Arduino.forBlock['epd_cz04_image_landscape'] = function (block, generator) {
  return Arduino.epdCz04Image(block, generator, 212, 104);
};

Arduino.forBlock['epd_cz04_image_icon'] = function (block, generator) {
  return Arduino.epdCz04Image(block, generator, 32, 32);
};

Arduino.forBlock['epd_cz04_width'] = function (block, generator) {
  const varName = Arduino.epdCz04VarName(block, 'VAR', 'epd');
  Arduino.epdCz04EnsureLibrary(generator);
  return [varName + '.width()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['epd_cz04_height'] = function (block, generator) {
  const varName = Arduino.epdCz04VarName(block, 'VAR', 'epd');
  Arduino.epdCz04EnsureLibrary(generator);
  return [varName + '.height()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['epd_cz04_color'] = function (block, generator) {
  const color = block.getFieldValue('COLOR') || 'EPD_CZ04_BLACK';
  Arduino.epdCz04EnsureLibrary(generator);
  return [color, generator.ORDER_ATOMIC];
};
