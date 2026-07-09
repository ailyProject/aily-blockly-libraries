function ensureK10(generator) {
  generator.addLibrary('SPIFFS', '#include <SPIFFS.h>');
  generator.addLibrary('unihiker_k10', '#include <unihiker_k10.h>');
  generator.addVariable('k10', 'UNIHIKER_K10 k10;');
  generator.addSetupBegin('k10_begin', 'k10.begin();');
}

function ensureMusic(generator) {
  ensureK10(generator);
  generator.addVariable('music', 'Music music;');
}

// ========== 播放内置音乐 ==========
Arduino.forBlock['k10_music_play_builtin'] = function(block, generator) {
  var music = block.getFieldValue('MUSIC');
  ensureMusic(generator);
  return 'music.playMusic(' + music + ');\n';
};

// ========== 播放音调 ==========
Arduino.forBlock['k10_music_play_tone'] = function(block, generator) {
  var freq = generator.valueToCode(block, 'FREQ', generator.ORDER_ATOMIC) || '131';
  var duration = generator.valueToCode(block, 'DURATION', generator.ORDER_ATOMIC) || '8000';
  ensureMusic(generator);
  return 'music.playTone(' + freq + ', ' + duration + ');\n';
};

// ========== 录音保存到TF卡 ==========
Arduino.forBlock['k10_music_record'] = function(block, generator) {
  var cmd = block.getFieldValue('CMD');
  var path = generator.valueToCode(block, 'FILENAME', generator.ORDER_ATOMIC) || '"S:/sound.wav"';
  ensureMusic(generator);
  if (cmd === 'start') {
    generator.addSetupBegin('k10_initSDFile', 'k10.initSDFile();');
    return 'music.recordSaveToTFCard(' + path + ');\n';
  }
  return 'music.stopRecord();\n';
};

// ========== 播放TF卡音频 ==========
Arduino.forBlock['k10_music_play_tf'] = function(block, generator) {
  var path = generator.valueToCode(block, 'FILENAME', generator.ORDER_ATOMIC) || '"S:/sound.wav"';
  ensureMusic(generator);
  return 'music.playTFCardAudio(' + path + ');\n';
};
