'use strict';

function esp32camEnsureLibrary(generator) {
  generator.addLibrary('esp32cam', '#include <esp32cam.h>');
}

function esp32camSafeTag(value) {
  return String(value || 'value').replace(/[^a-zA-Z0-9_]/g, '_');
}

function esp32camGetVariableName(block, fieldName, fallback) {
  const field = block.getField(fieldName);
  return field ? field.getText() : fallback;
}

function esp32camEnsureSerial(generator, serialName) {
  if (typeof ensureSerialBegin === 'function') {
    ensureSerialBegin(serialName, generator, 115200);
  } else {
    generator.addSetupBegin(
      'esp32cam_serial_begin_' + esp32camSafeTag(serialName),
      serialName + '.begin(115200);'
    );
  }
}

function esp32camEnsureReadyVariable(generator) {
  generator.addVariable('esp32cam_ready', 'bool _ailyEsp32camReady = false;');
}

function esp32camEnsureFrame(generator, varName) {
  esp32camEnsureLibrary(generator);
  generator.addObject(
    'esp32cam_frame_' + esp32camSafeTag(varName),
    'std::unique_ptr<esp32cam::Frame> ' + varName + ';'
  );
}

function esp32camRegisterFrameVariable(block) {
  const varName = block.getFieldValue('VAR') || 'frame';

  if (!block._esp32camFrameVarMonitorAttached) {
    block._esp32camFrameVarMonitorAttached = true;
    block._esp32camFrameVarLastName = varName;
    registerVariableToBlockly(varName, 'Esp32camFrame');

    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace ||
          (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._esp32camFrameVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'Esp32camFrame');
          block._esp32camFrameVarLastName = newName;
        }
      };
    }
  }

  return varName;
}

function esp32camResolutionCode(value) {
  const parts = String(value || '320,240').split(',');
  const width = Number(parts[0]) || 320;
  const height = Number(parts[1]) || 240;
  return 'esp32cam::Resolution::find(' + width + ', ' + height + ')';
}

function esp32camResolvePins(value) {
  if (value && value !== 'AUTO') {
    return value;
  }

  const boardConfig = typeof window !== 'undefined' && window['boardConfig']
    ? window['boardConfig']
    : {};
  const boardName = String(boardConfig.name || boardConfig.board || boardConfig.core || '').toLowerCase();
  if (boardName.includes('xiao_esp32s3') || boardName.includes('xiao esp32s3')) {
    return 'XiaoSense';
  }
  if (boardName.includes('m5camera')) {
    return 'M5Camera';
  }
  if (boardName.includes('ttgo') && boardName.includes('cam')) {
    return 'TTGO';
  }
  if (boardName.includes('freenove') && boardName.includes('cam')) {
    return 'FreeNove';
  }
  if (boardName.includes('n16r8') && boardName.includes('cam')) {
    return 'S3N16R8';
  }
  return 'AiThinker';
}

Arduino.forBlock['esp32cam_init'] = function(block, generator) {
  const pins = esp32camResolvePins(block.getFieldValue('PINS'));
  const resolution = esp32camResolutionCode(block.getFieldValue('RESOLUTION'));
  const format = block.getFieldValue('FORMAT') || 'JPEG';
  const quality = generator.valueToCode(block, 'QUALITY', generator.ORDER_ATOMIC) || '80';
  const bufferCount = generator.valueToCode(block, 'BUFFER_COUNT', generator.ORDER_ATOMIC) || '2';

  esp32camEnsureLibrary(generator);
  esp32camEnsureReadyVariable(generator);

  let formatCode = '  esp32camConfig.setJpeg(' + quality + ');\n';
  if (format === 'RGB') {
    formatCode = '  esp32camConfig.setRgb();\n';
  } else if (format === 'YUV') {
    formatCode = '  esp32camConfig.setYuv();\n';
  } else if (format === 'GRAYSCALE') {
    formatCode = '  esp32camConfig.setGrayscale();\n';
  }

  return '{\n' +
    '  esp32cam::Config esp32camConfig;\n' +
    '  esp32camConfig.setPins(esp32cam::pins::' + pins + ');\n' +
    '  esp32camConfig.setResolution(' + resolution + ');\n' +
    '  esp32camConfig.setBufferCount(' + bufferCount + ');\n' +
    formatCode +
    '  _ailyEsp32camReady = esp32cam::Camera.begin(esp32camConfig);\n' +
    '}\n';
};

Arduino.forBlock['esp32cam_end'] = function(block, generator) {
  esp32camEnsureLibrary(generator);
  esp32camEnsureReadyVariable(generator);
  return 'esp32cam::Camera.end();\n_ailyEsp32camReady = false;\n';
};

Arduino.forBlock['esp32cam_is_ready'] = function(block, generator) {
  esp32camEnsureLibrary(generator);
  esp32camEnsureReadyVariable(generator);
  return ['_ailyEsp32camReady', generator.ORDER_ATOMIC];
};

Arduino.forBlock['esp32cam_set_logger'] = function(block, generator) {
  const serialName = block.getFieldValue('SERIAL') || 'Serial';
  esp32camEnsureLibrary(generator);
  esp32camEnsureSerial(generator, serialName);
  return 'esp32cam::setLogger(' + serialName + ');\n';
};

Arduino.forBlock['esp32cam_update_resolution'] = function(block, generator) {
  const resolution = esp32camResolutionCode(block.getFieldValue('RESOLUTION'));
  esp32camEnsureLibrary(generator);
  return 'esp32cam::Camera.update([&](esp32cam::Settings& settings) {\n' +
    '  settings.resolution = ' + resolution + ';\n' +
    '}, 500);\n';
};

Arduino.forBlock['esp32cam_update_image'] = function(block, generator) {
  const brightness = generator.valueToCode(block, 'BRIGHTNESS', generator.ORDER_ATOMIC) || '0';
  const contrast = generator.valueToCode(block, 'CONTRAST', generator.ORDER_ATOMIC) || '0';
  const saturation = generator.valueToCode(block, 'SATURATION', generator.ORDER_ATOMIC) || '0';
  esp32camEnsureLibrary(generator);
  return 'esp32cam::Camera.update([&](esp32cam::Settings& settings) {\n' +
    '  settings.brightness = ' + brightness + ';\n' +
    '  settings.contrast = ' + contrast + ';\n' +
    '  settings.saturation = ' + saturation + ';\n' +
    '});\n';
};

Arduino.forBlock['esp32cam_update_gain'] = function(block, generator) {
  const gain = generator.valueToCode(block, 'GAIN', generator.ORDER_ATOMIC) || '-2';
  esp32camEnsureLibrary(generator);
  return 'esp32cam::Camera.update([&](esp32cam::Settings& settings) {\n' +
    '  settings.gain = ' + gain + ';\n' +
    '});\n';
};

Arduino.forBlock['esp32cam_update_light_mode'] = function(block, generator) {
  const mode = block.getFieldValue('MODE') || 'NONE';
  esp32camEnsureLibrary(generator);
  return 'esp32cam::Camera.update([&](esp32cam::Settings& settings) {\n' +
    '  settings.lightMode = esp32cam::LightMode::' + mode + ';\n' +
    '});\n';
};

Arduino.forBlock['esp32cam_update_special_effect'] = function(block, generator) {
  const effect = block.getFieldValue('EFFECT') || 'NONE';
  esp32camEnsureLibrary(generator);
  return 'esp32cam::Camera.update([&](esp32cam::Settings& settings) {\n' +
    '  settings.specialEffect = esp32cam::SpecialEffect::' + effect + ';\n' +
    '});\n';
};

Arduino.forBlock['esp32cam_update_flip'] = function(block, generator) {
  const hmirror = block.getFieldValue('HMIRROR') === 'TRUE' ? 'true' : 'false';
  const vflip = block.getFieldValue('VFLIP') === 'TRUE' ? 'true' : 'false';
  esp32camEnsureLibrary(generator);
  return 'esp32cam::Camera.update([&](esp32cam::Settings& settings) {\n' +
    '  settings.hmirror = ' + hmirror + ';\n' +
    '  settings.vflip = ' + vflip + ';\n' +
    '});\n';
};

Arduino.forBlock['esp32cam_update_corrections'] = function(block, generator) {
  const rawGma = block.getFieldValue('RAW_GMA') === 'TRUE' ? 'true' : 'false';
  const lensCorrection = block.getFieldValue('LENS_CORRECTION') === 'TRUE' ? 'true' : 'false';
  esp32camEnsureLibrary(generator);
  return 'esp32cam::Camera.update([&](esp32cam::Settings& settings) {\n' +
    '  settings.rawGma = ' + rawGma + ';\n' +
    '  settings.lensCorrection = ' + lensCorrection + ';\n' +
    '});\n';
};

Arduino.forBlock['esp32cam_status_number'] = function(block, generator) {
  const property = block.getFieldValue('PROPERTY') || 'WIDTH';
  const expressions = {
    WIDTH: 'esp32cam::Camera.status().resolution.getWidth()',
    HEIGHT: 'esp32cam::Camera.status().resolution.getHeight()',
    BRIGHTNESS: 'esp32cam::Camera.status().brightness',
    CONTRAST: 'esp32cam::Camera.status().contrast',
    SATURATION: 'esp32cam::Camera.status().saturation',
    GAIN: 'esp32cam::Camera.status().gain',
    LIGHT_MODE: 'static_cast<int>(esp32cam::Camera.status().lightMode)',
    SPECIAL_EFFECT: 'static_cast<int>(esp32cam::Camera.status().specialEffect)'
  };
  esp32camEnsureLibrary(generator);
  return [expressions[property] || expressions.WIDTH, generator.ORDER_ATOMIC];
};

Arduino.forBlock['esp32cam_status_boolean'] = function(block, generator) {
  const property = block.getFieldValue('PROPERTY') || 'HMIRROR';
  const expressions = {
    HMIRROR: 'esp32cam::Camera.status().hmirror',
    VFLIP: 'esp32cam::Camera.status().vflip',
    RAW_GMA: 'esp32cam::Camera.status().rawGma',
    LENS_CORRECTION: 'esp32cam::Camera.status().lensCorrection'
  };
  esp32camEnsureLibrary(generator);
  return [expressions[property] || expressions.HMIRROR, generator.ORDER_ATOMIC];
};

Arduino.forBlock['esp32cam_frame_create'] = function(block, generator) {
  const varName = esp32camRegisterFrameVariable(block);
  esp32camEnsureFrame(generator, varName);
  return varName + '.reset();\n';
};

Arduino.forBlock['esp32cam_frame_capture'] = function(block, generator) {
  const varName = esp32camGetVariableName(block, 'VAR', 'frame');
  esp32camEnsureFrame(generator, varName);
  return varName + ' = esp32cam::capture();\n';
};

Arduino.forBlock['esp32cam_frame_available'] = function(block, generator) {
  const varName = esp32camGetVariableName(block, 'VAR', 'frame');
  esp32camEnsureFrame(generator, varName);
  return ['static_cast<bool>(' + varName + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['esp32cam_frame_info'] = function(block, generator) {
  const varName = esp32camGetVariableName(block, 'VAR', 'frame');
  const property = block.getFieldValue('PROPERTY') || 'WIDTH';
  const expressions = {
    WIDTH: varName + '->getWidth()',
    HEIGHT: varName + '->getHeight()',
    SIZE: varName + '->size()',
    DATA: 'reinterpret_cast<uintptr_t>(' + varName + '->data())'
  };
  esp32camEnsureFrame(generator, varName);
  return ['(' + varName + ' ? ' + (expressions[property] || expressions.WIDTH) + ' : 0)', generator.ORDER_CONDITIONAL];
};

Arduino.forBlock['esp32cam_frame_format_is'] = function(block, generator) {
  const varName = esp32camGetVariableName(block, 'VAR', 'frame');
  const format = block.getFieldValue('FORMAT') || 'JPEG';
  const check = format === 'BMP' ? 'isBmp()' : 'isJpeg()';
  esp32camEnsureFrame(generator, varName);
  return ['(' + varName + ' && ' + varName + '->' + check + ')', generator.ORDER_LOGICAL_AND];
};

Arduino.forBlock['esp32cam_frame_convert'] = function(block, generator) {
  const varName = esp32camGetVariableName(block, 'VAR', 'frame');
  const format = block.getFieldValue('FORMAT') || 'JPEG';
  const quality = generator.valueToCode(block, 'QUALITY', generator.ORDER_ATOMIC) || '80';
  const conversion = format === 'BMP' ? 'toBmp()' : 'toJpeg(' + quality + ')';
  esp32camEnsureFrame(generator, varName);
  return 'if (' + varName + ') {\n  ' + varName + '->' + conversion + ';\n}\n';
};

Arduino.forBlock['esp32cam_frame_write_serial'] = function(block, generator) {
  const varName = esp32camGetVariableName(block, 'VAR', 'frame');
  const serialName = block.getFieldValue('SERIAL') || 'Serial';
  const timeout = generator.valueToCode(block, 'TIMEOUT', generator.ORDER_ATOMIC) || '10000';
  esp32camEnsureFrame(generator, varName);
  esp32camEnsureSerial(generator, serialName);
  return ['(' + varName + ' ? ' + varName + '->writeTo(' + serialName + ', ' + timeout + ') : false)', generator.ORDER_CONDITIONAL];
};

Arduino.forBlock['esp32cam_frame_release'] = function(block, generator) {
  const varName = esp32camGetVariableName(block, 'VAR', 'frame');
  esp32camEnsureFrame(generator, varName);
  return varName + '.reset();\n';
};

Arduino.forBlock['esp32cam_webserver_send_frame'] = function(block, generator) {
  const serverName = esp32camGetVariableName(block, 'SERVER', 'server');
  const varName = esp32camGetVariableName(block, 'VAR', 'frame');
  const timeout = generator.valueToCode(block, 'TIMEOUT', generator.ORDER_ATOMIC) || '10000';
  esp32camEnsureFrame(generator, varName);
  generator.addLibrary('WebServer', '#include <WebServer.h>');
  return 'if (' + varName + ') {\n' +
    '  ' + serverName + '.setContentLength(' + varName + '->size());\n' +
    '  ' + serverName + '.send(200, ' + varName + '->isBmp() ? "image/bmp" : (' + varName + '->isJpeg() ? "image/jpeg" : "application/octet-stream"));\n' +
    '  ' + varName + '->writeTo(' + serverName + '.client(), ' + timeout + ');\n' +
    '}\n';
};

Arduino.forBlock['esp32cam_webserver_stream_mjpeg'] = function(block, generator) {
  const serverName = esp32camGetVariableName(block, 'SERVER', 'server');
  const minInterval = generator.valueToCode(block, 'MIN_INTERVAL', generator.ORDER_ATOMIC) || '0';
  const maxFrames = generator.valueToCode(block, 'MAX_FRAMES', generator.ORDER_ATOMIC) || '-1';
  const frameTimeout = generator.valueToCode(block, 'FRAME_TIMEOUT', generator.ORDER_ATOMIC) || '10000';
  esp32camEnsureLibrary(generator);
  generator.addLibrary('WebServer', '#include <WebServer.h>');
  generator.addFunction('esp32cam_stream_mjpeg_webserver',
    'int esp32camStreamMjpeg(WebServer& server, int minInterval, int maxFrames, int frameTimeout) {\n' +
    '  esp32cam::MjpegConfig config;\n' +
    '  config.minInterval = minInterval;\n' +
    '  config.maxFrames = maxFrames;\n' +
    '  config.frameTimeout = frameTimeout;\n' +
    '  return esp32cam::Camera.streamMjpeg(server.client(), config);\n' +
    '}');
  return [
    'esp32camStreamMjpeg(' + serverName + ', ' + minInterval + ', ' + maxFrames + ', ' + frameTimeout + ')',
    generator.ORDER_FUNCTION_CALL
  ];
};
