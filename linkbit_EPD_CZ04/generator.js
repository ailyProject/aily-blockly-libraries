// Generator.js for linkbit_EPD_CZ04 (linkbit 2.13" 104x212 four-grey e-paper)

// 取出 field_variable 上显示的变量名，与 core-variables 的处理方式保持一致
Arduino.linkbitEpdVarName = function (block, fieldName, fallback) {
  const field = block.getField(fieldName);
  return (field && field.getText()) || fallback;
};

Arduino.linkbitEpdEnsureLibrary = function (generator) {
  generator.addLibrary('LinkbitEPD', '#include <LinkbitEPD.h>');
};

// 引脚按 linkbit 板载接线写死，换了别的 ESP32-C3 板时在代码里留个提醒
Arduino.linkbitEpdBoardNote = function () {
  try {
    const boardConfig = window['boardConfig'];
    const name = boardConfig && boardConfig.name ? String(boardConfig.name) : '';
    if (name && name.toLowerCase().indexOf('linkbit') === -1) {
      return '// 注意：当前开发板是 ' + name + '，本库按 linkbit 板载墨水屏接线（CS=2 DC=3 RST=1 BUSY=0 SCK=6 MOSI=7）\n';
    }
  } catch (e) {}
  return '';
};

// 刷新要等 BUSY 释放，超时一般是屏幕排线没插好，打印出来方便排查
Arduino.linkbitEpdRefresh = function (generator, varName) {
  ensureSerialBegin('Serial', generator);
  let code = '';
  code += 'if (!' + varName + '.display()) {\n';
  code += '  Serial.println("墨水屏刷新超时，请检查屏幕排线");\n';
  code += '}\n';
  return code;
};

// 输入口没接积木时用默认值，接了表达式就原样传给 C++
Arduino.linkbitEpdValue = function (block, generator, name, fallback) {
  const code = generator.valueToCode(block, name, generator.ORDER_ATOMIC);
  return code === '' || code == null ? fallback : code;
};

// 中文用 U8g2_for_Adafruit_GFX 画到同一块画布上，每块屏配一个字体引擎。
// begin() 只记下画布指针，所以放在 setup 开头即可，早于用户的初始化积木。
Arduino.linkbitEpdEnsureU8g2 = function (generator, varName) {
  const u8 = varName + '_u8g2';
  generator.addLibrary('U8g2_for_Adafruit_GFX', '#include <U8g2_for_Adafruit_GFX.h>');
  generator.addObject('linkbit_epd_u8g2_' + varName, 'U8G2_FOR_ADAFRUIT_GFX ' + u8 + ';');
  generator.addSetupBegin('linkbit_epd_u8g2_begin_' + varName, u8 + '.begin(' + varName + ');\n');
  return u8;
};

// field_bitmap_u8g2 的值是 [行][列] 的 0/1 二维数组；也兼容序列化后的字符串和
// {width, height, bitmap: XBM 字节} 形式，取不到时按块上声明的尺寸给一张空白图
Arduino.linkbitEpdBitmapRows = function (value, width, height) {
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
Arduino.linkbitEpdImage = function (block, generator, width, height) {
  Arduino.linkbitEpdEnsureLibrary(generator);
  const rows = Arduino.linkbitEpdBitmapRows(block.getFieldValue('CUSTOM_BITMAP'), width, height);
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
  const name = 'linkbit_epd_image_' + String(block.id || 'image').replace(/[^A-Za-z0-9]/g, '');
  let code = '';
  code += '// ' + w + 'x' + h + ' image\n';
  code += 'static const uint8_t ' + name + '_data[] PROGMEM = {\n' + lines.join(',\n') + '\n};\n';
  code += 'static const LinkbitEPDBitmap ' + name + ' = { ' + name + '_data, ' + w + ', ' + h + ' };';
  generator.addVariable(name, code);
  return [name, generator.ORDER_ATOMIC];
};

Arduino.forBlock['linkbit_epd_init'] = function (block, generator) {
  // 变量改名监听
  if (!block._linkbitEpdVarMonitorAttached) {
    block._linkbitEpdVarMonitorAttached = true;
    block._linkbitEpdVarLastName = block.getFieldValue('VAR') || 'epd';
    registerVariableToBlockly(block._linkbitEpdVarLastName, 'LinkbitEPD');
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function (newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._linkbitEpdVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'LinkbitEPD');
          block._linkbitEpdVarLastName = newName;
        }
      };
    }
  }

  const varName = block.getFieldValue('VAR') || 'epd';
  Arduino.linkbitEpdEnsureLibrary(generator);
  // 引脚在 linkbit 板上是固定的，构造函数默认值就是板载接线
  generator.addObject('linkbit_epd_' + varName, 'LinkbitEPD ' + varName + ';');
  return Arduino.linkbitEpdBoardNote() + varName + '.begin();\n';
};

Arduino.forBlock['linkbit_epd_set_rotation'] = function (block, generator) {
  const varName = Arduino.linkbitEpdVarName(block, 'VAR', 'epd');
  const rotation = block.getFieldValue('ROTATION') || '0';
  Arduino.linkbitEpdEnsureLibrary(generator);
  return varName + '.setRotation(' + rotation + ');\n';
};

Arduino.forBlock['linkbit_epd_clear_ghosting'] = function (block, generator) {
  const varName = Arduino.linkbitEpdVarName(block, 'VAR', 'epd');
  const rounds = Arduino.linkbitEpdValue(block, generator, 'ROUNDS', '1');
  Arduino.linkbitEpdEnsureLibrary(generator);
  return varName + '.clearGhosting(' + rounds + ');\n';
};

Arduino.forBlock['linkbit_epd_frame'] = function (block, generator) {
  const varName = Arduino.linkbitEpdVarName(block, 'VAR', 'epd');
  const bg = block.getFieldValue('BG') || 'WHITE';
  Arduino.linkbitEpdEnsureLibrary(generator);
  // 语句输入会多缩进一层，这里的绘制与前后语句同级，去掉那一层
  const indent = generator.INDENT || '  ';
  const draw = (generator.statementToCode(block, 'DRAW') || '')
    .split('\n')
    .map(line => (line.startsWith(indent) ? line.slice(indent.length) : line))
    .join('\n');
  let code = '';
  if (bg !== 'KEEP') code += varName + '.fillScreen(LINKBIT_EPD_WHITE);\n';
  code += draw;
  code += Arduino.linkbitEpdRefresh(generator, varName);
  return code;
};

Arduino.forBlock['linkbit_epd_display'] = function (block, generator) {
  const varName = Arduino.linkbitEpdVarName(block, 'VAR', 'epd');
  Arduino.linkbitEpdEnsureLibrary(generator);
  return Arduino.linkbitEpdRefresh(generator, varName);
};

Arduino.forBlock['linkbit_epd_clear'] = function (block, generator) {
  const varName = Arduino.linkbitEpdVarName(block, 'VAR', 'epd');
  const color = Arduino.linkbitEpdValue(block, generator, 'COLOR', 'LINKBIT_EPD_WHITE');
  Arduino.linkbitEpdEnsureLibrary(generator);
  return varName + '.clear(' + color + ');\n';
};

Arduino.forBlock['linkbit_epd_fill_screen'] = function (block, generator) {
  const varName = Arduino.linkbitEpdVarName(block, 'VAR', 'epd');
  const color = Arduino.linkbitEpdValue(block, generator, 'COLOR', 'LINKBIT_EPD_WHITE');
  Arduino.linkbitEpdEnsureLibrary(generator);
  return varName + '.fillScreen(' + color + ');\n';
};

Arduino.forBlock['linkbit_epd_draw_pixel'] = function (block, generator) {
  const varName = Arduino.linkbitEpdVarName(block, 'VAR', 'epd');
  const x = Arduino.linkbitEpdValue(block, generator, 'X', '0');
  const y = Arduino.linkbitEpdValue(block, generator, 'Y', '0');
  const color = Arduino.linkbitEpdValue(block, generator, 'COLOR', 'LINKBIT_EPD_BLACK');
  Arduino.linkbitEpdEnsureLibrary(generator);
  return varName + '.drawPixel(' + x + ', ' + y + ', ' + color + ');\n';
};

Arduino.forBlock['linkbit_epd_draw_line'] = function (block, generator) {
  const varName = Arduino.linkbitEpdVarName(block, 'VAR', 'epd');
  const x1 = Arduino.linkbitEpdValue(block, generator, 'X1', '0');
  const y1 = Arduino.linkbitEpdValue(block, generator, 'Y1', '0');
  const x2 = Arduino.linkbitEpdValue(block, generator, 'X2', '0');
  const y2 = Arduino.linkbitEpdValue(block, generator, 'Y2', '0');
  const color = Arduino.linkbitEpdValue(block, generator, 'COLOR', 'LINKBIT_EPD_BLACK');
  Arduino.linkbitEpdEnsureLibrary(generator);
  return varName + '.drawLine(' + x1 + ', ' + y1 + ', ' + x2 + ', ' + y2 + ', ' + color + ');\n';
};

Arduino.forBlock['linkbit_epd_draw_rect'] = function (block, generator) {
  const varName = Arduino.linkbitEpdVarName(block, 'VAR', 'epd');
  const x = Arduino.linkbitEpdValue(block, generator, 'X', '0');
  const y = Arduino.linkbitEpdValue(block, generator, 'Y', '0');
  const w = Arduino.linkbitEpdValue(block, generator, 'W', '10');
  const h = Arduino.linkbitEpdValue(block, generator, 'H', '10');
  const color = Arduino.linkbitEpdValue(block, generator, 'COLOR', 'LINKBIT_EPD_BLACK');
  const method = block.getFieldValue('FILL') === 'FILLED' ? 'fillRect' : 'drawRect';
  Arduino.linkbitEpdEnsureLibrary(generator);
  return varName + '.' + method + '(' + x + ', ' + y + ', ' + w + ', ' + h + ', ' + color + ');\n';
};

Arduino.forBlock['linkbit_epd_draw_circle'] = function (block, generator) {
  const varName = Arduino.linkbitEpdVarName(block, 'VAR', 'epd');
  const x = Arduino.linkbitEpdValue(block, generator, 'X', '0');
  const y = Arduino.linkbitEpdValue(block, generator, 'Y', '0');
  const radius = Arduino.linkbitEpdValue(block, generator, 'RADIUS', '10');
  const color = Arduino.linkbitEpdValue(block, generator, 'COLOR', 'LINKBIT_EPD_BLACK');
  const method = block.getFieldValue('FILL') === 'FILLED' ? 'fillCircle' : 'drawCircle';
  Arduino.linkbitEpdEnsureLibrary(generator);
  return varName + '.' + method + '(' + x + ', ' + y + ', ' + radius + ', ' + color + ');\n';
};

Arduino.forBlock['linkbit_epd_set_text_color'] = function (block, generator) {
  const varName = Arduino.linkbitEpdVarName(block, 'VAR', 'epd');
  const color = Arduino.linkbitEpdValue(block, generator, 'COLOR', 'LINKBIT_EPD_BLACK');
  Arduino.linkbitEpdEnsureLibrary(generator);
  return varName + '.setTextColor(' + color + ');\n';
};

Arduino.forBlock['linkbit_epd_set_text_size'] = function (block, generator) {
  const varName = Arduino.linkbitEpdVarName(block, 'VAR', 'epd');
  const size = block.getFieldValue('SIZE') || '1';
  Arduino.linkbitEpdEnsureLibrary(generator);
  return varName + '.setTextSize(' + size + ');\n';
};

Arduino.forBlock['linkbit_epd_set_font'] = function (block, generator) {
  const varName = Arduino.linkbitEpdVarName(block, 'VAR', 'epd');
  const font = block.getFieldValue('FONT') || 'NULL';
  Arduino.linkbitEpdEnsureLibrary(generator);
  if (font === 'NULL') return varName + '.setFont();\n';
  generator.addLibrary('linkbit_epd_font_' + font, '#include <Fonts/' + font + '.h>');
  return varName + '.setFont(&' + font + ');\n';
};

Arduino.forBlock['linkbit_epd_set_cursor'] = function (block, generator) {
  const varName = Arduino.linkbitEpdVarName(block, 'VAR', 'epd');
  const x = Arduino.linkbitEpdValue(block, generator, 'X', '0');
  const y = Arduino.linkbitEpdValue(block, generator, 'Y', '0');
  Arduino.linkbitEpdEnsureLibrary(generator);
  return varName + '.setCursor(' + x + ', ' + y + ');\n';
};

Arduino.forBlock['linkbit_epd_print'] = function (block, generator) {
  const varName = Arduino.linkbitEpdVarName(block, 'VAR', 'epd');
  const text = Arduino.linkbitEpdValue(block, generator, 'TEXT', '""');
  const mode = block.getFieldValue('MODE') === 'println' ? 'println' : 'print';
  Arduino.linkbitEpdEnsureLibrary(generator);
  return varName + '.' + mode + '(' + text + ');\n';
};

Arduino.forBlock['linkbit_epd_cn_text'] = function (block, generator) {
  const varName = Arduino.linkbitEpdVarName(block, 'VAR', 'epd');
  const x = Arduino.linkbitEpdValue(block, generator, 'X', '0');
  const y = Arduino.linkbitEpdValue(block, generator, 'Y', '16');
  const text = Arduino.linkbitEpdValue(block, generator, 'TEXT', '""');
  const font = block.getFieldValue('FONT') || 'u8g2_font_wqy12_t_gb2312a';
  const color = Arduino.linkbitEpdValue(block, generator, 'COLOR', 'LINKBIT_EPD_BLACK');
  Arduino.linkbitEpdEnsureLibrary(generator);
  const u8 = Arduino.linkbitEpdEnsureU8g2(generator, varName);
  let code = '';
  code += u8 + '.setFont(' + font + ');\n';
  // 换字体时 U8g2 会把背景模式改回不透明，每次都重新设成透明
  code += u8 + '.setFontMode(1);\n';
  code += u8 + '.setForegroundColor(' + color + ');\n';
  code += u8 + '.setCursor(' + x + ', ' + y + ');\n';
  code += u8 + '.print(' + text + ');\n';
  return code;
};

Arduino.forBlock['linkbit_epd_draw_weather'] = function (block, generator) {
  const varName = Arduino.linkbitEpdVarName(block, 'VAR', 'epd');
  const x = Arduino.linkbitEpdValue(block, generator, 'X', '0');
  const y = Arduino.linkbitEpdValue(block, generator, 'Y', '0');
  const icon = block.getFieldValue('ICON') || 'LINKBIT_EPD_WEATHER_SUNNY';
  const color = Arduino.linkbitEpdValue(block, generator, 'COLOR', 'LINKBIT_EPD_BLACK');
  Arduino.linkbitEpdEnsureLibrary(generator);
  return varName + '.drawWeatherIcon(' + x + ', ' + y + ', ' + icon + ', ' + color + ');\n';
};

Arduino.forBlock['linkbit_epd_draw_image'] = function (block, generator) {
  const varName = Arduino.linkbitEpdVarName(block, 'VAR', 'epd');
  const x = Arduino.linkbitEpdValue(block, generator, 'X', '0');
  const y = Arduino.linkbitEpdValue(block, generator, 'Y', '0');
  const image = Arduino.linkbitEpdValue(block, generator, 'IMAGE', '');
  const color = Arduino.linkbitEpdValue(block, generator, 'COLOR', 'LINKBIT_EPD_BLACK');
  Arduino.linkbitEpdEnsureLibrary(generator);
  if (!image) return '';
  return varName + '.drawImage(' + x + ', ' + y + ', ' + image + ', ' + color + ');\n';
};

Arduino.forBlock['linkbit_epd_image_portrait'] = function (block, generator) {
  return Arduino.linkbitEpdImage(block, generator, 104, 212);
};

Arduino.forBlock['linkbit_epd_image_landscape'] = function (block, generator) {
  return Arduino.linkbitEpdImage(block, generator, 212, 104);
};

Arduino.forBlock['linkbit_epd_image_icon'] = function (block, generator) {
  return Arduino.linkbitEpdImage(block, generator, 32, 32);
};

Arduino.forBlock['linkbit_epd_width'] = function (block, generator) {
  const varName = Arduino.linkbitEpdVarName(block, 'VAR', 'epd');
  Arduino.linkbitEpdEnsureLibrary(generator);
  return [varName + '.width()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['linkbit_epd_height'] = function (block, generator) {
  const varName = Arduino.linkbitEpdVarName(block, 'VAR', 'epd');
  Arduino.linkbitEpdEnsureLibrary(generator);
  return [varName + '.height()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['linkbit_epd_color'] = function (block, generator) {
  const color = block.getFieldValue('COLOR') || 'LINKBIT_EPD_BLACK';
  Arduino.linkbitEpdEnsureLibrary(generator);
  return [color, generator.ORDER_ATOMIC];
};
