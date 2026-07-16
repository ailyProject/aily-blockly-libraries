// Helper: convert #RRGGBB to 0xRRGGBB
function colorToHex(color) {
  if (color && color.startsWith('#')) {
    return '0x' + color.substring(1).toUpperCase();
  }
  return color || '0xFFFFFF';
}

// Ensure k10 object is initialized (begin only).
function ensureK10(generator) {
  generator.addLibrary('SPIFFS', '#include <SPIFFS.h>');
  generator.addLibrary('unihiker_k10', '#include <unihiker_k10.h>');
  generator.addVariable('k10', 'UNIHIKER_K10 k10;');
  generator.addSetupBegin('k10_begin', 'k10.begin();');
}

// Ensure screen + canvas initialization. Drawing blocks pass the default
// direction ('2' = portrait). When the user adds the "init screen" block,
// its direction takes effect because addVariable / addSetupBegin de-duplicate
// by key (first-wins). Place the init block near the top of setup.
function ensureScreenInit(generator, screenDir) {
  ensureK10(generator);
  generator.addVariable('k10_screen_dir', 'uint8_t screen_dir = ' + screenDir + ';');
  generator.addSetupBegin('k10_initScreen', 'k10.initScreen(screen_dir);');
  generator.addSetupBegin('k10_creatCanvas', 'k10.creatCanvas();');
}

// ========== 初始化屏幕 ==========
Arduino.forBlock['k10_init_screen'] = function(block, generator) {
  var dir = block.getFieldValue('DIR');
  ensureScreenInit(generator, dir);
  return '';
};

// ========== 设置背景颜色 ==========
Arduino.forBlock['k10_set_background'] = function(block, generator) {
  var color = colorToHex(block.getFieldValue('COLOR'));
  ensureScreenInit(generator, '2');
  return 'k10.setScreenBackground(' + color + ');\n';
};

// ========== 画点 ==========
Arduino.forBlock['k10_draw_point'] = function(block, generator) {
  var x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  var y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  var color = colorToHex(block.getFieldValue('COLOR'));
  ensureScreenInit(generator, '2');
  return 'k10.canvas->canvasPoint(' + x + ', ' + y + ', ' + color + ');\n';
};

// ========== 画线 ==========
Arduino.forBlock['k10_draw_line'] = function(block, generator) {
  var x1 = generator.valueToCode(block, 'X1', generator.ORDER_ATOMIC) || '0';
  var y1 = generator.valueToCode(block, 'Y1', generator.ORDER_ATOMIC) || '0';
  var x2 = generator.valueToCode(block, 'X2', generator.ORDER_ATOMIC) || '240';
  var y2 = generator.valueToCode(block, 'Y2', generator.ORDER_ATOMIC) || '320';
  var color = colorToHex(block.getFieldValue('COLOR'));
  ensureScreenInit(generator, '2');
  return 'k10.canvas->canvasLine(' + x1 + ', ' + y1 + ', ' + x2 + ', ' + y2 + ', ' + color + ');\n';
};

// ========== 设置线宽 ==========
Arduino.forBlock['k10_set_line_width'] = function(block, generator) {
  var width = block.getFieldValue('WIDTH');
  ensureScreenInit(generator, '2');
  return 'k10.canvas->canvasSetLineWidth(' + width + ');\n';
};

// ========== 画圆 ==========
Arduino.forBlock['k10_draw_circle'] = function(block, generator) {
  var x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '120';
  var y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '120';
  var r = generator.valueToCode(block, 'R', generator.ORDER_ATOMIC) || '40';
  var borderColor = colorToHex(block.getFieldValue('BORDER_COLOR'));
  var fillColor = colorToHex(block.getFieldValue('FILL_COLOR'));
  var filled = block.getFieldValue('FILLED') === 'TRUE' ? 'true' : 'false';
  ensureScreenInit(generator, '2');
  return 'k10.canvas->canvasCircle(' + x + ', ' + y + ', ' + r + ', ' + borderColor + ', ' + fillColor + ', ' + filled + ');\n';
};

// ========== 画矩形 ==========
Arduino.forBlock['k10_draw_rectangle'] = function(block, generator) {
  var x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '40';
  var y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '40';
  var w = generator.valueToCode(block, 'W', generator.ORDER_ATOMIC) || '160';
  var h = generator.valueToCode(block, 'H', generator.ORDER_ATOMIC) || '240';
  var borderColor = colorToHex(block.getFieldValue('BORDER_COLOR'));
  var fillColor = colorToHex(block.getFieldValue('FILL_COLOR'));
  var filled = block.getFieldValue('FILLED') === 'TRUE' ? 'true' : 'false';
  ensureScreenInit(generator, '2');
  return 'k10.canvas->canvasRectangle(' + x + ', ' + y + ', ' + w + ', ' + h + ', ' + borderColor + ', ' + fillColor + ', ' + filled + ');\n';
};

// ========== 在指定行显示文字（简化版）==========
// API: canvasText(text, line_num, color)
// 第二参数为屏幕行号(1~7)，系统自动按行排版，无需指定 X/Y。
Arduino.forBlock['k10_draw_text_simple'] = function(block, generator) {
  var text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '""';
  var line = block.getFieldValue('LINE');
  var color = colorToHex(block.getFieldValue('COLOR'));
  ensureScreenInit(generator, '2');
  return 'k10.canvas->canvasText(' + text + ', ' + line + ', ' + color + ');\n';
};

// ========== 显示文字（完整版）==========
// API: canvasText(text, x, y, color, font, lineCharCount, fillBg)
Arduino.forBlock['k10_draw_text'] = function(block, generator) {
  var text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '""';
  var x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  var y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  var color = colorToHex(block.getFieldValue('COLOR'));
  var font = block.getFieldValue('FONT');
  var lineChars = block.getFieldValue('LINE_CHARS');
  ensureScreenInit(generator, '2');
  return 'k10.canvas->canvasText(' + text + ', ' + x + ', ' + y + ', ' + color + ', k10.canvas->' + font + ', ' + lineChars + ', true);\n';
};

// ========== 显示内置图片 ==========
Arduino.forBlock['k10_draw_bitmap'] = function(block, generator) {
  var x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  var y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  var w = generator.valueToCode(block, 'W', generator.ORDER_ATOMIC) || '100';
  var h = generator.valueToCode(block, 'H', generator.ORDER_ATOMIC) || '100';
  var imageVar = block.getFieldValue('IMAGE') || 'image_data1';
  ensureScreenInit(generator, '2');
  generator.addLibrary('arduino_image_cache', '#include "arduino_image_cache.h"');
  return 'k10.canvas->canvasDrawBitmap(' + x + ', ' + y + ', ' + w + ', ' + h + ', ' + imageVar + ');\n';
};

// ========== 显示TF卡图片 ==========
Arduino.forBlock['k10_draw_image'] = function(block, generator) {
  var path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '"S:/photo.bmp"';
  var x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  var y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  ensureScreenInit(generator, '2');
  generator.addSetupBegin('k10_initSDFile', 'k10.initSDFile();');
  return 'k10.canvas->canvasDrawImage(' + x + ', ' + y + ', ' + path + ');\n';
};

// ========== 显示二维码 ==========
Arduino.forBlock['k10_draw_qrcode'] = function(block, generator) {
  var content = generator.valueToCode(block, 'CONTENT', generator.ORDER_ATOMIC) || '"https://www.unihiker.com.cn"';
  ensureScreenInit(generator, '2');
  return 'k10.canvasDrawCode(' + content + ');\n';
};

// ========== 刷新画布 ==========
Arduino.forBlock['k10_update_canvas'] = function(block, generator) {
  ensureScreenInit(generator, '2');
  return 'k10.canvas->updateCanvas();\n';
};

// ========== 清除画布 ==========
Arduino.forBlock['k10_clear_canvas'] = function(block, generator) {
  var mode = block.getFieldValue('MODE');
  ensureScreenInit(generator, '2');
  if (mode === '0') {
    return 'k10.canvas->canvasClear();\n';
  } else {
    return 'k10.canvas->canvasClear(1);\n';
  }
};

// ========== 清除画布指定行 ==========
Arduino.forBlock['k10_clear_canvas_row'] = function(block, generator) {
  var line = generator.valueToCode(block, 'LINE', generator.ORDER_ATOMIC) || '1';
  ensureScreenInit(generator, '2');
  return 'k10.canvas->canvasClear(' + line + ');\n';
};

// ========== 清除二维码 ==========
Arduino.forBlock['k10_clear_qrcode'] = function(block, generator) {
  ensureScreenInit(generator, '2');
  return 'k10.clearCode();\n';
};

// ========== 动画 ==========
function k10DecodeBase64AnimationFrame(frameValue, expectedByteLength, frameIndex) {
  if (typeof frameValue !== 'string') {
    console.error(`[k10_animation] Frame ${frameIndex} is not a Base64 string`);
    return null;
  }

  const base64 = frameValue.trim();
  const base64Pattern = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
  if (!base64 || base64.length % 4 !== 0 || !base64Pattern.test(base64)) {
    console.error(`[k10_animation] Frame ${frameIndex} contains invalid Base64 data`);
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
      console.error('[k10_animation] Base64 decoder is unavailable');
      return null;
    }

    if (bytes.length !== expectedByteLength) {
      console.error(`[k10_animation] Frame ${frameIndex} has ${bytes.length} bytes; expected ${expectedByteLength}`);
      return null;
    }
    return bytes;
  } catch (error) {
    console.error(`[k10_animation] Failed to decode frame ${frameIndex}:`, error);
    return null;
  }
}

function k10Rgb332ToRgb565(value) {
  const red3 = (value >> 5) & 0x07;
  const green3 = (value >> 2) & 0x07;
  const blue2 = value & 0x03;
  const red5 = (red3 << 2) | (red3 >> 1);
  const green6 = (green3 << 3) | green3;
  const blue5 = (blue2 << 3) | (blue2 << 1) | (blue2 >> 1);
  return (red5 << 11) | (green6 << 5) | blue5;
}

function k10SwapRgb565RedBlue(value) {
  const red5 = (value >> 11) & 0x1F;
  const green6 = (value >> 5) & 0x3F;
  const blue5 = value & 0x1F;
  return (blue5 << 11) | (green6 << 5) | red5;
}

function k10FormatAnimationFrame(bytes, isRgb332) {
  const values = [];
  if (isRgb332) {
    for (const byte of bytes) {
      const rgb565 = k10SwapRgb565RedBlue(k10Rgb332ToRgb565(byte));
      values.push((rgb565 >> 8) & 0xFF, rgb565 & 0xFF);
    }
  } else {
    for (let index = 0; index < bytes.length; index += 2) {
      const sourceRgb565 = (bytes[index] << 8) | bytes[index + 1];
      const rgb565 = k10SwapRgb565RedBlue(sourceRgb565);
      values.push((rgb565 >> 8) & 0xFF, rgb565 & 0xFF);
    }
  }

  const lines = [];
  for (let index = 0; index < values.length; index += 16) {
    lines.push(`  ${values.slice(index, index + 16).map(value => `0x${value.toString(16).padStart(2, '0').toUpperCase()}`).join(', ')}`);
  }
  return lines.join(',\n');
}

function k10GetAnimationSignature(format, encoding, width, height, fps, encodedFrames) {
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

function k10GetAnimationData(block) {
  let animationData = block.getFieldValue('CUSTOM_ANIMATION');

  if (typeof animationData === 'string') {
    try {
      animationData = JSON.parse(animationData);
    } catch (error) {
      console.error('[k10_animation] Failed to parse animation field value:', error);
      return null;
    }
  }

  if (!animationData || typeof animationData !== 'object') {
    console.error('[k10_animation] Animation data is missing');
    return null;
  }

  const format = animationData.format;
  const encoding = animationData.encoding;
  const isRgb565 = format === 'rgb565' && encoding === 'rgb565-be-base64';
  const isRgb332 = format === 'rgb332' && encoding === 'rgb332-base64';
  if (animationData.version !== 1 || (!isRgb565 && !isRgb332)) {
    console.error('[k10_animation] Unsupported animation version, format, or encoding');
    return null;
  }

  const width = animationData.width;
  const height = animationData.height;
  const fps = animationData.fps;
  if (!Number.isInteger(width) || width <= 0 || width > 65535 ||
      !Number.isInteger(height) || height <= 0 || height > 65535) {
    console.error('[k10_animation] Width and height must be positive 16-bit integers');
    return null;
  }
  if (!Number.isFinite(fps) || fps <= 0) {
    console.error('[k10_animation] FPS must be a positive number');
    return null;
  }
  if (!Array.isArray(animationData.frames)) {
    console.error('[k10_animation] Animation frames must be an array');
    return null;
  }
  // A newly dragged block intentionally starts empty until media is uploaded.
  if (animationData.frames.length === 0) {
    return null;
  }
  if (animationData.frames.length > 65535) {
    console.error('[k10_animation] Animation cannot contain more than 65535 frames');
    return null;
  }

  const expectedByteLength = width * height * (isRgb332 ? 1 : 2);
  if (!Number.isSafeInteger(expectedByteLength)) {
    console.error('[k10_animation] Animation dimensions are too large');
    return null;
  }

  const frames = [];
  for (let index = 0; index < animationData.frames.length; index++) {
    const bytes = k10DecodeBase64AnimationFrame(animationData.frames[index], expectedByteLength, index);
    if (bytes === null) {
      return null;
    }
    // K10 canvas data uses big-endian RGB565 bytes, but its display path expects
    // the red and blue fields reversed. Apply that conversion to both source formats.
    frames.push(k10FormatAnimationFrame(bytes, isRgb332));
  }

  return {
    width,
    height,
    fps,
    format,
    signature: k10GetAnimationSignature(format, encoding, width, height, fps, animationData.frames),
    frames
  };
}

function k10GetBlockSymbolSuffix(block) {
  const suffix = String(block.id || 'block').replace(/[^a-zA-Z0-9]/g, '');
  return suffix || 'block';
}

function k10GetVariableCodeName(block, fieldName, fallbackName) {
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

function k10GetFrameVariableCodeName(block, generator) {
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

  return k10GetVariableCodeName(block, 'FRAME_VAR', 'k10AnimationFrame');
}

function k10GetAnimationPrefix(block, generator) {
  if (typeof block.getInputTargetBlock === 'function') {
    const animationBlock = block.getInputTargetBlock('ANIMATION');
    if (!animationBlock || animationBlock.type !== 'k10_animation') {
      console.error('[K10 animation] The animation input must be connected directly to a K10 animation data block');
      return null;
    }
  }

  const animationCode = generator.valueToCode(block, 'ANIMATION', generator.ORDER_ATOMIC);
  if (!animationCode) {
    return null;
  }

  const match = String(animationCode).trim().match(/^(k10_animation_[0-9a-f]{16})_frames$/);
  if (!match) {
    console.error('[K10 animation] The animation input must be connected directly to a K10 animation data block');
    return null;
  }
  return match[1];
}

Arduino.forBlock['k10_animation'] = function(block, generator) {
  const animationData = k10GetAnimationData(block);
  if (!animationData) {
    return ['', generator.ORDER_ATOMIC];
  }

  const { width, height, fps, format, signature, frames } = animationData;
  const symbolPrefix = `k10_animation_${signature}`;
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
    frameDeclarations.push(`static const uint8_t ${frameName}[] PROGMEM = {
${frames[index]}
};`);
  }

  const frameDelay = Math.max(1, Math.round(1000 / fps));
  const animationDeclaration = `// K10 animation (${width}x${height}, ${frameNames.length} frames, ${frameDeclarations.length} unique, ${fps} FPS, ${format.toUpperCase()} source)
${frameDeclarations.join('\n\n')}
static const uint8_t* const ${symbolPrefix}_frames[] = {
  ${frameNames.join(',\n  ')}
};
static const uint16_t ${symbolPrefix}_width = ${width};
static const uint16_t ${symbolPrefix}_height = ${height};
static const uint16_t ${symbolPrefix}_frame_count = ${frameNames.length};
static const uint32_t ${symbolPrefix}_frame_delay = ${frameDelay};`;

  generator.addVariable(symbolPrefix, animationDeclaration);
  return [`${symbolPrefix}_frames`, generator.ORDER_ATOMIC];
};

function k10AddAnimationRenderHelper(generator) {
  generator.addFunction('k10_draw_animation_frame', `void k10DrawAnimationFrame(Canvas &canvas, int32_t x, int32_t y, uint16_t width, uint16_t height, const uint8_t *frame) {
  canvas.canvasDrawBitmap(x, y, width, height, frame);
  canvas.updateCanvas();
}`);
}

function k10AddAnimationFrameByIndexHelper(generator) {
  k10AddAnimationRenderHelper(generator);
  generator.addFunction('k10_draw_animation_frame_by_index', `void k10DrawAnimationFrameByIndex(Canvas &canvas, int32_t x, int32_t y, uint16_t width, uint16_t height, const uint8_t * const frames[], uint16_t frameCount, int32_t frameIndex) {
  if (frameCount == 0) {
    return;
  }
  if (frameIndex < 0) {
    frameIndex = 0;
  }
  if (frameIndex >= (int32_t)frameCount) {
    frameIndex = frameCount - 1;
  }
  k10DrawAnimationFrame(canvas, x, y, width, height, frames[frameIndex]);
}`);
}

Arduino.forBlock['k10_play_animation'] = function(block, generator) {
  ensureScreenInit(generator, '2');
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const animationPrefix = k10GetAnimationPrefix(block, generator);
  if (!animationPrefix) {
    return '// No K10 animation data\n';
  }

  k10AddAnimationRenderHelper(generator);
  const playMode = block.getFieldValue('PLAY_MODE') || 'BLOCKING';
  const loop = block.getFieldValue('LOOP') === 'TRUE';

  if (playMode === 'NON_BLOCKING') {
    const statePrefix = `k10_animation_state_${k10GetBlockSymbolSuffix(block)}`;
    generator.addVariable(`${statePrefix}_frame`, `uint16_t ${statePrefix}_frame = 0;`);
    generator.addVariable(`${statePrefix}_last_ms`, `uint32_t ${statePrefix}_last_ms = 0;`);
    generator.addVariable(`${statePrefix}_started`, `bool ${statePrefix}_started = false;`);
    generator.addVariable(`${statePrefix}_done`, `bool ${statePrefix}_done = false;`);

    let code = `if (!${statePrefix}_done) {\n`;
    code += `  uint32_t ${statePrefix}_now = millis();\n`;
    code += `  if (!${statePrefix}_started || ${statePrefix}_now - ${statePrefix}_last_ms >= ${animationPrefix}_frame_delay) {\n`;
    code += `    k10DrawAnimationFrame(*k10.canvas, ${x}, ${y}, ${animationPrefix}_width, ${animationPrefix}_height, ${animationPrefix}_frames[${statePrefix}_frame]);\n`;
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

  let code = `for (uint16_t k10AnimationFrameIndex = 0; k10AnimationFrameIndex < ${animationPrefix}_frame_count; k10AnimationFrameIndex++) {\n`;
  code += '  uint32_t k10AnimationFrameStartedAt = millis();\n';
  code += `  k10DrawAnimationFrame(*k10.canvas, ${x}, ${y}, ${animationPrefix}_width, ${animationPrefix}_height, ${animationPrefix}_frames[k10AnimationFrameIndex]);\n`;
  code += '  uint32_t k10AnimationFrameRenderTime = millis() - k10AnimationFrameStartedAt;\n';
  code += `  if (k10AnimationFrameRenderTime < ${animationPrefix}_frame_delay) {\n`;
  code += `    delay(${animationPrefix}_frame_delay - k10AnimationFrameRenderTime);\n`;
  code += '  }\n';
  code += '}\n';
  return code;
};

Arduino.forBlock['k10_draw_animation_frame'] = function(block, generator) {
  ensureScreenInit(generator, '2');
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const frame = generator.valueToCode(block, 'FRAME', generator.ORDER_ATOMIC) || '0';
  const animationPrefix = k10GetAnimationPrefix(block, generator);
  if (!animationPrefix) {
    return '// No K10 animation data\n';
  }

  k10AddAnimationFrameByIndexHelper(generator);
  return `k10DrawAnimationFrameByIndex(*k10.canvas, ${x}, ${y}, ${animationPrefix}_width, ${animationPrefix}_height, ${animationPrefix}_frames, ${animationPrefix}_frame_count, ${frame});\n`;
};

Arduino.forBlock['k10_animation_frame_count'] = function(block, generator) {
  const animationPrefix = k10GetAnimationPrefix(block, generator);
  if (!animationPrefix) {
    return ['0', generator.ORDER_ATOMIC];
  }
  return [`${animationPrefix}_frame_count`, generator.ORDER_ATOMIC];
};

Arduino.forBlock['k10_step_animation_frame'] = function(block, generator) {
  const frameVariable = k10GetFrameVariableCodeName(block, generator);
  const target = generator.valueToCode(block, 'TARGET', generator.ORDER_ATOMIC) || '0';
  const frameCount = generator.valueToCode(block, 'FRAME_COUNT', generator.ORDER_ATOMIC) || '1';
  const direction = block.getFieldValue('DIRECTION') || 'AUTO';
  const symbolSuffix = k10GetBlockSymbolSuffix(block);
  const targetVariable = `k10_animation_target_${symbolSuffix}`;
  const countVariable = `k10_animation_frame_count_${symbolSuffix}`;

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

// ========== 屏幕宽度 / 高度（常量）==========
Arduino.forBlock['k10_screen_size'] = function(block, generator) {
  var which = block.getFieldValue('WHICH');
  // K10 屏幕分辨率：240(W) x 320(H)（正向/反向）；横屏方向交换
  var value = which === 'W' ? '240' : '320';
  return [value, generator.ORDER_ATOMIC];
};

if (Blockly.Extensions.isRegistered('k10_animation_play_dynamic_inputs')) {
  Blockly.Extensions.unregister('k10_animation_play_dynamic_inputs');
}

Blockly.Extensions.register('k10_animation_play_dynamic_inputs', function() {
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
