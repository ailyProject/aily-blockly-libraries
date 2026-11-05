// QMC6309：地磁罗盘，I2C 引脚读开发板的 magnetometerConfig，没有就用板卡 I2C 引脚；地址 0x7C / 0x2C 由驱动自己找

// I2C 引脚按板卡选：aily_iic 设过的自定义引脚 > 芯片自己的板卡配置 > 板卡 i2cPins > Wire 默认引脚
Arduino.qmc6309WireBegin = function (generator, devicePins) {
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
Arduino.qmc6309BoardConfig = function (key) {
  try {
    const board = window['boardConfig'];
    return board && board[key] ? board[key] : null;
  } catch (e) {
    return null;
  }
};

Arduino.qmc6309Ensure = function (generator) {
  generator.addLibrary('QMC6309', '#include <QMC6309.h>');
  generator.addVariable('qmc6309', 'QMC6309 qmc6309;');
};

// 10 毫秒内重复取值共用一次采样
Arduino.qmc6309SampleEnsure = function (generator) {
  Arduino.qmc6309Ensure(generator);
  generator.addVariable('qmc6309_state', [
    'int16_t qmc6309_x = 0, qmc6309_y = 0, qmc6309_z = 0;',
    'float qmc6309_heading = 0;',
    'bool qmc6309_valid = false;',
    'uint32_t qmc6309_at = 0;',
  ].join('\n'));
  generator.addFunction('qmc6309_update', [
    'void qmc6309_update() {',
    '  if (qmc6309_at && millis() - qmc6309_at < 10) return;',
    '  qmc6309_at = millis() | 1;',
    '  int16_t x, y, z;',
    '  float heading;',
    '  qmc6309_valid = qmc6309.readRaw(x, y, z) && qmc6309.readHeading(heading);',
    '  if (qmc6309_valid) {',
    '    qmc6309_x = x; qmc6309_y = y; qmc6309_z = z;',
    '    qmc6309_heading = heading;',
    '  }',
    '}',
  ].join('\n'));
};

Arduino.forBlock['qmc6309_init'] = function (block, generator) {
  Arduino.qmc6309Ensure(generator);
  const cfg = Arduino.qmc6309BoardConfig('magnetometerConfig');
  const mine = cfg && /^qmc6309/i.test(String(cfg.model || ''));
  Arduino.qmc6309WireBegin(generator, mine ? cfg.pins : null);
  return 'qmc6309.begin(Wire);\n';
};

Arduino.forBlock['qmc6309_read'] = function (block, generator) {
  const what = { X: 1, Y: 2, Z: 3 }[block.getFieldValue('WHAT')] || 0;
  Arduino.qmc6309SampleEnsure(generator);
  generator.addFunction('qmc6309_get', [
    'float qmc6309_get(int what) {',
    '  qmc6309_update();',
    '  if (what == 1) return qmc6309_x;',
    '  if (what == 2) return qmc6309_y;',
    '  if (what == 3) return qmc6309_z;',
    '  return qmc6309_heading;',
    '}',
  ].join('\n'));
  return ['qmc6309_get(' + what + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['qmc6309_calibrate'] = function (block, generator) {
  const seconds = generator.valueToCode(block, 'SECONDS', generator.ORDER_ATOMIC) || '10';
  Arduino.qmc6309SampleEnsure(generator);
  generator.addFunction('qmc6309_calibrate', [
    'void qmc6309_calibrate(float seconds) {',
    '  qmc6309.calibrateReset();',
    '  const uint32_t start = millis();',
    '  const uint32_t span = (uint32_t)(constrain(seconds, 1.0f, 120.0f) * 1000);',
    '  while (millis() - start < span) {',
    '    qmc6309.calibrateUpdate();',
    '    delay(20);',
    '  }',
    '  qmc6309.calibrateApply();',
    '  qmc6309_at = 0;',
    '}',
  ].join('\n'));
  return 'qmc6309_calibrate(' + seconds + ');\n';
};

Arduino.forBlock['qmc6309_declination'] = function (block, generator) {
  const degrees = generator.valueToCode(block, 'DEGREES', generator.ORDER_ATOMIC) || '0';
  Arduino.qmc6309Ensure(generator);
  return 'qmc6309.setDeclination(' + degrees + ');\n';
};

Arduino.forBlock['qmc6309_set_offsets'] = function (block, generator) {
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const z = generator.valueToCode(block, 'Z', generator.ORDER_ATOMIC) || '0';
  Arduino.qmc6309Ensure(generator);
  return 'qmc6309.setOffsets((int16_t)(' + x + '), (int16_t)(' + y + '), (int16_t)(' + z + '));\n';
};

Arduino.forBlock['qmc6309_offset'] = function (block, generator) {
  const axis = { Y: 1, Z: 2 }[block.getFieldValue('AXIS')] || 0;
  Arduino.qmc6309Ensure(generator);
  generator.addFunction('qmc6309_offset', [
    'int qmc6309_offset(int axis) {',
    '  int16_t x, y, z;',
    '  qmc6309.getOffsets(x, y, z);',
    '  return axis == 1 ? y : axis == 2 ? z : x;',
    '}',
  ].join('\n'));
  return ['qmc6309_offset(' + axis + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['qmc6309_ok'] = function (block, generator) {
  Arduino.qmc6309SampleEnsure(generator);
  generator.addFunction('qmc6309_ok', [
    'bool qmc6309_ok() {',
    '  qmc6309_update();',
    '  return qmc6309_valid;',
    '}',
  ].join('\n'));
  return ['qmc6309_ok()', generator.ORDER_FUNCTION_CALL];
};
