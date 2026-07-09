'use strict';

const MAX7219_DEFAULT_DATA_PIN = '23';
const MAX7219_DEFAULT_CS_PIN = '0';
const MAX7219_DEFAULT_CLK_PIN = '18';
const MAX7219_DEFAULT_HORIZONTAL = 1;
const MAX7219_DEFAULT_VERTICAL = 1;

function max7219Order(generator) {
  return generator.ORDER_ATOMIC || Arduino.ORDER_ATOMIC;
}

function max7219SafeInt(value, fallback, min, max) {
  const parsed = parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    return fallback;
  }
  return Math.max(min, Math.min(max, parsed));
}

function max7219SafeIdentifier(value, fallback) {
  let text = String(value || fallback || 'max7219Value').replace(/[^A-Za-z0-9_]/g, '_');
  if (!text) {
    text = fallback || 'max7219Value';
  }
  if (!/^[A-Za-z_]/.test(text)) {
    text = '_' + text;
  }
  return text;
}

function max7219GetVariableName(block, fieldName, fallback) {
  const field = block.getField(fieldName);
  const variableId = block.getFieldValue(fieldName);
  const variable = block.workspace && block.workspace.getVariableById
    ? block.workspace.getVariableById(variableId)
    : null;
  return max7219SafeIdentifier(variable ? variable.name : (field && field.getText ? field.getText() : variableId), fallback);
}

function max7219AttachPatternVarMonitor(block) {
  if (block._varMonitorAttached) {
    return;
  }
  block._varMonitorAttached = true;
  block._varLastName = max7219GetVariableName(block, 'VAR', 'LedArray1');
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._varLastName, 'MAX7219Pattern');
  }

  const varField = block.getField('VAR');
  if (!varField) {
    return;
  }
  const originalFinishEditing = varField.onFinishEditing_;
  varField.onFinishEditing_ = function(newName) {
    if (typeof originalFinishEditing === 'function') {
      originalFinishEditing.call(this, newName);
    }
    const nextName = max7219SafeIdentifier(newName, 'LedArray1');
    const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
    if (workspace && nextName && nextName !== block._varLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._varLastName, nextName, 'MAX7219Pattern');
      block._varLastName = nextName;
    }
  };
}

function max7219ValueToCode(block, generator, name, fallback) {
  return generator.valueToCode(block, name, max7219Order(generator)) || fallback;
}

function max7219HashText(text) {
  let hash = 5381;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) + hash) + text.charCodeAt(i);
    hash >>>= 0;
  }
  return hash.toString(36);
}

function max7219ByteToCode(value) {
  const byteValue = max7219SafeInt(value, 0, 0, 255);
  return '0x' + byteValue.toString(16).toUpperCase().padStart(2, '0');
}

function max7219NormalizeMatrix(value) {
  let matrix = value;
  if (typeof matrix === 'string') {
    try {
      matrix = JSON.parse(matrix);
    } catch (error) {
      matrix = null;
    }
  }

  const rows = [];
  for (let y = 0; y < 8; y++) {
    const sourceRow = Array.isArray(matrix) && Array.isArray(matrix[y]) ? matrix[y] : [];
    let rowByte = 0;
    for (let x = 0; x < 8; x++) {
      const pixel = sourceRow[x];
      if (pixel === true || pixel === 1 || pixel === '1' || (typeof pixel === 'string' && pixel !== '0' && pixel !== '#000000')) {
        rowByte |= (0x80 >> x);
      }
    }
    rows.push(rowByte);
  }
  return rows;
}

function max7219FormatByteArray(bytes) {
  return bytes.map(max7219ByteToCode).join(', ');
}

function max7219EnsureConfig(generator, config = {}, overwrite = false) {
  const dataPin = String(config.dataPin || MAX7219_DEFAULT_DATA_PIN);
  const csPin = String(config.csPin || MAX7219_DEFAULT_CS_PIN);
  const clkPin = String(config.clkPin || MAX7219_DEFAULT_CLK_PIN);
  const horizontal = max7219SafeInt(config.horizontal, MAX7219_DEFAULT_HORIZONTAL, 1, 8);
  const vertical = max7219SafeInt(config.vertical, MAX7219_DEFAULT_VERTICAL, 1, 8);

  generator.addLibrary('Arduino', '#include <Arduino.h>');
  generator.addLibrary('LedControl', '#include <LedControl.h>');
  generator.addObject('max7219_config', `const uint8_t max7219DataPin = ${dataPin};
const uint8_t max7219ChipSelectPin = ${csPin};
const uint8_t max7219ClockPin = ${clkPin};
const uint8_t max7219HorizontalDevices = ${horizontal};
const uint8_t max7219VerticalDevices = ${vertical};
const uint8_t max7219DeviceCount = max7219HorizontalDevices * max7219VerticalDevices;
uint8_t max7219Buffer[max7219DeviceCount][8] = {0};
uint8_t max7219Rotation[max7219DeviceCount] = {0};`, overwrite);
  generator.addObject('max7219_driver', 'LedControl max7219Matrix(max7219DataPin, max7219ClockPin, max7219ChipSelectPin, max7219DeviceCount);');
}

function max7219EnsureRuntime(generator) {
  max7219EnsureConfig(generator);
  generator.addObject('max7219_font_5x7', `const uint8_t max7219Font5x7[][5] = {
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
  generator.addFunction('max7219_runtime', `void max7219FlushRow(uint8_t device, uint8_t row) {
  if (device >= max7219DeviceCount || row > 7) {
    return;
  }
  max7219Matrix.setRow(device, row, max7219Buffer[device][row]);
}

void max7219FlushDevice(uint8_t device) {
  if (device >= max7219DeviceCount) {
    return;
  }
  for (uint8_t row = 0; row < 8; row++) {
    max7219FlushRow(device, row);
  }
}

void max7219FlushAll() {
  for (uint8_t device = 0; device < max7219DeviceCount; device++) {
    max7219FlushDevice(device);
  }
}

void max7219ClearBufferOnly() {
  for (uint8_t device = 0; device < max7219DeviceCount; device++) {
    for (uint8_t row = 0; row < 8; row++) {
      max7219Buffer[device][row] = 0x00;
    }
  }
}

bool max7219MapDevicePixel(uint8_t device, int16_t x, int16_t y, uint8_t &row, uint8_t &mask) {
  if (device >= max7219DeviceCount || x < 0 || x > 7 || y < 0 || y > 7) {
    return false;
  }
  int16_t px = x;
  int16_t py = y;
  switch (max7219Rotation[device] & 0x03) {
    case 1:
      px = 7 - y;
      py = x;
      break;
    case 2:
      px = 7 - x;
      py = 7 - y;
      break;
    case 3:
      px = y;
      py = 7 - x;
      break;
  }
  if (px < 0 || px > 7 || py < 0 || py > 7) {
    return false;
  }
  row = (uint8_t)py;
  mask = (uint8_t)(0x80 >> px);
  return true;
}

bool max7219MapGlobalPixel(int16_t x, int16_t y, uint8_t &device, uint8_t &row, uint8_t &mask) {
  const int16_t width = max7219HorizontalDevices * 8;
  const int16_t height = max7219VerticalDevices * 8;
  if (x < 0 || y < 0 || x >= width || y >= height) {
    return false;
  }
  uint8_t tileX = (uint8_t)(x / 8);
  uint8_t tileY = (uint8_t)(y / 8);
  device = tileY * max7219HorizontalDevices + tileX;
  return max7219MapDevicePixel(device, x % 8, y % 8, row, mask);
}

void max7219SetDevicePixelBuffered(uint8_t device, int16_t x, int16_t y, bool state) {
  uint8_t row = 0;
  uint8_t mask = 0;
  if (!max7219MapDevicePixel(device, x, y, row, mask)) {
    return;
  }
  if (state) {
    max7219Buffer[device][row] |= mask;
  } else {
    max7219Buffer[device][row] &= (uint8_t)~mask;
  }
}

void max7219SetPixelBuffered(int16_t x, int16_t y, bool state) {
  uint8_t device = 0;
  uint8_t row = 0;
  uint8_t mask = 0;
  if (!max7219MapGlobalPixel(x, y, device, row, mask)) {
    return;
  }
  if (state) {
    max7219Buffer[device][row] |= mask;
  } else {
    max7219Buffer[device][row] &= (uint8_t)~mask;
  }
}

void max7219SetDevicePixel(uint8_t device, int16_t x, int16_t y, bool state) {
  uint8_t row = 0;
  uint8_t mask = 0;
  if (!max7219MapDevicePixel(device, x, y, row, mask)) {
    return;
  }
  if (state) {
    max7219Buffer[device][row] |= mask;
  } else {
    max7219Buffer[device][row] &= (uint8_t)~mask;
  }
  max7219FlushRow(device, row);
}

void max7219SetPixel(int16_t x, int16_t y, bool state) {
  uint8_t device = 0;
  uint8_t row = 0;
  uint8_t mask = 0;
  if (!max7219MapGlobalPixel(x, y, device, row, mask)) {
    return;
  }
  if (state) {
    max7219Buffer[device][row] |= mask;
  } else {
    max7219Buffer[device][row] &= (uint8_t)~mask;
  }
  max7219FlushRow(device, row);
}

void max7219SetIntensity(uint8_t intensity) {
  intensity = constrain(intensity, 0, 15);
  for (uint8_t device = 0; device < max7219DeviceCount; device++) {
    max7219Matrix.setIntensity(device, intensity);
  }
}

void max7219SetRotation(uint8_t device, uint8_t rotation) {
  if (device >= max7219DeviceCount) {
    return;
  }
  max7219Rotation[device] = rotation & 0x03;
  max7219FlushDevice(device);
}

void max7219Fill(bool state) {
  for (uint8_t device = 0; device < max7219DeviceCount; device++) {
    for (uint8_t row = 0; row < 8; row++) {
      max7219Buffer[device][row] = state ? 0xFF : 0x00;
    }
  }
  max7219FlushAll();
}

void max7219DrawBitmap(uint8_t device, const uint8_t pattern[8]) {
  if (device >= max7219DeviceCount) {
    return;
  }
  for (uint8_t row = 0; row < 8; row++) {
    max7219Buffer[device][row] = 0x00;
  }
  for (uint8_t y = 0; y < 8; y++) {
    for (uint8_t x = 0; x < 8; x++) {
      if (pattern[y] & (0x80 >> x)) {
        max7219SetDevicePixelBuffered(device, x, y, true);
      }
    }
  }
  max7219FlushDevice(device);
}

int8_t max7219FontIndex(char c) {
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

void max7219DrawCharBuffered(int16_t x, int16_t y, char c, bool state) {
  int8_t index = max7219FontIndex(c);
  for (uint8_t col = 0; col < 5; col++) {
    uint8_t line = max7219Font5x7[index][col];
    for (uint8_t row = 0; row < 7; row++) {
      if (line & (1 << row)) {
        max7219SetPixelBuffered(x + col, y + row, state);
      }
    }
  }
}

void max7219DrawTextBuffered(int16_t x, int16_t y, const String &text, bool state) {
  int16_t cursorX = x;
  int16_t cursorY = y;
  for (uint16_t i = 0; i < text.length(); i++) {
    char c = text.charAt(i);
    if (c == '\\n') {
      cursorX = x;
      cursorY += 8;
    } else {
      max7219DrawCharBuffered(cursorX, cursorY, c, state);
      cursorX += 6;
    }
  }
}

void max7219ScrollText(const String &text, uint16_t waitMs) {
  int16_t displayWidth = max7219HorizontalDevices * 8;
  int16_t textWidth = text.length() * 6;
  for (int16_t cursor = displayWidth; cursor >= -textWidth; cursor--) {
    max7219ClearBufferOnly();
    max7219DrawTextBuffered(cursor, 0, text, true);
    max7219FlushAll();
    delay(waitMs);
  }
}

void max7219Begin(uint8_t intensity) {
  for (uint8_t device = 0; device < max7219DeviceCount; device++) {
    max7219Rotation[device] = 0;
    max7219Matrix.shutdown(device, false);
    max7219Matrix.setScanLimit(device, 7);
    max7219Matrix.setIntensity(device, constrain(intensity, 0, 15));
    max7219Matrix.clearDisplay(device);
  }
  max7219ClearBufferOnly();
}`);
}

const MAX7219_PRESET_PATTERNS = {
  ARROW_UP: {
    name: 'max7219PatternArrowUp',
    bytes: [0x18, 0x3C, 0x7E, 0x18, 0x18, 0x18, 0x18, 0x00]
  },
  ARROW_DOWN: {
    name: 'max7219PatternArrowDown',
    bytes: [0x18, 0x18, 0x18, 0x18, 0x7E, 0x3C, 0x18, 0x00]
  },
  ARROW_LEFT: {
    name: 'max7219PatternArrowLeft',
    bytes: [0x10, 0x30, 0x7F, 0xFF, 0x7F, 0x30, 0x10, 0x00]
  },
  ARROW_RIGHT: {
    name: 'max7219PatternArrowRight',
    bytes: [0x08, 0x0C, 0xFE, 0xFF, 0xFE, 0x0C, 0x08, 0x00]
  },
  HEART: {
    name: 'max7219PatternHeart',
    bytes: [0x66, 0xFF, 0xFF, 0xFF, 0x7E, 0x3C, 0x18, 0x00]
  },
  SMILE: {
    name: 'max7219PatternSmile',
    bytes: [0x3C, 0x42, 0xA5, 0x81, 0xA5, 0x99, 0x42, 0x3C]
  },
  CHECK: {
    name: 'max7219PatternCheck',
    bytes: [0x00, 0x01, 0x03, 0x86, 0xCC, 0x78, 0x30, 0x00]
  },
  CROSS: {
    name: 'max7219PatternCross',
    bytes: [0x81, 0x42, 0x24, 0x18, 0x18, 0x24, 0x42, 0x81]
  }
};

function max7219AddPresetPattern(generator, key) {
  const pattern = MAX7219_PRESET_PATTERNS[key] || MAX7219_PRESET_PATTERNS.ARROW_UP;
  generator.addObject(pattern.name, 'const uint8_t ' + pattern.name + '[8] = {' + max7219FormatByteArray(pattern.bytes) + '};');
  return pattern.name;
}

Arduino.forBlock['max7219_matrix_init'] = function(block, generator) {
  const dataPin = block.getFieldValue('DATA_PIN') || MAX7219_DEFAULT_DATA_PIN;
  const csPin = block.getFieldValue('CS_PIN') || MAX7219_DEFAULT_CS_PIN;
  const clkPin = block.getFieldValue('CLK_PIN') || MAX7219_DEFAULT_CLK_PIN;
  const horizontal = max7219SafeInt(block.getFieldValue('HORIZONTAL'), MAX7219_DEFAULT_HORIZONTAL, 1, 8);
  const vertical = max7219SafeInt(block.getFieldValue('VERTICAL'), MAX7219_DEFAULT_VERTICAL, 1, 8);
  max7219EnsureConfig(generator, { dataPin, csPin, clkPin, horizontal, vertical }, true);
  max7219EnsureRuntime(generator);
  return 'max7219Begin(5);\n';
};

Arduino.forBlock['max7219_set_pixel'] = function(block, generator) {
  max7219EnsureRuntime(generator);
  const x = block.getFieldValue('X') || '0';
  const y = block.getFieldValue('Y') || '0';
  const state = block.getFieldValue('STATE') === 'false' ? 'false' : 'true';
  return 'max7219SetPixel(' + x + ', ' + y + ', ' + state + ');\n';
};

Arduino.forBlock['max7219_set_rotation'] = function(block, generator) {
  max7219EnsureRuntime(generator);
  const device = block.getFieldValue('DEVICE') || '0';
  const rotation = block.getFieldValue('ROTATION') || '0';
  return 'max7219SetRotation(' + device + ', ' + rotation + ');\n';
};

Arduino.forBlock['max7219_draw_screen_pixel'] = function(block, generator) {
  max7219EnsureRuntime(generator);
  const device = block.getFieldValue('DEVICE') || '0';
  const x = block.getFieldValue('X') || '0';
  const y = block.getFieldValue('Y') || '0';
  return 'max7219SetDevicePixel(' + device + ', ' + x + ', ' + y + ', true);\n';
};

Arduino.forBlock['max7219_scroll_text'] = function(block, generator) {
  max7219EnsureRuntime(generator);
  const text = max7219ValueToCode(block, generator, 'TEXT', '"Mixly"');
  const speed = max7219ValueToCode(block, generator, 'SPEED', '300');
  return 'max7219ScrollText(String(' + text + '), ' + speed + ');\n';
};

Arduino.forBlock['max7219_display_pattern'] = function(block, generator) {
  max7219EnsureRuntime(generator);
  const device = block.getFieldValue('DEVICE') || '0';
  let pattern = generator.valueToCode(block, 'PATTERN', max7219Order(generator));
  if (!pattern) {
    pattern = max7219AddPresetPattern(generator, 'ARROW_UP');
  }
  return 'max7219DrawBitmap(' + device + ', ' + pattern + ');\n';
};

Arduino.forBlock['max7219_matrix_pattern'] = function(block, generator) {
  max7219AttachPatternVarMonitor(block);
  const varName = max7219GetVariableName(block, 'VAR', 'LedArray1');
  const bytes = max7219NormalizeMatrix(block.getFieldValue('MATRIX'));
  generator.addObject('max7219_pattern_' + varName, 'const uint8_t ' + varName + '[8] = {' + max7219FormatByteArray(bytes) + '};', true);
  return [varName, max7219Order(generator)];
};

Arduino.forBlock['max7219_preset_pattern'] = function(block, generator) {
  const patternName = max7219AddPresetPattern(generator, block.getFieldValue('PATTERN') || 'ARROW_UP');
  return [patternName, max7219Order(generator)];
};

Arduino.forBlock['max7219_fill'] = function(block, generator) {
  max7219EnsureRuntime(generator);
  const state = block.getFieldValue('STATE') === 'false' ? 'false' : 'true';
  return 'max7219Fill(' + state + ');\n';
};

Arduino.forBlock['max7219_set_brightness'] = function(block, generator) {
  max7219EnsureRuntime(generator);
  const brightness = block.getFieldValue('BRIGHTNESS') || '5';
  return 'max7219SetIntensity(' + brightness + ');\n';
};
