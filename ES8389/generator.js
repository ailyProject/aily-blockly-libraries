// ES8389：ES8389 codec + I2S + 功放。引脚和 I2C 地址读开发板的 audioConfig，
// SD 卡引脚读 sdCardPins（播放器自己挂卡时用）；播放 / 录音由 ES8389Player 在后台任务里做

// I2C 引脚按板卡选：aily_iic 设过的自定义引脚 > 芯片自己的板卡配置 > 板卡 i2cPins > Wire 默认引脚
Arduino.es8389WireBegin = function (generator, devicePins) {
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
Arduino.es8389BoardConfig = function (key) {
  try {
    const board = window['boardConfig'];
    return board && board[key] ? board[key] : null;
  } catch (e) {
    return null;
  }
};

Arduino.es8389Ensure = function (generator) {
  generator.addLibrary('ES8389', '#include <ESP_I2S.h>\n#include <ES8389.h>\n#include <ES8389Player.h>');
  generator.addVariable('es8389', 'ES8389 es8389;\nES8389Player es8389_player(es8389);');
};

// SD 卡在 /sdcard（没挂载时播放器按 sdCardPins 自己挂，卡的电源要先打开），U 盘在 /usb（要先启动 ESP32 USB 主机）
Arduino.es8389Path = function (block, name, fallback, generator) {
  const root = block.getFieldValue('SRC') === 'USB' ? 'ES8389_USB_ROOT' : 'ES8389_SD_ROOT';
  const path = generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
  Arduino.es8389Ensure(generator);
  generator.addFunction('es8389_path', [
    'String es8389_path(const char *root, const String &path) {',
    '  return String(root) + (path.startsWith("/") ? path : "/" + path);',
    '}',
  ].join('\n'));
  return 'es8389_path(' + root + ', String(' + path + ')).c_str()';
};

// 板卡 audioConfig 的 din / dout 是按 codec 方向起的名字：din = MCU→codec（驱动里的 DOUT），dout = codec→MCU
Arduino.forBlock['es8389_init'] = function (block, generator) {
  Arduino.es8389Ensure(generator);
  const cfg = Arduino.es8389BoardConfig('audioConfig');
  if (cfg && cfg.codec && !/^es8389$/i.test(String(cfg.codec))) {
    generator.addLibrary('es8389_board_check', '#error "ES8389 库：当前开发板的音频芯片是 ' + String(cfg.codec).replace(/"/g, '') + '，不是 ES8389"');
    return '';
  }
  let code = '';
  if (cfg && cfg.pins) {
    const p = cfg.pins;
    const pin = v => (v === undefined || v === null || v === '' ? '-1' : String(v));
    Arduino.es8389WireBegin(generator, { sda: p.sda, scl: p.scl });
    code += 'es8389.setPins(' + [p.mclk, p.sclk, p.lrck, p.din, p.dout, p.pa].map(pin).join(', ') + ');\n';
    if (/^0x[0-9a-f]{2}$/i.test(String(cfg.address || ''))) code += 'es8389.setAddress(' + cfg.address + ');\n';
  } else {
    // 板卡没写音频配置：用库里的默认引脚（智盒板 IBox S31 的接线）
    Arduino.es8389WireBegin(generator);
  }
  const sd = Arduino.es8389BoardConfig('sdCardPins');
  if (sd && sd.clk != null && sd.cmd != null && sd.d0 != null) {
    code += 'ES8389Player::setSdPins(' + sd.clk + ', ' + sd.cmd + ', ' + sd.d0 + ');\n';
  }
  return code + 'es8389.begin(ES8389::DEFAULT_RATE, Wire);\n';
};

Arduino.forBlock['es8389_volume'] = function (block, generator) {
  const volume = generator.valueToCode(block, 'VOLUME', generator.ORDER_ATOMIC) || '80';
  Arduino.es8389Ensure(generator);
  return 'es8389.setVolume(constrain((int)(' + volume + '), 0, 100));\n';
};

Arduino.forBlock['es8389_play'] = function (block, generator) {
  const wait = block.getFieldValue('MODE') === 'WAIT' ? 'true' : 'false';
  const path = Arduino.es8389Path(block, 'PATH', '"/music/song.mp3"', generator);
  return 'es8389_player.play(' + path + ', ' + wait + ');\n';
};

Arduino.forBlock['es8389_play_folder'] = function (block, generator) {
  const wait = block.getFieldValue('MODE') === 'WAIT' ? 'true' : 'false';
  const number = generator.valueToCode(block, 'NUMBER', generator.ORDER_ATOMIC) || '1';
  const dir = Arduino.es8389Path(block, 'DIR', '"/music"', generator);
  // 积木里从 1 数，库里从 0 数
  return 'es8389_player.playFolder(' + dir + ', (int)(' + number + ') - 1, ' + wait + ');\n';
};

Arduino.forBlock['es8389_folder_count'] = function (block, generator) {
  const dir = Arduino.es8389Path(block, 'DIR', '"/music"', generator);
  return ['ES8389Player::countFiles(' + dir + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['es8389_control'] = function (block, generator) {
  const call = { PAUSE: 'pause', RESUME: 'resume', STOP: 'stop' }[block.getFieldValue('ACTION')] || 'stop';
  Arduino.es8389Ensure(generator);
  return 'es8389_player.' + call + '();\n';
};

Arduino.forBlock['es8389_loop'] = function (block, generator) {
  const on = block.getFieldValue('STATE') === 'false' ? 'false' : 'true';
  Arduino.es8389Ensure(generator);
  return 'es8389_player.setLoop(' + on + ');\n';
};

Arduino.forBlock['es8389_state'] = function (block, generator) {
  const what = block.getFieldValue('WHAT');
  Arduino.es8389Ensure(generator);
  if (what === 'IDLE') return ['(!es8389_player.busy())', generator.ORDER_ATOMIC];
  const state = { PAUSED: 'PAUSED', RECORDING: 'RECORDING' }[what] || 'PLAYING';
  return ['(es8389_player.state() == ES8389Player::' + state + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['es8389_info'] = function (block, generator) {
  const call = block.getFieldValue('WHAT') === 'DUR' ? 'duration' : 'position';
  Arduino.es8389Ensure(generator);
  return ['es8389_player.' + call + '()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['es8389_file_name'] = function (block, generator) {
  Arduino.es8389Ensure(generator);
  return ['String(es8389_player.fileName())', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['es8389_error'] = function (block, generator) {
  Arduino.es8389Ensure(generator);
  return ['String(es8389_player.lastError())', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['es8389_record'] = function (block, generator) {
  const wait = block.getFieldValue('MODE') === 'WAIT' ? 'true' : 'false';
  const seconds = generator.valueToCode(block, 'SECONDS', generator.ORDER_ATOMIC) || '5';
  const path = Arduino.es8389Path(block, 'PATH', '"/rec.wav"', generator);
  return 'es8389_player.record(' + path + ', (uint32_t)constrain((int)(' + seconds + '), 0, 86400), 16000, ' + wait + ');\n';
};

Arduino.forBlock['es8389_tone'] = function (block, generator) {
  const hz = generator.valueToCode(block, 'HZ', generator.ORDER_ATOMIC) || '1000';
  const ms = generator.valueToCode(block, 'MS', generator.ORDER_ATOMIC) || '350';
  Arduino.es8389Ensure(generator);
  // 后台在放的话两路数据会交错，先停掉
  return 'es8389_player.stop();\nes8389.playTone(constrain((float)(' + hz + '), 50.0f, 7000.0f), (uint32_t)constrain((int)(' + ms + '), 10, 10000));\n';
};

Arduino.forBlock['es8389_mic_level'] = function (block, generator) {
  Arduino.es8389Ensure(generator);
  // 左声道才是麦克风，右声道是 DAC 回采；录音时 I2S 被后台占着，用录音的峰值
  generator.addFunction('es8389_mic_level', [
    'int es8389_mic_level() {',
    '  if (es8389_player.state() == ES8389Player::RECORDING) {',
    '    return constrain(es8389_player.recordLevel() * 100 / 32767, 0, 100);',
    '  }',
    '  int left = 0, right = 0;',
    '  if (!es8389.readPeakLR(left, right, 2048)) return 0;',
    '  return constrain(left * 100 / 32767, 0, 100);',
    '}',
  ].join('\n'));
  return ['es8389_mic_level()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['es8389_mic_gain'] = function (block, generator) {
  const db = generator.valueToCode(block, 'DB', generator.ORDER_ATOMIC) || '12';
  Arduino.es8389Ensure(generator);
  return 'es8389.setMicGain(constrain((float)(' + db + '), 3.5f, 36.5f));\n';
};

Arduino.forBlock['es8389_switch'] = function (block, generator) {
  const on = block.getFieldValue('STATE') === 'false' ? 'false' : 'true';
  Arduino.es8389Ensure(generator);
  if (block.getFieldValue('WHAT') === 'MUTE') return 'es8389.setMicMute(' + on + ');\n';
  return 'es8389.setPA(' + on + ');\n';
};

Arduino.forBlock['es8389_end'] = function (block, generator) {
  Arduino.es8389Ensure(generator);
  return 'es8389_player.stop();\nes8389.end();\n';
};
