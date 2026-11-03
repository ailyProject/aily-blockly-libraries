// NICE_GFX 1.0.0. Objects live globally; initialization runs at the block's position.
function niceGfxBoardDisplayConfig() {
  var board = typeof window !== 'undefined' && window['boardConfig'];
  return board && board.displayConfig;
}

function niceGfxSetBoardField(block, name, value, isPin) {
  if (value === undefined || value === null) return;
  var field = block.getField(name);
  if (!field) return;
  value = String(value);
  if (typeof field.getOptions === 'function') {
    var options = field.getOptions(false);
    if (!options.some(function(option) { return option[1] === value; })) {
      // Built-in display pins are not always exposed in the board's general GPIO picker.
      if (!isPin || !/^(?:-?\d+|[A-Za-z_]\w*)$/.test(value)) return;
      field.setOptions(options.concat([['GPIO ' + value, value]]));
    }
  }
  field.setValue(value);
}

function niceGfxSetBoardNumber(block, name, value) {
  if (value === undefined || value === null || !Number.isFinite(Number(value))) return;
  var input = block.getInput(name), connection = input && input.connection;
  if (!connection) return;
  var target = connection.targetBlock();
  // Connected expressions and ordinary number blocks belong to the user.
  if (target && !target.isShadow()) return;
  if (target && target.type === 'math_number') target.setFieldValue(Number(value), 'NUM');
  else if (!target && Blockly.Blocks['math_number']) {
    connection.setShadowState({ type: 'math_number', fields: { NUM: Number(value) } });
  }
}

function niceGfxApplyBoardDisplayConfig(block) {
  var config = niceGfxBoardDisplayConfig();
  if (!config) return;
  var bus = String(config.interface || 'spi').toLowerCase().replace(/[\s-]+/g, '_');
  var expected = block.type === 'nice_gfx_init_spi' ? ['spi', 'sw_spi', 'software_spi'] :
    block.type === 'nice_gfx_init_qspi' ? ['qspi'] : ['i2c', 'iic'];
  if (expected.indexOf(bus) === -1) return;
  var driverField = block.getField('DRIVER');
  if (config.controller && driverField) {
    var controller = String(config.controller).trim().replace(/[\s-]+/g, '_').replace(/_DRIVER$/i, '').toUpperCase();
    var resolution = config.width != null && config.height != null ? '_' + config.width + 'x' + config.height : '';
    var suffix = block.type === 'nice_gfx_init_qspi' ? '_QSPI' : block.type === 'nice_gfx_init_i2c' ? '_I2C' : '';
    var model = (controller + resolution + suffix).toUpperCase();
    var option = driverField.getOptions(false).find(function(item) {
      var value = item[1].replace(/^nice_gfx::/, '').toUpperCase();
      return resolution ? value === model : value.indexOf(controller + '_') === 0;
    });
    if (!option) {
      var messages = typeof window !== 'undefined' && window.__BLOCKLY_LIB_I18N__;
      messages = messages && messages['@aily-project/lib-nice-gfx'];
      messages = messages && messages.extensions && messages.extensions.nice_gfx_board_display_config;
      var warning = messages && messages.unsupportedProfile || 'No NICE_GFX profile matches board displayConfig: %1';
      block.setWarningText(warning.replace('%1', model), 'nice_gfx_board_display');
      return;
    }
    driverField.setValue(option[1]);
  }
  block.setWarningText(null, 'nice_gfx_board_display');
  if (block.type === 'nice_gfx_init_spi') niceGfxSetBoardField(block, 'BUS', bus === 'spi' ? 'SPI' : 'SW_SPI');
  var pins = config.pins || {};
  var fields = { CS: pins.cs, DC: pins.dc, RST: pins.rst, SCK: pins.sclk != null ? pins.sclk : pins.sck,
    MOSI: pins.mosi, MISO: pins.miso, D0: pins.d0 != null ? pins.d0 : pins.data0,
    D1: pins.d1 != null ? pins.d1 : pins.data1, D2: pins.d2 != null ? pins.d2 : pins.data2,
    D3: pins.d3 != null ? pins.d3 : pins.data3, SDA: pins.sda, SCL: pins.scl };
  Object.keys(fields).forEach(function(name) { niceGfxSetBoardField(block, name, fields[name], true); });
  if (config.frequency > 0) niceGfxSetBoardNumber(block, 'HZ', config.frequency);
  if (config.address != null) niceGfxSetBoardNumber(block, 'ADDRESS', config.address);
  niceGfxSetBoardField(block, 'ROTATION', config.rotation);
  if (block.type === 'nice_gfx_init_i2c') niceGfxSetBoardField(block, 'WIRE', config.wire);
}

if (typeof Blockly !== 'undefined' && Blockly.Extensions) {
  if (Blockly.Extensions.isRegistered('nice_gfx_board_display_config')) Blockly.Extensions.unregister('nice_gfx_board_display_config');
  Blockly.Extensions.register('nice_gfx_board_display_config', function() {
    // Run before serialized fields/inputs are restored, so saved/manual values win.
    niceGfxApplyBoardDisplayConfig(this);
    if (this.isInFlyout && typeof setTimeout === 'function') {
      var block = this;
      // The toolbox's generic shadow values are attached after jsonInit.
      setTimeout(function() {
        if (block.workspace && block.workspace.getBlockById(block.id) === block) niceGfxApplyBoardDisplayConfig(block);
      }, 0);
    }
  });
}

function niceGfxInclude(generator) {
  generator.addLibrary('nice_gfx', '#include <NICE_GFX.h>');
}

function niceGfxIdentifier(name) {
  name = String(name).replace(/[^a-zA-Z0-9_]/gu, function(c) {
    return '_u' + c.codePointAt(0).toString(16) + '_';
  });
  if (!/^[a-zA-Z_]/.test(name)) name = 'ng_' + name;
  if (/^(?:auto|bool|break|case|char|class|const|continue|default|delete|do|double|else|enum|extern|false|float|for|if|int|long|namespace|new|nullptr|private|protected|public|return|short|signed|sizeof|static|struct|switch|template|this|true|typedef|typename|union|unsigned|using|virtual|void|volatile|while|setup|loop|String|Serial|SPI|Wire)$/.test(name)) name = 'ng_' + name;
  return name;
}

function niceGfxName(block, key, fallback) {
  key = key || 'VAR';
  var field = block.getField(key);
  return niceGfxIdentifier((field && field.getText ? field.getText() : block.getFieldValue(key)) || fallback || 'gfx');
}

function niceGfxTrack(block, type) {
  // _varMonitorAttached: keep initialization names and typed field_variable references in sync.
  var current = block.getFieldValue('VAR') || 'gfx';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(current, type);
  if (block._varMonitorAttached) return;
  block._varMonitorAttached = true;
  block._niceGfxLastName = current;
  var field = block.getField('VAR');
  if (!field) return;
  var previous = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof previous === 'function') previous.call(this, newName);
    if (newName && newName !== block._niceGfxLastName) {
      if (typeof renameVariableInBlockly === 'function') {
        renameVariableInBlockly(block, block._niceGfxLastName, newName, type);
      }
      block._niceGfxLastName = newName;
    }
  };
}

function niceGfxValue(block, generator, key, fallback) {
  return generator.valueToCode(block, key, generator.ORDER_NONE) || String(fallback === undefined ? 0 : fallback);
}

function niceGfxArgs(block, generator, keys) {
  return keys.map(function(key) { return niceGfxValue(block, generator, key); }).join(', ');
}

function niceGfxText(block, generator, key) {
  // Arduino String accepts literals, String expressions and numeric values; lifetime lasts through the call.
  return 'String(' + niceGfxValue(block, generator, key, '""') + ').c_str()';
}

Arduino.forBlock['nice_gfx_init_spi'] = function(block, generator) {
  niceGfxInclude(generator);
  niceGfxTrack(block, 'NICE_GFX');
  var name = niceGfxName(block);
  var driver = block.getFieldValue('DRIVER') || 'ILI9341_240x320';
  var mode = block.getFieldValue('BUS') || 'SPI';
  var pins = ['CS', 'DC', 'RST', 'SCK', 'MOSI', 'MISO'].map(function(key) { return block.getFieldValue(key); });
  generator.addObject('nice_gfx_display_' + name, driver + '_' + mode + ' ' + name + '(' + pins.join(', ') + ', ' + niceGfxValue(block, generator, 'HZ', 40000000) + ');');
  return name + '.begin();\n' + name + '.setRotation(' + (block.getFieldValue('ROTATION') || '0') + ');\n';
};

Arduino.forBlock['nice_gfx_init_qspi'] = function(block, generator) {
  niceGfxInclude(generator);
  niceGfxTrack(block, 'NICE_GFX');
  var name = niceGfxName(block);
  var driver = block.getFieldValue('DRIVER') || 'nice_gfx::CH13613_480x480_QSPI';
  var pins = ['CS', 'RST', 'SCK', 'D0', 'D1', 'D2', 'D3'].map(function(key) { return block.getFieldValue(key); });
  generator.addObject('nice_gfx_display_' + name, driver + ' ' + name + '(' + pins.join(', ') + ', ' + niceGfxValue(block, generator, 'HZ', 40000000) + ');');
  return name + '.begin();\n';
};

Arduino.forBlock['nice_gfx_init_i2c'] = function(block, generator) {
  niceGfxInclude(generator);
  niceGfxTrack(block, 'NICE_GFX');
  generator.addLibrary('nice_gfx_wire', '#include <Platform/Arduino/I2cWire.h>');
  var name = niceGfxName(block), wire = block.getFieldValue('WIRE') || 'Wire';
  generator.addObject('nice_gfx_i2c_' + name, 'nice_gfx::I2cWire ' + name + '_i2c(' + wire + ');');
  generator.addObject('nice_gfx_display_' + name, (block.getFieldValue('DRIVER') || 'SSD1306_128x64_I2C') + ' ' + name + '(' + name + '_i2c, ' + niceGfxValue(block, generator, 'ADDRESS', 60) + ', ' + (block.getFieldValue('RST') || '-1') + ');');
  var sda = block.getFieldValue('SDA') || '-1', scl = block.getFieldValue('SCL') || '-1';
  var begin = wire + '.begin();\n';
  if (sda !== '-1' || scl !== '-1') {
    if (sda === '-1' || scl === '-1') throw new Error('NICE_GFX I2C requires both SDA and SCL, or -1 for both default pins');
    begin = '#if defined(ESP32) || defined(ARDUINO_ARCH_ESP32) || defined(ESP8266) || defined(ARDUINO_ARCH_ESP8266)\n' +
      wire + '.begin(' + sda + ', ' + scl + ');\n' +
      '#elif (defined(ARDUINO_ARCH_RP2040) && !defined(ARDUINO_ARCH_MBED)) || defined(ARDUINO_ARCH_STM32)\n' +
      wire + '.setSDA(' + sda + ');\n' + wire + '.setSCL(' + scl + ');\n' + wire + '.begin();\n' +
      '#else\n#error "NICE_GFX custom I2C pins require a supported core; use -1 for default pins"\n#endif\n';
  }
  return begin + wire + '.setClock(' + niceGfxValue(block, generator, 'HZ', 400000) + ');\n' + name + '.begin();\n' + name + '.setRotation(' + (block.getFieldValue('ROTATION') || '0') + ');\n';
};

Arduino.forBlock['nice_gfx_init_board'] = function(block, generator) {
  niceGfxInclude(generator);
  niceGfxTrack(block, 'NICE_GFX');
  var name = niceGfxName(block);
  generator.addObject('nice_gfx_display_' + name, 'nice_gfx::BoardDisplay<nice_gfx::BoardPresetId::' + (block.getFieldValue('BOARD') || 'Esp32') + '> ' + name + ';');
  return name + '.begin();\n';
};

function niceGfxCall(block, generator, method, keys) {
  niceGfxInclude(generator);
  return niceGfxName(block) + '.' + method + '(' + niceGfxArgs(block, generator, keys || []) + ');\n';
}

Arduino.forBlock['nice_gfx_fill'] = function(b, g) { return niceGfxCall(b, g, 'fillScreen', ['COLOR']); };
Arduino.forBlock['nice_gfx_pixel'] = function(b, g) { return niceGfxCall(b, g, 'drawPixel', ['X', 'Y', 'COLOR']); };
Arduino.forBlock['nice_gfx_line'] = function(b, g) { return niceGfxCall(b, g, 'drawLine', ['X0', 'Y0', 'X1', 'Y1', 'COLOR']); };
Arduino.forBlock['nice_gfx_rect'] = function(b, g) { return niceGfxCall(b, g, b.getFieldValue('MODE') || 'drawRect', ['X', 'Y', 'W', 'H', 'COLOR']); };
Arduino.forBlock['nice_gfx_round_rect'] = function(b, g) { return niceGfxCall(b, g, b.getFieldValue('MODE') || 'drawRoundRect', ['X', 'Y', 'W', 'H', 'R', 'COLOR']); };
Arduino.forBlock['nice_gfx_circle'] = function(b, g) { return niceGfxCall(b, g, b.getFieldValue('MODE') || 'drawCircle', ['X', 'Y', 'R', 'COLOR']); };
Arduino.forBlock['nice_gfx_ellipse'] = function(b, g) { return niceGfxCall(b, g, b.getFieldValue('MODE') || 'drawEllipse', ['X', 'Y', 'RX', 'RY', 'COLOR']); };
Arduino.forBlock['nice_gfx_triangle'] = function(b, g) { return niceGfxCall(b, g, b.getFieldValue('MODE') || 'drawTriangle', ['X0', 'Y0', 'X1', 'Y1', 'X2', 'Y2', 'COLOR']); };
Arduino.forBlock['nice_gfx_gradient'] = function(b, g) { return niceGfxCall(b, g, b.getFieldValue('MODE') || 'fillRectVGradient', ['X', 'Y', 'W', 'H', 'COLOR1', 'COLOR2']); };
Arduino.forBlock['nice_gfx_arc'] = function(b, g) { return niceGfxCall(b, g, 'drawSmoothArc', ['X', 'Y', 'R', 'IR', 'START', 'END', 'COLOR', 'BG']); };
Arduino.forBlock['nice_gfx_wide_line'] = function(b, g) { return niceGfxCall(b, g, 'drawWideLine', ['X0', 'Y0', 'X1', 'Y1', 'W', 'COLOR', 'BG']); };

Arduino.forBlock['nice_gfx_font'] = function(block, generator) {
  niceGfxInclude(generator);
  return niceGfxName(block) + '.setFont(nice_gfx::fonts::' + (block.getFieldValue('FONT') || 'Fixed6x13') + ');\n';
};
Arduino.forBlock['nice_gfx_text_style'] = function(block, generator) {
  return niceGfxCall(block, generator, 'setTextColor', ['COLOR', 'BG']) +
    niceGfxCall(block, generator, 'setTextSize', ['SIZE']) +
    niceGfxName(block) + '.setTextWrap(' + (block.getFieldValue('WRAP') === 'TRUE' ? 'true' : 'false') + ');\n';
};
Arduino.forBlock['nice_gfx_text'] = function(block, generator) {
  niceGfxInclude(generator);
  return niceGfxName(block) + '.drawString(' + niceGfxText(block, generator, 'TEXT') + ', ' + niceGfxArgs(block, generator, ['X', 'Y']) + ');\n';
};
Arduino.forBlock['nice_gfx_cursor_print'] = function(block, generator) {
  return niceGfxCall(block, generator, 'setCursor', ['X', 'Y']) + niceGfxName(block) + '.' + (block.getFieldValue('MODE') || 'print') + '(' + niceGfxValue(block, generator, 'TEXT', '""') + ');\n';
};
Arduino.forBlock['nice_gfx_rotation'] = function(b, g) { return niceGfxCall(b, g, 'setRotation', ['ROTATION']); };
Arduino.forBlock['nice_gfx_invert'] = function(b, g) { return niceGfxCall(b, g, 'invertDisplay', ['INVERT']); };
Arduino.forBlock['nice_gfx_viewport'] = function(b, g) { return niceGfxCall(b, g, 'setViewport', ['X', 'Y', 'W', 'H']); };
Arduino.forBlock['nice_gfx_action'] = function(b, g) { return niceGfxCall(b, g, b.getFieldValue('ACTION') || 'wait'); };
Arduino.forBlock['nice_gfx_dimension'] = function(block, generator) {
  niceGfxInclude(generator);
  return [niceGfxName(block) + '.' + (block.getFieldValue('DIM') || 'width') + '()', generator.ORDER_FUNCTION_CALL];
};
Arduino.forBlock['nice_gfx_status'] = function(block, generator) {
  niceGfxInclude(generator);
  return ['static_cast<int>(' + niceGfxName(block) + '.lastError())', generator.ORDER_FUNCTION_CALL];
};
Arduino.forBlock['nice_gfx_color'] = function(block, generator) { return [block.getFieldValue('COLOR') || '0xFFFF', generator.ORDER_ATOMIC]; };
Arduino.forBlock['nice_gfx_rgb565'] = function(block, generator) {
  generator.addFunction('nice_gfx_color565', 'uint16_t ailyNiceGfxColor565(uint8_t r, uint8_t g, uint8_t b) {\n  return uint16_t(((r & 0xF8) << 8) | ((g & 0xFC) << 3) | (b >> 3));\n}');
  return ['ailyNiceGfxColor565(' + niceGfxArgs(block, generator, ['R', 'G', 'B']) + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['nice_gfx_sprite_create'] = function(block, generator) {
  niceGfxInclude(generator);
  niceGfxTrack(block, 'GFX_Sprite');
  var name = niceGfxName(block, 'VAR', 'sprite');
  generator.addObject('nice_gfx_sprite_' + name, 'GFX_Sprite ' + name + '(&' + niceGfxName(block, 'DISPLAY') + ');');
  return name + '.setColorDepth(' + (block.getFieldValue('DEPTH') || '16') + ');\n' + name + '.createSprite(' + niceGfxArgs(block, generator, ['W', 'H']) + ');\n';
};
Arduino.forBlock['nice_gfx_sprite_push'] = function(b, g) { return niceGfxCall(b, g, 'pushSprite', ['X', 'Y']); };
Arduino.forBlock['nice_gfx_sprite_transparent'] = function(b, g) { return niceGfxCall(b, g, 'pushSprite', ['X', 'Y', 'COLOR']); };
Arduino.forBlock['nice_gfx_sprite_delete'] = function(b, g) { return niceGfxCall(b, g, 'deleteSprite'); };
Arduino.forBlock['nice_gfx_sprite_ready'] = function(b, g) { niceGfxInclude(g); return [niceGfxName(b) + '.created()', g.ORDER_FUNCTION_CALL]; };

Arduino.forBlock['nice_gfx_touch_i2c'] = function(block, generator) {
  niceGfxInclude(generator);
  generator.addLibrary('nice_gfx_touch_wire', '#include <Platform/Arduino/TouchWire.h>');
  var name = niceGfxName(block), wire = block.getFieldValue('WIRE') || 'Wire';
  var combinedReads = block.getFieldValue('DRIVER') === 'Gt1151' ? ', true' : '';
  generator.addObject('nice_gfx_touch_bus_' + name, 'nice_gfx::TouchWire ' + name + '_touch_bus(' + wire + ', ' + block.getFieldValue('RST') + ', ' + block.getFieldValue('IRQ') + combinedReads + ');');
  generator.addObject('nice_gfx_touch_' + name, 'nice_gfx::' + (block.getFieldValue('DRIVER') || 'Cst816') + ' ' + name + '_touch(' + name + '_touch_bus, ' + niceGfxArgs(block, generator, ['W', 'H', 'ADDRESS']) + ');');
  return wire + '.begin();\n' + name + '_touch.begin();\n' + name + '.attachTouch(' + name + '_touch);\n';
};
Arduino.forBlock['nice_gfx_touch_xpt2046'] = function(block, generator) {
  niceGfxInclude(generator);
  generator.addLibrary('nice_gfx_touch_spi', '#include <Platform/Arduino/TouchSpi.h>');
  var name = niceGfxName(block);
  var pins = ['SCK', 'MOSI', 'MISO', 'CS', 'IRQ'].map(function(key) { return block.getFieldValue(key); }).join(', ');
  generator.addObject('nice_gfx_touch_bus_' + name, 'nice_gfx::TouchSoftwareSpi ' + name + '_touch_bus(nice_gfx::TouchPins(' + pins + '));');
  generator.addObject('nice_gfx_touch_' + name, 'nice_gfx::Xpt2046 ' + name + '_touch(' + name + '_touch_bus);');
  return name + '_touch.begin();\n' + name + '.attachTouch(' + name + '_touch);\n';
};
function niceGfxTouchCache(name, generator) {
  generator.addVariable('nice_gfx_touch_xy_' + name, 'uint16_t ' + name + '_touch_x = 0, ' + name + '_touch_y = 0;');
}
Arduino.forBlock['nice_gfx_touch_read'] = function(block, generator) {
  niceGfxInclude(generator);
  var name = niceGfxName(block);
  niceGfxTouchCache(name, generator);
  return [name + '.getTouch(&' + name + '_touch_x, &' + name + '_touch_y)', generator.ORDER_FUNCTION_CALL];
};
Arduino.forBlock['nice_gfx_touch_coordinate'] = function(block, generator) {
  var name = niceGfxName(block);
  niceGfxTouchCache(name, generator);
  return [name + '_touch_' + (block.getFieldValue('AXIS') || 'x'), generator.ORDER_ATOMIC];
};
Arduino.forBlock['nice_gfx_touch_calibrate'] = function(block, generator) {
  niceGfxInclude(generator);
  var name = niceGfxName(block);
  generator.addVariable('nice_gfx_touch_cal_' + name, 'uint16_t ' + name + '_touch_cal[5] = {0};');
  return name + '.calibrateTouchChecked(' + name + '_touch_cal, ' + niceGfxArgs(block, generator, ['COLOR', 'BG']) + ');\n';
};

function niceGfxUiInclude(generator) {
  niceGfxInclude(generator);
  generator.addLibrary('nice_gfx_ui', '#include <UI/View.h>');
}
function niceGfxUiId(block, generator) { return 'ui_config::id(' + niceGfxText(block, generator, 'ID') + ')'; }
Arduino.forBlock['nice_gfx_ui_init'] = function(block, generator) {
  niceGfxUiInclude(generator);
  niceGfxTrack(block, 'NICE_GFX_View');
  var name = niceGfxName(block, 'VAR', 'ui');
  var header = block.getFieldValue('HEADER') || 'ui.h';
  if (!/^[a-zA-Z0-9_./-]+\.h$/.test(header)) throw new Error('NICE_GFX UI header must be a relative .h path');
  generator.addLibrary('nice_gfx_ui_resource_' + header, '#include "' + header + '"');
  generator.addObject('nice_gfx_ui_' + name, 'nice_gfx::htmlui::View ' + name + '(' + niceGfxName(block, 'DISPLAY') + ', ' + niceGfxValue(block, generator, 'TILE', 2048) + ');');
  generator.addVariable('nice_gfx_ui_ready_' + name, 'bool ' + name + '_ready = false;');
  generator.addLoopEnd('nice_gfx_ui_tick_' + name, 'if (' + name + '_ready) ' + name + '.tick(millis());');
  return name + '_ready = (ui_config::load(' + name + ') == nice_gfx::Status::Ok);\n';
};
Arduino.forBlock['nice_gfx_ui_text'] = function(block, generator) {
  niceGfxUiInclude(generator);
  return niceGfxName(block, 'VAR', 'ui') + '.setText(' + niceGfxUiId(block, generator) + ', ' + niceGfxText(block, generator, 'TEXT') + ');\n';
};
Arduino.forBlock['nice_gfx_ui_value'] = function(block, generator) {
  niceGfxUiInclude(generator);
  return niceGfxName(block, 'VAR', 'ui') + '.setValue(' + niceGfxUiId(block, generator) + ', ' + niceGfxValue(block, generator, 'VALUE') + ');\n';
};
Arduino.forBlock['nice_gfx_ui_get_value'] = function(block, generator) {
  niceGfxUiInclude(generator);
  return [niceGfxName(block, 'VAR', 'ui') + '.value(' + niceGfxUiId(block, generator) + ')', generator.ORDER_FUNCTION_CALL];
};
Arduino.forBlock['nice_gfx_ui_get_text'] = function(block, generator) {
  niceGfxUiInclude(generator);
  return ['String(' + niceGfxName(block, 'VAR', 'ui') + '.text(' + niceGfxUiId(block, generator) + '))', generator.ORDER_FUNCTION_CALL];
};
Arduino.forBlock['nice_gfx_ui_state'] = function(block, generator) {
  niceGfxUiInclude(generator);
  return niceGfxName(block, 'VAR', 'ui') + '.' + (block.getFieldValue('MODE') || 'setVisible') + '(' + niceGfxUiId(block, generator) + ', ' + niceGfxValue(block, generator, 'STATE', 'true') + ');\n';
};
Arduino.forBlock['nice_gfx_ui_navigate'] = function(block, generator) {
  niceGfxUiInclude(generator);
  return niceGfxName(block, 'VAR', 'ui') + '.' + (block.getFieldValue('MODE') || 'push') + '(' + niceGfxText(block, generator, 'PATH') + ');\n';
};
Arduino.forBlock['nice_gfx_ui_action'] = function(block, generator) {
  niceGfxUiInclude(generator);
  return niceGfxName(block, 'VAR', 'ui') + '.' + (block.getFieldValue('ACTION') || 'back') + '();\n';
};
Arduino.forBlock['nice_gfx_ui_chart'] = function(block, generator) {
  niceGfxUiInclude(generator);
  return niceGfxName(block, 'VAR', 'ui') + '.appendChartValue(' + niceGfxUiId(block, generator) + ', ' + niceGfxArgs(block, generator, ['SERIES', 'VALUE']) + ');\n';
};
Arduino.forBlock['nice_gfx_ui_pointer'] = function(block, generator) {
  niceGfxUiInclude(generator);
  return niceGfxName(block, 'VAR', 'ui') + '.' + (block.getFieldValue('MODE') || 'pointerDown') + '(' + niceGfxArgs(block, generator, ['X', 'Y']) + ', millis());\n';
};
Arduino.forBlock['nice_gfx_ui_touch'] = function(block, generator) {
  niceGfxUiInclude(generator);
  var name = niceGfxName(block, 'VAR', 'ui'), display = niceGfxName(block, 'DISPLAY');
  generator.addVariable('nice_gfx_ui_pointer_' + name, 'bool ' + name + '_pressed = false;\nuint16_t ' + name + '_x = 0, ' + name + '_y = 0;');
  return 'if (' + display + '.getTouch(&' + name + '_x, &' + name + '_y)) {\n' +
    '  if (' + name + '_pressed) ' + name + '.pointerMove(' + name + '_x, ' + name + '_y, millis());\n' +
    '  else ' + name + '.pointerDown(' + name + '_x, ' + name + '_y, millis());\n' +
    '  ' + name + '_pressed = true;\n' +
    '} else if (' + name + '_pressed) {\n' +
    '  ' + name + '.pointerUp(' + name + '_x, ' + name + '_y, millis());\n' +
    '  ' + name + '_pressed = false;\n}\n';
};
Arduino.forBlock['nice_gfx_ui_on'] = function(block, generator) {
  niceGfxUiInclude(generator);
  var name = niceGfxName(block, 'VAR', 'ui');
  var callback = 'ailyNiceGfxEvent_' + niceGfxIdentifier(block.id || 'handler');
  var body = generator.statementToCode(block, 'DO') || '';
  generator.addFunction(callback, 'void ' + callback + '(void *, nice_gfx::htmlui::Event &ng_event) {\n' + body + '}\n');
  var eventType = block.getFieldValue('EVENT') || 'Click';
  var target = eventType === 'RouteChange' ? '0' : niceGfxUiId(block, generator);
  generator.addSetupEnd(callback, name + '.on(' + target + ', nice_gfx::htmlui::EventType::' + eventType + ', ' + callback + ');');
  return '';
};
Arduino.forBlock['nice_gfx_ui_event_value'] = function(block, generator) {
  var parent = block.getSurroundParent && block.getSurroundParent();
  while (parent && parent.type !== 'nice_gfx_ui_on') parent = parent.getSurroundParent && parent.getSurroundParent();
  if (!parent) {
    if (block.setWarningText) block.setWarningText('NICE_GFX event data must be used inside a UI event block');
    return ['0', generator.ORDER_ATOMIC];
  }
  if (block.setWarningText) block.setWarningText(null);
  return ['ng_event.' + (block.getFieldValue('PROP') || 'value'), generator.ORDER_MEMBER];
};
