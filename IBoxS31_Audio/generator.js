// IBoxS31_Audio：ES8389 codec（I2C 0x10）+ I2S（MCLK=IO2 BCK=IO3 WS=IO4 DOUT=IO5 DIN=IO6）+ 功放 IO7
// 播放 / 录音由库里的 IBoxS31_AudioPlayer 在后台任务里做

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

Arduino.iboxs31AudioEnsure = function (generator) {
  generator.addLibrary('IBoxS31_Audio', '#include <ESP_I2S.h>\n#include <IBoxS31_Audio.h>\n#include <IBoxS31_AudioPlayer.h>');
  generator.addVariable('iboxs31_audio', 'IBoxS31_Audio iboxs31_audio;\nIBoxS31_AudioPlayer iboxs31_audio_player(iboxs31_audio);');
};

// SD 卡在 /sdcard（播放器会自己挂载），U 盘在 /usb（要先初始化 IBoxS31_USBHost）
Arduino.iboxs31AudioPath = function (block, name, fallback, generator) {
  const root = block.getFieldValue('SRC') === 'USB' ? 'IBOX_AUDIO_USB_ROOT' : 'IBOX_AUDIO_SD_ROOT';
  const path = generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
  Arduino.iboxs31AudioEnsure(generator);
  generator.addFunction('iboxs31_audio_path', [
    'String iboxs31_audio_path(const char *root, const String &path) {',
    '  return String(root) + (path.startsWith("/") ? path : "/" + path);',
    '}',
  ].join('\n'));
  return 'iboxs31_audio_path(' + root + ', String(' + path + ')).c_str()';
};

Arduino.forBlock['iboxs31_audio_init'] = function (block, generator) {
  Arduino.iboxs31AudioEnsure(generator);
  return Arduino.iboxs31BoardNote() + 'iboxs31_audio.begin(IBoxS31_Audio::DEFAULT_RATE, Wire, 0, 1);\n';
};

Arduino.forBlock['iboxs31_audio_volume'] = function (block, generator) {
  const volume = generator.valueToCode(block, 'VOLUME', generator.ORDER_ATOMIC) || '80';
  Arduino.iboxs31AudioEnsure(generator);
  return 'iboxs31_audio.setVolume(constrain((int)(' + volume + '), 0, 100));\n';
};

Arduino.forBlock['iboxs31_audio_play'] = function (block, generator) {
  const wait = block.getFieldValue('MODE') === 'WAIT' ? 'true' : 'false';
  const path = Arduino.iboxs31AudioPath(block, 'PATH', '"/music/song.mp3"', generator);
  return 'iboxs31_audio_player.play(' + path + ', ' + wait + ');\n';
};

Arduino.forBlock['iboxs31_audio_play_folder'] = function (block, generator) {
  const wait = block.getFieldValue('MODE') === 'WAIT' ? 'true' : 'false';
  const number = generator.valueToCode(block, 'NUMBER', generator.ORDER_ATOMIC) || '1';
  const dir = Arduino.iboxs31AudioPath(block, 'DIR', '"/music"', generator);
  // 积木里从 1 数，库里从 0 数
  return 'iboxs31_audio_player.playFolder(' + dir + ', (int)(' + number + ') - 1, ' + wait + ');\n';
};

Arduino.forBlock['iboxs31_audio_folder_count'] = function (block, generator) {
  const dir = Arduino.iboxs31AudioPath(block, 'DIR', '"/music"', generator);
  return ['IBoxS31_AudioPlayer::countFiles(' + dir + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['iboxs31_audio_control'] = function (block, generator) {
  const call = { PAUSE: 'pause', RESUME: 'resume', STOP: 'stop' }[block.getFieldValue('ACTION')] || 'stop';
  Arduino.iboxs31AudioEnsure(generator);
  return 'iboxs31_audio_player.' + call + '();\n';
};

Arduino.forBlock['iboxs31_audio_loop'] = function (block, generator) {
  const on = block.getFieldValue('STATE') === 'false' ? 'false' : 'true';
  Arduino.iboxs31AudioEnsure(generator);
  return 'iboxs31_audio_player.setLoop(' + on + ');\n';
};

Arduino.forBlock['iboxs31_audio_state'] = function (block, generator) {
  const what = block.getFieldValue('WHAT');
  Arduino.iboxs31AudioEnsure(generator);
  if (what === 'IDLE') return ['(!iboxs31_audio_player.busy())', generator.ORDER_ATOMIC];
  const state = { PAUSED: 'PAUSED', RECORDING: 'RECORDING' }[what] || 'PLAYING';
  return ['(iboxs31_audio_player.state() == IBoxS31_AudioPlayer::' + state + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['iboxs31_audio_info'] = function (block, generator) {
  const call = block.getFieldValue('WHAT') === 'DUR' ? 'duration' : 'position';
  Arduino.iboxs31AudioEnsure(generator);
  return ['iboxs31_audio_player.' + call + '()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['iboxs31_audio_file_name'] = function (block, generator) {
  Arduino.iboxs31AudioEnsure(generator);
  return ['String(iboxs31_audio_player.fileName())', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['iboxs31_audio_error'] = function (block, generator) {
  Arduino.iboxs31AudioEnsure(generator);
  return ['String(iboxs31_audio_player.lastError())', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['iboxs31_audio_record'] = function (block, generator) {
  const wait = block.getFieldValue('MODE') === 'WAIT' ? 'true' : 'false';
  const seconds = generator.valueToCode(block, 'SECONDS', generator.ORDER_ATOMIC) || '5';
  const path = Arduino.iboxs31AudioPath(block, 'PATH', '"/rec.wav"', generator);
  return 'iboxs31_audio_player.record(' + path + ', (uint32_t)constrain((int)(' + seconds + '), 0, 86400), 16000, ' + wait + ');\n';
};

Arduino.forBlock['iboxs31_audio_tone'] = function (block, generator) {
  const hz = generator.valueToCode(block, 'HZ', generator.ORDER_ATOMIC) || '1000';
  const ms = generator.valueToCode(block, 'MS', generator.ORDER_ATOMIC) || '350';
  Arduino.iboxs31AudioEnsure(generator);
  // 后台在放的话两路数据会交错，先停掉
  return 'iboxs31_audio_player.stop();\niboxs31_audio.playTone(constrain((float)(' + hz + '), 50.0f, 7000.0f), (uint32_t)constrain((int)(' + ms + '), 10, 10000));\n';
};

Arduino.forBlock['iboxs31_audio_mic_level'] = function (block, generator) {
  Arduino.iboxs31AudioEnsure(generator);
  // 左声道才是麦克风，右声道是 DAC 回采；录音时 I2S 被后台占着，用录音的峰值
  generator.addFunction('iboxs31_audio_mic_level', [
    'int iboxs31_audio_mic_level() {',
    '  if (iboxs31_audio_player.state() == IBoxS31_AudioPlayer::RECORDING) {',
    '    return constrain(iboxs31_audio_player.recordLevel() * 100 / 32767, 0, 100);',
    '  }',
    '  int left = 0, right = 0;',
    '  if (!iboxs31_audio.readPeakLR(left, right, 2048)) return 0;',
    '  return constrain(left * 100 / 32767, 0, 100);',
    '}',
  ].join('\n'));
  return ['iboxs31_audio_mic_level()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['iboxs31_audio_mic_gain'] = function (block, generator) {
  const db = generator.valueToCode(block, 'DB', generator.ORDER_ATOMIC) || '12';
  Arduino.iboxs31AudioEnsure(generator);
  return 'iboxs31_audio.setMicGain(constrain((float)(' + db + '), 3.5f, 36.5f));\n';
};

Arduino.forBlock['iboxs31_audio_switch'] = function (block, generator) {
  const on = block.getFieldValue('STATE') === 'false' ? 'false' : 'true';
  Arduino.iboxs31AudioEnsure(generator);
  if (block.getFieldValue('WHAT') === 'MUTE') return 'iboxs31_audio.setMicMute(' + on + ');\n';
  return 'iboxs31_audio.setPA(' + on + ');\n';
};

Arduino.forBlock['iboxs31_audio_end'] = function (block, generator) {
  Arduino.iboxs31AudioEnsure(generator);
  return 'iboxs31_audio_player.stop();\niboxs31_audio.end();\n';
};
