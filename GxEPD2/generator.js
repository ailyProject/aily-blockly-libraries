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
  if (generator && typeof generator.addMacro === 'function') {
    generator.addMacro(key, code);
  } else if (generator && typeof generator.addVariable === 'function') {
    generator.addVariable(key, code);
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

  gxepd2AddMacro(generator, 'GXEPD2_MAX_DISPLAY_BUFFER_SIZE',
`#ifndef GXEPD2_MAX_DISPLAY_BUFFER_SIZE
#if defined(ARDUINO_ARCH_AVR)
#define GXEPD2_MAX_DISPLAY_BUFFER_SIZE 800
#elif defined(ARDUINO_ARCH_ESP32)
#define GXEPD2_MAX_DISPLAY_BUFFER_SIZE 65536ul
#elif defined(ARDUINO_ARCH_ESP8266)
#define GXEPD2_MAX_DISPLAY_BUFFER_SIZE (81920ul - 34000ul - 5000ul)
#elif defined(ARDUINO_ARCH_RP2040)
#define GXEPD2_MAX_DISPLAY_BUFFER_SIZE 131072ul
#else
#define GXEPD2_MAX_DISPLAY_BUFFER_SIZE ${fallbackBufferSize}
#endif
#endif`);
  gxepd2AddMacro(generator, 'GXEPD2_MAX_HEIGHT_BW',
`#ifndef GXEPD2_MAX_HEIGHT_BW
#define GXEPD2_MAX_HEIGHT_BW(EPD) (EPD::HEIGHT <= GXEPD2_MAX_DISPLAY_BUFFER_SIZE / (EPD::WIDTH / 8) ? EPD::HEIGHT : GXEPD2_MAX_DISPLAY_BUFFER_SIZE / (EPD::WIDTH / 8))
#endif`);
  gxepd2AddMacro(generator, 'GXEPD2_MAX_HEIGHT_COLOR',
`#ifndef GXEPD2_MAX_HEIGHT_COLOR
#define GXEPD2_MAX_HEIGHT_COLOR(EPD) (EPD::HEIGHT <= (GXEPD2_MAX_DISPLAY_BUFFER_SIZE / 2) / (EPD::WIDTH / 8) ? EPD::HEIGHT : (GXEPD2_MAX_DISPLAY_BUFFER_SIZE / 2) / (EPD::WIDTH / 8))
#endif`);
  gxepd2AddMacro(generator, 'GXEPD2_MAX_HEIGHT_7C',
`#ifndef GXEPD2_MAX_HEIGHT_7C
#define GXEPD2_MAX_HEIGHT_7C(EPD) (EPD::HEIGHT <= GXEPD2_MAX_DISPLAY_BUFFER_SIZE / (EPD::WIDTH / 2) ? EPD::HEIGHT : GXEPD2_MAX_DISPLAY_BUFFER_SIZE / (EPD::WIDTH / 2))
#endif`);
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

  var declaration = panel.displayClass + '<' + panel.driver + ', ' + panel.heightMacro + '(' + panel.driver + ')> ' +
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
