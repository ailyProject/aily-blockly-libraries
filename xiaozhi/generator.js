'use strict';

function xiaozhiValue(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_NONE) || fallback;
}

function xiaozhiEnum(block, name, choices) {
  const value = String(block.getFieldValue(name));
  return choices.includes(value) ? value : choices[0];
}

function xiaozhiNumber(block, name, fallback, min = -1, max = 48) {
  const raw = block.getFieldValue(name);
  const value = raw === null || raw === '' ? fallback : Number(raw);
  return String(Math.max(min, Math.min(max, Number.isFinite(value) ? Math.round(value) : fallback)));
}

function xiaozhiInclude(generator) {
  // Keep the optional network dependency discoverable by Arduino's library scanner.
  generator.addLibrary('xiaozhi', '#include <ArduinoWebsockets.h>\n#include <AilyXiaozhi.h>');
}

function xiaozhiEnsure(block, generator) {
  if (generator._xiaozhiToolHandler) {
    throw new Error('MCP 工具处理区不能调用小智客户端积木 / Xiaozhi client blocks cannot run inside an MCP tool handler.');
  }
  xiaozhiInclude(generator);
  // All blocks share one internal global, including independent event roots.
  // Register in the host's global-variable section, independent of traversal order.
  const name = 'xiaozhiClient';
  generator.addVariable('xiaozhi_loop_stack', 'SET_LOOP_TASK_STACK_SIZE(16 * 1024);');
  generator.addVariable('xiaozhi_' + name, 'AilyXiaozhi ' + name + ';');
  generator.addLoopBegin('xiaozhi_' + name, name + '.loop();');
  return name;
}

Arduino.forBlock['xiaozhi_create'] = function(block, generator) {
  xiaozhiEnsure(block, generator);
  return '';
};

Arduino.forBlock['xiaozhi_wifi_begin'] = function(block, generator) {
  if (generator._xiaozhiToolHandler) {
    throw new Error('MCP 工具处理区不能重新配置 WiFi / WiFi configuration cannot run inside an MCP tool handler.');
  }
  generator.addLibrary('WiFi', '#include <WiFi.h>');
  const ssid = xiaozhiValue(block, generator, 'SSID', '""');
  const password = xiaozhiValue(block, generator, 'PASSWORD', '""');
  return 'WiFi.mode(WIFI_STA);\nWiFi.setAutoReconnect(true);\nWiFi.begin(String(' + ssid + ').c_str(), String(' + password + ').c_str());\n';
};

Arduino.forBlock['xiaozhi_begin_official'] = function(block, generator) {
  return xiaozhiEnsure(block, generator) + '.beginOfficial();\n';
};
Arduino.forBlock['xiaozhi_begin_websocket'] = function(block, generator) {
  const name = xiaozhiEnsure(block, generator);
  return name + '.beginWebSocket(String(' + xiaozhiValue(block, generator, 'URL', '""') + '), String(' +
    xiaozhiValue(block, generator, 'TOKEN', '""') + '), String(' + xiaozhiValue(block, generator, 'CA', '""') + '), ' +
    xiaozhiEnum(block, 'PROTOCOL', ['1', '2', '3']) + ');\n';
};
Arduino.forBlock['xiaozhi_features'] = function(block, generator) {
  return xiaozhiEnsure(block, generator) + '.setFeatures(' + ['AEC', 'BARGE_IN', 'RAW_JSON'].map(key => block.getFieldValue(key) === 'TRUE' ? 'true' : 'false').join(', ') + ');\n';
};
Arduino.forBlock['xiaozhi_timeouts'] = function(block, generator) {
  return xiaozhiEnsure(block, generator) + '.setTimeouts(' + xiaozhiValue(block, generator, 'HANDSHAKE', '10000') + ', ' + xiaozhiValue(block, generator, 'CHANNEL', '120000') + ');\n';
};
Arduino.forBlock['xiaozhi_identity'] = function(block, generator) {
  return xiaozhiEnsure(block, generator) + '.setIdentity(String(' + xiaozhiValue(block, generator, 'DEVICE', '""') + '), String(' + xiaozhiValue(block, generator, 'CLIENT', '""') + '));\n';
};

const xiaozhiActions = {stop:'stop', stop_listening:'stopListening', toggle_chat:'toggleChat', close_session:'closeSession'};
Object.keys(xiaozhiActions).forEach(function(type) {
  Arduino.forBlock['xiaozhi_' + type] = function(block, generator) {
    return xiaozhiEnsure(block, generator) + '.' + xiaozhiActions[type] + '();\n';
  };
});
Arduino.forBlock['xiaozhi_start_listening'] = function(block, generator) {
  return xiaozhiEnsure(block, generator) + '.startListening(xiaozhi::ListeningMode::' + xiaozhiEnum(block, 'MODE', ['AutoStop', 'ManualStop', 'Realtime']) + ');\n';
};
Arduino.forBlock['xiaozhi_abort_speaking'] = function(block, generator) {
  return xiaozhiEnsure(block, generator) + '.abortSpeaking(xiaozhi::AbortReason::' + xiaozhiEnum(block, 'REASON', ['None', 'WakeWordDetected']) + ');\n';
};
Arduino.forBlock['xiaozhi_wake_word'] = function(block, generator) {
  return xiaozhiEnsure(block, generator) + '.wakeWord(String(' + xiaozhiValue(block, generator, 'WORD', '"你好小智"') + '));\n';
};
Arduino.forBlock['xiaozhi_mute'] = function(block, generator) {
  return xiaozhiEnsure(block, generator) + '.mute(' + xiaozhiValue(block, generator, 'MUTED', 'true') + ');\n';
};
Arduino.forBlock['xiaozhi_send_mcp'] = function(block, generator) {
  return xiaozhiEnsure(block, generator) + '.sendMcp(String(' + xiaozhiValue(block, generator, 'JSON', '"{}"') + '));\n';
};

function xiaozhiAudioEntry(block, generator, includes) {
  // An Arduino translation unit can compile exactly one upstream audio profile.
  // Checking the workspace avoids carrying profile state into the next generation.
  const workspace = block.workspace;
  if (workspace && typeof workspace.getAllBlocks === 'function') {
    const audioBlocks = workspace.getAllBlocks(false).filter(b => /^xiaozhi_audio_(preset|es8311|i2s|pdm)$/.test(b.type) &&
      (!b.isEnabled || b.isEnabled()) && (!b.getInheritedDisabled || !b.getInheritedDisabled()));
    if (audioBlocks.length > 1) {
      throw new Error('小智：每个程序只能使用一个音频硬件配置积木 / Use only one Xiaozhi audio configuration per sketch.');
    }
  }
  generator.addLibrary('xiaozhi_audio', '#if !defined(CONFIG_IDF_TARGET_ESP32S3)\n#error "Bundled Xiaozhi Opus audio requires ESP32-S3"\n#endif\n#include <EspressifOpus.h>\n' + includes);
  return xiaozhiEnsure(block, generator);
}

function xiaozhiAudioAttach(name, configCode) {
  // Local static gives the borrowed audio pointer sketch lifetime. Configuration
  // runs in setup, after user inputs/globals are initialized, not before Arduino.
  return 'if (!' + name + '.running()) {\n  static I2sOpusAudioPort xiaozhiAudio([&]() {\n' +
    configCode + '    return config;\n  }());\n  ' + name + '.attachAudio(&xiaozhiAudio);\n}\n';
}

Arduino.forBlock['xiaozhi_audio_preset'] = function(block, generator) {
  const board = xiaozhiEnum(block, 'BOARD', ['NULLLAB_AI_VOX3', 'NULLLAB_AI_VOX', 'OJ_ESP32S3_BASIC', 'OJ_ESP32S3_OJOY']);
  const wake = block.getFieldValue('WAKE') === 'TRUE';
  // Include the preset explicitly after the core; legacy presets unconditionally
  // enable wake, so override the flag after BoardPresets and before the audio port.
  let includes = '#define XIAOZHI_BOARD ' + board + '\n#include <xiaozhi/boards/BoardPresets.h>\n#undef XIAOZHI_AUDIO_ENABLE_WAKE_ESP_SR\n#define XIAOZHI_AUDIO_ENABLE_WAKE_ESP_SR ' + (wake ? '1' : '0') + '\n';
  if (wake) includes += '#include <ESP_SR.h>\n';
  if (board !== 'NULLLAB_AI_VOX') includes += '#include <Wire.h>\n#include <EspressifEs8311.h>\n';
  includes += '#include <xiaozhi/audio/AudioBoard.h>';
  // Ensure Xiaozhi.h has already been loaded before the board macro is defined.
  xiaozhiInclude(generator);
  const name = xiaozhiAudioEntry(block, generator, includes);
  let config = '    auto config = xiaozhi_audio_board::makeConfig();\n    config.enableWakeDetection = ' + (wake ? 'true' : 'false') + ';\n';
  if (wake) {
    config += '    config.wakeModelPartition = "model";\n    config.wakeModelKeyword = "wn9_nihaoxiaozhi_tts";\n';
  }
  if (board === 'OJ_ESP32S3_OJOY') {
    // Keep the proven OJoy speech path with its board wiring preset.
    config += '    config.inputTaskStackBytes = 4 * 1024;\n    config.outputTaskStackBytes = 3 * 1024;\n' +
      '    config.hardware.es8311.outputVolumeDb = -12.0f;\n    config.hardware.es8311.playbackMicrophoneGainDb = 12.0f;\n' +
      '    config.playbackMuteDelayMs = 150;\n    config.enableSpeechConditioning = true;\n' +
      '    config.speechGateRms = 40;\n    config.speechTargetRms = 2200;\n    config.speechMaximumGain = 16.0f;\n' +
      '    config.speechSilenceGain = 0.25f;\n    config.speechStartPackets = 2;\n    config.speechHoldMs = 420;\n';
    if (wake) {
      config += '    config.enableWakeWordInterruption = true;\n    config.enableWakeAec = true;\n' +
        '    config.wakeAecDuringPlaybackOnly = true;\n    config.wakeDetectionThreshold = 0.55f;\n';
    }
  }
  // The installer is referenced only by wake-enabled sketches, so the linker
  // drops the embedded model from headless and wake-disabled applications.
  return (wake ? name + '.useBundledWakeModel();\n' : '') + xiaozhiAudioAttach(name, config);
};

Arduino.forBlock['xiaozhi_audio_es8311'] = function(block, generator) {
  const name = xiaozhiAudioEntry(block, generator, '#include <Wire.h>\n#include <EspressifEs8311.h>\n#include <xiaozhi/audio/Es8311Audio.h>');
  let code = '    auto config = I2sOpusAudioPort::Config::forCompiledProfile();\n    auto& output = config.hardware.output;\n    output.sampleRate = 16000;\n';
  [['MCLK','mclk',11],['BCLK','bclk',10],['WS','ws',8],['DOUT','data',7]].forEach(([field,prop,def]) => {code += '    output.' + prop + ' = ' + xiaozhiNumber(block,field,def) + ';\n';});
  code += '    config.hardware.input = output;\n    config.hardware.input.data = ' + xiaozhiNumber(block,'DIN',9) + ';\n    config.captureChannel = I2sOpusAudioPort::CaptureChannel::Left;\n    auto& codec = config.hardware.es8311;\n    codec.wire = &Wire;\n';
  [['SDA','i2cSda',13],['SCL','i2cScl',12],['PA','paPin',-1]].forEach(([field,prop,def]) => {code += '    codec.' + prop + ' = ' + xiaozhiNumber(block,field,def) + ';\n';});
  code += '    codec.noDacReference = false;\n    codec.microphoneGainDb = ' + xiaozhiNumber(block,'GAIN',30,0,42) + ';\n    codec.outputVolumeDb = ' + xiaozhiNumber(block,'VOLUME',-12,-96,0) + ';\n    config.enableWakeDetection = false;\n';
  return xiaozhiAudioAttach(name, code);
};

Arduino.forBlock['xiaozhi_audio_i2s'] = function(block, generator) {
  const shared = xiaozhiEnum(block, 'BUS', ['SIMPLEX','DUPLEX']) === 'DUPLEX';
  const name = xiaozhiAudioEntry(block, generator, '#include <xiaozhi/audio/' + (shared ? 'I2sDuplexAudio' : 'I2sSimplexAudio') + '.h>');
  let code = '    auto config = I2sOpusAudioPort::Config::forCompiledProfile();\n';
  [['OUT_BCLK','output.bclk',13],['OUT_WS','output.ws',14],['DOUT','output.data',1],[shared?'OUT_BCLK':'IN_BCLK','input.bclk',shared?13:5],[shared?'OUT_WS':'IN_WS','input.ws',shared?14:2],['DIN','input.data',4],['AMP','amplifier.enablePin',-1]].forEach(([field,prop,def]) => {code += '    config.hardware.' + prop + ' = ' + xiaozhiNumber(block,field,def) + ';\n';});
  const channel = xiaozhiEnum(block,'CHANNEL',['Left','Right']);
  // The hardware slot selects L/R on the wire. Both profiles use mono DMA,
  // whose only sample is channel 0; CaptureChannel::Right requires stereo DMA.
  code += '    config.hardware.input.slot = I2sOpusAudioPort::I2sSlot::' + channel + ';\n    config.captureChannel = I2sOpusAudioPort::CaptureChannel::Left;\n    config.hardware.input.rightShift = ' + xiaozhiNumber(block,'SHIFT',12,0,31) + ';\n    config.hardware.amplifier.volumePercent = ' + xiaozhiNumber(block,'VOLUME',70,0,100) + ';\n    config.enableWakeDetection = false;\n';
  return xiaozhiAudioAttach(name,code);
};
Arduino.forBlock['xiaozhi_audio_pdm'] = function(block, generator) {
  const name = xiaozhiAudioEntry(block, generator, '#include <xiaozhi/audio/PdmAudio.h>');
  let code = '    auto config = I2sOpusAudioPort::Config::forCompiledProfile();\n';
  [['CLK','pdmInput.clock',5],['DIN','pdmInput.data',4],['BCLK','output.bclk',13],['WS','output.ws',14],['DOUT','output.data',1],['AMP','amplifier.enablePin',-1]].forEach(([field,prop,def]) => {code += '    config.hardware.' + prop + ' = ' + xiaozhiNumber(block,field,def) + ';\n';});
  code += '    config.hardware.amplifier.volumePercent = ' + xiaozhiNumber(block,'VOLUME',70,0,100) + ';\n    config.enableWakeDetection = false;\n';
  return xiaozhiAudioAttach(name,code);
};

const xiaozhiStates = ['Unknown','Starting','WifiConfiguring','Idle','Connecting','Listening','Speaking','Upgrading','Activating','AudioTesting','FatalError'];
const xiaozhiEvents = ['Stt','TtsSentence','Emotion','Alert','Custom','RebootRequested','UnknownMessage'];
const xiaozhiSimpleValues = {last_operation:['lastOperation',''],state:['stateName()','String'],capture_enabled:['captureEnabled',''],detected_wake_word:['detectedWakeWord',''],emotion_id:['event.emotion_type','static_cast<int>']};
Object.keys(xiaozhiSimpleValues).forEach(function(type) {
  Arduino.forBlock['xiaozhi_' + type] = function(block, generator) {
    const [member,cast] = xiaozhiSimpleValues[type];
    let code = xiaozhiEnsure(block,generator) + '.' + member;
    if (cast) code = cast + '(' + code + ')';
    return [code,generator.ORDER_ATOMIC];
  };
});
Arduino.forBlock['xiaozhi_ready'] = function(block,generator) {
  return [xiaozhiEnsure(block,generator) + '.' + xiaozhiEnum(block,'STATUS',['ready','running','sessionReady']) + '()',generator.ORDER_ATOMIC];
};
Arduino.forBlock['xiaozhi_is_state'] = function(block,generator) {
  return ['(' + xiaozhiEnsure(block,generator) + '.state() == xiaozhi::State::' + xiaozhiEnum(block,'STATE',xiaozhiStates) + ')',generator.ORDER_ATOMIC];
};
Arduino.forBlock['xiaozhi_event_is'] = function(block,generator) {
  return ['(' + xiaozhiEnsure(block,generator) + '.event.type == xiaozhi::EventType::' + xiaozhiEnum(block,'EVENT',xiaozhiEvents) + ')',generator.ORDER_ATOMIC];
};
Arduino.forBlock['xiaozhi_event_text'] = function(block,generator) {
  return ['String(' + xiaozhiEnsure(block,generator) + '.event.' + xiaozhiEnum(block,'FIELD',['text','emotion','status','json']) + '.c_str())',generator.ORDER_ATOMIC];
};
Arduino.forBlock['xiaozhi_activation'] = function(block,generator) {
  return [xiaozhiEnsure(block,generator) + '.' + xiaozhiEnum(block,'FIELD',['activationCode','activationMessage']),generator.ORDER_ATOMIC];
};
Arduino.forBlock['xiaozhi_error'] = function(block,generator) {
  const name = xiaozhiEnsure(block,generator);
  return [block.getFieldValue('FIELD') === 'errorName' ? 'String(xiaozhi::errorName(' + name + '.errorCode))' : name + '.lastError',generator.ORDER_ATOMIC];
};
Arduino.forBlock['xiaozhi_state_event'] = function(block,generator) {
  return ['String(xiaozhi::stateName(' + xiaozhiEnsure(block,generator) + '.' + xiaozhiEnum(block,'FIELD',['eventState','previousState']) + '))',generator.ORDER_ATOMIC];
};
Arduino.forBlock['xiaozhi_audio_meta'] = function(block,generator) {
  const field = xiaozhiEnum(block,'FIELD',['opus_bytes','timestamp','sample_rate','frame_duration_ms','channels']);
  return [xiaozhiEnsure(block,generator) + '.audioMeta.' + (['opus_bytes','timestamp'].includes(field) ? '' : 'format.') + field,generator.ORDER_ATOMIC];
};
Arduino.forBlock['xiaozhi_stats'] = function(block,generator) {
  return [xiaozhiEnsure(block,generator) + '.stats().' + xiaozhiEnum(block,'FIELD',['commands_rejected','callbacks_dropped','playback_first_audio_timeouts','playback_inter_packet_timeouts','service_cycle_overruns']),generator.ORDER_ATOMIC];
};

const xiaozhiCallbackMembers = {event:'onEvent',state:'onState',error:'onError',activation:'onActivation',capture:'onCapture',wake:'onWake',audio:'onAudio'};
Object.keys(xiaozhiCallbackMembers).forEach(function(type) {
  Arduino.forBlock['xiaozhi_on_' + type] = function(block,generator) {
    const name = xiaozhiEnsure(block,generator);
    const member = xiaozhiCallbackMembers[type];
    let handler = generator.statementToCode(block,'HANDLER') || '';
    if (type === 'event' && block.getFieldValue('EVENT') !== 'ALL') {
      handler = '    if (' + name + '.event.type == xiaozhi::EventType::' + xiaozhiEnum(block,'EVENT',xiaozhiEvents) + ') {\n' + handler + '    }\n';
    }
    const code = '{\n  auto xiaozhiPrevious = ' + name + '.' + member + ';\n  ' + name + '.' + member + ' = [xiaozhiPrevious]() {\n    if (xiaozhiPrevious) xiaozhiPrevious();\n' + handler + '  };\n}\n';
    generator.addSetupBegin('xiaozhi_callback_' + block.id,code);
    return '';
  };
});

// These child blocks intentionally emit lexical references owned by xiaozhi_tool.
// The editor warning points out a wrong placement before C++ compilation.
function xiaozhiToolScope(block, area) {
  if (typeof block.getSurroundParent !== 'function') return;
  let current = block;
  let parent = current.getSurroundParent();
  let valid = false;
  const visited = new Set();
  while (parent && !visited.has(parent)) {
    visited.add(parent);
    if (parent.type === 'xiaozhi_tool') {
      const input = typeof parent.getInputWithBlock === 'function' ? parent.getInputWithBlock(current) : null;
      valid = !input || input.name === area;
      break;
    }
    current = parent;
    parent = typeof current.getSurroundParent === 'function' ? current.getSurroundParent() : null;
  }
  if (typeof block.setWarningText === 'function') block.setWarningText(valid ? null : '此积木必须放在 MCP 工具的 ' + area + ' 区域 / Place this block inside the MCP tool ' + area + ' input.', 'xiaozhi_scope');
}

Arduino.forBlock['xiaozhi_tool'] = function(block,generator) {
  const name = xiaozhiEnsure(block,generator);
  const properties = generator.statementToCode(block,'PROPERTIES') || '';
  let handler;
  const oldContext = generator._xiaozhiToolHandler;
  try {
    generator._xiaozhiToolHandler = true;
    handler = generator.statementToCode(block,'HANDLER') || '';
  } finally {
    generator._xiaozhiToolHandler = oldContext;
  }
  const code = '{\n  xiaozhi::McpTool xiaozhiTool;\n  xiaozhiTool.name = String(' + xiaozhiValue(block,generator,'NAME','"device.tool"') + ').c_str();\n  xiaozhiTool.description = String(' + xiaozhiValue(block,generator,'DESCRIPTION','""') + ').c_str();\n' + properties +
    '  xiaozhiTool.handler = [](const xiaozhi::McpArguments& xiaozhiArguments) -> xiaozhi::McpResult {\n    (void)xiaozhiArguments;\n' + handler + '    return xiaozhi::McpResult::Text("OK");\n  };\n  ' + name + '.addTool(std::move(xiaozhiTool));\n}\n';
  // Value inputs can reference variables initialized by the user's setup code.
  // Startup is deferred to loop(), so tools can safely register at setup end.
  generator.addSetupEnd('xiaozhi_tool_' + block.id,code);
  return '';
};

['string','number','boolean'].forEach(function(type) {
  const cppType = {string:'String',number:'Integer',boolean:'Boolean'}[type];
  Arduino.forBlock['xiaozhi_property_' + type] = function(block,generator) {
    xiaozhiToolScope(block,'PROPERTIES');
    xiaozhiInclude(generator);
    const propertyName = JSON.stringify(block.getFieldValue('NAME') || 'value');
    const required = block.getFieldValue('REQUIRED') === 'TRUE';
    let params = propertyName;
    if (!required) {
      const value = xiaozhiValue(block,generator,'DEFAULT',type==='string'?'""':type==='number'?'0':'false');
      params += ', ' + (type==='string' ? 'std::string(String(' + value + ').c_str())' : type==='number' ? 'static_cast<int32_t>(' + value + ')' : value);
    }
    if (type==='number') params += ', ' + xiaozhiNumber(block,'MIN',0,-2147483648,2147483647) + ', ' + xiaozhiNumber(block,'MAX',100,-2147483648,2147483647);
    return 'xiaozhiTool.properties.push_back(xiaozhi::McpProperty::' + cppType + '(' + params + '));\n';
  };
  Arduino.forBlock['xiaozhi_argument_' + type] = function(block,generator) {
    xiaozhiToolScope(block,'HANDLER');
    xiaozhiInclude(generator);
    const method = {string:'argumentString',number:'argumentNumber',boolean:'argumentBoolean'}[type];
    return ['AilyXiaozhi::' + method + '(xiaozhiArguments, String(' + xiaozhiValue(block,generator,'NAME','"value"') + '))',generator.ORDER_ATOMIC];
  };
});
['string','number','boolean','json','error'].forEach(function(type) {
  Arduino.forBlock['xiaozhi_return_' + type] = function(block,generator) {
    xiaozhiToolScope(block,'HANDLER');
    xiaozhiInclude(generator);
    const method = {string:'Text',number:'Integer',boolean:'Boolean',json:'Json',error:'Error'}[type];
    let value = xiaozhiValue(block,generator,'VALUE',type==='number'?'0':type==='boolean'?'false':'""');
    if (!['number','boolean'].includes(type)) value = 'std::string(String(' + value + ').c_str())';
    if (type === 'number') value = 'static_cast<int32_t>(' + value + ')';
    return 'return xiaozhi::McpResult::' + method + '(' + value + ');\n';
  };
});
