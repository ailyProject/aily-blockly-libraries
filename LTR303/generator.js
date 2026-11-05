// LTR303：LTR-303 环境光（I2C 0x29），I2C 引脚按开发板选

// I2C 引脚按板卡选：aily_iic 设过的自定义引脚 > 芯片自己的板卡配置 > 板卡 i2cPins > Wire 默认引脚
Arduino.ltr303WireBegin = function (generator, devicePins) {
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
Arduino.ltr303BoardConfig = function (key) {
  try {
    const board = window['boardConfig'];
    return board && board[key] ? board[key] : null;
  } catch (e) {
    return null;
  }
};

Arduino.ltr303Ensure = function (generator) {
  generator.addLibrary('LTR303', '#include <LTR303.h>');
  generator.addVariable('ltr303', 'LTR303 ltr303;');
  generator.addVariable('ltr303_state', [
    'float ltr303_lux = 0;',
    'uint16_t ltr303_ch0 = 0, ltr303_ch1 = 0;',
    'bool ltr303_valid = false;',
    'uint32_t ltr303_at = 0;',
  ].join('\n'));
  // 0.1 秒内重复取值直接用上次结果，三种读数来自同一次采样
  generator.addFunction('ltr303_update', [
    'void ltr303_update() {',
    '  if (ltr303_at && millis() - ltr303_at < 100) return;',
    '  ltr303_at = millis() | 1;',
    '  uint16_t ch0, ch1;',
    '  float lux;',
    '  ltr303_valid = ltr303.readChannels(ch0, ch1) && ltr303.readLux(lux);',
    '  if (ltr303_valid) { ltr303_ch0 = ch0; ltr303_ch1 = ch1; ltr303_lux = lux; }',
    '}',
  ].join('\n'));
};

Arduino.forBlock['ltr303_init'] = function (block, generator) {
  Arduino.ltr303Ensure(generator);
  Arduino.ltr303WireBegin(generator);
  return 'ltr303.begin(Wire);\n';
};

Arduino.forBlock['ltr303_gain'] = function (block, generator) {
  const gain = block.getFieldValue('GAIN') || 'GAIN_1X';
  Arduino.ltr303Ensure(generator);
  return 'ltr303.setGain(LTR303::' + gain + ');\n';
};

Arduino.forBlock['ltr303_integration'] = function (block, generator) {
  const time = block.getFieldValue('TIME') || 'INT_100MS';
  Arduino.ltr303Ensure(generator);
  // 积分时间不能超过测量周期，周期保持默认的 500ms
  return 'ltr303.setTiming(LTR303::' + time + ', LTR303::RATE_500MS);\n';
};

Arduino.forBlock['ltr303_read'] = function (block, generator) {
  const what = { CH0: 1, CH1: 2 }[block.getFieldValue('WHAT')] || 0;
  Arduino.ltr303Ensure(generator);
  generator.addFunction('ltr303_get', [
    'float ltr303_get(int what) {',
    '  ltr303_update();',
    '  if (what == 1) return ltr303_ch0;',
    '  if (what == 2) return ltr303_ch1;',
    '  return ltr303_lux;',
    '}',
  ].join('\n'));
  return ['ltr303_get(' + what + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['ltr303_ok'] = function (block, generator) {
  Arduino.ltr303Ensure(generator);
  generator.addFunction('ltr303_ok', [
    'bool ltr303_ok() {',
    '  ltr303_update();',
    '  return ltr303_valid;',
    '}',
  ].join('\n'));
  return ['ltr303_ok()', generator.ORDER_FUNCTION_CALL];
};
