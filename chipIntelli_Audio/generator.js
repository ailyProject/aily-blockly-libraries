'use strict';

const CHIPINTELLI_AUDIO_LANGUAGES = [
  'CHIPINTELLI_LANGUAGE_ZH',
  'CHIPINTELLI_LANGUAGE_EN',
  'CHIPINTELLI_LANGUAGE_JA',
  'CHIPINTELLI_LANGUAGE_KO',
  'CHIPINTELLI_LANGUAGE_RU',
  'CHIPINTELLI_LANGUAGE_ES',
  'CHIPINTELLI_LANGUAGE_TH',
  'CHIPINTELLI_LANGUAGE_DE',
  'CHIPINTELLI_LANGUAGE_ID',
  'CHIPINTELLI_LANGUAGE_VI',
  'CHIPINTELLI_LANGUAGE_FR',
  'CHIPINTELLI_LANGUAGE_PT',
  'CHIPINTELLI_LANGUAGE_FA',
  'CHIPINTELLI_LANGUAGE_TR',
  'CHIPINTELLI_LANGUAGE_AR'
];

function ensureChipIntelliAudio(generator) {
  generator.addLibrary('chipintelli_audio', '#include <ChipIntelliAudio.h>');
}

function chipIntelliAudioValue(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}

function chipIntelliAudioLearningManaged(block) {
  const workspace = block && block.workspace;
  if (!workspace || typeof workspace.getAllBlocks !== 'function') return false;
  return workspace.getAllBlocks(false).some(candidate => {
    if (candidate.type !== 'chipintelli_cwsl_voice_learning_init' || candidate.isInFlyout) return false;
    const visited = new Set();
    let current = candidate;
    let connected = false;
    while (current && !visited.has(current)) {
      visited.add(current);
      if (typeof current.isEnabled === 'function' && !current.isEnabled()) return false;
      if (['arduino_setup', 'arduino_loop'].indexOf(current.type) >= 0) connected = true;
      current = typeof current.getParent === 'function' ? current.getParent() : null;
    }
    return connected;
  });
}

function chipIntelliAudioGuard(block, generator, expression) {
  if (!chipIntelliAudioLearningManaged(block)) return expression;
  generator.addFunction('chipintelli_cwsl_voice_busy_declaration', 'bool ailyChipIntelliCWSLVoiceBusy();');
  return '(!ailyChipIntelliCWSLVoiceBusy() && ' + expression + ')';
}

function chipIntelliAudioIsVariableInput(block, name) {
  const inputBlock = block && typeof block.getInputTargetBlock === 'function'
    ? block.getInputTargetBlock(name)
    : null;
  return inputBlock && (
    inputBlock.type === 'variables_get' ||
    inputBlock.type === 'variables_get_dynamic'
  );
}

function chipIntelliAudioVoiceId(generator, text) {
  const macros = generator.codeDict && generator.codeDict['macros'];
  const tag = 'chipintelli_audio_voice:' + text;

  if (macros && macros[tag] !== undefined) {
    const existingId = String(macros[tag]).match(/^#define\s+VOICE(\d+)\s+/);
    if (existingId) {
      return Number(existingId[1]);
    }
  }

  let voiceId = 1;
  if (macros) {
    Object.keys(macros).forEach(function(tag) {
      const code = String(macros[tag]);
      const id = code.match(/^#define\s+VOICE(\d+)\s+/);
      if (id) voiceId = Math.max(voiceId, Number(id[1]) + 1);
    });
  }

  generator.addMacro(tag, '#define VOICE' + voiceId + ' ' + voiceId + ' //' + text);
  return voiceId;
}

function chipIntelliAudioAudioValue(block) {
  let value = block.getFieldValue('AUDIO');
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value);
    } catch (error) {
      return null;
    }
  }
  return value && typeof value === 'object' ? value : null;
}

function chipIntelliAudioProjectAudioPath(value) {
  const audioPath = value && typeof value.audioPath === 'string'
    ? value.audioPath.trim().replace(/\\/g, '/').replace(/^\.\//, '')
    : '';
  if (!audioPath || /[\r\n]/.test(audioPath) || audioPath.startsWith('/') || /^[a-z]:/i.test(audioPath)) return '';
  const segments = audioPath.split('/');
  if (segments.some(function(segment) {
    return !segment || segment === '.' || segment === '..';
  })) return '';
  return audioPath;
}

function chipIntelliAudioLocalAudioTag(audioPath) {
  // field_audio stores the converted MP3 under the project directory and
  // serializes audioPath as a project-relative path. The content-addressed
  // path is also a stable addMacro tag for reusing the first matching macro.
  return audioPath ? 'chipintelli_audio_mp3:' + audioPath : '';
}

function chipIntelliAudioMp3Id(generator, tag, audioPath) {
  const macros = generator.codeDict && generator.codeDict['macros'];
  if (macros && macros[tag] !== undefined) {
    const existingId = String(macros[tag]).match(/^#define\s+VOICEMP3(\d+)\s+/);
    if (existingId) return Number(existingId[1]);
  }

  let mp3Id = 500;
  if (macros) {
    Object.keys(macros).forEach(function(macroTag) {
      const id = String(macros[macroTag]).match(/^#define\s+VOICEMP3(\d+)\s+/);
      if (id) mp3Id = Math.max(mp3Id, Number(id[1]) + 1);
    });
  }

  generator.addMacro(
    tag,
    '#define VOICEMP3' + mp3Id + ' ' + mp3Id + ' //' + audioPath
  );
  return mp3Id;
}

Arduino.forBlock['chipintelli_audio_init'] = function(block, generator) {
  const selectedLanguage = block.getFieldValue('LANGUAGE');
  const language = CHIPINTELLI_AUDIO_LANGUAGES.indexOf(selectedLanguage) === -1
    ? 'CHIPINTELLI_LANGUAGE_ZH'
    : selectedLanguage;
  generator.addMacro(
    'chipintelli_audio_language',
    '#define CHIPINTELLI_LANGUAGE ' + language
  );
  ensureChipIntelliAudio(generator);
  return 'ChipIntelliAudio.begin();\nChipIntelliAudio.setVolume(100);\n';
};

Arduino.forBlock['chipintelli_audio_end'] = function(block, generator) {
  ensureChipIntelliAudio(generator);
  return 'ChipIntelliAudio.end();\n';
};

Arduino.forBlock['chipintelli_audio_voice_settings'] = function(block, generator) {
  const voiceRole = String(block.getFieldValue('VOICE_ROLE') || '').replace(/[\r\n]/g, ' ');
  const voiceVolume = block.getFieldValue('VOICE_VOLUME');
  const voiceSpeed = block.getFieldValue('VOICE_SPEED');
  generator.addMacro(
    'chipintelli_audio_voice_settings',
    '//VOICE_ROLE:"' + voiceRole + '";VOICE_VOLUME:' +
      (voiceVolume === null ? '10' : voiceVolume) + ';VOICE_SPEED:' +
      (voiceSpeed === null ? '10' : voiceSpeed) + ';'
  );
  return '';
};

Arduino.forBlock['chipintelli_audio_voice'] = function(block, generator) {
  const text = String(block.getFieldValue('TEXT') || '').replace(/[\r\n]/g, ' ');
  const voiceId = chipIntelliAudioVoiceId(generator, text);
  return ['VOICE' + voiceId, generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_audio_local_audio'] = function(block, generator) {
  const value = chipIntelliAudioAudioValue(block);
  const audioPath = chipIntelliAudioProjectAudioPath(value);
  const tag = chipIntelliAudioLocalAudioTag(audioPath);
  if (!tag) return ['0', generator.ORDER_ATOMIC];
  const mp3Id = chipIntelliAudioMp3Id(generator, tag, audioPath);
  return ['VOICEMP3' + mp3Id, generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_audio_play_voice'] = function(block, generator) {
  ensureChipIntelliAudio(generator);
  const voiceId = chipIntelliAudioValue(block, generator, 'VOICE_ID', '1');
  const interruptCurrent = block.getFieldValue('MODE') === 'false' ? 'false' : 'true';
  if (chipIntelliAudioIsVariableInput(block, 'VOICE_ID')) {
    return chipIntelliAudioGuard(block, generator, 'ChipIntelliAudio.playVoice(String(' + voiceId + '), ' + interruptCurrent + ')') + ';\n';
  }
  return chipIntelliAudioGuard(block, generator, 'ChipIntelliAudio.playVoice((uint16_t)(' + voiceId + '), ' + interruptCurrent + ')') + ';\n';
};

Arduino.forBlock['chipintelli_audio_stop'] = function(block, generator) {
  ensureChipIntelliAudio(generator);
  if (chipIntelliAudioLearningManaged(block)) {
    generator.addFunction('chipintelli_cwsl_voice_busy_declaration', 'bool ailyChipIntelliCWSLVoiceBusy();');
    return 'if (!ailyChipIntelliCWSLVoiceBusy()) ChipIntelliAudio.stop();\n';
  }
  return 'ChipIntelliAudio.stop();\n';
};

Arduino.forBlock['chipintelli_audio_set_volume'] = function(block, generator) {
  ensureChipIntelliAudio(generator);
  const volume = chipIntelliAudioValue(block, generator, 'VOLUME', '100');
  return 'ChipIntelliAudio.setVolume((uint8_t)constrain((int)(' + volume + '), 0, 100));\n';
};

Arduino.forBlock['chipintelli_audio_set_muted'] = function(block, generator) {
  ensureChipIntelliAudio(generator);
  const muted = chipIntelliAudioValue(block, generator, 'MUTED', 'true');
  return 'ChipIntelliAudio.setMuted((bool)(' + muted + '));\n';
};

Arduino.forBlock['chipintelli_audio_is_ready'] = function(block, generator) {
  ensureChipIntelliAudio(generator);
  return ['ChipIntelliAudio.isReady()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_audio_is_playing'] = function(block, generator) {
  ensureChipIntelliAudio(generator);
  return ['ChipIntelliAudio.isPlaying()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_audio_volume'] = function(block, generator) {
  ensureChipIntelliAudio(generator);
  return ['ChipIntelliAudio.volume()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_audio_is_muted'] = function(block, generator) {
  ensureChipIntelliAudio(generator);
  return ['ChipIntelliAudio.isMuted()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_audio_on_finished'] = function(block, generator) {
  ensureChipIntelliAudio(generator);
  const handler = generator.statementToCode(block, 'HANDLER') || '';
  generator.addVariable('chipintelli_audio_finished_flag', 'volatile bool ailyChipIntelliAudioFinished = false;');
  generator.addFunction('chipintelli_audio_finished_callback',
    'void ailyChipIntelliAudioFinishedCallback(void *context) {\n' +
    '  (void)context;\n' +
    '  ailyChipIntelliAudioFinished = true;\n' +
    '}\n');
  generator.addFunction('chipintelli_audio_finished_handler',
    'void ailyChipIntelliAudioFinishedHandler() {\n' + handler + '}\n');
  generator.addSetupEnd('chipintelli_audio_finished_callback_setup',
    'ChipIntelliAudio.onFinished(ailyChipIntelliAudioFinishedCallback);');
  generator.addLoopBegin('chipintelli_audio_finished_dispatch',
    'if (ailyChipIntelliAudioFinished) {\n' +
    '  ailyChipIntelliAudioFinished = false;\n' +
    '  ailyChipIntelliAudioFinishedHandler();\n' +
    '}');
  return '';
};
