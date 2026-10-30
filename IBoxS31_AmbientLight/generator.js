// IBoxS31_LTR303：板载 LTR-303 环境光（I2C 0x29，SDA=IO0 SCL=IO1）

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

Arduino.iboxs31Ltr303Ensure = function (generator) {
  generator.addLibrary('IBoxS31_LTR303', '#include <IBoxS31_LTR303.h>');
  generator.addVariable('iboxs31_ltr303', 'IBoxS31_LTR303 iboxs31_ltr303;');
  generator.addVariable('iboxs31_ltr303_state', [
    'float iboxs31_ltr303_lux = 0;',
    'uint16_t iboxs31_ltr303_ch0 = 0, iboxs31_ltr303_ch1 = 0;',
    'bool iboxs31_ltr303_valid = false;',
    'uint32_t iboxs31_ltr303_at = 0;',
  ].join('\n'));
  // 0.1 秒内重复取值直接用上次结果，三种读数来自同一次采样
  generator.addFunction('iboxs31_ltr303_update', [
    'void iboxs31_ltr303_update() {',
    '  if (iboxs31_ltr303_at && millis() - iboxs31_ltr303_at < 100) return;',
    '  iboxs31_ltr303_at = millis() | 1;',
    '  uint16_t ch0, ch1;',
    '  float lux;',
    '  iboxs31_ltr303_valid = iboxs31_ltr303.readChannels(ch0, ch1) && iboxs31_ltr303.readLux(lux);',
    '  if (iboxs31_ltr303_valid) { iboxs31_ltr303_ch0 = ch0; iboxs31_ltr303_ch1 = ch1; iboxs31_ltr303_lux = lux; }',
    '}',
  ].join('\n'));
};

Arduino.forBlock['iboxs31_ltr303_init'] = function (block, generator) {
  Arduino.iboxs31Ltr303Ensure(generator);
  return Arduino.iboxs31BoardNote() + 'iboxs31_ltr303.begin(Wire, 0, 1);\n';
};

Arduino.forBlock['iboxs31_ltr303_gain'] = function (block, generator) {
  const gain = block.getFieldValue('GAIN') || 'GAIN_1X';
  Arduino.iboxs31Ltr303Ensure(generator);
  return 'iboxs31_ltr303.setGain(IBoxS31_LTR303::' + gain + ');\n';
};

Arduino.forBlock['iboxs31_ltr303_integration'] = function (block, generator) {
  const time = block.getFieldValue('TIME') || 'INT_100MS';
  Arduino.iboxs31Ltr303Ensure(generator);
  // 积分时间不能超过测量周期，周期保持默认的 500ms
  return 'iboxs31_ltr303.setTiming(IBoxS31_LTR303::' + time + ', IBoxS31_LTR303::RATE_500MS);\n';
};

Arduino.forBlock['iboxs31_ltr303_read'] = function (block, generator) {
  const what = { CH0: 1, CH1: 2 }[block.getFieldValue('WHAT')] || 0;
  Arduino.iboxs31Ltr303Ensure(generator);
  generator.addFunction('iboxs31_ltr303_get', [
    'float iboxs31_ltr303_get(int what) {',
    '  iboxs31_ltr303_update();',
    '  if (what == 1) return iboxs31_ltr303_ch0;',
    '  if (what == 2) return iboxs31_ltr303_ch1;',
    '  return iboxs31_ltr303_lux;',
    '}',
  ].join('\n'));
  return ['iboxs31_ltr303_get(' + what + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['iboxs31_ltr303_ok'] = function (block, generator) {
  Arduino.iboxs31Ltr303Ensure(generator);
  generator.addFunction('iboxs31_ltr303_ok', [
    'bool iboxs31_ltr303_ok() {',
    '  iboxs31_ltr303_update();',
    '  return iboxs31_ltr303_valid;',
    '}',
  ].join('\n'));
  return ['iboxs31_ltr303_ok()', generator.ORDER_FUNCTION_CALL];
};
