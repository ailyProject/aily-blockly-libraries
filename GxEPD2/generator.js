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

// 板载墨水屏按开发板配置（做法同 TFT_eSPI 读 board.json 的 displayConfig，字段按《功能引脚申明规范》）：
// 只有 displayConfig.interface 是 spi、displayConfig.model 对得上本库的面板时才采用，否则保持手动配置。
function gxepd2BoardDisplay() {
  var board = typeof window !== 'undefined' && window['boardConfig'] ? window['boardConfig'] : null;
  var config = board && board.displayConfig;
  if (!config || typeof config !== 'object') return null;
  if (String(config.interface || '').toLowerCase() !== 'spi') return null;
  var model = String(config.model || '').replace(/[\s_-]+/g, '').toUpperCase();
  if (!model) return null;
  var panelKey = null;
  Object.keys(GXEPD2_PANEL_OPTIONS).forEach(function(key) {
    // 面板键名是“颜色前缀_型号”，如 C3_GDEY0213Z98
    if (!panelKey && key.replace(/^[A-Z0-9]+_/, '') === model) panelKey = key;
  });
  if (!panelKey) return null;
  var pins = config.pins && typeof config.pins === 'object' ? config.pins : {};
  function pin(name) {
    return pins[name] != null && pins[name] !== '' ? String(pins[name]) : null;
  }
  return {
    panel: panelKey,
    cs: pin('cs'), dc: pin('dc'), rst: pin('rst'), busy: pin('busy'),
    sclk: pin('sclk'), mosi: pin('mosi'), miso: pin('miso')
  };
}

// 把工具箱积木里数字输入的默认值（影子积木）改成板卡的引脚；不是纯数字的引脚名就保持原默认值
function gxepd2SetShadowNumber(block, inputName, value) {
  if (value == null || !/^-?\d+$/.test(String(value))) return;
  var target = block.getInputTargetBlock && block.getInputTargetBlock(inputName);
  if (target && target.isShadow && target.isShadow() && target.getField('NUM')) {
    target.setFieldValue(String(value), 'NUM');
  }
}

// 只改工具箱（flyout）里的积木，拖出来的积木带着板卡的面板和引脚；打开已保存的程序时不改用户的值
if (Blockly.Extensions.isRegistered('gxepd2_board_display')) {
  Blockly.Extensions.unregister('gxepd2_board_display');
}
Blockly.Extensions.register('gxepd2_board_display', function() {
  var block = this;
  if (!block.isInFlyout) return;
  // 工具箱里的影子积木在扩展挂上之后才接上，延后一拍再填
  setTimeout(function() {
    var disposed = typeof block.isDisposed === 'function' ? block.isDisposed() : block.disposed;
    if (!block.workspace || disposed) return;
    var config = gxepd2BoardDisplay();
    if (!config) return;
    if (block.type === 'gxepd2_setup') {
      block.setFieldValue(config.panel, 'PANEL');
      gxepd2SetShadowNumber(block, 'CS', config.cs);
      gxepd2SetShadowNumber(block, 'DC', config.dc);
      gxepd2SetShadowNumber(block, 'RST', config.rst);
      gxepd2SetShadowNumber(block, 'BUSY', config.busy);
    } else if (block.type === 'gxepd2_spi_pins') {
      if (!config.sclk || !config.mosi) return;
      gxepd2SetShadowNumber(block, 'SCK', config.sclk);
      gxepd2SetShadowNumber(block, 'MISO', config.miso != null ? config.miso : '-1');
      gxepd2SetShadowNumber(block, 'MOSI', config.mosi);
      gxepd2SetShadowNumber(block, 'CS', config.cs);
    }
    if (block.rendered && typeof block.render === 'function') block.render();
  }, 0);
});

// 初始化积木的面板和 4 个引脚跟板卡 displayConfig 完全一致（用的就是板载屏），板卡又写了 sclk/mosi，
// 并且工作区里没有“重映射 SPI 引脚”积木时，自动把 SPI 接到板载屏的脚上（ESP32 内核）
function gxepd2BoardSpiRemap(block, panelKey, cs, dc, rst, busy) {
  if (gxepd2GetBoardCore().indexOf('esp32') < 0) return null;
  var config = gxepd2BoardDisplay();
  if (!config || !config.sclk || !config.mosi) return null;
  if (panelKey !== config.panel || cs !== config.cs || dc !== config.dc || rst !== config.rst || busy !== config.busy) {
    return null;
  }
  var workspace = block.workspace;
  if (workspace && typeof workspace.getAllBlocks === 'function') {
    var hasSpiBlock = workspace.getAllBlocks(false).some(function(other) {
      return other.type === 'gxepd2_spi_pins' && (typeof other.isEnabled !== 'function' || other.isEnabled());
    });
    if (hasSpiBlock) return null;
  }
  return config;
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

  var code = varName + '.init(' + baud + ', ' + initial + ', ' + resetDuration + ', ' + pulldown + ');\n';
  var boardSpi = gxepd2BoardSpiRemap(block, panelKey, cs, dc, rst, busy);
  if (boardSpi) {
    generator.addLibrary('SPI', '#include <SPI.h>');
    code += 'SPI.end();\n' +
      'SPI.begin(' + boardSpi.sclk + ', ' + (boardSpi.miso != null ? boardSpi.miso : '-1') + ', ' +
      boardSpi.mosi + ', ' + boardSpi.cs + '); // 板载墨水屏的 SPI 引脚（开发板 displayConfig）\n';
  }
  return code;
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
