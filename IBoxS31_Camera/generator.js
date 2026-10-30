// IBoxS31_Camera：OV3660 DVP 640x480 RGB565 大端（SCCB 0x3C 与板上 I2C 共用）

// 引脚和 I2C 地址按智盒板 IBox S31 写死，换成别的板时在代码里留个提醒
Arduino.iboxs31BoardNote = function () {
  try {
    const boardConfig = window['boardConfig'];
    const name = boardConfig && boardConfig.name ? String(boardConfig.name) : '';
    if (name && !/ibox\s*s31/i.test(name)) {
      return '// 注意：当前开发板是 ' + name + '，本库按智盒板 IBox S31 的引脚和 I2C 地址编写\n';
    }
  } catch (e) {}
  return '';
};

Arduino.iboxs31CameraEnsure = function (generator) {
  generator.addLibrary('IBoxS31_Camera', '#include <IBoxS31_Camera.h>\n#include <IBoxS31_CameraStream.h>');
  generator.addVariable('iboxs31_camera', 'IBoxS31_Camera iboxs31_camera;\nIBoxS31_CameraStream iboxs31_camera_stream(iboxs31_camera);');
  // RGB565 像素 → 8 位 R G B（原始帧是大端；视频流可能是小端）
  generator.addFunction('iboxs31_camera_rgb', [
    'void iboxs31_camera_rgb(uint16_t pixel, bool bigEndian, uint8_t &r, uint8_t &g, uint8_t &b) {',
    '  const uint16_t v = bigEndian ? (uint16_t)((pixel >> 8) | (pixel << 8)) : pixel;',
    '  r = ((v >> 11) & 0x1F) * 255 / 31;',
    '  g = ((v >> 5) & 0x3F) * 255 / 63;',
    '  b = (v & 0x1F) * 255 / 31;',
    '}',
  ].join('\n'));
};

// 拍一帧后留一张 80x60 的缩略图（每 8x8 像素取一点）和整幅平均值
Arduino.iboxs31CameraFrameEnsure = function (generator) {
  Arduino.iboxs31CameraEnsure(generator);
  generator.addVariable('iboxs31_camera_frame', [
    'uint8_t iboxs31_camera_thumb[60][80][3];',
    'uint8_t iboxs31_camera_avg[4] = {0, 0, 0, 0};',
  ].join('\n'));
  generator.addFunction('iboxs31_camera_capture', [
    'bool iboxs31_camera_capture() {',
    '  IBoxS31_CameraFrame f;',
    '  const uint16_t *px = nullptr;',
    '  int w, h;',
    '  // 视频流开着时帧都归它，从流里拿（已经正立）；否则直接取原始帧（上下颠倒）',
    '  const bool fromStream = iboxs31_camera_stream.running();',
    '  if (fromStream) {',
    '    if (!iboxs31_camera_stream.acquire(&px, false, 500)) return false;',
    '    w = iboxs31_camera_stream.width(); h = iboxs31_camera_stream.height();',
    '  } else {',
    '    if (!iboxs31_camera.isReady() || !iboxs31_camera.getFrame(f, 500)) return false;',
    '    if (f.len < (size_t)f.width * f.height * 2) { iboxs31_camera.returnFrame(f); return false; }',
    '    px = f.data; w = f.width; h = f.height;',
    '  }',
    '  const bool be = !fromStream || !iboxs31_camera_stream.littleEndian();',
    '  uint32_t sum[3] = {0, 0, 0};',
    '  for (int ty = 0; ty < 60; ++ty) {',
    '    const int y = ty * h / 60;',
    '    const uint16_t *row = px + (size_t)(fromStream ? y : h - 1 - y) * w;',
    '    for (int tx = 0; tx < 80; ++tx) {',
    '      uint8_t *p = iboxs31_camera_thumb[ty][tx];',
    '      iboxs31_camera_rgb(row[tx * w / 80], be, p[0], p[1], p[2]);',
    '      sum[0] += p[0]; sum[1] += p[1]; sum[2] += p[2];',
    '    }',
    '  }',
    '  if (fromStream) iboxs31_camera_stream.release(); else iboxs31_camera.returnFrame(f);',
    '  for (int i = 0; i < 3; ++i) iboxs31_camera_avg[i + 1] = sum[i] / (60 * 80);',
    '  iboxs31_camera_avg[0] = (iboxs31_camera_avg[1] * 299 + iboxs31_camera_avg[2] * 587 + iboxs31_camera_avg[3] * 114) / 1000;',
    '  return true;',
    '}',
  ].join('\n'));
};

Arduino.forBlock['iboxs31_camera_init'] = function (block, generator) {
  Arduino.iboxs31CameraEnsure(generator);
  return Arduino.iboxs31BoardNote() + 'iboxs31_camera.begin(Wire, 0, 1);\n';
};

Arduino.forBlock['iboxs31_camera_ready'] = function (block, generator) {
  Arduino.iboxs31CameraEnsure(generator);
  return ['iboxs31_camera.isReady()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['iboxs31_camera_error'] = function (block, generator) {
  Arduino.iboxs31CameraEnsure(generator);
  return ['String(iboxs31_camera.lastError())', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['iboxs31_camera_flip'] = function (block, generator) {
  const on = block.getFieldValue('STATE') === 'false' ? 'false' : 'true';
  const call = block.getFieldValue('WHAT') === 'MIRROR' ? 'setHMirror' : 'setVFlip';
  Arduino.iboxs31CameraEnsure(generator);
  return 'iboxs31_camera.' + call + '(' + on + ');\n';
};

Arduino.forBlock['iboxs31_camera_exposure'] = function (block, generator) {
  const level = generator.valueToCode(block, 'LEVEL', generator.ORDER_ATOMIC) || '0';
  Arduino.iboxs31CameraEnsure(generator);
  return 'iboxs31_camera.setAELevel(constrain((int)(' + level + '), -5, 5));\n';
};

Arduino.forBlock['iboxs31_camera_capture'] = function (block, generator) {
  Arduino.iboxs31CameraFrameEnsure(generator);
  return ['iboxs31_camera_capture()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['iboxs31_camera_average'] = function (block, generator) {
  const index = { R: 1, G: 2, B: 3 }[block.getFieldValue('WHAT')] || 0;
  Arduino.iboxs31CameraFrameEnsure(generator);
  return ['iboxs31_camera_avg[' + index + ']', generator.ORDER_ATOMIC];
};

Arduino.forBlock['iboxs31_camera_pixel'] = function (block, generator) {
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const index = { R: 1, G: 2, B: 3 }[block.getFieldValue('WHAT')] || 0;
  Arduino.iboxs31CameraFrameEnsure(generator);
  generator.addFunction('iboxs31_camera_pixel', [
    'int iboxs31_camera_pixel(int x, int y, int what) {',
    '  const uint8_t *p = iboxs31_camera_thumb[constrain(y, 0, 479) / 8][constrain(x, 0, 639) / 8];',
    '  if (what == 0) return (p[0] * 299 + p[1] * 587 + p[2] * 114) / 1000;',
    '  return p[what - 1];',
    '}',
  ].join('\n'));
  return ['iboxs31_camera_pixel((int)(' + x + '), (int)(' + y + '), ' + index + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['iboxs31_camera_save_bmp'] = function (block, generator) {
  const path = 'String(' + (generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '"/photo.bmp"') + ')';
  Arduino.iboxs31CameraEnsure(generator);
  generator.addLibrary('iboxs31_camera_sd', '#include <FS.h>\n#include <SD_MMC.h>');
  // BMP 自下而上存行：原始帧本身上下颠倒，按原行序写正好正立；视频流已经正立，要倒着写
  generator.addFunction('iboxs31_camera_save_bmp', [
    'bool iboxs31_camera_save_bmp(String path) {',
    '  if (!path.startsWith("/")) path = "/" + path;',
    '  IBoxS31_CameraFrame f;',
    '  const bool fromStream = iboxs31_camera_stream.running();',
    '  bool ok;',
    '  if (fromStream) {',
    '    const uint16_t *px = nullptr;',
    '    ok = iboxs31_camera_stream.acquire(&px, false, 500);',
    '    f.data = (uint16_t *)px; f.width = f.stride = iboxs31_camera_stream.width(); f.height = iboxs31_camera_stream.height();',
    '  } else {',
    '    if (!iboxs31_camera.isReady() || !iboxs31_camera.getFrame(f, 500)) return false;',
    '    ok = f.len >= (size_t)f.width * f.height * 2;',
    '  }',
    '  const bool be = !fromStream || !iboxs31_camera_stream.littleEndian();',
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
    '      for (int x = 0; x < f.width; ++x) iboxs31_camera_rgb(src[x], be, line[x * 3 + 2], line[x * 3 + 1], line[x * 3]);',
    '      ok = file.write(line, rowBytes) == rowBytes;',
    '    }',
    '  }',
    '  free(line);',
    '  if (file) file.close();',
    '  if (fromStream) iboxs31_camera_stream.release(); else if (f.data) iboxs31_camera.returnFrame(f);',
    '  return ok;',
    '}',
  ].join('\n'));
  return ['iboxs31_camera_save_bmp(' + path + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['iboxs31_camera_stream_start'] = function (block, generator) {
  const size = { '640': 640, '160': 160 }[block.getFieldValue('SIZE')] || 320;
  const little = block.getFieldValue('ORDER') === 'LE' ? 'true' : 'false';
  Arduino.iboxs31CameraEnsure(generator);
  return 'iboxs31_camera_stream.begin(' + size + ', ' + little + ');\n';
};

Arduino.forBlock['iboxs31_camera_stream_stop'] = function (block, generator) {
  Arduino.iboxs31CameraEnsure(generator);
  return 'iboxs31_camera_stream.end();\n';
};

Arduino.forBlock['iboxs31_camera_stream_new_frame'] = function (block, generator) {
  Arduino.iboxs31CameraEnsure(generator);
  // 拿住最新的新帧，直到下一次判断；之后用 iboxs31_camera_stream.pixels() 读
  generator.addFunction('iboxs31_camera_stream_next', [
    'bool iboxs31_camera_stream_next() {',
    '  const uint16_t *px = nullptr;',
    '  return iboxs31_camera_stream.acquire(&px, true, 0);',
    '}',
  ].join('\n'));
  return ['iboxs31_camera_stream_next()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['iboxs31_camera_stream_pixels'] = function (block, generator) {
  Arduino.iboxs31CameraEnsure(generator);
  return ['iboxs31_camera_stream.pixels()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['iboxs31_camera_stream_info'] = function (block, generator) {
  const call = { HEIGHT: 'height()', FPS: 'fps()', FRAMES: 'frames()', BYTES: 'bytes()' }[block.getFieldValue('WHAT')] || 'width()';
  Arduino.iboxs31CameraEnsure(generator);
  return ['iboxs31_camera_stream.' + call, generator.ORDER_FUNCTION_CALL];
};
