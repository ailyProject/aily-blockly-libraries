// IBoxS31_AHT20：板载 AHT20 温湿度（I2C 0x38，SDA=IO0 SCL=IO1）

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

Arduino.iboxs31Aht20Ensure = function (generator) {
  generator.addLibrary('IBoxS31_AHT20', '#include <IBoxS31_AHT20.h>');
  generator.addVariable('iboxs31_aht20', 'IBoxS31_AHT20 iboxs31_aht20;');
  generator.addVariable('iboxs31_aht20_state', [
    'float iboxs31_aht20_t = 0, iboxs31_aht20_h = 0;',
    'bool iboxs31_aht20_valid = false;',
    'uint32_t iboxs31_aht20_at = 0;',
  ].join('\n'));
  // 一次测量要 80ms，0.5 秒内重复取值直接用上次结果
  generator.addFunction('iboxs31_aht20_update', [
    'void iboxs31_aht20_update() {',
    '  if (iboxs31_aht20_at && millis() - iboxs31_aht20_at < 500) return;',
    '  iboxs31_aht20_at = millis() | 1;',
    '  float t, h;',
    '  iboxs31_aht20_valid = iboxs31_aht20.read(t, h) == IBoxS31_AHT20::AHT_OK;',
    '  if (iboxs31_aht20_valid) { iboxs31_aht20_t = t; iboxs31_aht20_h = h; }',
    '}',
  ].join('\n'));
};

Arduino.forBlock['iboxs31_aht20_init'] = function (block, generator) {
  Arduino.iboxs31Aht20Ensure(generator);
  return Arduino.iboxs31BoardNote() + 'iboxs31_aht20.begin(Wire, 0, 1);\n';
};

Arduino.forBlock['iboxs31_aht20_read'] = function (block, generator) {
  const humidity = block.getFieldValue('WHAT') === 'HUMI';
  Arduino.iboxs31Aht20Ensure(generator);
  generator.addFunction('iboxs31_aht20_get', [
    'float iboxs31_aht20_get(bool humidity) {',
    '  iboxs31_aht20_update();',
    '  return humidity ? iboxs31_aht20_h : iboxs31_aht20_t;',
    '}',
  ].join('\n'));
  return ['iboxs31_aht20_get(' + (humidity ? 'true' : 'false') + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['iboxs31_aht20_ok'] = function (block, generator) {
  Arduino.iboxs31Aht20Ensure(generator);
  generator.addFunction('iboxs31_aht20_ok', [
    'bool iboxs31_aht20_ok() {',
    '  iboxs31_aht20_update();',
    '  return iboxs31_aht20_valid;',
    '}',
  ].join('\n'));
  return ['iboxs31_aht20_ok()', generator.ORDER_FUNCTION_CALL];
};
