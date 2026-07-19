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
  const model = 'ST7789_DRIVER';
  const frequency = '40000000';
  const width = '240';
  const height = '320';
  const miso = '19';
  const mosi = '23';
  const sclk = '18';
  const cs = '5';
  const dc = '4';
  const rst = '19';
  const bl = '-1';
  const blLevel = 'HIGH';
  const colorMode = 'TFT_BGR';

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

function tftScreenEnsureAnimationLibraries(generator) {
  generator.addLibrary('TFT_eSPI', '#include <TFT_eSPI.h>');
  generator.addLibrary('SPI', '#include <SPI.h>');
}

function tftScreenDecodeBase64Frame(frameValue, expectedByteLength, frameIndex) {
  if (typeof frameValue !== 'string') {
    console.error(`[tftscr_animation] Frame ${frameIndex} is not a Base64 string`);
    return null;
  }

  const base64 = frameValue.trim();
  const base64Pattern = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
  if (!base64 || base64.length % 4 !== 0 || !base64Pattern.test(base64)) {
    console.error(`[tftscr_animation] Frame ${frameIndex} contains invalid Base64 data`);
    return null;
  }

  try {
    let bytes;
    if (typeof atob === 'function') {
      const binary = atob(base64);
      bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
    } else if (typeof Buffer !== 'undefined') {
      bytes = Uint8Array.from(Buffer.from(base64, 'base64'));
    } else {
      console.error('[tftscr_animation] Base64 decoder is unavailable');
      return null;
    }

    if (bytes.length !== expectedByteLength) {
      console.error(`[tftscr_animation] Frame ${frameIndex} has ${bytes.length} bytes; expected ${expectedByteLength}`);
      return null;
    }
    return bytes;
  } catch (error) {
    console.error(`[tftscr_animation] Failed to decode frame ${frameIndex}:`, error);
    return null;
  }
}

function tftScreenFormatRgb565Frame(bytes) {
  const values = [];
  for (let offset = 0; offset < bytes.length; offset += 2) {
    const value = (bytes[offset] << 8) | bytes[offset + 1];
    values.push(`0x${value.toString(16).padStart(4, '0').toUpperCase()}`);
  }

  const lines = [];
  for (let index = 0; index < values.length; index += 12) {
    lines.push(`  ${values.slice(index, index + 12).join(', ')}`);
  }
  return lines.join(',\n');
}

function tftScreenFormatRgb332Frame(bytes) {
  const values = Array.from(bytes, value => `0x${value.toString(16).padStart(2, '0').toUpperCase()}`);
  const lines = [];
  for (let index = 0; index < values.length; index += 16) {
    lines.push(`  ${values.slice(index, index + 16).join(', ')}`);
  }
  return lines.join(',\n');
}

function tftScreenGetAnimationSignature(format, encoding, width, height, fps, encodedFrames) {
  let hash1 = 0x811C9DC5;
  let hash2 = 0x9E3779B9;
  const updateHash = value => {
    const text = String(value);
    for (let index = 0; index < text.length; index++) {
      const code = text.charCodeAt(index);
      hash1 = Math.imul(hash1 ^ code, 0x01000193);
      hash2 = Math.imul(hash2 ^ code, 0x85EBCA77);
    }
  };

  updateHash(`${format}:${encoding}:${width}:${height}:${fps}:${encodedFrames.length}|`);
  for (const encodedFrame of encodedFrames) {
    updateHash(encodedFrame);
    updateHash('|');
  }
  return `${(hash1 >>> 0).toString(16).padStart(8, '0')}${(hash2 >>> 0).toString(16).padStart(8, '0')}`;
}

function tftScreenGetAnimationData(block) {
  let animationData = block.getFieldValue('CUSTOM_ANIMATION');

  if (typeof animationData === 'string') {
    try {
      animationData = JSON.parse(animationData);
    } catch (error) {
      console.error('[tftscr_animation] Failed to parse animation field value:', error);
      return null;
    }
  }

  if (!animationData || typeof animationData !== 'object') {
    console.error('[tftscr_animation] Animation data is missing');
    return null;
  }

  const format = animationData.format;
  const encoding = animationData.encoding;
  const isRgb565 = format === 'rgb565' && encoding === 'rgb565-be-base64';
  const isRgb332 = format === 'rgb332' && encoding === 'rgb332-base64';
  if (animationData.version !== 1 || (!isRgb565 && !isRgb332)) {
    console.error('[tftscr_animation] Unsupported animation version, format, or encoding');
    return null;
  }

  const width = animationData.width;
  const height = animationData.height;
  const fps = animationData.fps;
  if (!Number.isInteger(width) || width <= 0 || width > 65535 ||
      !Number.isInteger(height) || height <= 0 || height > 65535) {
    console.error('[tftscr_animation] Width and height must be positive 16-bit integers');
    return null;
  }
  if (!Number.isFinite(fps) || fps <= 0) {
    console.error('[tftscr_animation] FPS must be a positive number');
    return null;
  }
  if (!Array.isArray(animationData.frames)) {
    console.error('[tftscr_animation] Animation frames must be an array');
    return null;
  }
  // A newly dragged block intentionally starts empty until a GIF or MP4 is uploaded.
  if (animationData.frames.length === 0) {
    return null;
  }
  if (animationData.frames.length > 65535) {
    console.error('[tftscr_animation] Animation cannot contain more than 65535 frames');
    return null;
  }

  const expectedByteLength = width * height * (isRgb332 ? 1 : 2);
  if (!Number.isSafeInteger(expectedByteLength)) {
    console.error('[tftscr_animation] Animation dimensions are too large');
    return null;
  }

  const frames = [];
  for (let index = 0; index < animationData.frames.length; index++) {
    const binary = tftScreenDecodeBase64Frame(animationData.frames[index], expectedByteLength, index);
    if (binary === null) {
      return null;
    }
    frames.push(isRgb332 ? tftScreenFormatRgb332Frame(binary) : tftScreenFormatRgb565Frame(binary));
  }

  return {
    width,
    height,
    fps,
    format,
    signature: tftScreenGetAnimationSignature(format, encoding, width, height, fps, animationData.frames),
    frames
  };
}

function tftScreenGetBlockSymbolSuffix(block) {
  const suffix = String(block.id || 'block').replace(/[^a-zA-Z0-9]/g, '');
  return suffix || 'block';
}

function tftScreenGetVariableCodeName(block, fieldName, fallbackName) {
  const field = block.getField(fieldName);
  if (field && typeof field.getText === 'function') {
    const fieldText = field.getText();
    if (fieldText) {
      return fieldText;
    }
  }

  const fieldValue = block.getFieldValue(fieldName);
  const variable = block.workspace && typeof block.workspace.getVariableById === 'function'
    ? block.workspace.getVariableById(fieldValue)
    : null;
  return variable && variable.name ? variable.name : fallbackName;
}

function tftScreenGetFrameVariableCodeName(block, generator) {
  if (generator && typeof generator.getValue === 'function') {
    const generatedName = generator.getValue(block, 'FRAME_VAR', 'field_variable');
    if (generatedName && generatedName !== '?') {
      return generatedName;
    }
  }

  const variableId = block.getFieldValue('FRAME_VAR');
  if (variableId && generator && generator.nameDB_ && typeof generator.nameDB_.getName === 'function') {
    return generator.nameDB_.getName(variableId, 'VARIABLE');
  }

  return tftScreenGetVariableCodeName(block, 'FRAME_VAR', 'tftScreenAnimationFrame');
}

function tftScreenGetAnimationPrefix(block, generator) {
  if (typeof block.getInputTargetBlock === 'function') {
    const animationBlock = block.getInputTargetBlock('ANIMATION');
    if (!animationBlock || animationBlock.type !== 'tftscr_animation') {
      console.error('[TFT screen animation] The animation input must be connected directly to a TFT screen animation data block');
      return null;
    }
  }

  const animationCode = generator.valueToCode(block, 'ANIMATION', generator.ORDER_ATOMIC);
  if (!animationCode) {
    return null;
  }

  const match = String(animationCode).trim().match(/^(tftscr_animation_[0-9a-f]{16})_frames$/);
  if (!match) {
    console.error('[TFT screen animation] The animation input must be connected directly to a TFT screen animation data block');
    return null;
  }
  return match[1];
}

Arduino.forBlock['tftscr_animation'] = function(block, generator) {
  tftScreenEnsureAnimationLibraries(generator);
  const animationData = tftScreenGetAnimationData(block);
  if (!animationData) {
    return ['', generator.ORDER_ATOMIC];
  }

  const { width, height, fps, format, signature, frames } = animationData;
  const symbolPrefix = `tftscr_animation_${signature}`;
  const frameType = format === 'rgb332' ? 'uint8_t' : 'uint16_t';
  const formatLabel = format.toUpperCase();
  const frameNames = [];
  const frameDeclarations = [];
  const frameNameByData = new Map();

  for (let index = 0; index < frames.length; index++) {
    const existingFrameName = frameNameByData.get(frames[index]);
    if (existingFrameName) {
      frameNames.push(existingFrameName);
      continue;
    }

    const frameName = `${symbolPrefix}_frame_${index}`;
    frameNameByData.set(frames[index], frameName);
    frameNames.push(frameName);
    frameDeclarations.push(`static const ${frameType} ${frameName}[] PROGMEM = {
${frames[index]}
};`);
  }

  const frameDelay = Math.max(1, Math.round(1000 / fps));
  const animationDeclaration = `// TFT screen animation (${width}x${height}, ${frameNames.length} frames, ${frameDeclarations.length} unique, ${fps} FPS, ${formatLabel})
${frameDeclarations.join('\n\n')}
static const ${frameType}* const ${symbolPrefix}_frames[] = {
  ${frameNames.join(',\n  ')}
};
static const uint16_t ${symbolPrefix}_width = ${width};
static const uint16_t ${symbolPrefix}_height = ${height};
static const uint16_t ${symbolPrefix}_frame_count = ${frameNames.length};
static const uint32_t ${symbolPrefix}_frame_delay = ${frameDelay};`;

  generator.addVariable(symbolPrefix, animationDeclaration);
  return [`${symbolPrefix}_frames`, generator.ORDER_ATOMIC];
};

function tftScreenAddAnimationRenderHelper(generator) {
  generator.addFunction('tftscr_draw_animation_frame', `void tftScreenDrawAnimationFrame(TFT_eSPI &display, int32_t x, int32_t y, uint16_t width, uint16_t height, const uint16_t *frame) {
  bool previousSwapBytes = display.getSwapBytes();
  // RGB565 constants are native-endian uint16_t values; swap bytes for TFT transport.
  display.setSwapBytes(true);
  display.pushImage(x, y, width, height, frame);
  display.setSwapBytes(previousSwapBytes);
}

void tftScreenDrawAnimationFrame(TFT_eSPI &display, int32_t x, int32_t y, uint16_t width, uint16_t height, const uint8_t *frame) {
  display.pushImage(x, y, width, height, frame, true);
}`);
}

function tftScreenAddAnimationFrameByIndexHelper(generator) {
  tftScreenAddAnimationRenderHelper(generator);
  generator.addFunction('tftscr_draw_animation_frame_by_index', `void tftScreenDrawAnimationFrameByIndex(TFT_eSPI &display, int32_t x, int32_t y, uint16_t width, uint16_t height, const uint16_t * const frames[], uint16_t frameCount, int32_t frameIndex) {
  if (frameCount == 0) {
    return;
  }
  if (frameIndex < 0) {
    frameIndex = 0;
  }
  if (frameIndex >= (int32_t)frameCount) {
    frameIndex = frameCount - 1;
  }
  tftScreenDrawAnimationFrame(display, x, y, width, height, frames[frameIndex]);
}

void tftScreenDrawAnimationFrameByIndex(TFT_eSPI &display, int32_t x, int32_t y, uint16_t width, uint16_t height, const uint8_t * const frames[], uint16_t frameCount, int32_t frameIndex) {
  if (frameCount == 0) {
    return;
  }
  if (frameIndex < 0) {
    frameIndex = 0;
  }
  if (frameIndex >= (int32_t)frameCount) {
    frameIndex = frameCount - 1;
  }
  tftScreenDrawAnimationFrame(display, x, y, width, height, frames[frameIndex]);
}`);
}

Arduino.forBlock['tftscr_play_animation'] = function(block, generator) {
  tftScreenEnsureAnimationLibraries(generator);
  const x = cleanValue(generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0');
  const y = cleanValue(generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0');
  const animationPrefix = tftScreenGetAnimationPrefix(block, generator);
  if (!animationPrefix) {
    return '// No TFT screen animation data\n';
  }

  tftScreenAddAnimationRenderHelper(generator);
  const playMode = block.getFieldValue('PLAY_MODE') || 'BLOCKING';
  const loop = block.getFieldValue('LOOP') === 'TRUE';

  if (playMode === 'NON_BLOCKING') {
    const statePrefix = `tftscr_animation_state_${tftScreenGetBlockSymbolSuffix(block)}`;
    generator.addVariable(`${statePrefix}_frame`, `uint16_t ${statePrefix}_frame = 0;`);
    generator.addVariable(`${statePrefix}_last_ms`, `uint32_t ${statePrefix}_last_ms = 0;`);
    generator.addVariable(`${statePrefix}_started`, `bool ${statePrefix}_started = false;`);
    generator.addVariable(`${statePrefix}_done`, `bool ${statePrefix}_done = false;`);

    let code = `if (!${statePrefix}_done) {\n`;
    code += `  uint32_t ${statePrefix}_now = millis();\n`;
    code += `  if (!${statePrefix}_started || ${statePrefix}_now - ${statePrefix}_last_ms >= ${animationPrefix}_frame_delay) {\n`;
    code += `    tftScreenDrawAnimationFrame(tft, ${x}, ${y}, ${animationPrefix}_width, ${animationPrefix}_height, ${animationPrefix}_frames[${statePrefix}_frame]);\n`;
    code += `    ${statePrefix}_last_ms = ${statePrefix}_now;\n`;
    code += `    ${statePrefix}_started = true;\n`;
    code += `    ${statePrefix}_frame++;\n`;
    code += `    if (${statePrefix}_frame >= ${animationPrefix}_frame_count) {\n`;
    if (loop) {
      code += `      ${statePrefix}_frame = 0;\n`;
    } else {
      code += `      ${statePrefix}_frame = ${animationPrefix}_frame_count - 1;\n`;
      code += `      ${statePrefix}_done = true;\n`;
    }
    code += '    }\n';
    code += '  }\n';
    code += '}\n';
    return code;
  }

  let code = `for (uint16_t tftScreenFrameIndex = 0; tftScreenFrameIndex < ${animationPrefix}_frame_count; tftScreenFrameIndex++) {\n`;
  code += '  uint32_t tftScreenFrameStartedAt = millis();\n';
  code += `  tftScreenDrawAnimationFrame(tft, ${x}, ${y}, ${animationPrefix}_width, ${animationPrefix}_height, ${animationPrefix}_frames[tftScreenFrameIndex]);\n`;
  code += '  uint32_t tftScreenFrameRenderTime = millis() - tftScreenFrameStartedAt;\n';
  code += `  if (tftScreenFrameRenderTime < ${animationPrefix}_frame_delay) {\n`;
  code += `    delay(${animationPrefix}_frame_delay - tftScreenFrameRenderTime);\n`;
  code += '  }\n';
  code += '}\n';
  return code;
};

Arduino.forBlock['tftscr_draw_animation_frame'] = function(block, generator) {
  tftScreenEnsureAnimationLibraries(generator);
  const x = cleanValue(generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0');
  const y = cleanValue(generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0');
  const frame = cleanValue(generator.valueToCode(block, 'FRAME', generator.ORDER_ATOMIC) || '0');
  const animationPrefix = tftScreenGetAnimationPrefix(block, generator);
  if (!animationPrefix) {
    return '// No TFT screen animation data\n';
  }

  tftScreenAddAnimationFrameByIndexHelper(generator);
  return `tftScreenDrawAnimationFrameByIndex(tft, ${x}, ${y}, ${animationPrefix}_width, ${animationPrefix}_height, ${animationPrefix}_frames, ${animationPrefix}_frame_count, ${frame});\n`;
};

Arduino.forBlock['tftscr_animation_frame_count'] = function(block, generator) {
  tftScreenEnsureAnimationLibraries(generator);
  const animationPrefix = tftScreenGetAnimationPrefix(block, generator);
  if (!animationPrefix) {
    return ['0', generator.ORDER_ATOMIC];
  }

  return [`${animationPrefix}_frame_count`, generator.ORDER_ATOMIC];
};

Arduino.forBlock['tftscr_step_animation_frame'] = function(block, generator) {
  tftScreenEnsureAnimationLibraries(generator);
  const frameVariable = tftScreenGetFrameVariableCodeName(block, generator);
  const target = generator.valueToCode(block, 'TARGET', generator.ORDER_ATOMIC) || '0';
  const frameCount = generator.valueToCode(block, 'FRAME_COUNT', generator.ORDER_ATOMIC) || '1';
  const direction = block.getFieldValue('DIRECTION') || 'AUTO';
  const symbolSuffix = tftScreenGetBlockSymbolSuffix(block);
  const targetVariable = `tftscr_animation_target_${symbolSuffix}`;
  const countVariable = `tftscr_animation_frame_count_${symbolSuffix}`;

  let code = `int32_t ${countVariable} = (int32_t)(${frameCount});\n`;
  code += `if (${countVariable} > 0) {\n`;
  code += `  int32_t ${targetVariable} = constrain((int32_t)(${target}), 0, ${countVariable} - 1);\n`;
  code += `  ${frameVariable} = constrain((int32_t)${frameVariable}, 0, ${countVariable} - 1);\n`;

  if (direction === 'FORWARD') {
    code += `  if (${frameVariable} != ${targetVariable}) {\n`;
    code += `    ${frameVariable}++;\n`;
    code += `    if (${frameVariable} >= ${countVariable}) {\n`;
    code += `      ${frameVariable} = 0;\n`;
    code += '    }\n';
    code += '  }\n';
  } else if (direction === 'BACKWARD') {
    code += `  if (${frameVariable} != ${targetVariable}) {\n`;
    code += `    if (${frameVariable} <= 0) {\n`;
    code += `      ${frameVariable} = ${countVariable} - 1;\n`;
    code += '    } else {\n';
    code += `      ${frameVariable}--;\n`;
    code += '    }\n';
    code += '  }\n';
  } else {
    code += `  if (${frameVariable} < ${targetVariable}) {\n`;
    code += `    ${frameVariable}++;\n`;
    code += `  } else if (${frameVariable} > ${targetVariable}) {\n`;
    code += `    ${frameVariable}--;\n`;
    code += '  }\n';
  }

  code += '}\n';
  return code;
};

if (Blockly.Extensions.isRegistered('tftscr_animation_play_dynamic_inputs')) {
  Blockly.Extensions.unregister('tftscr_animation_play_dynamic_inputs');
}

Blockly.Extensions.register('tftscr_animation_play_dynamic_inputs', function() {
  let renderScheduled = false;

  const getLoopInput = () => {
    return this.inputList.find(input => input.fieldRow && input.fieldRow.some(field => field.name === 'LOOP'));
  };

  const scheduleRender = () => {
    if (!this.rendered || renderScheduled) {
      return;
    }
    renderScheduled = true;
    Promise.resolve().then(() => {
      renderScheduled = false;
      const rootBlock = typeof this.getRootBlock === 'function' ? this.getRootBlock() : this;
      if (rootBlock && rootBlock.rendered) {
        rootBlock.render();
      } else if (this.rendered) {
        this.render();
      }
    });
  };

  const updatePlaybackMode = modeValue => {
    const loopInput = getLoopInput();
    if (loopInput) {
      loopInput.setVisible(modeValue === 'NON_BLOCKING');
    }
    scheduleRender();
  };

  const playModeField = this.getField('PLAY_MODE');
  if (playModeField) {
    playModeField.setValidator(option => {
      updatePlaybackMode(option);
      return option;
    });
  }

  updatePlaybackMode(this.getFieldValue('PLAY_MODE'));
});
