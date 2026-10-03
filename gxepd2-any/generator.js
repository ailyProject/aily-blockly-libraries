var GXEPD2_VAR_TYPE = 'GxEPD2';

var GXEPD2_PANEL_OPTIONS = {
  BW_GDEH0154D67: { displayClass: 'GxEPD2_BW', driver: 'GxEPD2_154_D67', heightMacro: 'GXEPD2_MAX_HEIGHT_BW' },
  BW_GDEY0213B74: { displayClass: 'GxEPD2_BW', driver: 'GxEPD2_213_GDEY0213B74', heightMacro: 'GXEPD2_MAX_HEIGHT_BW' },
  BW_DEPG0266BN: { displayClass: 'GxEPD2_BW', driver: 'GxEPD2_266_BN', heightMacro: 'GXEPD2_MAX_HEIGHT_BW' },
  BW_GDEM029T94: { displayClass: 'GxEPD2_BW', driver: 'GxEPD2_290_T94', heightMacro: 'GXEPD2_MAX_HEIGHT_BW' },
  BW_GDEW042T2: { displayClass: 'GxEPD2_BW', driver: 'GxEPD2_420', heightMacro: 'GXEPD2_MAX_HEIGHT_BW' },
  BW_GDEW075T7: { displayClass: 'GxEPD2_BW', driver: 'GxEPD2_750_T7', heightMacro: 'GXEPD2_MAX_HEIGHT_BW' },
  C3_GDEH0154Z90: { displayClass: 'GxEPD2_3C', driver: 'GxEPD2_154_Z90c', heightMacro: 'GXEPD2_MAX_HEIGHT_COLOR' },
  C3_GDEY0213Z98: { displayClass: 'GxEPD2_3C', driver: 'GxEPD2_213_Z98c', heightMacro: 'GXEPD2_MAX_HEIGHT_COLOR' },
  C3_GDEM029C90: { displayClass: 'GxEPD2_3C', driver: 'GxEPD2_290_C90c', heightMacro: 'GXEPD2_MAX_HEIGHT_COLOR' },
  C3_GDEW042Z15: { displayClass: 'GxEPD2_3C', driver: 'GxEPD2_420c', heightMacro: 'GXEPD2_MAX_HEIGHT_COLOR' },
  C3_GDEW0583Z83: { displayClass: 'GxEPD2_3C', driver: 'GxEPD2_583c_Z83', heightMacro: 'GXEPD2_MAX_HEIGHT_COLOR' },
  C3_GDEW075Z08: { displayClass: 'GxEPD2_3C', driver: 'GxEPD2_750c_Z08', heightMacro: 'GXEPD2_MAX_HEIGHT_COLOR' },
  C4_WS300: { displayClass: 'GxEPD2_4C', driver: 'GxEPD2_300c', heightMacro: 'GXEPD2_MAX_HEIGHT_COLOR' },
  C7_WS565: { displayClass: 'GxEPD2_7C', driver: 'GxEPD2_565c', heightMacro: 'GXEPD2_MAX_HEIGHT_7C' }
};

function gxepd2SanitizeIdentifier(value, fallback) {
  var name = String(value || fallback || 'display').trim();
  name = name.replace(/[^A-Za-z0-9_]/g, '_');
  if (!/^[A-Za-z_]/.test(name)) {
    name = '_' + name;
  }
  return name || fallback || 'display';
}

function gxepd2CleanValue(value, fallback) {
  var code = value == null || value === '' ? fallback : String(value);
  return code.replace(/^\((.*)\)$/, '$1');
}

function gxepd2Bool(value) {
  return value === 'TRUE' || value === true ? 'true' : 'false';
}

function gxepd2GetVarName(block, fallback) {
  var varField = block.getField('VAR');
  if (varField && typeof varField.getText === 'function') {
    return gxepd2SanitizeIdentifier(varField.getText(), fallback);
  }
  return gxepd2SanitizeIdentifier(block.getFieldValue('VAR'), fallback);
}

function gxepd2ValueToCode(block, generator, name, fallback) {
  return gxepd2CleanValue(generator.valueToCode(block, name, generator.ORDER_ATOMIC), fallback);
}

function gxepd2AddMacro(generator, key, code) {
  // 注意：aily-builder 的 addMacro 会转成命令行 -D，无法正确定义带参数(EPD)或多行 #if 的宏，
  // 会导致 GXEPD2_MAX_HEIGHT_COLOR(EPD) 展开失败。这里改用 addVariable 把宏作为源码 #define 写入。
  if (generator && typeof generator.addVariable === 'function') {
    generator.addVariable(key, code);
  } else if (generator && typeof generator.addMacro === 'function') {
    generator.addMacro(key, code);
  }
}

function gxepd2GetBoardCore() {
  var boardConfig = typeof window !== 'undefined' && window['boardConfig'] ? window['boardConfig'] : null;
  return boardConfig && boardConfig.core ? String(boardConfig.core).toLowerCase() : '';
}

function gxepd2GetFallbackBufferSize() {
  var boardCore = gxepd2GetBoardCore();
  if (boardCore.indexOf('esp32') > -1) {
    return '65536ul';
  }
  if (boardCore.indexOf('esp8266') > -1) {
    return '(81920ul - 34000ul - 5000ul)';
  }
  if (boardCore.indexOf('rp2040') > -1) {
    return '131072ul';
  }
  if (boardCore.indexOf('avr') > -1) {
    return '800';
  }
  return '15000ul';
}

function gxepd2AddCore(generator) {
  var fallbackBufferSize = gxepd2GetFallbackBufferSize();

  generator.addLibrary('Adafruit_GFX', '#include <Adafruit_GFX.h>');
  generator.addLibrary('GxEPD2', '#include <GxEPD2.h>');
  generator.addLibrary('GxEPD2_BW', '#include <GxEPD2_BW.h>');
  generator.addLibrary('GxEPD2_3C', '#include <GxEPD2_3C.h>');
  generator.addLibrary('GxEPD2_4C', '#include <GxEPD2_4C.h>');
  generator.addLibrary('GxEPD2_7C', '#include <GxEPD2_7C.h>');
  generator.addLibrary('GxEPD2_FreeMono9', '#include <Fonts/FreeMono9pt7b.h>');
  generator.addLibrary('GxEPD2_FreeMonoBold9', '#include <Fonts/FreeMonoBold9pt7b.h>');
  generator.addLibrary('GxEPD2_FreeSans9', '#include <Fonts/FreeSans9pt7b.h>');
  generator.addLibrary('GxEPD2_FreeSansBold12', '#include <Fonts/FreeSansBold12pt7b.h>');
  generator.addLibrary('GxEPD2_FreeSerif9', '#include <Fonts/FreeSerif9pt7b.h>');

// NOTE: The build system extracts #define as -D compiler flags,
// which breaks parameterized macros like GXEPD2_MAX_HEIGHT_COLOR(EPD).
// Instead, we use EPD::HEIGHT directly in declarations.
// On ESP32 (65536 buffer), HEIGHT always fits, so the macro is unnecessary.
}

function gxepd2AttachVarMonitor(block) {
  if (block._gxepd2VarMonitorAttached) {
    return;
  }

  block._gxepd2VarMonitorAttached = true;
  block._gxepd2VarLastName = gxepd2SanitizeIdentifier(block.getFieldValue('VAR'), 'display');
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._gxepd2VarLastName, GXEPD2_VAR_TYPE);
  }

  var varField = block.getField('VAR');
  if (!varField) {
    return;
  }

  var originalFinishEditing = varField.onFinishEditing_;
  varField.onFinishEditing_ = function(newName) {
    if (typeof originalFinishEditing === 'function') {
      originalFinishEditing.call(this, newName);
    }
    var workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
    var oldName = block._gxepd2VarLastName;
    var cleanName = gxepd2SanitizeIdentifier(newName, oldName);
    if (workspace && cleanName && cleanName !== oldName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, oldName, cleanName, GXEPD2_VAR_TYPE);
      block._gxepd2VarLastName = cleanName;
    }
  };
}

Arduino.forBlock['gxepd2_setup'] = function(block, generator) {
  gxepd2AttachVarMonitor(block);
  gxepd2AddCore(generator);

  var varName = gxepd2SanitizeIdentifier(block.getFieldValue('VAR'), 'display');
  var panelKey = block.getFieldValue('PANEL') || 'BW_GDEH0154D67';
  var panel = GXEPD2_PANEL_OPTIONS[panelKey] || GXEPD2_PANEL_OPTIONS.BW_GDEH0154D67;
  var cs = gxepd2ValueToCode(block, generator, 'CS', 'SS');
  var dc = gxepd2ValueToCode(block, generator, 'DC', '17');
  var rst = gxepd2ValueToCode(block, generator, 'RST', '16');
  var busy = gxepd2ValueToCode(block, generator, 'BUSY', '4');
  var baud = block.getFieldValue('BAUD') || '0';
  var resetDuration = block.getFieldValue('RESET_DURATION') || '2';
  var initial = gxepd2Bool(block.getFieldValue('INITIAL'));
  var pulldown = gxepd2Bool(block.getFieldValue('PULLDOWN'));

  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(varName, GXEPD2_VAR_TYPE);
  }

  if (baud !== '0' && typeof ensureSerialBegin === 'function') {
    ensureSerialBegin('Serial', generator, baud);
  }

  var declaration = panel.displayClass + '<' + panel.driver + ', ' + panel.driver + '::HEIGHT> ' +
    varName + '(' + panel.driver + '(' + cs + ', ' + dc + ', ' + rst + ', ' + busy + '));';
  generator.addVariable(varName, declaration);

  return varName + '.init(' + baud + ', ' + initial + ', ' + resetDuration + ', ' + pulldown + ');\n';
};

Arduino.forBlock['gxepd2_page_update'] = function(block, generator) {
  var varName = gxepd2GetVarName(block, 'display');
  var windowMode = block.getFieldValue('WINDOW') || 'FULL';
  var drawCode = generator.statementToCode(block, 'DRAW') || '';
  var code = '';
  if (windowMode === 'FULL') {
    code += varName + '.setFullWindow();\n';
  }
  code += varName + '.firstPage();\n';
  code += 'do {\n';
  code += drawCode;
  code += '} while (' + varName + '.nextPage());\n';
  return code;
};

Arduino.forBlock['gxepd2_clear_display'] = function(block, generator) {
  var varName = gxepd2GetVarName(block, 'display');
  var color = gxepd2ValueToCode(block, generator, 'COLOR', 'GxEPD_WHITE');
  return varName + '.setFullWindow();\n' +
    varName + '.firstPage();\n' +
    'do {\n' +
    '  ' + varName + '.fillScreen(' + color + ');\n' +
    '} while (' + varName + '.nextPage());\n';
};

Arduino.forBlock['gxepd2_set_partial_window'] = function(block, generator) {
  var varName = gxepd2GetVarName(block, 'display');
  var x = gxepd2ValueToCode(block, generator, 'X', '0');
  var y = gxepd2ValueToCode(block, generator, 'Y', '0');
  var w = gxepd2ValueToCode(block, generator, 'W', '128');
  var h = gxepd2ValueToCode(block, generator, 'H', '64');
  return varName + '.setPartialWindow(' + x + ', ' + y + ', ' + w + ', ' + h + ');\n';
};

Arduino.forBlock['gxepd2_fill_screen'] = function(block, generator) {
  var varName = gxepd2GetVarName(block, 'display');
  var color = gxepd2ValueToCode(block, generator, 'COLOR', 'GxEPD_WHITE');
  return varName + '.fillScreen(' + color + ');\n';
};

Arduino.forBlock['gxepd2_set_rotation'] = function(block) {
  var varName = gxepd2GetVarName(block, 'display');
  var rotation = block.getFieldValue('ROTATION') || '0';
  return varName + '.setRotation(' + rotation + ');\n';
};

Arduino.forBlock['gxepd2_set_text_color'] = function(block, generator) {
  var varName = gxepd2GetVarName(block, 'display');
  var color = gxepd2ValueToCode(block, generator, 'COLOR', 'GxEPD_BLACK');
  return varName + '.setTextColor(' + color + ');\n';
};

Arduino.forBlock['gxepd2_set_text_size'] = function(block) {
  var varName = gxepd2GetVarName(block, 'display');
  var size = block.getFieldValue('SIZE') || '1';
  return varName + '.setTextSize(' + size + ');\n';
};

Arduino.forBlock['gxepd2_set_font'] = function(block, generator) {
  gxepd2AddCore(generator);
  var varName = gxepd2GetVarName(block, 'display');
  var font = block.getFieldValue('FONT') || 'NULL';
  if (font === 'NULL') {
    return varName + '.setFont();\n';
  }
  return varName + '.setFont(' + font + ');\n';
};

Arduino.forBlock['gxepd2_set_cursor'] = function(block, generator) {
  var varName = gxepd2GetVarName(block, 'display');
  var x = gxepd2ValueToCode(block, generator, 'X', '0');
  var y = gxepd2ValueToCode(block, generator, 'Y', '0');
  return varName + '.setCursor(' + x + ', ' + y + ');\n';
};

Arduino.forBlock['gxepd2_print'] = function(block, generator) {
  var varName = gxepd2GetVarName(block, 'display');
  var text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '""';
  return varName + '.print(' + text + ');\n';
};

Arduino.forBlock['gxepd2_draw_pixel'] = function(block, generator) {
  var varName = gxepd2GetVarName(block, 'display');
  var x = gxepd2ValueToCode(block, generator, 'X', '0');
  var y = gxepd2ValueToCode(block, generator, 'Y', '0');
  var color = gxepd2ValueToCode(block, generator, 'COLOR', 'GxEPD_BLACK');
  return varName + '.drawPixel(' + x + ', ' + y + ', ' + color + ');\n';
};

Arduino.forBlock['gxepd2_draw_line'] = function(block, generator) {
  var varName = gxepd2GetVarName(block, 'display');
  var x1 = gxepd2ValueToCode(block, generator, 'X1', '0');
  var y1 = gxepd2ValueToCode(block, generator, 'Y1', '0');
  var x2 = gxepd2ValueToCode(block, generator, 'X2', '0');
  var y2 = gxepd2ValueToCode(block, generator, 'Y2', '0');
  var color = gxepd2ValueToCode(block, generator, 'COLOR', 'GxEPD_BLACK');
  return varName + '.drawLine(' + x1 + ', ' + y1 + ', ' + x2 + ', ' + y2 + ', ' + color + ');\n';
};

Arduino.forBlock['gxepd2_draw_rect'] = function(block, generator) {
  var varName = gxepd2GetVarName(block, 'display');
  var x = gxepd2ValueToCode(block, generator, 'X', '0');
  var y = gxepd2ValueToCode(block, generator, 'Y', '0');
  var w = gxepd2ValueToCode(block, generator, 'W', '10');
  var h = gxepd2ValueToCode(block, generator, 'H', '10');
  var color = gxepd2ValueToCode(block, generator, 'COLOR', 'GxEPD_BLACK');
  var method = block.getFieldValue('FILL') === 'FILLED' ? 'fillRect' : 'drawRect';
  return varName + '.' + method + '(' + x + ', ' + y + ', ' + w + ', ' + h + ', ' + color + ');\n';
};

Arduino.forBlock['gxepd2_draw_circle'] = function(block, generator) {
  var varName = gxepd2GetVarName(block, 'display');
  var x = gxepd2ValueToCode(block, generator, 'X', '0');
  var y = gxepd2ValueToCode(block, generator, 'Y', '0');
  var radius = gxepd2ValueToCode(block, generator, 'RADIUS', '10');
  var color = gxepd2ValueToCode(block, generator, 'COLOR', 'GxEPD_BLACK');
  var method = block.getFieldValue('FILL') === 'FILLED' ? 'fillCircle' : 'drawCircle';
  return varName + '.' + method + '(' + x + ', ' + y + ', ' + radius + ', ' + color + ');\n';
};

Arduino.forBlock['gxepd2_refresh'] = function(block) {
  var varName = gxepd2GetVarName(block, 'display');
  var partial = block.getFieldValue('MODE') === 'PARTIAL' ? 'true' : 'false';
  return varName + '.refresh(' + partial + ');\n';
};

Arduino.forBlock['gxepd2_sleep'] = function(block) {
  var varName = gxepd2GetVarName(block, 'display');
  var mode = block.getFieldValue('MODE') || 'POWER_OFF';
  return mode === 'HIBERNATE' ? varName + '.hibernate();\n' : varName + '.powerOff();\n';
};

Arduino.forBlock['gxepd2_width'] = function(block, generator) {
  var varName = gxepd2GetVarName(block, 'display');
  return [varName + '.width()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['gxepd2_height'] = function(block, generator) {
  var varName = gxepd2GetVarName(block, 'display');
  return [varName + '.height()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['gxepd2_color'] = function(block, generator) {
  gxepd2AddCore(generator);
  var color = block.getFieldValue('COLOR') || 'GxEPD_BLACK';
  return [color, generator.ORDER_ATOMIC];
};

// ===== U8g2 中文字体（U8g2_for_Adafruit_GFX）=====

function gxepd2AddU8g2(generator) {
  generator.addLibrary('U8g2_for_Adafruit_GFX', '#include <U8g2_for_Adafruit_GFX.h>');
  generator.addObject('u8g2Fonts', 'U8G2_FOR_ADAFRUIT_GFX u8g2Fonts;');
}

// 绑定字体引擎到墨水屏（setup 用一次）
Arduino.forBlock['gxepd2_u8g2_begin'] = function(block, generator) {
  gxepd2AddCore(generator);
  gxepd2AddU8g2(generator);
  var varName = gxepd2GetVarName(block, 'display');
  var code = 'u8g2Fonts.begin(' + varName + ');\n';
  code += 'u8g2Fonts.setFontMode(1);\n';
  code += 'u8g2Fonts.setFontDirection(0);\n';
  return code;
};

// 设置字体
Arduino.forBlock['gxepd2_u8g2_font'] = function(block, generator) {
  gxepd2AddU8g2(generator);
  var font = block.getFieldValue('FONT') || 'u8g2_font_wqy12_t_gb2312a';
  return 'u8g2Fonts.setFont(' + font + ');\n';
};

// 设置前景/背景色
Arduino.forBlock['gxepd2_u8g2_color'] = function(block, generator) {
  gxepd2AddCore(generator);
  gxepd2AddU8g2(generator);
  var fg = block.getFieldValue('FG') || 'GxEPD_BLACK';
  var bg = block.getFieldValue('BG') || 'GxEPD_WHITE';
  return 'u8g2Fonts.setForegroundColor(' + fg + ');\n' +
         'u8g2Fonts.setBackgroundColor(' + bg + ');\n';
};

// 背景模式（透明/实心）
Arduino.forBlock['gxepd2_u8g2_mode'] = function(block, generator) {
  gxepd2AddU8g2(generator);
  var mode = block.getFieldValue('MODE') || '1';
  return 'u8g2Fonts.setFontMode(' + mode + ');\n';
};

// 定位显示文字（支持中文 UTF-8）
Arduino.forBlock['gxepd2_u8g2_text'] = function(block, generator) {
  gxepd2AddU8g2(generator);
  var x = gxepd2ValueToCode(block, generator, 'X', '0');
  var y = gxepd2ValueToCode(block, generator, 'Y', '0');
  var text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '""';
  return 'u8g2Fonts.setCursor(' + x + ', ' + y + ');\n' +
         'u8g2Fonts.print(' + text + ');\n';
};

// 重映射 SPI 引脚（ESP32/ESP32-C3 自定义 SCK/MOSI/MISO/CS）
Arduino.forBlock['gxepd2_spi_pins'] = function(block, generator) {
  generator.addLibrary('SPI', '#include <SPI.h>');
  var sck = gxepd2ValueToCode(block, generator, 'SCK', '-1');
  var miso = gxepd2ValueToCode(block, generator, 'MISO', '-1');
  var mosi = gxepd2ValueToCode(block, generator, 'MOSI', '-1');
  var cs = gxepd2ValueToCode(block, generator, 'CS', '-1');
  return 'SPI.end();\n' +
         'SPI.begin(' + sck + ', ' + miso + ', ' + mosi + ', ' + cs + ');\n';
};


// ==== any-panel setup (merged from @aily-project/lib-gxepd2-any, single-IC catalog only) ====
var GXEPD2ANY_VAR_TYPE = 'GxEPD2';

var GXEPD2ANY_PANELS = {
  GxEPD2_102: { base: 'GxEPD2_BW', pageH: 128 },
  GxEPD2_213_flex: { base: 'GxEPD2_BW', pageH: 212 },
  GxEPD2_213_M21: { base: 'GxEPD2_BW', pageH: 212 },
  GxEPD2_213_T5D: { base: 'GxEPD2_BW', pageH: 212 },
  GxEPD2_213: { base: 'GxEPD2_BW', pageH: 250 },
  GxEPD2_213_B72: { base: 'GxEPD2_BW', pageH: 250 },
  GxEPD2_213_B73: { base: 'GxEPD2_BW', pageH: 250 },
  GxEPD2_213_B74: { base: 'GxEPD2_BW', pageH: 250 },
  GxEPD2_213_BN: { base: 'GxEPD2_BW', pageH: 250 },
  GxEPD2_213_GDEY0213B74: { base: 'GxEPD2_BW', pageH: 250 },
  GxEPD2_290: { base: 'GxEPD2_BW', pageH: 296 },
  GxEPD2_290_BS: { base: 'GxEPD2_BW', pageH: 296 },
  GxEPD2_290_GDEY029T94: { base: 'GxEPD2_BW', pageH: 296 },
  GxEPD2_290_I6FD: { base: 'GxEPD2_BW', pageH: 296 },
  GxEPD2_290_M06: { base: 'GxEPD2_BW', pageH: 296 },
  GxEPD2_290_T5: { base: 'GxEPD2_BW', pageH: 296 },
  GxEPD2_290_T5D: { base: 'GxEPD2_BW', pageH: 296 },
  GxEPD2_290_T94: { base: 'GxEPD2_BW', pageH: 296 },
  GxEPD2_290_T94_V2: { base: 'GxEPD2_BW', pageH: 296 },
  GxEPD2_154_M10: { base: 'GxEPD2_BW', pageH: 152 },
  GxEPD2_154_T8: { base: 'GxEPD2_BW', pageH: 152 },
  GxEPD2_260: { base: 'GxEPD2_BW', pageH: 296 },
  GxEPD2_260_M01: { base: 'GxEPD2_BW', pageH: 296 },
  GxEPD2_266_BN: { base: 'GxEPD2_BW', pageH: 296 },
  GxEPD2_266_GDEY0266T90: { base: 'GxEPD2_BW', pageH: 296 },
  GxEPD2_290_GDEY029T71H: { base: 'GxEPD2_BW', pageH: 384 },
  GxEPD2_270: { base: 'GxEPD2_BW', pageH: 264 },
  GxEPD2_270_GDEY027T91: { base: 'GxEPD2_BW', pageH: 264 },
  GxEPD2_150_BN: { base: 'GxEPD2_BW', pageH: 200 },
  GxEPD2_154: { base: 'GxEPD2_BW', pageH: 200 },
  GxEPD2_154_D67: { base: 'GxEPD2_BW', pageH: 200 },
  GxEPD2_154_GDEY0154D67: { base: 'GxEPD2_BW', pageH: 200 },
  GxEPD2_154_M09: { base: 'GxEPD2_BW', pageH: 200 },
  GxEPD2_310_GDEQ031T10: { base: 'GxEPD2_BW', pageH: 320 },
  GxEPD2_370_GDEY037T03: { base: 'GxEPD2_BW', pageH: 416 },
  GxEPD2_371: { base: 'GxEPD2_BW', pageH: 416 },
  GxEPD2_370_TC1: { base: 'GxEPD2_BW', pageH: 480 },
  GxEPD2_420: { base: 'GxEPD2_BW', pageH: 300 },
  GxEPD2_420_GDEY042T81: { base: 'GxEPD2_BW', pageH: 300 },
  GxEPD2_420_GYE042A87: { base: 'GxEPD2_BW', pageH: 300 },
  GxEPD2_420_M01: { base: 'GxEPD2_BW', pageH: 300 },
  GxEPD2_420_SE0420NQ04: { base: 'GxEPD2_BW', pageH: 300 },
  GxEPD2_583: { base: 'GxEPD2_BW', pageH: 448 },
  GxEPD2_750: { base: 'GxEPD2_BW', pageH: 384 },
  GxEPD2_583_GDEQ0583T31: { base: 'GxEPD2_BW', pageH: 480 },
  GxEPD2_583_T8: { base: 'GxEPD2_BW', pageH: 480 },
  GxEPD2_579_GDEY0579T93: { base: 'GxEPD2_BW', pageH: 272 },
  GxEPD2_397_GDEM0397T81: { base: 'GxEPD2_BW', pageH: 480 },
  GxEPD2_426_GDEQ0426T82: { base: 'GxEPD2_BW', pageH: 480 },
  GxEPD2_750_GDEY075T7: { base: 'GxEPD2_BW', pageH: 480 },
  GxEPD2_750_T7: { base: 'GxEPD2_BW', pageH: 480 },
  GxEPD2_576_GDEH0576T81: { base: 'GxEPD2_BW', pageH: 568 },
  GxEPD2_1020_GDEM102T91: { base: 'GxEPD2_BW', pageH: 544 },
  GxEPD2_1160_T91: { base: 'GxEPD2_BW', pageH: 544 },
  GxEPD2_1330_GDEM133T91: { base: 'GxEPD2_BW', pageH: 544 },
  GxEPD2_1248: { base: 'GxEPD2_BW', pageH: 400 },
  GxEPD2_1085_GDEM1085T51: { base: 'GxEPD2_BW', pageH: 384 },
  GxEPD2_213_Z19c: { base: 'GxEPD2_3C', pageH: 212 },
  GxEPD2_213c: { base: 'GxEPD2_3C', pageH: 212 },
  GxEPD2_213_Z98c: { base: 'GxEPD2_3C', pageH: 250 },
  GxEPD2_290_C90c: { base: 'GxEPD2_3C', pageH: 296 },
  GxEPD2_290_Z13c: { base: 'GxEPD2_3C', pageH: 296 },
  GxEPD2_290c: { base: 'GxEPD2_3C', pageH: 296 },
  GxEPD2_266c: { base: 'GxEPD2_3C', pageH: 296 },
  GxEPD2_270c: { base: 'GxEPD2_3C', pageH: 264 },
  GxEPD2_154_Z90c: { base: 'GxEPD2_3C', pageH: 200 },
  GxEPD2_154c: { base: 'GxEPD2_3C', pageH: 200 },
  GxEPD2_420c: { base: 'GxEPD2_3C', pageH: 300 },
  GxEPD2_420c_GDEY042Z98: { base: 'GxEPD2_3C', pageH: 300 },
  GxEPD2_420c_Z21: { base: 'GxEPD2_3C', pageH: 300 },
  GxEPD2_583c: { base: 'GxEPD2_3C', pageH: 448 },
  GxEPD2_750c: { base: 'GxEPD2_3C', pageH: 384 },
  GxEPD2_583c_GDEQ0583Z31: { base: 'GxEPD2_3C', pageH: 400 },
  GxEPD2_583c_Z83: { base: 'GxEPD2_3C', pageH: 400 },
  GxEPD2_579c_GDEY0579Z93: { base: 'GxEPD2_3C', pageH: 272 },
  GxEPD2_750c_GDEW075Z08: { base: 'GxEPD2_3C', pageH: 320 },
  GxEPD2_750c_GDEY075Z08: { base: 'GxEPD2_3C', pageH: 320 },
  GxEPD2_750c_Z08: { base: 'GxEPD2_3C', pageH: 320 },
  GxEPD2_750c_Z90: { base: 'GxEPD2_3C', pageH: 296 },
  GxEPD2_1160c_GDEY116Z91: { base: 'GxEPD2_3C', pageH: 272 },
  GxEPD2_1330c_GDEM133Z91: { base: 'GxEPD2_3C', pageH: 272 },
  GxEPD2_1248c: { base: 'GxEPD2_3C', pageH: 200 },
  GxEPD2_213c_GDEY0213F51: { base: 'GxEPD2_4C', pageH: 250 },
  GxEPD2_290c_GDEY029F51H: { base: 'GxEPD2_4C', pageH: 384 },
  GxEPD2_300c: { base: 'GxEPD2_4C', pageH: 400 },
  GxEPD2_266c_GDEY0266F51H: { base: 'GxEPD2_4C', pageH: 360 },
  GxEPD2_350c_GDEM035F51: { base: 'GxEPD2_4C', pageH: 384 },
  GxEPD2_154c_GDEM0154F51H: { base: 'GxEPD2_4C', pageH: 200 },
  GxEPD2_420c_GDEY0420F51: { base: 'GxEPD2_4C', pageH: 300 },
  GxEPD2_437c: { base: 'GxEPD2_4C', pageH: 368 },
  GxEPD2_579c_GDEY0579F51: { base: 'GxEPD2_4C', pageH: 272 },
  GxEPD2_397c_GDEM0397F81: { base: 'GxEPD2_4C', pageH: 320 },
  GxEPD2_750c_GDEM075F52: { base: 'GxEPD2_4C', pageH: 320 },
  GxEPD2_1160c_GDEY116F51: { base: 'GxEPD2_4C', pageH: 272 },
  GxEPD2_565c: { base: 'GxEPD2_7C', pageH: 432 },
  GxEPD2_565c_GDEP0565D90: { base: 'GxEPD2_7C', pageH: 432 },
  GxEPD2_730c_ACeP_730: { base: 'GxEPD2_7C', pageH: 320 },
  GxEPD2_730c_GDEP073E01: { base: 'GxEPD2_7C', pageH: 320 },
  GxEPD2_730c_GDEY073D46: { base: 'GxEPD2_7C', pageH: 320 }
};

function gxepd2anySanitizeIdentifier(value, fallback) {
  var name = String(value || fallback || 'display').trim();
  name = name.replace(/[^A-Za-z0-9_]/g, '_');
  if (!/^[A-Za-z_]/.test(name)) {
    name = '_' + name;
  }
  return name || fallback || 'display';
}

function gxepd2anyCleanValue(value, fallback) {
  var code = value == null || value === '' ? fallback : String(value);
  return code.replace(/^\((.*)\)$/, '$1');
}

function gxepd2anyBool(value) {
  return value === 'TRUE' || value === true ? 'true' : 'false';
}

function gxepd2anyValueToCode(block, generator, name, fallback) {
  return gxepd2anyCleanValue(generator.valueToCode(block, name, generator.ORDER_ATOMIC), fallback);
}

function gxepd2anyAttachVarMonitor(block) {
  if (block._gxepd2anyVarMonitorAttached) {
    return;
  }
  block._gxepd2anyVarMonitorAttached = true;
  block._gxepd2anyVarLastName = gxepd2anySanitizeIdentifier(block.getFieldValue('VAR'), 'display');
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._gxepd2anyVarLastName, GXEPD2ANY_VAR_TYPE);
  }
  var varField = block.getField('VAR');
  if (!varField) {
    return;
  }
  var originalFinishEditing = varField.onFinishEditing_;
  varField.onFinishEditing_ = function(newName) {
    if (typeof originalFinishEditing === 'function') {
      originalFinishEditing.call(this, newName);
    }
    var workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
    var oldName = block._gxepd2anyVarLastName;
    var cleanName = gxepd2anySanitizeIdentifier(newName, oldName);
    if (workspace && cleanName && cleanName !== oldName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, oldName, cleanName, GXEPD2ANY_VAR_TYPE);
      block._gxepd2anyVarLastName = cleanName;
    }
  };
}

Arduino.forBlock['gxepd2any_setup'] = function(block, generator) {
  gxepd2anyAttachVarMonitor(block);
  // Same include keys as the stock gxepd2 blocks so duplicate includes deduplicate.
  generator.addLibrary('Adafruit_GFX', '#include <Adafruit_GFX.h>');
  generator.addLibrary('GxEPD2', '#include <GxEPD2.h>');
  generator.addLibrary('GxEPD2_BW', '#include <GxEPD2_BW.h>');
  generator.addLibrary('GxEPD2_3C', '#include <GxEPD2_3C.h>');
  generator.addLibrary('GxEPD2_4C', '#include <GxEPD2_4C.h>');
  generator.addLibrary('GxEPD2_7C', '#include <GxEPD2_7C.h>');
  generator.addLibrary('SPI', '#include <SPI.h>');

  var varName = gxepd2anySanitizeIdentifier(block.getFieldValue('VAR'), 'display');
  var cls = block.getFieldValue('PANEL');
  var panel = GXEPD2ANY_PANELS[cls];
  if (!panel) {
    panel = GXEPD2ANY_PANELS['GxEPD2_154_D67'] || { base: 'GxEPD2_BW', pageH: 200 };
  }
  var sck = gxepd2anyValueToCode(block, generator, 'SCK', '18');
  var mosi = gxepd2anyValueToCode(block, generator, 'MOSI', '23');
  var cs = gxepd2anyValueToCode(block, generator, 'CS', 'SS');
  var dc = gxepd2anyValueToCode(block, generator, 'DC', '17');
  var rst = gxepd2anyValueToCode(block, generator, 'RST', '21');
  var busy = gxepd2anyValueToCode(block, generator, 'BUSY', '4');
  var baud = block.getFieldValue('BAUD') || '0';
  var resetDuration = block.getFieldValue('RESET_DURATION') || '2';
  var initial = gxepd2anyBool(block.getFieldValue('INITIAL'));
  var pulldown = gxepd2anyBool(block.getFieldValue('PULLDOWN'));

  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(varName, GXEPD2ANY_VAR_TYPE);
  }

  if (baud !== '0' && typeof ensureSerialBegin === 'function') {
    ensureSerialBegin('Serial', generator, baud);
  }

  // Pin the hardware SPI bus to the chosen SCK/MOSI before display init
  // (same approach as the stock gxepd2_spi_pins block; e-paper has no MISO).
  var code = 'SPI.end();\nSPI.begin(' + sck + ', -1, ' + mosi + ', ' + cs + ');\n';

  var declaration = panel.base + '<' + cls + ', ' + panel.pageH + '> ' + varName +
    '(' + cls + '(' + cs + ', ' + dc + ', ' + rst + ', ' + busy + '));';
  generator.addVariable(varName, declaration);

  code += varName + '.init(' + baud + ', ' + initial + ', ' + resetDuration + ', ' + pulldown + ');\n';
  return code;
};

// @aily-project/lib-gxepd2-2ic

Arduino.forBlock["gxepd22ic_setup"] = function (block, generator) {
  registerVariableToBlockly(block.getFieldValue("VAR"), "GxEPD2");
  generator.addLibrary('Adafruit_GFX_2IC', '#include <Adafruit_GFX.h>');
  generator.addLibrary('SPI_2IC', '#include <SPI.h>');
  generator.addLibrary('GxEPD2_2IC_BW', '#include "GxEPD2_2IC_BW.h"');
  function cleanPin(name, fallback) {
    var v = generator.valueToCode(block, name, generator.ORDER_ATOMIC);
    v = (v == null || v === '') ? fallback : String(v);
    return v.replace(/^\((.*)\)$/, '$1');
  }
  function sanitizeId(value, fallback) {
    var n = String(value || fallback).trim().replace(/[^A-Za-z0-9_]/g, '_');
    if (!/^[A-Za-z_]/.test(n)) n = '_' + n;
    return n || fallback;
  }
  var varName = sanitizeId(block.getFieldValue('VAR'), 'display');
  var sck = cleanPin('SCK', '18');
  var mosi = cleanPin('MOSI', '23');
  var cs = cleanPin('CS', '5');
  var cs2 = cleanPin('CS2', '22');
  var dc = cleanPin('DC', '17');
  var rst = cleanPin('RST', '16');
  var busy = cleanPin('BUSY', '4');
  var pwr = cleanPin('PWR', '32');
  var baud = block.getFieldValue('BAUD') || '115200';
  var resetDuration = block.getFieldValue('RESET_DURATION') || '10';
  var initial = (block.getFieldValue('INITIAL') === 'FALSE') ? 'false' : 'true';
  var pulldown = (block.getFieldValue('PULLDOWN') === 'TRUE') ? 'true' : 'false';
  if (baud !== '0' && typeof ensureSerialBegin === 'function') {
    ensureSerialBegin('Serial', generator, baud);
  }
  generator.addVariable(varName, 'GxEPD2_2IC_BW<GxEPD2_2IC_420_A03, GxEPD2_2IC_420_A03::HEIGHT> ' + varName +
    '(GxEPD2_2IC_420_A03(' + cs + ', ' + cs2 + ', ' + dc + ', ' + rst + ', ' + busy + '));');
  var code = '';
  code += 'SPI.end();\n';
  code += 'SPI.begin(' + sck + ', -1, ' + mosi + ', ' + cs + ');\n';
  code += 'if ((' + pwr + ') >= 0) { pinMode(' + pwr + ', OUTPUT); digitalWrite(' + pwr + ', LOW); }\n';
  code += varName + '.init(' + baud + ', ' + initial + ', ' + resetDuration + ', ' + pulldown + ');\n';
  return code;
};

