'use strict';

const WS2812_MATRIX_TYPE = 'WS2812RGBMatrix';
const WS2812_MATRIX_DEFAULT_VAR = 'matrix';
const WS2812_MATRIX_TRANSPARENT = '0xFFFFFFFFUL';

function ws2812MatrixOrder(generator) {
  return generator.ORDER_ATOMIC || Arduino.ORDER_ATOMIC;
}

function ws2812MatrixGetBoardCore() {
  const boardConfig = typeof window !== 'undefined' ? window['boardConfig'] : null;
  return boardConfig && boardConfig.core ? boardConfig.core : '';
}

function ws2812MatrixEnsureLibrary(generator) {
  ws2812MatrixGetBoardCore();
  generator.addLibrary('Adafruit_NeoPixel', '#include <Adafruit_NeoPixel.h>');
}

function ws2812MatrixAttachVarMonitor(block) {
  if (!block._varMonitorAttached) {
    block._varMonitorAttached = true;
    block._varLastName = block.getFieldValue('VAR') || WS2812_MATRIX_DEFAULT_VAR;
    registerVariableToBlockly(block._varLastName, WS2812_MATRIX_TYPE);
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._varLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, WS2812_MATRIX_TYPE);
          block._varLastName = newName;
        }
      };
    }
  }
}

function ws2812MatrixGetVarName(block) {
  const varField = block.getField('VAR');
  return varField ? varField.getText() : WS2812_MATRIX_DEFAULT_VAR;
}

function ws2812MatrixValueToCode(block, generator, name, fallback) {
  return generator.valueToCode(block, name, ws2812MatrixOrder(generator)) || fallback;
}

function ws2812MatrixSafeInteger(value, fallback, min, max) {
  const parsed = parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    return fallback;
  }
  return Math.max(min, Math.min(max, parsed));
}

function ws2812MatrixHexToCode(hex) {
  const safeHex = /^#[0-9a-fA-F]{6}$/.test(hex || '') ? hex : '#000000';
  return '0x' + safeHex.slice(1).toUpperCase() + 'UL';
}

function ws2812MatrixPixelToCode(pixel, transparent) {
  if (typeof pixel === 'string' && /^#[0-9a-fA-F]{6}$/.test(pixel)) {
    return ws2812MatrixHexToCode(pixel);
  }
  if (pixel === 1) {
    return '0xFFFFFFUL';
  }
  return transparent ? WS2812_MATRIX_TRANSPARENT : '0x000000UL';
}

function ws2812MatrixHashText(text) {
  let hash = 5381;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) + hash) + text.charCodeAt(i);
    hash = hash >>> 0;
  }
  return hash.toString(36);
}

function ws2812MatrixNormalizeImage(value) {
  let image = value;
  if (typeof image === 'string') {
    try {
      image = JSON.parse(image);
    } catch (error) {
      image = null;
    }
  }
  const width = ws2812MatrixSafeInteger(image && image.width, 8, 1, 128);
  const height = ws2812MatrixSafeInteger(image && image.height, 8, 1, 128);
  const sourcePixels = image && Array.isArray(image.pixels) ? image.pixels : [];
  const pixels = [];
  for (let y = 0; y < height; y++) {
    const sourceRow = Array.isArray(sourcePixels[y]) ? sourcePixels[y] : [];
    const row = [];
    for (let x = 0; x < width; x++) {
      row.push(sourceRow[x] === undefined ? null : sourceRow[x]);
    }
    pixels.push(row);
  }
  return { width, height, pixels };
}

function ws2812MatrixFormatArray(values) {
  const lines = [];
  for (let i = 0; i < values.length; i += 8) {
    lines.push('  ' + values.slice(i, i + 8).join(', '));
  }
  return lines.join(',\n');
}

function ws2812MatrixEnsureCoreHelpers(generator) {
  ws2812MatrixEnsureLibrary(generator);
  generator.addFunction('ws2812MatrixCoreHelpers', `uint16_t ws2812MatrixXYToIndex(int16_t x, int16_t y, uint16_t width, uint16_t height, bool serpentine) {
  if (x < 0 || y < 0 || x >= (int16_t)width || y >= (int16_t)height) {
    return 65535;
  }
  uint16_t index = (uint16_t)y * width;
  if (serpentine && (y & 1)) {
    index += width - 1 - x;
  } else {
    index += x;
  }
  return index;
}

void ws2812MatrixSetPixelIndex(Adafruit_NeoPixel &matrix, int32_t index, uint32_t color) {
  if (index < 0 || index >= (int32_t)matrix.numPixels()) {
    return;
  }
  matrix.setPixelColor((uint16_t)index, color);
}

void ws2812MatrixSetPixel(Adafruit_NeoPixel &matrix, int16_t x, int16_t y, uint16_t width, uint16_t height, bool serpentine, uint32_t color) {
  uint16_t index = ws2812MatrixXYToIndex(x, y, width, height, serpentine);
  if (index != 65535 && index < matrix.numPixels()) {
    matrix.setPixelColor(index, color);
  }
}

uint32_t ws2812MatrixScaleColor(uint32_t color, uint8_t amount) {
  uint8_t red = (uint8_t)(((color >> 16) & 0xFF) * amount / 255);
  uint8_t green = (uint8_t)(((color >> 8) & 0xFF) * amount / 255);
  uint8_t blue = (uint8_t)((color & 0xFF) * amount / 255);
  return ((uint32_t)red << 16) | ((uint32_t)green << 8) | blue;
}`);
}

function ws2812MatrixEnsureShapeHelpers(generator) {
  ws2812MatrixEnsureCoreHelpers(generator);
  generator.addFunction('ws2812MatrixShapeHelpers', `void ws2812MatrixDrawLine(Adafruit_NeoPixel &matrix, int16_t x0, int16_t y0, int16_t x1, int16_t y1, uint16_t width, uint16_t height, bool serpentine, uint32_t color) {
  int16_t dx = abs(x1 - x0);
  int16_t sx = x0 < x1 ? 1 : -1;
  int16_t dy = -abs(y1 - y0);
  int16_t sy = y0 < y1 ? 1 : -1;
  int16_t err = dx + dy;
  while (true) {
    ws2812MatrixSetPixel(matrix, x0, y0, width, height, serpentine, color);
    if (x0 == x1 && y0 == y1) {
      break;
    }
    int16_t e2 = 2 * err;
    if (e2 >= dy) {
      err += dy;
      x0 += sx;
    }
    if (e2 <= dx) {
      err += dx;
      y0 += sy;
    }
  }
}

void ws2812MatrixDrawRect(Adafruit_NeoPixel &matrix, int16_t x, int16_t y, int16_t rectWidth, int16_t rectHeight, bool filled, uint16_t width, uint16_t height, bool serpentine, uint32_t color) {
  if (rectWidth < 0) {
    x += rectWidth;
    rectWidth = -rectWidth;
  }
  if (rectHeight < 0) {
    y += rectHeight;
    rectHeight = -rectHeight;
  }
  if (rectWidth == 0 || rectHeight == 0) {
    return;
  }
  if (filled) {
    for (int16_t row = y; row < y + rectHeight; row++) {
      ws2812MatrixDrawLine(matrix, x, row, x + rectWidth - 1, row, width, height, serpentine, color);
    }
  } else {
    ws2812MatrixDrawLine(matrix, x, y, x + rectWidth - 1, y, width, height, serpentine, color);
    ws2812MatrixDrawLine(matrix, x, y + rectHeight - 1, x + rectWidth - 1, y + rectHeight - 1, width, height, serpentine, color);
    ws2812MatrixDrawLine(matrix, x, y, x, y + rectHeight - 1, width, height, serpentine, color);
    ws2812MatrixDrawLine(matrix, x + rectWidth - 1, y, x + rectWidth - 1, y + rectHeight - 1, width, height, serpentine, color);
  }
}

void ws2812MatrixCirclePoints(Adafruit_NeoPixel &matrix, int16_t x0, int16_t y0, int16_t x, int16_t y, bool filled, uint16_t width, uint16_t height, bool serpentine, uint32_t color) {
  if (filled) {
    ws2812MatrixDrawLine(matrix, x0 - x, y0 + y, x0 + x, y0 + y, width, height, serpentine, color);
    ws2812MatrixDrawLine(matrix, x0 - x, y0 - y, x0 + x, y0 - y, width, height, serpentine, color);
    ws2812MatrixDrawLine(matrix, x0 - y, y0 + x, x0 + y, y0 + x, width, height, serpentine, color);
    ws2812MatrixDrawLine(matrix, x0 - y, y0 - x, x0 + y, y0 - x, width, height, serpentine, color);
  } else {
    ws2812MatrixSetPixel(matrix, x0 + x, y0 + y, width, height, serpentine, color);
    ws2812MatrixSetPixel(matrix, x0 - x, y0 + y, width, height, serpentine, color);
    ws2812MatrixSetPixel(matrix, x0 + x, y0 - y, width, height, serpentine, color);
    ws2812MatrixSetPixel(matrix, x0 - x, y0 - y, width, height, serpentine, color);
    ws2812MatrixSetPixel(matrix, x0 + y, y0 + x, width, height, serpentine, color);
    ws2812MatrixSetPixel(matrix, x0 - y, y0 + x, width, height, serpentine, color);
    ws2812MatrixSetPixel(matrix, x0 + y, y0 - x, width, height, serpentine, color);
    ws2812MatrixSetPixel(matrix, x0 - y, y0 - x, width, height, serpentine, color);
  }
}

void ws2812MatrixDrawCircle(Adafruit_NeoPixel &matrix, int16_t x0, int16_t y0, int16_t radius, bool filled, uint16_t width, uint16_t height, bool serpentine, uint32_t color) {
  if (radius < 0) {
    return;
  }
  int16_t x = 0;
  int16_t y = radius;
  int16_t decision = 1 - radius;
  ws2812MatrixCirclePoints(matrix, x0, y0, x, y, filled, width, height, serpentine, color);
  while (x < y) {
    x++;
    if (decision < 0) {
      decision += 2 * x + 1;
    } else {
      y--;
      decision += 2 * (x - y) + 1;
    }
    ws2812MatrixCirclePoints(matrix, x0, y0, x, y, filled, width, height, serpentine, color);
  }
}`);
}

function ws2812MatrixEnsureBitmapHelper(generator) {
  ws2812MatrixEnsureCoreHelpers(generator);
  generator.addFunction('ws2812MatrixBitmapHelper', `void ws2812MatrixDrawBitmap(Adafruit_NeoPixel &matrix, int16_t x, int16_t y, uint16_t width, uint16_t height, bool serpentine, uint16_t imageWidth, uint16_t imageHeight, const uint32_t *pixels, bool transparent) {
  for (uint16_t row = 0; row < imageHeight; row++) {
    for (uint16_t col = 0; col < imageWidth; col++) {
      uint32_t color = pixels[(uint32_t)row * imageWidth + col];
      if (transparent && color == 0xFFFFFFFFUL) {
        continue;
      }
      ws2812MatrixSetPixel(matrix, x + col, y + row, width, height, serpentine, color);
    }
  }
}`);
}

function ws2812MatrixEnsureTextHelpers(generator) {
  ws2812MatrixEnsureCoreHelpers(generator);
  generator.addObject('ws2812_matrix_font_5x7', `const uint8_t ws2812MatrixFont5x7[][5] = {
  {0x00, 0x00, 0x00, 0x00, 0x00},
  {0x3E, 0x51, 0x49, 0x45, 0x3E},
  {0x00, 0x42, 0x7F, 0x40, 0x00},
  {0x42, 0x61, 0x51, 0x49, 0x46},
  {0x21, 0x41, 0x45, 0x4B, 0x31},
  {0x18, 0x14, 0x12, 0x7F, 0x10},
  {0x27, 0x45, 0x45, 0x45, 0x39},
  {0x3C, 0x4A, 0x49, 0x49, 0x30},
  {0x01, 0x71, 0x09, 0x05, 0x03},
  {0x36, 0x49, 0x49, 0x49, 0x36},
  {0x06, 0x49, 0x49, 0x29, 0x1E},
  {0x7E, 0x11, 0x11, 0x11, 0x7E},
  {0x7F, 0x49, 0x49, 0x49, 0x36},
  {0x3E, 0x41, 0x41, 0x41, 0x22},
  {0x7F, 0x41, 0x41, 0x22, 0x1C},
  {0x7F, 0x49, 0x49, 0x49, 0x41},
  {0x7F, 0x09, 0x09, 0x09, 0x01},
  {0x3E, 0x41, 0x49, 0x49, 0x7A},
  {0x7F, 0x08, 0x08, 0x08, 0x7F},
  {0x00, 0x41, 0x7F, 0x41, 0x00},
  {0x20, 0x40, 0x41, 0x3F, 0x01},
  {0x7F, 0x08, 0x14, 0x22, 0x41},
  {0x7F, 0x40, 0x40, 0x40, 0x40},
  {0x7F, 0x02, 0x0C, 0x02, 0x7F},
  {0x7F, 0x04, 0x08, 0x10, 0x7F},
  {0x3E, 0x41, 0x41, 0x41, 0x3E},
  {0x7F, 0x09, 0x09, 0x09, 0x06},
  {0x3E, 0x41, 0x51, 0x21, 0x5E},
  {0x7F, 0x09, 0x19, 0x29, 0x46},
  {0x46, 0x49, 0x49, 0x49, 0x31},
  {0x01, 0x01, 0x7F, 0x01, 0x01},
  {0x3F, 0x40, 0x40, 0x40, 0x3F},
  {0x1F, 0x20, 0x40, 0x20, 0x1F},
  {0x3F, 0x40, 0x38, 0x40, 0x3F},
  {0x63, 0x14, 0x08, 0x14, 0x63},
  {0x07, 0x08, 0x70, 0x08, 0x07},
  {0x61, 0x51, 0x49, 0x45, 0x43},
  {0x00, 0x60, 0x60, 0x00, 0x00},
  {0x00, 0x36, 0x36, 0x00, 0x00},
  {0x08, 0x08, 0x08, 0x08, 0x08},
  {0x20, 0x10, 0x08, 0x04, 0x02},
  {0x00, 0x00, 0x5F, 0x00, 0x00},
  {0x02, 0x01, 0x51, 0x09, 0x06},
  {0x00, 0x80, 0x60, 0x00, 0x00},
  {0x08, 0x08, 0x3E, 0x08, 0x08},
  {0x14, 0x14, 0x14, 0x14, 0x14}
};`);
  generator.addFunction('ws2812MatrixTextHelpers', `int8_t ws2812MatrixFontIndex(char c) {
  if (c >= 'a' && c <= 'z') {
    c -= 32;
  }
  if (c == ' ') {
    return 0;
  }
  if (c >= '0' && c <= '9') {
    return 1 + c - '0';
  }
  if (c >= 'A' && c <= 'Z') {
    return 11 + c - 'A';
  }
  switch (c) {
    case '.': return 37;
    case ':': return 38;
    case '-': return 39;
    case '/': return 40;
    case '!': return 41;
    case '?': return 42;
    case ',': return 43;
    case '+': return 44;
    case '=': return 45;
    default: return 0;
  }
}

void ws2812MatrixDrawChar(Adafruit_NeoPixel &matrix, int16_t x, int16_t y, uint16_t width, uint16_t height, bool serpentine, char c, uint32_t color) {
  int8_t index = ws2812MatrixFontIndex(c);
  for (uint8_t col = 0; col < 5; col++) {
    uint8_t line = ws2812MatrixFont5x7[index][col];
    for (uint8_t row = 0; row < 7; row++) {
      if (line & (1 << row)) {
        ws2812MatrixSetPixel(matrix, x + col, y + row, width, height, serpentine, color);
      }
    }
  }
}

void ws2812MatrixDrawText(Adafruit_NeoPixel &matrix, int16_t x, int16_t y, uint16_t width, uint16_t height, bool serpentine, const String &text, uint32_t color) {
  int16_t cursorX = x;
  int16_t cursorY = y;
  for (uint16_t i = 0; i < text.length(); i++) {
    char c = text.charAt(i);
    if (c == '\n') {
      cursorY += 8;
      cursorX = x;
    } else {
      ws2812MatrixDrawChar(matrix, cursorX, cursorY, width, height, serpentine, c, color);
      cursorX += 6;
    }
  }
}

void ws2812MatrixScrollText(Adafruit_NeoPixel &matrix, uint16_t width, uint16_t height, bool serpentine, const String &text, uint32_t color, uint32_t background, uint16_t wait) {
  int16_t textWidth = text.length() * 6;
  for (int16_t cursor = width; cursor >= -textWidth; cursor--) {
    matrix.fill(background);
    ws2812MatrixDrawText(matrix, cursor, 0, width, height, serpentine, text, color);
    matrix.show();
    delay(wait);
  }
}`);
}

function ws2812MatrixEnsureAnimationHelpers(generator) {
  ws2812MatrixEnsureCoreHelpers(generator);
  generator.addFunction('ws2812MatrixAnimationHelpers', `void ws2812MatrixColorWipe(Adafruit_NeoPixel &matrix, uint32_t color, uint16_t wait) {
  for (uint16_t i = 0; i < matrix.numPixels(); i++) {
    matrix.setPixelColor(i, color);
    matrix.show();
    delay(wait);
  }
}

void ws2812MatrixRainbow(Adafruit_NeoPixel &matrix, uint16_t wait, uint8_t cycles) {
  uint16_t totalSteps = (uint16_t)cycles * 256;
  for (uint16_t step = 0; step < totalSteps; step++) {
    for (uint16_t i = 0; i < matrix.numPixels(); i++) {
      uint16_t pixelHue = (uint16_t)(step * 256UL + i * 65536UL / matrix.numPixels());
      matrix.setPixelColor(i, matrix.gamma32(matrix.ColorHSV(pixelHue)));
    }
    matrix.show();
    delay(wait);
  }
}

void ws2812MatrixTheaterChase(Adafruit_NeoPixel &matrix, uint32_t color, uint16_t wait, uint8_t cycles) {
  for (uint8_t cycle = 0; cycle < cycles; cycle++) {
    for (uint8_t phase = 0; phase < 3; phase++) {
      matrix.clear();
      for (uint16_t i = phase; i < matrix.numPixels(); i += 3) {
        matrix.setPixelColor(i, color);
      }
      matrix.show();
      delay(wait);
    }
  }
}

void ws2812MatrixRunEffect(Adafruit_NeoPixel &matrix, uint16_t width, uint16_t height, bool serpentine, uint8_t effect, uint32_t color, uint16_t wait, uint8_t cycles) {
  for (uint8_t cycle = 0; cycle < cycles; cycle++) {
    if (effect == 0) {
      for (uint16_t row = 0; row < height; row++) {
        matrix.clear();
        for (uint16_t col = 0; col < width; col++) {
          ws2812MatrixSetPixel(matrix, col, row, width, height, serpentine, color);
        }
        matrix.show();
        delay(wait);
      }
    } else if (effect == 1) {
      for (uint16_t col = 0; col < width; col++) {
        matrix.clear();
        for (uint16_t row = 0; row < height; row++) {
          ws2812MatrixSetPixel(matrix, col, row, width, height, serpentine, color);
        }
        matrix.show();
        delay(wait);
      }
    } else if (effect == 2) {
      uint16_t count = width * height;
      for (uint16_t i = 0; i < count; i++) {
        int32_t index = random(matrix.numPixels());
        ws2812MatrixSetPixelIndex(matrix, index, color);
        matrix.show();
        delay(wait);
        ws2812MatrixSetPixelIndex(matrix, index, 0);
      }
    } else if (effect == 3) {
      for (int16_t amount = 0; amount <= 255; amount += 5) {
        matrix.fill(ws2812MatrixScaleColor(color, amount));
        matrix.show();
        delay(wait);
      }
      for (int16_t amount = 255; amount >= 0; amount -= 5) {
        matrix.fill(ws2812MatrixScaleColor(color, amount));
        matrix.show();
        delay(wait);
      }
    } else if (effect == 4) {
      for (uint8_t phase = 0; phase < 2; phase++) {
        matrix.clear();
        for (uint16_t row = 0; row < height; row++) {
          for (uint16_t col = 0; col < width; col++) {
            if (((row + col + phase) & 1) == 0) {
              ws2812MatrixSetPixel(matrix, col, row, width, height, serpentine, color);
            }
          }
        }
        matrix.show();
        delay(wait);
      }
    }
  }
}`);
}

Arduino.forBlock['ws2812_matrix_init'] = function(block, generator) {
  ws2812MatrixAttachVarMonitor(block);
  ws2812MatrixEnsureLibrary(generator);

  const varName = block.getFieldValue('VAR') || WS2812_MATRIX_DEFAULT_VAR;
  const pin = block.getFieldValue('PIN') || '6';
  const width = ws2812MatrixSafeInteger(block.getFieldValue('WIDTH'), 8, 1, 128);
  const height = ws2812MatrixSafeInteger(block.getFieldValue('HEIGHT'), 8, 1, 128);
  const ledType = block.getFieldValue('TYPE') || 'NEO_GRB + NEO_KHZ800';
  const brightness = ws2812MatrixSafeInteger(block.getFieldValue('BRIGHTNESS'), 50, 0, 255);
  const serpentine = block.getFieldValue('SERPENTINE') === 'true' ? 'true' : 'false';

  registerVariableToBlockly(varName, WS2812_MATRIX_TYPE);
  generator.addObject(varName, 'Adafruit_NeoPixel ' + varName + '(' + width + ' * ' + height + ', ' + pin + ', ' + ledType + ');');
  generator.addObject(varName + '_ws2812_matrix_config', 'const uint16_t ' + varName + '_width = ' + width + ';\nconst uint16_t ' + varName + '_height = ' + height + ';\nconst bool ' + varName + '_serpentine = ' + serpentine + ';');

  return varName + '.begin();\n' +
    varName + '.setBrightness(' + brightness + ');\n' +
    varName + '.clear();\n' +
    varName + '.show();\n';
};

Arduino.forBlock['ws2812_matrix_show'] = function(block) {
  const varName = ws2812MatrixGetVarName(block);
  return varName + '.show();\n';
};

Arduino.forBlock['ws2812_matrix_clear'] = function(block) {
  const varName = ws2812MatrixGetVarName(block);
  let code = varName + '.clear();\n';
  if (block.getFieldValue('SHOW') === 'true') {
    code += varName + '.show();\n';
  }
  return code;
};

Arduino.forBlock['ws2812_matrix_set_brightness'] = function(block, generator) {
  const varName = ws2812MatrixGetVarName(block);
  const brightness = ws2812MatrixValueToCode(block, generator, 'BRIGHTNESS', '50');
  return varName + '.setBrightness(constrain((int)(' + brightness + '), 0, 255));\n';
};

Arduino.forBlock['ws2812_matrix_color_picker'] = function(block, generator) {
  return [ws2812MatrixHexToCode(block.getFieldValue('COLOR')), ws2812MatrixOrder(generator)];
};

Arduino.forBlock['ws2812_matrix_color_rgb'] = function(block, generator) {
  const red = ws2812MatrixValueToCode(block, generator, 'RED', '255');
  const green = ws2812MatrixValueToCode(block, generator, 'GREEN', '0');
  const blue = ws2812MatrixValueToCode(block, generator, 'BLUE', '0');
  const code = '(((uint32_t)constrain((int)(' + red + '), 0, 255) << 16) | ((uint32_t)constrain((int)(' + green + '), 0, 255) << 8) | (uint32_t)constrain((int)(' + blue + '), 0, 255))';
  return [code, ws2812MatrixOrder(generator)];
};

Arduino.forBlock['ws2812_matrix_set_pixel_xy'] = function(block, generator) {
  const varName = ws2812MatrixGetVarName(block);
  const x = ws2812MatrixValueToCode(block, generator, 'X', '0');
  const y = ws2812MatrixValueToCode(block, generator, 'Y', '0');
  const color = ws2812MatrixValueToCode(block, generator, 'COLOR', '0xFF0000UL');
  ws2812MatrixEnsureCoreHelpers(generator);
  return 'ws2812MatrixSetPixel(' + varName + ', ' + x + ', ' + y + ', ' + varName + '_width, ' + varName + '_height, ' + varName + '_serpentine, ' + color + ');\n';
};

Arduino.forBlock['ws2812_matrix_set_pixel_index'] = function(block, generator) {
  const varName = ws2812MatrixGetVarName(block);
  const index = ws2812MatrixValueToCode(block, generator, 'INDEX', '0');
  const color = ws2812MatrixValueToCode(block, generator, 'COLOR', '0xFF0000UL');
  ws2812MatrixEnsureCoreHelpers(generator);
  return 'ws2812MatrixSetPixelIndex(' + varName + ', ' + index + ', ' + color + ');\n';
};

Arduino.forBlock['ws2812_matrix_fill_color'] = function(block, generator) {
  const varName = ws2812MatrixGetVarName(block);
  const color = ws2812MatrixValueToCode(block, generator, 'COLOR', '0xFF0000UL');
  return varName + '.fill(' + color + ');\n';
};

Arduino.forBlock['ws2812_matrix_draw_image'] = function(block, generator) {
  const varName = ws2812MatrixGetVarName(block);
  const x = ws2812MatrixValueToCode(block, generator, 'X', '0');
  const y = ws2812MatrixValueToCode(block, generator, 'Y', '0');
  const transparent = block.getFieldValue('TRANSPARENT') === 'true';
  const image = ws2812MatrixNormalizeImage(block.getFieldValue('IMAGE'));
  const imageValues = [];
  for (let row = 0; row < image.height; row++) {
    for (let col = 0; col < image.width; col++) {
      imageValues.push(ws2812MatrixPixelToCode(image.pixels[row][col], transparent));
    }
  }
  const imageKey = 'ws2812_matrix_image_' + ws2812MatrixHashText(JSON.stringify({ image, transparent }));
  generator.addObject(imageKey, 'const uint32_t ' + imageKey + '[] = {\n' + ws2812MatrixFormatArray(imageValues) + '\n};');
  ws2812MatrixEnsureBitmapHelper(generator);
  return 'ws2812MatrixDrawBitmap(' + varName + ', ' + x + ', ' + y + ', ' + varName + '_width, ' + varName + '_height, ' + varName + '_serpentine, ' + image.width + ', ' + image.height + ', ' + imageKey + ', ' + (transparent ? 'true' : 'false') + ');\n';
};

Arduino.forBlock['ws2812_matrix_draw_line'] = function(block, generator) {
  const varName = ws2812MatrixGetVarName(block);
  const x0 = ws2812MatrixValueToCode(block, generator, 'X0', '0');
  const y0 = ws2812MatrixValueToCode(block, generator, 'Y0', '0');
  const x1 = ws2812MatrixValueToCode(block, generator, 'X1', '7');
  const y1 = ws2812MatrixValueToCode(block, generator, 'Y1', '7');
  const color = ws2812MatrixValueToCode(block, generator, 'COLOR', '0xFF0000UL');
  ws2812MatrixEnsureShapeHelpers(generator);
  return 'ws2812MatrixDrawLine(' + varName + ', ' + x0 + ', ' + y0 + ', ' + x1 + ', ' + y1 + ', ' + varName + '_width, ' + varName + '_height, ' + varName + '_serpentine, ' + color + ');\n';
};

Arduino.forBlock['ws2812_matrix_draw_rect'] = function(block, generator) {
  const varName = ws2812MatrixGetVarName(block);
  const x = ws2812MatrixValueToCode(block, generator, 'X', '0');
  const y = ws2812MatrixValueToCode(block, generator, 'Y', '0');
  const width = ws2812MatrixValueToCode(block, generator, 'WIDTH', '8');
  const height = ws2812MatrixValueToCode(block, generator, 'HEIGHT', '8');
  const filled = block.getFieldValue('FILL') === 'true' ? 'true' : 'false';
  const color = ws2812MatrixValueToCode(block, generator, 'COLOR', '0xFF0000UL');
  ws2812MatrixEnsureShapeHelpers(generator);
  return 'ws2812MatrixDrawRect(' + varName + ', ' + x + ', ' + y + ', ' + width + ', ' + height + ', ' + filled + ', ' + varName + '_width, ' + varName + '_height, ' + varName + '_serpentine, ' + color + ');\n';
};

Arduino.forBlock['ws2812_matrix_draw_circle'] = function(block, generator) {
  const varName = ws2812MatrixGetVarName(block);
  const x = ws2812MatrixValueToCode(block, generator, 'X', '3');
  const y = ws2812MatrixValueToCode(block, generator, 'Y', '3');
  const radius = ws2812MatrixValueToCode(block, generator, 'RADIUS', '3');
  const filled = block.getFieldValue('FILL') === 'true' ? 'true' : 'false';
  const color = ws2812MatrixValueToCode(block, generator, 'COLOR', '0xFF0000UL');
  ws2812MatrixEnsureShapeHelpers(generator);
  return 'ws2812MatrixDrawCircle(' + varName + ', ' + x + ', ' + y + ', ' + radius + ', ' + filled + ', ' + varName + '_width, ' + varName + '_height, ' + varName + '_serpentine, ' + color + ');\n';
};

Arduino.forBlock['ws2812_matrix_draw_text'] = function(block, generator) {
  const varName = ws2812MatrixGetVarName(block);
  const text = ws2812MatrixValueToCode(block, generator, 'TEXT', '"HELLO"');
  const x = ws2812MatrixValueToCode(block, generator, 'X', '0');
  const y = ws2812MatrixValueToCode(block, generator, 'Y', '0');
  const color = ws2812MatrixValueToCode(block, generator, 'COLOR', '0xFF0000UL');
  ws2812MatrixEnsureTextHelpers(generator);
  return 'ws2812MatrixDrawText(' + varName + ', ' + x + ', ' + y + ', ' + varName + '_width, ' + varName + '_height, ' + varName + '_serpentine, String(' + text + '), ' + color + ');\n';
};

Arduino.forBlock['ws2812_matrix_scroll_text'] = function(block, generator) {
  const varName = ws2812MatrixGetVarName(block);
  const text = ws2812MatrixValueToCode(block, generator, 'TEXT', '"HELLO"');
  const color = ws2812MatrixValueToCode(block, generator, 'COLOR', '0xFF0000UL');
  const background = ws2812MatrixValueToCode(block, generator, 'BACKGROUND', '0x000000UL');
  const wait = ws2812MatrixValueToCode(block, generator, 'WAIT', '80');
  ws2812MatrixEnsureTextHelpers(generator);
  return 'ws2812MatrixScrollText(' + varName + ', ' + varName + '_width, ' + varName + '_height, ' + varName + '_serpentine, String(' + text + '), ' + color + ', ' + background + ', ' + wait + ');\n';
};

Arduino.forBlock['ws2812_matrix_color_wipe'] = function(block, generator) {
  const varName = ws2812MatrixGetVarName(block);
  const color = ws2812MatrixValueToCode(block, generator, 'COLOR', '0xFF0000UL');
  const wait = ws2812MatrixValueToCode(block, generator, 'WAIT', '30');
  ws2812MatrixEnsureAnimationHelpers(generator);
  return 'ws2812MatrixColorWipe(' + varName + ', ' + color + ', ' + wait + ');\n';
};

Arduino.forBlock['ws2812_matrix_rainbow'] = function(block, generator) {
  const varName = ws2812MatrixGetVarName(block);
  const wait = ws2812MatrixValueToCode(block, generator, 'WAIT', '20');
  const cycles = ws2812MatrixValueToCode(block, generator, 'CYCLES', '1');
  ws2812MatrixEnsureAnimationHelpers(generator);
  return 'ws2812MatrixRainbow(' + varName + ', ' + wait + ', constrain((int)(' + cycles + '), 1, 255));\n';
};

Arduino.forBlock['ws2812_matrix_theater_chase'] = function(block, generator) {
  const varName = ws2812MatrixGetVarName(block);
  const color = ws2812MatrixValueToCode(block, generator, 'COLOR', '0xFF0000UL');
  const wait = ws2812MatrixValueToCode(block, generator, 'WAIT', '70');
  const cycles = ws2812MatrixValueToCode(block, generator, 'CYCLES', '10');
  ws2812MatrixEnsureAnimationHelpers(generator);
  return 'ws2812MatrixTheaterChase(' + varName + ', ' + color + ', ' + wait + ', constrain((int)(' + cycles + '), 1, 255));\n';
};

Arduino.forBlock['ws2812_matrix_run_effect'] = function(block, generator) {
  const varName = ws2812MatrixGetVarName(block);
  const effect = block.getFieldValue('EFFECT') || '0';
  const color = ws2812MatrixValueToCode(block, generator, 'COLOR', '0x00FF00UL');
  const wait = ws2812MatrixValueToCode(block, generator, 'WAIT', '80');
  const cycles = ws2812MatrixValueToCode(block, generator, 'CYCLES', '1');
  ws2812MatrixEnsureAnimationHelpers(generator);
  return 'ws2812MatrixRunEffect(' + varName + ', ' + varName + '_width, ' + varName + '_height, ' + varName + '_serpentine, ' + effect + ', ' + color + ', ' + wait + ', constrain((int)(' + cycles + '), 1, 255));\n';
};

Arduino.forBlock['ws2812_matrix_xy_to_index'] = function(block, generator) {
  const varName = ws2812MatrixGetVarName(block);
  const x = ws2812MatrixValueToCode(block, generator, 'X', '0');
  const y = ws2812MatrixValueToCode(block, generator, 'Y', '0');
  ws2812MatrixEnsureCoreHelpers(generator);
  return ['ws2812MatrixXYToIndex(' + x + ', ' + y + ', ' + varName + '_width, ' + varName + '_height, ' + varName + '_serpentine)', ws2812MatrixOrder(generator)];
};

Arduino.forBlock['ws2812_matrix_get_width'] = function(block, generator) {
  const varName = ws2812MatrixGetVarName(block);
  return [varName + '_width', ws2812MatrixOrder(generator)];
};

Arduino.forBlock['ws2812_matrix_get_height'] = function(block, generator) {
  const varName = ws2812MatrixGetVarName(block);
  return [varName + '_height', ws2812MatrixOrder(generator)];
};

Arduino.forBlock['ws2812_matrix_get_count'] = function(block, generator) {
  const varName = ws2812MatrixGetVarName(block);
  return [varName + '.numPixels()', ws2812MatrixOrder(generator)];
};
