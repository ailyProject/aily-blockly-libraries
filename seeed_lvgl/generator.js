function seeedLvglAtomicOrder(generator) {
  return generator.ORDER_ATOMIC || Arduino.ORDER_ATOMIC || 0;
}

function seeedLvglFunctionOrder(generator) {
  return generator.ORDER_FUNCTION_CALL || Arduino.ORDER_FUNCTION_CALL || seeedLvglAtomicOrder(generator);
}

function seeedLvglValue(block, generator, name, fallback) {
  const value = generator.valueToCode(block, name, seeedLvglAtomicOrder(generator));
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value === 'string') return value.replace(/^\(([-+\w.]+)\)$/, '$1');
  return value;
}

function seeedLvglVariableText(block, name, fallback) {
  const field = block.getField(name);
  return field ? field.getText() : fallback;
}

function seeedLvglSanitizeName(name, fallback) {
  const rawName = (name || fallback || 'item').toString().trim();
  const safeName = rawName.replace(/[^A-Za-z0-9_]/g, '_');
  return /^[A-Za-z_]/.test(safeName) ? safeName : '_' + safeName;
}

function seeedLvglAttachVariableMonitor(block, fieldName, varType, fallback, monitorKey) {
  if (!block._varMonitorAttached) block._varMonitorAttached = {};
  if (block._varMonitorAttached[monitorKey]) return;
  block._varMonitorAttached[monitorKey] = true;
  block._varMonitorLastName = block._varMonitorLastName || {};
  block._varMonitorLastName[monitorKey] = block.getFieldValue(fieldName) || fallback;

  registerVariableToBlockly(block._varMonitorLastName[monitorKey], varType);
  const varField = block.getField(fieldName);
  if (!varField) return;

  const originalFinishEditing = varField.onFinishEditing_;
  varField.onFinishEditing_ = function(newName) {
    if (typeof originalFinishEditing === 'function') originalFinishEditing.call(this, newName);
    const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
    const oldName = block._varMonitorLastName[monitorKey];
    if (workspace && newName && newName !== oldName) {
      renameVariableInBlockly(block, oldName, newName, varType);
      block._varMonitorLastName[monitorKey] = newName;
    }
  };
}

function seeedLvglIsESP32Core() {
  const boardConfig = window['boardConfig'];
  return !!(boardConfig && boardConfig.core && boardConfig.core.indexOf('esp32') > -1);
}

function seeedLvglEnsureSerial(generator) {
  if (typeof ensureSerialBegin === 'function') {
    ensureSerialBegin('Serial', generator, 115200);
  } else if (generator.addSetup) {
    generator.addSetup('seeed_lvgl_serial', 'Serial.begin(115200);');
  }
}

function seeedGfxEnsureLibrary(generator) {
  generator.addLibrary('seeed_gfx', '#include <TFT_eSPI.h>');
}

function seeedLvglEnsureLibrary(generator) {
  generator.addLibrary('seeed_lvgl', '#include <lvgl.h>');
}

function seeedGfxAddMacro(generator, id, code, projectMacro) {
  generator.addMacro(id, code);
  if (window['projectService'] && projectMacro) {
    window['projectService'].addMacro(projectMacro).catch(err => console.error('Failed to add macro:', projectMacro, err));
  }
}

function seeedColourToRgb565(hexColour) {
  const hex = (hexColour || '#ffffff').replace('#', '');
  const redValue = parseInt(hex.substring(0, 2), 16);
  const greenValue = parseInt(hex.substring(2, 4), 16);
  const blueValue = parseInt(hex.substring(4, 6), 16);
  const rgb565 = ((redValue & 0xF8) << 8) | ((greenValue & 0xFC) << 3) | (blueValue >> 3);
  return '0x' + rgb565.toString(16).toUpperCase().padStart(4, '0');
}

function seeedColourToLvgl(hexColour) {
  const hex = (hexColour || '#ffffff').replace('#', '');
  const redValue = parseInt(hex.substring(0, 2), 16);
  const greenValue = parseInt(hex.substring(2, 4), 16);
  const blueValue = parseInt(hex.substring(4, 6), 16);
  return 'lv_color_make(' + redValue + ', ' + greenValue + ', ' + blueValue + ')';
}

function seeedLvglCreateObject(block, generator, blockDefaultName, varType, constructorCode) {
  seeedLvglAttachVariableMonitor(block, 'VAR', varType, blockDefaultName, block.type);
  const varName = seeedLvglSanitizeName(block.getFieldValue('VAR'), blockDefaultName);
  const scope = block.getFieldValue('SCOPE') || 'global';
  const parent = seeedLvglVariableText(block, 'PARENT', 'screen');
  seeedLvglEnsureLibrary(generator);

  const createCode = constructorCode.replace('{parent}', parent);
  if (scope === 'global') {
    generator.addVariable(varName, 'lv_obj_t * ' + varName + ';');
    return varName + ' = ' + createCode + ';\n';
  }
  return 'lv_obj_t * ' + varName + ' = ' + createCode + ';\n';
}

Arduino.forBlock['seeed_gfx_setup'] = function(block, generator) {
  seeedLvglAttachVariableMonitor(block, 'VAR', 'TFT_eSPI', 'tft', 'seeed_gfx_setup');
  const varName = seeedLvglSanitizeName(block.getFieldValue('VAR'), 'tft');
  const model = block.getFieldValue('MODEL') || 'ST7789_DRIVER';
  const frequency = block.getFieldValue('FREQUENCY') || '27000000';
  const width = seeedLvglValue(block, generator, 'WIDTH', '240');
  const height = seeedLvglValue(block, generator, 'HEIGHT', '240');
  const miso = seeedLvglValue(block, generator, 'MISO', '-1');
  const mosi = seeedLvglValue(block, generator, 'MOSI', '-1');
  const sclk = seeedLvglValue(block, generator, 'SCLK', '-1');
  const cs = seeedLvglValue(block, generator, 'CS', '-1');
  const dc = seeedLvglValue(block, generator, 'DC', '-1');
  const rst = seeedLvglValue(block, generator, 'RST', '-1');
  const bl = seeedLvglValue(block, generator, 'BL', '-1');
  const blLevel = block.getFieldValue('BL_LEVEL') || 'HIGH';
  const colorMode = block.getFieldValue('COLOR_MODE') || 'TFT_RGB';
  const rotation = block.getFieldValue('ROTATION') || '0';

  seeedGfxAddMacro(generator, 'SEEED_GFX_MODEL', '#define ' + model, model);
  seeedGfxAddMacro(generator, 'SEEED_GFX_WIDTH', '#define TFT_WIDTH ' + width, 'TFT_WIDTH=' + width);
  seeedGfxAddMacro(generator, 'SEEED_GFX_HEIGHT', '#define TFT_HEIGHT ' + height, 'TFT_HEIGHT=' + height);
  seeedGfxAddMacro(generator, 'SEEED_GFX_SPI_FREQUENCY', '#define SPI_FREQUENCY ' + frequency, 'SPI_FREQUENCY=' + frequency);
  seeedGfxAddMacro(generator, 'SEEED_GFX_MISO', '#define TFT_MISO ' + miso, 'TFT_MISO=' + miso);
  seeedGfxAddMacro(generator, 'SEEED_GFX_MOSI', '#define TFT_MOSI ' + mosi, 'TFT_MOSI=' + mosi);
  seeedGfxAddMacro(generator, 'SEEED_GFX_SCLK', '#define TFT_SCLK ' + sclk, 'TFT_SCLK=' + sclk);
  seeedGfxAddMacro(generator, 'SEEED_GFX_CS', '#define TFT_CS ' + cs, 'TFT_CS=' + cs);
  seeedGfxAddMacro(generator, 'SEEED_GFX_DC', '#define TFT_DC ' + dc, 'TFT_DC=' + dc);
  seeedGfxAddMacro(generator, 'SEEED_GFX_RST', '#define TFT_RST ' + rst, 'TFT_RST=' + rst);
  seeedGfxAddMacro(generator, 'SEEED_GFX_BL', '#define TFT_BL ' + bl, 'TFT_BL=' + bl);
  seeedGfxAddMacro(generator, 'SEEED_GFX_BACKLIGHT', '#define TFT_BACKLIGHT_ON ' + blLevel, 'TFT_BACKLIGHT_ON=' + blLevel);
  seeedGfxAddMacro(generator, 'SEEED_GFX_RGB_ORDER', '#define TFT_RGB_ORDER ' + colorMode, 'TFT_RGB_ORDER=' + colorMode);
  if (seeedLvglIsESP32Core()) seeedGfxAddMacro(generator, 'SEEED_GFX_USE_HSPI', '#define USE_HSPI_PORT', 'USE_HSPI_PORT');

  seeedGfxEnsureLibrary(generator);
  generator.addVariable(varName, 'TFT_eSPI ' + varName + ' = TFT_eSPI();');
  return varName + '.init();\n' + varName + '.setRotation(' + rotation + ');\n';
};

Arduino.forBlock['seeed_gfx_set_rotation'] = function(block) {
  const varName = seeedLvglVariableText(block, 'VAR', 'tft');
  const rotation = block.getFieldValue('ROTATION') || '0';
  return varName + '.setRotation(' + rotation + ');\n';
};

Arduino.forBlock['seeed_gfx_invert_display'] = function(block) {
  const varName = seeedLvglVariableText(block, 'VAR', 'tft');
  const invert = block.getFieldValue('INVERT') || 'false';
  return varName + '.invertDisplay(' + invert + ');\n';
};

Arduino.forBlock['seeed_gfx_fill_screen'] = function(block, generator) {
  const varName = seeedLvglVariableText(block, 'VAR', 'tft');
  const color = seeedLvglValue(block, generator, 'COLOR', 'TFT_BLACK');
  return varName + '.fillScreen(' + color + ');\n';
};

Arduino.forBlock['seeed_gfx_draw_pixel'] = function(block, generator) {
  const varName = seeedLvglVariableText(block, 'VAR', 'tft');
  const xValue = seeedLvglValue(block, generator, 'X', '0');
  const yValue = seeedLvglValue(block, generator, 'Y', '0');
  const color = seeedLvglValue(block, generator, 'COLOR', 'TFT_WHITE');
  return varName + '.drawPixel(' + xValue + ', ' + yValue + ', ' + color + ');\n';
};

Arduino.forBlock['seeed_gfx_draw_line'] = function(block, generator) {
  const varName = seeedLvglVariableText(block, 'VAR', 'tft');
  const x1 = seeedLvglValue(block, generator, 'X1', '0');
  const y1 = seeedLvglValue(block, generator, 'Y1', '0');
  const x2 = seeedLvglValue(block, generator, 'X2', '100');
  const y2 = seeedLvglValue(block, generator, 'Y2', '100');
  const color = seeedLvglValue(block, generator, 'COLOR', 'TFT_WHITE');
  return varName + '.drawLine(' + x1 + ', ' + y1 + ', ' + x2 + ', ' + y2 + ', ' + color + ');\n';
};

function seeedGfxRectCode(block, generator, methodName, includeRadius) {
  const varName = seeedLvglVariableText(block, 'VAR', 'tft');
  const xValue = seeedLvglValue(block, generator, 'X', '0');
  const yValue = seeedLvglValue(block, generator, 'Y', '0');
  const width = seeedLvglValue(block, generator, 'W', '50');
  const height = seeedLvglValue(block, generator, 'H', '50');
  const radius = includeRadius ? seeedLvglValue(block, generator, 'RADIUS', '8') + ', ' : '';
  const color = seeedLvglValue(block, generator, 'COLOR', 'TFT_WHITE');
  return varName + '.' + methodName + '(' + xValue + ', ' + yValue + ', ' + width + ', ' + height + ', ' + radius + color + ');\n';
}

Arduino.forBlock['seeed_gfx_draw_rect'] = (block, generator) => seeedGfxRectCode(block, generator, 'drawRect', false);
Arduino.forBlock['seeed_gfx_fill_rect'] = (block, generator) => seeedGfxRectCode(block, generator, 'fillRect', false);
Arduino.forBlock['seeed_gfx_draw_round_rect'] = (block, generator) => seeedGfxRectCode(block, generator, 'drawRoundRect', true);
Arduino.forBlock['seeed_gfx_fill_round_rect'] = (block, generator) => seeedGfxRectCode(block, generator, 'fillRoundRect', true);

function seeedGfxCircleCode(block, generator, methodName) {
  const varName = seeedLvglVariableText(block, 'VAR', 'tft');
  const xValue = seeedLvglValue(block, generator, 'X', '40');
  const yValue = seeedLvglValue(block, generator, 'Y', '40');
  const radius = seeedLvglValue(block, generator, 'RADIUS', '20');
  const color = seeedLvglValue(block, generator, 'COLOR', 'TFT_WHITE');
  return varName + '.' + methodName + '(' + xValue + ', ' + yValue + ', ' + radius + ', ' + color + ');\n';
}

Arduino.forBlock['seeed_gfx_draw_circle'] = (block, generator) => seeedGfxCircleCode(block, generator, 'drawCircle');
Arduino.forBlock['seeed_gfx_fill_circle'] = (block, generator) => seeedGfxCircleCode(block, generator, 'fillCircle');

function seeedGfxTriangleCode(block, generator, methodName) {
  const varName = seeedLvglVariableText(block, 'VAR', 'tft');
  const x1 = seeedLvglValue(block, generator, 'X1', '20');
  const y1 = seeedLvglValue(block, generator, 'Y1', '10');
  const x2 = seeedLvglValue(block, generator, 'X2', '5');
  const y2 = seeedLvglValue(block, generator, 'Y2', '50');
  const x3 = seeedLvglValue(block, generator, 'X3', '60');
  const y3 = seeedLvglValue(block, generator, 'Y3', '50');
  const color = seeedLvglValue(block, generator, 'COLOR', 'TFT_WHITE');
  return varName + '.' + methodName + '(' + x1 + ', ' + y1 + ', ' + x2 + ', ' + y2 + ', ' + x3 + ', ' + y3 + ', ' + color + ');\n';
}

Arduino.forBlock['seeed_gfx_draw_triangle'] = (block, generator) => seeedGfxTriangleCode(block, generator, 'drawTriangle');
Arduino.forBlock['seeed_gfx_fill_triangle'] = (block, generator) => seeedGfxTriangleCode(block, generator, 'fillTriangle');

Arduino.forBlock['seeed_gfx_set_text_style'] = function(block, generator) {
  const varName = seeedLvglVariableText(block, 'VAR', 'tft');
  const textColor = seeedLvglValue(block, generator, 'TEXT_COLOR', 'TFT_WHITE');
  const backgroundColor = seeedLvglValue(block, generator, 'BG_COLOR', 'TFT_BLACK');
  const size = block.getFieldValue('SIZE') || '1';
  const font = block.getFieldValue('FONT') || '1';
  return varName + '.setTextColor(' + textColor + ', ' + backgroundColor + ');\n' + varName + '.setTextSize(' + size + ');\n' + varName + '.setTextFont(' + font + ');\n';
};

Arduino.forBlock['seeed_gfx_draw_string'] = function(block, generator) {
  const varName = seeedLvglVariableText(block, 'VAR', 'tft');
  const xValue = seeedLvglValue(block, generator, 'X', '0');
  const yValue = seeedLvglValue(block, generator, 'Y', '0');
  const text = seeedLvglValue(block, generator, 'TEXT', '"Hello"');
  return varName + '.drawString(' + text + ', ' + xValue + ', ' + yValue + ');\n';
};

Arduino.forBlock['seeed_gfx_set_cursor'] = function(block, generator) {
  const varName = seeedLvglVariableText(block, 'VAR', 'tft');
  const xValue = seeedLvglValue(block, generator, 'X', '0');
  const yValue = seeedLvglValue(block, generator, 'Y', '0');
  return varName + '.setCursor(' + xValue + ', ' + yValue + ');\n';
};

Arduino.forBlock['seeed_gfx_print'] = function(block, generator) {
  const varName = seeedLvglVariableText(block, 'VAR', 'tft');
  const text = seeedLvglValue(block, generator, 'TEXT', '"Hello"');
  const newLine = block.getFieldValue('NEWLINE') === 'true';
  return varName + (newLine ? '.println(' : '.print(') + text + ');\n';
};

Arduino.forBlock['seeed_gfx_color'] = function(block, generator) {
  const color = block.getFieldValue('COLOR') || 'TFT_WHITE';
  return [color, seeedLvglAtomicOrder(generator)];
};

Arduino.forBlock['seeed_gfx_color_rgb'] = function(block, generator) {
  return [seeedColourToRgb565(block.getFieldValue('COLOR')), seeedLvglAtomicOrder(generator)];
};

Arduino.forBlock['seeed_gfx_width'] = function(block, generator) {
  const varName = seeedLvglVariableText(block, 'VAR', 'tft');
  return [varName + '.width()', seeedLvglFunctionOrder(generator)];
};

Arduino.forBlock['seeed_gfx_height'] = function(block, generator) {
  const varName = seeedLvglVariableText(block, 'VAR', 'tft');
  return [varName + '.height()', seeedLvglFunctionOrder(generator)];
};

Arduino.forBlock['seeed_gfx_read_touch'] = function(block, generator) {
  const varName = seeedLvglVariableText(block, 'VAR', 'tft');
  const xName = seeedLvglSanitizeName(block.getFieldValue('XVAR'), 'touchX');
  const yName = seeedLvglSanitizeName(block.getFieldValue('YVAR'), 'touchY');
  const touchedName = seeedLvglSanitizeName(block.getFieldValue('TOUCHVAR'), 'touched');
  const threshold = seeedLvglValue(block, generator, 'THRESHOLD', '600');
  registerVariableToBlockly(xName, 'uint16_t');
  registerVariableToBlockly(yName, 'uint16_t');
  registerVariableToBlockly(touchedName, 'bool');
  generator.addVariable(xName, 'uint16_t ' + xName + ' = 0;');
  generator.addVariable(yName, 'uint16_t ' + yName + ' = 0;');
  generator.addVariable(touchedName, 'bool ' + touchedName + ' = false;');
  return touchedName + ' = ' + varName + '.getTouch(&' + xName + ', &' + yName + ', ' + threshold + ');\n';
};

Arduino.forBlock['seeed_gfx_touch_pressed'] = function(block, generator) {
  const varName = seeedLvglVariableText(block, 'VAR', 'tft');
  const threshold = seeedLvglValue(block, generator, 'THRESHOLD', '600');
  generator.addVariable('seeed_gfx_touch_x', 'uint16_t seeed_gfx_touch_x = 0;');
  generator.addVariable('seeed_gfx_touch_y', 'uint16_t seeed_gfx_touch_y = 0;');
  return [varName + '.getTouch(&seeed_gfx_touch_x, &seeed_gfx_touch_y, ' + threshold + ')', seeedLvglFunctionOrder(generator)];
};

Arduino.forBlock['seeed_gfx_sprite_create'] = function(block, generator) {
  seeedLvglAttachVariableMonitor(block, 'VAR', 'TFT_eSprite', 'sprite', 'seeed_gfx_sprite_create');
  const spriteName = seeedLvglSanitizeName(block.getFieldValue('VAR'), 'sprite');
  const tftName = seeedLvglVariableText(block, 'TFT', 'tft');
  const width = seeedLvglValue(block, generator, 'WIDTH', '80');
  const height = seeedLvglValue(block, generator, 'HEIGHT', '80');
  const depth = block.getFieldValue('DEPTH') || '16';
  seeedGfxEnsureLibrary(generator);
  generator.addVariable(spriteName, 'TFT_eSprite ' + spriteName + ' = TFT_eSprite(&' + tftName + ');');
  return spriteName + '.setColorDepth(' + depth + ');\n' + spriteName + '.createSprite(' + width + ', ' + height + ');\n';
};

Arduino.forBlock['seeed_gfx_sprite_set_depth'] = function(block) {
  const spriteName = seeedLvglVariableText(block, 'VAR', 'sprite');
  const depth = block.getFieldValue('DEPTH') || '16';
  return spriteName + '.setColorDepth(' + depth + ');\n';
};

Arduino.forBlock['seeed_gfx_sprite_fill'] = function(block, generator) {
  const spriteName = seeedLvglVariableText(block, 'VAR', 'sprite');
  const color = seeedLvglValue(block, generator, 'COLOR', 'TFT_BLACK');
  return spriteName + '.fillSprite(' + color + ');\n';
};

Arduino.forBlock['seeed_gfx_sprite_push'] = function(block, generator) {
  const spriteName = seeedLvglVariableText(block, 'VAR', 'sprite');
  const xValue = seeedLvglValue(block, generator, 'X', '0');
  const yValue = seeedLvglValue(block, generator, 'Y', '0');
  return spriteName + '.pushSprite(' + xValue + ', ' + yValue + ');\n';
};

Arduino.forBlock['seeed_gfx_sprite_delete'] = function(block) {
  const spriteName = seeedLvglVariableText(block, 'VAR', 'sprite');
  return spriteName + '.deleteSprite();\n';
};

Arduino.forBlock['seeed_gfx_epaper_setup'] = function(block, generator) {
  seeedLvglAttachVariableMonitor(block, 'VAR', 'EPaper', 'epaper', 'seeed_gfx_epaper_setup');
  const varName = seeedLvglSanitizeName(block.getFieldValue('VAR'), 'epaper');
  const wake = block.getFieldValue('WAKE') || '0';
  seeedGfxAddMacro(generator, 'SEEED_GFX_EPAPER_ENABLE', '#define EPAPER_ENABLE', 'EPAPER_ENABLE');
  seeedGfxEnsureLibrary(generator);
  generator.addVariable(varName, 'EPaper ' + varName + ';');
  return varName + '.begin(' + wake + ');\n';
};

Arduino.forBlock['seeed_gfx_epaper_update'] = function(block) {
  const varName = seeedLvglVariableText(block, 'VAR', 'epaper');
  return varName + '.update();\n';
};

Arduino.forBlock['seeed_gfx_epaper_sleep'] = function(block) {
  const varName = seeedLvglVariableText(block, 'VAR', 'epaper');
  return varName + '.sleep();\n';
};

Arduino.forBlock['seeed_gfx_epaper_wake'] = function(block) {
  const varName = seeedLvglVariableText(block, 'VAR', 'epaper');
  return varName + '.wake();\n';
};

Arduino.forBlock['seeed_gfx_epaper_partial_update'] = function(block, generator) {
  const varName = seeedLvglVariableText(block, 'VAR', 'epaper');
  const xValue = seeedLvglValue(block, generator, 'X', '0');
  const yValue = seeedLvglValue(block, generator, 'Y', '0');
  const width = seeedLvglValue(block, generator, 'W', '80');
  const height = seeedLvglValue(block, generator, 'H', '40');
  return varName + '.updataPartial(' + xValue + ', ' + yValue + ', ' + width + ', ' + height + ');\n';
};

Arduino.forBlock['seeed_lvgl_init'] = function(block, generator) {
  const tftName = seeedLvglVariableText(block, 'TFT', 'tft');
  const width = seeedLvglValue(block, generator, 'WIDTH', '320');
  const height = seeedLvglValue(block, generator, 'HEIGHT', '240');
  const rotation = block.getFieldValue('ROTATION') || '3';
  const bufferLines = seeedLvglValue(block, generator, 'BUFFER_LINES', '10');
  const tickMs = seeedLvglValue(block, generator, 'TICK_MS', '5');

  seeedGfxEnsureLibrary(generator);
  seeedLvglEnsureLibrary(generator);
  seeedLvglEnsureSerial(generator);
  generator.addVariable('seeed_lvgl_disp_buf', 'static lv_disp_buf_t seeed_lvgl_disp_buf;');
  generator.addVariable('seeed_lvgl_buf', 'static lv_color_t seeed_lvgl_buf[' + width + ' * ' + bufferLines + '];');
  generator.addFunction('seeed_lvgl_disp_flush', 'void seeed_lvgl_disp_flush(lv_disp_drv_t * disp, const lv_area_t * area, lv_color_t * color_p) {\n  ' + tftName + '.startWrite();\n  ' + tftName + '.setAddrWindow(area->x1, area->y1, area->x2 - area->x1 + 1, area->y2 - area->y1 + 1);\n  for (int16_t row = area->y1; row <= area->y2; row++) {\n    for (int16_t col = area->x1; col <= area->x2; col++) {\n      ' + tftName + '.writeColor(color_p->full, 1);\n      color_p++;\n    }\n  }\n  ' + tftName + '.endWrite();\n  lv_disp_flush_ready(disp);\n}\n');
  generator.addLoopBegin('seeed_lvgl_task', 'lv_tick_inc(' + tickMs + ');\nlv_task_handler();\ndelay(' + tickMs + ');');

  let code = '';
  code += 'lv_init();\n';
  code += tftName + '.begin();\n';
  code += tftName + '.setRotation(' + rotation + ');\n';
  code += 'lv_disp_buf_init(&seeed_lvgl_disp_buf, seeed_lvgl_buf, NULL, ' + width + ' * ' + bufferLines + ');\n';
  code += 'lv_disp_drv_t seeed_lvgl_disp_drv;\n';
  code += 'lv_disp_drv_init(&seeed_lvgl_disp_drv);\n';
  code += 'seeed_lvgl_disp_drv.hor_res = ' + width + ';\n';
  code += 'seeed_lvgl_disp_drv.ver_res = ' + height + ';\n';
  code += 'seeed_lvgl_disp_drv.flush_cb = seeed_lvgl_disp_flush;\n';
  code += 'seeed_lvgl_disp_drv.buffer = &seeed_lvgl_disp_buf;\n';
  code += 'lv_disp_drv_register(&seeed_lvgl_disp_drv);\n';
  return code;
};

Arduino.forBlock['seeed_lvgl_touch_input_create'] = function(block, generator) {
  seeedLvglAttachVariableMonitor(block, 'VAR', 'lv_indev_t', 'indev', 'seeed_lvgl_touch_input_create');
  const indevName = seeedLvglSanitizeName(block.getFieldValue('VAR'), 'indev');
  const tftName = seeedLvglVariableText(block, 'TFT', 'tft');
  const threshold = seeedLvglValue(block, generator, 'THRESHOLD', '600');
  const callbackName = indevName + '_read_cb';
  seeedLvglEnsureLibrary(generator);
  generator.addVariable(indevName, 'lv_indev_t * ' + indevName + ';');
  generator.addFunction(callbackName, 'bool ' + callbackName + '(lv_indev_drv_t * indev_drv, lv_indev_data_t * data) {\n  static uint16_t touchX = 0;\n  static uint16_t touchY = 0;\n  if (' + tftName + '.getTouch(&touchX, &touchY, ' + threshold + ')) {\n    data->state = LV_INDEV_STATE_PR;\n    data->point.x = touchX;\n    data->point.y = touchY;\n  } else {\n    data->state = LV_INDEV_STATE_REL;\n  }\n  return false;\n}\n');
  return 'lv_indev_drv_t ' + indevName + '_drv;\nlv_indev_drv_init(&' + indevName + '_drv);\n' + indevName + '_drv.type = LV_INDEV_TYPE_POINTER;\n' + indevName + '_drv.read_cb = ' + callbackName + ';\n' + indevName + ' = lv_indev_drv_register(&' + indevName + '_drv);\n';
};

Arduino.forBlock['seeed_lvgl_screen_create'] = function(block, generator) {
  seeedLvglAttachVariableMonitor(block, 'VAR', 'lv_obj_t', 'screen', 'seeed_lvgl_screen_create');
  const varName = seeedLvglSanitizeName(block.getFieldValue('VAR'), 'screen');
  seeedLvglEnsureLibrary(generator);
  generator.addVariable(varName, 'lv_obj_t * ' + varName + ';');
  return varName + ' = lv_obj_create(NULL, NULL);\n';
};

Arduino.forBlock['seeed_lvgl_screen_load'] = function(block, generator) {
  const varName = seeedLvglVariableText(block, 'VAR', 'screen');
  seeedLvglEnsureLibrary(generator);
  return 'lv_scr_load(' + varName + ');\n';
};

Arduino.forBlock['seeed_lvgl_active_screen'] = function(block, generator) {
  seeedLvglEnsureLibrary(generator);
  return ['lv_scr_act()', seeedLvglFunctionOrder(generator)];
};

Arduino.forBlock['seeed_lvgl_obj_set_pos'] = function(block, generator) {
  const varName = seeedLvglVariableText(block, 'VAR', 'obj');
  const xValue = seeedLvglValue(block, generator, 'X', '0');
  const yValue = seeedLvglValue(block, generator, 'Y', '0');
  return 'lv_obj_set_pos(' + varName + ', ' + xValue + ', ' + yValue + ');\n';
};

Arduino.forBlock['seeed_lvgl_obj_set_size'] = function(block, generator) {
  const varName = seeedLvglVariableText(block, 'VAR', 'obj');
  const width = seeedLvglValue(block, generator, 'W', '100');
  const height = seeedLvglValue(block, generator, 'H', '40');
  return 'lv_obj_set_size(' + varName + ', ' + width + ', ' + height + ');\n';
};

Arduino.forBlock['seeed_lvgl_obj_align'] = function(block, generator) {
  const varName = seeedLvglVariableText(block, 'VAR', 'obj');
  const align = block.getFieldValue('ALIGN') || 'LV_ALIGN_CENTER';
  const xOffset = seeedLvglValue(block, generator, 'X', '0');
  const yOffset = seeedLvglValue(block, generator, 'Y', '0');
  return 'lv_obj_align(' + varName + ', NULL, ' + align + ', ' + xOffset + ', ' + yOffset + ');\n';
};

Arduino.forBlock['seeed_lvgl_obj_set_hidden'] = function(block) {
  const varName = seeedLvglVariableText(block, 'VAR', 'obj');
  const hidden = block.getFieldValue('HIDDEN') || 'true';
  return 'lv_obj_set_hidden(' + varName + ', ' + hidden + ');\n';
};

Arduino.forBlock['seeed_lvgl_obj_delete'] = function(block) {
  const varName = seeedLvglVariableText(block, 'VAR', 'obj');
  return 'lv_obj_del(' + varName + ');\n';
};

Arduino.forBlock['seeed_lvgl_obj_set_event'] = function(block, generator) {
  const varName = seeedLvglVariableText(block, 'VAR', 'obj');
  const eventName = block.getFieldValue('EVENT') || 'LV_EVENT_CLICKED';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const handlerName = seeedLvglSanitizeName(varName + '_' + eventName.toLowerCase() + '_cb', 'obj_event_cb');
  generator.addFunction(handlerName, 'void ' + handlerName + '(lv_obj_t * obj, lv_event_t event) {\n  if (event == ' + eventName + ') {\n' + handlerCode + '  }\n}\n');
  return 'lv_obj_set_event_cb(' + varName + ', ' + handlerName + ');\n';
};

Arduino.forBlock['seeed_lvgl_label_create'] = (block, generator) => seeedLvglCreateObject(block, generator, 'label', 'lv_obj_t', 'lv_label_create({parent}, NULL)');

Arduino.forBlock['seeed_lvgl_label_set_text'] = function(block, generator) {
  const varName = seeedLvglVariableText(block, 'VAR', 'label');
  const text = seeedLvglValue(block, generator, 'TEXT', '"Hello LVGL"');
  return 'lv_label_set_text(' + varName + ', ' + text + ');\n';
};

Arduino.forBlock['seeed_lvgl_label_set_long_mode'] = function(block) {
  const varName = seeedLvglVariableText(block, 'VAR', 'label');
  const mode = block.getFieldValue('MODE') || 'LV_LABEL_LONG_BREAK';
  return 'lv_label_set_long_mode(' + varName + ', ' + mode + ');\n';
};

Arduino.forBlock['seeed_lvgl_button_create'] = (block, generator) => seeedLvglCreateObject(block, generator, 'btn', 'lv_obj_t', 'lv_btn_create({parent}, NULL)');
Arduino.forBlock['seeed_lvgl_slider_create'] = (block, generator) => seeedLvglCreateObject(block, generator, 'slider', 'lv_obj_t', 'lv_slider_create({parent}, NULL)');
Arduino.forBlock['seeed_lvgl_bar_create'] = (block, generator) => seeedLvglCreateObject(block, generator, 'bar', 'lv_obj_t', 'lv_bar_create({parent}, NULL)');
Arduino.forBlock['seeed_lvgl_switch_create'] = (block, generator) => seeedLvglCreateObject(block, generator, 'sw', 'lv_obj_t', 'lv_switch_create({parent}, NULL)');

Arduino.forBlock['seeed_lvgl_slider_set_range'] = function(block, generator) {
  const varName = seeedLvglVariableText(block, 'VAR', 'slider');
  const minValue = seeedLvglValue(block, generator, 'MIN', '0');
  const maxValue = seeedLvglValue(block, generator, 'MAX', '100');
  return 'lv_slider_set_range(' + varName + ', ' + minValue + ', ' + maxValue + ');\n';
};

Arduino.forBlock['seeed_lvgl_slider_set_value'] = function(block, generator) {
  const varName = seeedLvglVariableText(block, 'VAR', 'slider');
  const value = seeedLvglValue(block, generator, 'VALUE', '50');
  const anim = block.getFieldValue('ANIM') || 'LV_ANIM_OFF';
  return 'lv_slider_set_value(' + varName + ', ' + value + ', ' + anim + ');\n';
};

Arduino.forBlock['seeed_lvgl_slider_get_value'] = function(block, generator) {
  const varName = seeedLvglVariableText(block, 'VAR', 'slider');
  return ['lv_slider_get_value(' + varName + ')', seeedLvglFunctionOrder(generator)];
};

Arduino.forBlock['seeed_lvgl_bar_set_range'] = function(block, generator) {
  const varName = seeedLvglVariableText(block, 'VAR', 'bar');
  const minValue = seeedLvglValue(block, generator, 'MIN', '0');
  const maxValue = seeedLvglValue(block, generator, 'MAX', '100');
  return 'lv_bar_set_range(' + varName + ', ' + minValue + ', ' + maxValue + ');\n';
};

Arduino.forBlock['seeed_lvgl_bar_set_value'] = function(block, generator) {
  const varName = seeedLvglVariableText(block, 'VAR', 'bar');
  const value = seeedLvglValue(block, generator, 'VALUE', '50');
  const anim = block.getFieldValue('ANIM') || 'LV_ANIM_OFF';
  return 'lv_bar_set_value(' + varName + ', ' + value + ', ' + anim + ');\n';
};

Arduino.forBlock['seeed_lvgl_switch_set'] = function(block) {
  const varName = seeedLvglVariableText(block, 'VAR', 'sw');
  const state = block.getFieldValue('STATE') || 'ON';
  const anim = block.getFieldValue('ANIM') || 'LV_ANIM_OFF';
  if (state === 'TOGGLE') return 'lv_switch_toggle(' + varName + ', ' + anim + ');\n';
  return (state === 'ON' ? 'lv_switch_on' : 'lv_switch_off') + '(' + varName + ', ' + anim + ');\n';
};

Arduino.forBlock['seeed_lvgl_switch_get_state'] = function(block, generator) {
  const varName = seeedLvglVariableText(block, 'VAR', 'sw');
  return ['lv_switch_get_state(' + varName + ')', seeedLvglFunctionOrder(generator)];
};

Arduino.forBlock['seeed_lvgl_checkbox_create'] = function(block, generator) {
  const code = seeedLvglCreateObject(block, generator, 'checkbox', 'lv_obj_t', 'lv_checkbox_create({parent}, NULL)');
  const varName = seeedLvglVariableText(block, 'VAR', 'checkbox');
  const text = seeedLvglValue(block, generator, 'TEXT', '"Check"');
  return code + 'lv_checkbox_set_text(' + varName + ', ' + text + ');\n';
};

Arduino.forBlock['seeed_lvgl_image_create'] = (block, generator) => seeedLvglCreateObject(block, generator, 'img', 'lv_obj_t', 'lv_img_create({parent}, NULL)');

Arduino.forBlock['seeed_lvgl_image_set_src'] = function(block, generator) {
  const varName = seeedLvglVariableText(block, 'VAR', 'img');
  const src = seeedLvglValue(block, generator, 'SRC', '"A:/image.bin"');
  return 'lv_img_set_src(' + varName + ', ' + src + ');\n';
};

Arduino.forBlock['seeed_lvgl_image_set_transform'] = function(block, generator) {
  const varName = seeedLvglVariableText(block, 'VAR', 'img');
  const zoom = seeedLvglValue(block, generator, 'ZOOM', '256');
  const angle = seeedLvglValue(block, generator, 'ANGLE', '0');
  return 'lv_img_set_zoom(' + varName + ', ' + zoom + ');\n' + 'lv_img_set_angle(' + varName + ', ' + angle + ');\n';
};

Arduino.forBlock['seeed_lvgl_style_color'] = function(block, generator) {
  const varName = seeedLvglVariableText(block, 'VAR', 'obj');
  const part = block.getFieldValue('PART') || 'LV_OBJ_PART_MAIN';
  const state = block.getFieldValue('STATE') || 'LV_STATE_DEFAULT';
  const property = block.getFieldValue('PROPERTY') || 'bg_color';
  const color = seeedLvglValue(block, generator, 'COLOR', 'LV_COLOR_WHITE');
  return 'lv_obj_set_style_local_' + property + '(' + varName + ', ' + part + ', ' + state + ', ' + color + ');\n';
};

Arduino.forBlock['seeed_lvgl_style_number'] = function(block, generator) {
  const varName = seeedLvglVariableText(block, 'VAR', 'obj');
  const part = block.getFieldValue('PART') || 'LV_OBJ_PART_MAIN';
  const state = block.getFieldValue('STATE') || 'LV_STATE_DEFAULT';
  const property = block.getFieldValue('PROPERTY') || 'radius';
  const value = seeedLvglValue(block, generator, 'VALUE', '0');
  return 'lv_obj_set_style_local_' + property + '(' + varName + ', ' + part + ', ' + state + ', ' + value + ');\n';
};

Arduino.forBlock['seeed_lvgl_color'] = function(block, generator) {
  const color = block.getFieldValue('COLOR') || 'LV_COLOR_WHITE';
  return [color, seeedLvglAtomicOrder(generator)];
};

Arduino.forBlock['seeed_lvgl_color_rgb'] = function(block, generator) {
  return [seeedColourToLvgl(block.getFieldValue('COLOR')), seeedLvglFunctionOrder(generator)];
};
