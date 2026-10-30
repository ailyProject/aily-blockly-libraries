// IBoxS31_Battery：BQ27220 电压 + 电压法电量 + 低压保护（I2C 0x55）

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

Arduino.iboxs31BatteryEnsure = function (generator) {
  generator.addLibrary('IBoxS31_Battery', '#include <IBoxS31_Battery.h>');
  generator.addVariable('iboxs31_battery', 'IBoxS31_Battery iboxs31_battery;');
  generator.addVariable('iboxs31_battery_at', 'uint32_t iboxs31_battery_at = 0;');
  // 平滑和 3 秒低压计数都按 100ms 一次设计
  generator.addFunction('iboxs31_battery_service', [
    'void iboxs31_battery_service() {',
    '  if (iboxs31_battery_at && millis() - iboxs31_battery_at < 100) return;',
    '  iboxs31_battery_at = millis() | 1;',
    '  iboxs31_battery.update();',
    '}',
  ].join('\n'));
};

Arduino.forBlock['iboxs31_battery_init'] = function (block, generator) {
  Arduino.iboxs31BatteryEnsure(generator);
  generator.addLoopBegin('iboxs31_battery_service', 'iboxs31_battery_service();\n');
  return Arduino.iboxs31BoardNote() + 'iboxs31_battery.begin(Wire, 0, 1);\n';
};

Arduino.forBlock['iboxs31_battery_read'] = function (block, generator) {
  const what = ['PERCENT', 'VOLT', 'RAW', 'CURRENT', 'TEMP'].indexOf(block.getFieldValue('WHAT'));
  Arduino.iboxs31BatteryEnsure(generator);
  generator.addFunction('iboxs31_battery_get', [
    'float iboxs31_battery_get(int what) {',
    '  iboxs31_battery_service();',
    '  if (what == 1) return iboxs31_battery.voltageMv() / 1000.0f;',
    '  if (what == 2) return iboxs31_battery.lastRawMv();',
    '  if (what == 3) { int16_t ma = 0; iboxs31_battery.readCurrent(ma); return ma; }',
    '  if (what == 4) { float c = 0; iboxs31_battery.readTemperature(c); return c; }',
    '  return iboxs31_battery.percent();',
    '}',
  ].join('\n'));
  return ['iboxs31_battery_get(' + Math.max(0, what) + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['iboxs31_battery_state'] = function (block, generator) {
  const call = {
    SHUTDOWN: 'iboxs31_battery.shouldShutdown()',
    VALID: 'iboxs31_battery.hasReading()',
  }[block.getFieldValue('WHAT')] || 'iboxs31_battery.isLow()';
  Arduino.iboxs31BatteryEnsure(generator);
  return ['(iboxs31_battery_service(), ' + call + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['iboxs31_battery_shutdown'] = function (block, generator) {
  Arduino.iboxs31BatteryEnsure(generator);
  return 'IBoxS31_Battery::deepSleepShutdown();\n';
};
