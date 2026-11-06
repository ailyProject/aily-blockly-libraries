// OV3660：DVP 640x480 RGB565 大端（ESP32-S31 的 DVP 控制器），引脚读开发板的 cameraConfig，SCCB 0x3C 走 Wire

// I2C 引脚按板卡选：aily_iic 设过的自定义引脚 > 芯片自己的板卡配置 > 板卡 i2cPins > Wire 默认引脚
Arduino.ov3660WireBegin = function (generator, devicePins) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  let pins = null;
  try {
    const board = window['boardConfig'] || {};
    const custom = window['customI2CPins'] && window['customI2CPins']['Wire'];
    const pick = list => {
      const sda = list && list.find(p => p[0] === 'SDA');
      const scl = list && list.find(p => p[0] === 'SCL');
      return sda && scl ? { sda: sda[1], scl: scl[1] } : null;
    };
    if (custom) pins = pick(custom);
    else if (devicePins && devicePins.sda != null && devicePins.scl != null) pins = { sda: devicePins.sda, scl: devicePins.scl };
    else pins = pick(board.i2cPins && board.i2cPins['Wire']);
    // 只有 ESP32 的 Wire.begin 能带引脚
    if (!(board.core && String(board.core).indexOf('esp32') > -1)) pins = null;
  } catch (e) {
    pins = null;
  }
  const code = pins ? 'Wire.begin(' + pins.sda + ', ' + pins.scl + ');' : 'Wire.begin();';
  let old = null;
  try {
    old = generator.codeDict.setups_begin['wire_Wire_begin'];
  } catch (e) {}
  generator.addSetupBegin('wire_Wire_begin', code, !!(pins && old && /\.begin\(\s*\)/.test(old)));
};

// 当前开发板 board.json 里的某项配置（没有就是 null）
Arduino.ov3660BoardConfig = function (key) {
  try {
    const board = window['boardConfig'];
    return board && board[key] ? board[key] : null;
  } catch (e) {
    return null;
  }
};

Arduino.ov3660Ensure = function (generator) {
  generator.addLibrary('OV3660', '#include <OV3660.h>\n#include <OV3660Stream.h>');
  generator.addVariable('ov3660', 'OV3660 ov3660;\nOV3660Stream ov3660_stream(ov3660);');
  // RGB565 像素 → 8 位 R G B（原始帧是大端；视频流可能是小端）
  generator.addFunction('ov3660_rgb', [
    'void ov3660_rgb(uint16_t pixel, bool bigEndian, uint8_t &r, uint8_t &g, uint8_t &b) {',
    '  const uint16_t v = bigEndian ? (uint16_t)((pixel >> 8) | (pixel << 8)) : pixel;',
    '  r = ((v >> 11) & 0x1F) * 255 / 31;',
    '  g = ((v >> 5) & 0x3F) * 255 / 63;',
    '  b = (v & 0x1F) * 255 / 31;',
    '}',
  ].join('\n'));
};

// 拍一帧后留一张 80x60 的缩略图（每 8x8 像素取一点）和整幅平均值
Arduino.ov3660FrameEnsure = function (generator) {
  Arduino.ov3660Ensure(generator);
  generator.addVariable('ov3660_frame', [
    'uint8_t ov3660_thumb[60][80][3];',
    'uint8_t ov3660_avg[4] = {0, 0, 0, 0};',
  ].join('\n'));
  generator.addFunction('ov3660_capture', [
    'bool ov3660_capture() {',
    '  OV3660Frame f;',
    '  const uint16_t *px = nullptr;',
    '  int w, h;',
    '  // 视频流开着时帧都归它，从流里拿（已经正立）；否则直接取原始帧（上下颠倒）',
    '  const bool fromStream = ov3660_stream.running();',
    '  if (fromStream) {',
    '    if (!ov3660_stream.acquire(&px, false, 500)) return false;',
    '    w = ov3660_stream.width(); h = ov3660_stream.height();',
    '  } else {',
    '    if (!ov3660.isReady() || !ov3660.getFrame(f, 500)) return false;',
    '    if (f.len < (size_t)f.width * f.height * 2) { ov3660.returnFrame(f); return false; }',
    '    px = f.data; w = f.width; h = f.height;',
    '  }',
    '  const bool be = !fromStream || !ov3660_stream.littleEndian();',
    '  uint32_t sum[3] = {0, 0, 0};',
    '  for (int ty = 0; ty < 60; ++ty) {',
    '    const int y = ty * h / 60;',
    '    const uint16_t *row = px + (size_t)(fromStream ? y : h - 1 - y) * w;',
    '    for (int tx = 0; tx < 80; ++tx) {',
    '      uint8_t *p = ov3660_thumb[ty][tx];',
    '      ov3660_rgb(row[tx * w / 80], be, p[0], p[1], p[2]);',
    '      sum[0] += p[0]; sum[1] += p[1]; sum[2] += p[2];',
    '    }',
    '  }',
    '  if (fromStream) ov3660_stream.release(); else ov3660.returnFrame(f);',
    '  for (int i = 0; i < 3; ++i) ov3660_avg[i + 1] = sum[i] / (60 * 80);',
    '  ov3660_avg[0] = (ov3660_avg[1] * 299 + ov3660_avg[2] * 587 + ov3660_avg[3] * 114) / 1000;',
    '  return true;',
    '}',
  ].join('\n'));
};

// 板卡 cameraConfig：supportedModels 里要有 ov3660；y2..y9 是 D0..D7（esp32-camera 的叫法）
Arduino.forBlock['ov3660_init'] = function (block, generator) {
  Arduino.ov3660Ensure(generator);
  const cfg = Arduino.ov3660BoardConfig('cameraConfig');
  const models = cfg && Array.isArray(cfg.supportedModels) ? cfg.supportedModels.map(m => String(m).toLowerCase()) : [];
  if (models.length && models.indexOf('ov3660') < 0) {
    generator.addLibrary('ov3660_board_check', '#error "OV3660 库：当前开发板的摄像头是 ' + models.join('/').replace(/"/g, '') + '，不是 OV3660"');
    return '';
  }
  if (!(cfg && cfg.pins)) {
    // 板卡没写摄像头配置：用库里的默认引脚（智盒板 IBox S31 的接线）
    Arduino.ov3660WireBegin(generator);
    return 'ov3660.begin(Wire);\n';
  }
  const p = cfg.pins;
  const pin = v => (v === undefined || v === null || v === '' ? '-1' : String(v));
  Arduino.ov3660WireBegin(generator, { sda: p.sda, scl: p.scl });
  generator.addFunction('ov3660_board_pins', [
    'OV3660Pins ov3660_board_pins() {',
    '  OV3660Pins p;',
    '  const int data[8] = { ' + ['y2', 'y3', 'y4', 'y5', 'y6', 'y7', 'y8', 'y9'].map(k => pin(p[k])).join(', ') + ' };',
    '  for (int i = 0; i < 8; i++) p.data[i] = data[i];',
    '  p.pclk = ' + pin(p.pclk) + ';',
    '  p.xclk = ' + pin(p.xclk) + ';',
    '  p.vsync = ' + pin(p.vsync) + ';',
    '  p.href = ' + pin(p.href) + ';',
    '  return p;',
    '}',
  ].join('\n'));
  return 'ov3660.begin(Wire, -1, -1, OV3660::DEFAULT_XCLK_HZ, 2, ov3660_board_pins());\n';
};

Arduino.forBlock['ov3660_ready'] = function (block, generator) {
  Arduino.ov3660Ensure(generator);
  return ['ov3660.isReady()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['ov3660_error'] = function (block, generator) {
  Arduino.ov3660Ensure(generator);
  return ['String(ov3660.lastError())', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['ov3660_flip'] = function (block, generator) {
  const on = block.getFieldValue('STATE') === 'false' ? 'false' : 'true';
  const call = block.getFieldValue('WHAT') === 'MIRROR' ? 'setHMirror' : 'setVFlip';
  Arduino.ov3660Ensure(generator);
  return 'ov3660.' + call + '(' + on + ');\n';
};

Arduino.forBlock['ov3660_exposure'] = function (block, generator) {
  const level = generator.valueToCode(block, 'LEVEL', generator.ORDER_ATOMIC) || '0';
  Arduino.ov3660Ensure(generator);
  return 'ov3660.setAELevel(constrain((int)(' + level + '), -5, 5));\n';
};

Arduino.forBlock['ov3660_capture'] = function (block, generator) {
  Arduino.ov3660FrameEnsure(generator);
  return ['ov3660_capture()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['ov3660_average'] = function (block, generator) {
  const index = { R: 1, G: 2, B: 3 }[block.getFieldValue('WHAT')] || 0;
  Arduino.ov3660FrameEnsure(generator);
  return ['ov3660_avg[' + index + ']', generator.ORDER_ATOMIC];
};

Arduino.forBlock['ov3660_pixel'] = function (block, generator) {
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const index = { R: 1, G: 2, B: 3 }[block.getFieldValue('WHAT')] || 0;
  Arduino.ov3660FrameEnsure(generator);
  generator.addFunction('ov3660_pixel', [
    'int ov3660_pixel(int x, int y, int what) {',
    '  const uint8_t *p = ov3660_thumb[constrain(y, 0, 479) / 8][constrain(x, 0, 639) / 8];',
    '  if (what == 0) return (p[0] * 299 + p[1] * 587 + p[2] * 114) / 1000;',
    '  return p[what - 1];',
    '}',
  ].join('\n'));
  return ['ov3660_pixel((int)(' + x + '), (int)(' + y + '), ' + index + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['ov3660_save_bmp'] = function (block, generator) {
  const path = 'String(' + (generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '"/photo.bmp"') + ')';
  Arduino.ov3660Ensure(generator);
  generator.addLibrary('ov3660_sd', '#include <FS.h>\n#include <SD_MMC.h>');
  // BMP 自下而上存行：原始帧本身上下颠倒，按原行序写正好正立；视频流已经正立，要倒着写
  generator.addFunction('ov3660_save_bmp', [
    'bool ov3660_save_bmp(String path) {',
    '  if (!path.startsWith("/")) path = "/" + path;',
    '  OV3660Frame f;',
    '  const bool fromStream = ov3660_stream.running();',
    '  bool ok;',
    '  if (fromStream) {',
    '    const uint16_t *px = nullptr;',
    '    ok = ov3660_stream.acquire(&px, false, 500);',
    '    f.data = (uint16_t *)px; f.width = f.stride = ov3660_stream.width(); f.height = ov3660_stream.height();',
    '  } else {',
    '    if (!ov3660.isReady() || !ov3660.getFrame(f, 500)) return false;',
    '    ok = f.len >= (size_t)f.width * f.height * 2;',
    '  }',
    '  const bool be = !fromStream || !ov3660_stream.littleEndian();',
    '  File file;',
    '  if (ok) file = SD_MMC.open(path, FILE_WRITE);',
    '  const uint32_t rowBytes = ((uint32_t)f.width * 3 + 3) & ~3u;',
    '  uint8_t *line = ok && file ? (uint8_t *)malloc(rowBytes) : nullptr;',
    '  ok = ok && file && line;',
    '  if (ok) {',
    '    const uint32_t imageBytes = rowBytes * f.height, fileBytes = 54 + imageBytes;',
    '    uint8_t h[54] = {\'B\', \'M\'};',
    '    auto put32 = [&h](int at, uint32_t v) { for (int i = 0; i < 4; ++i) h[at + i] = (uint8_t)(v >> (8 * i)); };',
    '    put32(2, fileBytes); put32(10, 54); put32(14, 40); put32(18, f.width); put32(22, f.height);',
    '    h[26] = 1; h[28] = 24; put32(34, imageBytes); put32(38, 2835); put32(42, 2835);',
    '    ok = file.write(h, sizeof(h)) == sizeof(h);',
    '    memset(line, 0, rowBytes);',
    '    for (int y = 0; ok && y < f.height; ++y) {',
    '      const uint16_t *src = f.data + (size_t)(fromStream ? f.height - 1 - y : y) * f.stride;',
    '      for (int x = 0; x < f.width; ++x) ov3660_rgb(src[x], be, line[x * 3 + 2], line[x * 3 + 1], line[x * 3]);',
    '      ok = file.write(line, rowBytes) == rowBytes;',
    '    }',
    '  }',
    '  free(line);',
    '  if (file) file.close();',
    '  if (fromStream) ov3660_stream.release(); else if (f.data) ov3660.returnFrame(f);',
    '  return ok;',
    '}',
  ].join('\n'));
  return ['ov3660_save_bmp(' + path + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['ov3660_stream_start'] = function (block, generator) {
  const size = { '640': 640, '160': 160 }[block.getFieldValue('SIZE')] || 320;
  const little = block.getFieldValue('ORDER') === 'LE' ? 'true' : 'false';
  Arduino.ov3660Ensure(generator);
  return 'ov3660_stream.begin(' + size + ', ' + little + ');\n';
};

Arduino.forBlock['ov3660_stream_stop'] = function (block, generator) {
  Arduino.ov3660Ensure(generator);
  return 'ov3660_stream.end();\n';
};

Arduino.forBlock['ov3660_stream_new_frame'] = function (block, generator) {
  Arduino.ov3660Ensure(generator);
  // 拿住最新的新帧，直到下一次判断；之后用 ov3660_stream.pixels() 读
  generator.addFunction('ov3660_stream_next', [
    'bool ov3660_stream_next() {',
    '  const uint16_t *px = nullptr;',
    '  return ov3660_stream.acquire(&px, true, 0);',
    '}',
  ].join('\n'));
  return ['ov3660_stream_next()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['ov3660_stream_pixels'] = function (block, generator) {
  Arduino.ov3660Ensure(generator);
  return ['ov3660_stream.pixels()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['ov3660_stream_info'] = function (block, generator) {
  const call = { HEIGHT: 'height()', FPS: 'fps()', FRAMES: 'frames()', BYTES: 'bytes()' }[block.getFieldValue('WHAT')] || 'width()';
  Arduino.ov3660Ensure(generator);
  return ['ov3660_stream.' + call, generator.ORDER_FUNCTION_CALL];
};
