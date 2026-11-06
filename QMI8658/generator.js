// QMI8658：六轴 IMU，引脚和地址读开发板的 imuConfig，没有就用板卡 I2C 引脚和 0x6B

// I2C 引脚按板卡选：aily_iic 设过的自定义引脚 > 芯片自己的板卡配置 > 板卡 i2cPins > Wire 默认引脚
Arduino.qmi8658WireBegin = function (generator, devicePins) {
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
Arduino.qmi8658BoardConfig = function (key) {
  try {
    const board = window['boardConfig'];
    return board && board[key] ? board[key] : null;
  } catch (e) {
    return null;
  }
};

Arduino.qmi8658Ensure = function (generator) {
  generator.addLibrary('QMI8658', '#include <QMI8658.h>');
  generator.addVariable('qmi8658', 'QMI8658 qmi8658;');
};

// 10 毫秒内重复取值共用一次采样，各轴读数来自同一时刻
Arduino.qmi8658SampleEnsure = function (generator) {
  Arduino.qmi8658Ensure(generator);
  generator.addVariable('qmi8658_state', [
    'QMI8658Data qmi8658_data = {};',
    'float qmi8658_temp = 0;',
    'bool qmi8658_valid = false;',
    'uint32_t qmi8658_at = 0;',
    'bool qmi8658_sampled = false;',
  ].join('\n'));
  generator.addFunction('qmi8658_update', [
    'void qmi8658_update() {',
    '  const uint32_t now = millis();',
    '  if (qmi8658_sampled && (uint32_t)(now - qmi8658_at) < 10) return;',
    '  qmi8658_at = now;',
    '  qmi8658_sampled = true;',
    '  QMI8658Data d;',
    '  qmi8658_valid = qmi8658.read(d);',
    '  if (qmi8658_valid) qmi8658_data = d;',
    '  float t;',
    '  if (qmi8658.readTemperature(t)) qmi8658_temp = t;',
    '}',
  ].join('\n'));
};

Arduino.forBlock['qmi8658_init'] = function (block, generator) {
  Arduino.qmi8658Ensure(generator);
  const cfg = Arduino.qmi8658BoardConfig('imuConfig');
  const mine = cfg && /^qmi8658/i.test(String(cfg.model || ''));
  Arduino.qmi8658WireBegin(generator, mine ? cfg.pins : null);
  const addr = mine && /^0x[0-9a-f]{2}$/i.test(String(cfg.address || '')) ? String(cfg.address) : 'QMI8658::ADDR_DEFAULT';
  return 'qmi8658.begin(Wire, ' + addr + ');\n';
};

Arduino.forBlock['qmi8658_range'] = function (block, generator) {
  // CTRL2/CTRL3 的 bit[6:4] 是量程，低 4 位 ODR 保持 0x4
  const acc = Math.min(3, Math.max(0, Number(block.getFieldValue('ACC')) || 0));
  const gyro = Math.min(7, Math.max(4, Number(block.getFieldValue('GYRO')) || 6));
  const hex = v => '0x' + ((v << 4) | 0x04).toString(16).toUpperCase().padStart(2, '0');
  Arduino.qmi8658Ensure(generator);
  return 'qmi8658.configure(' + hex(acc) + ', ' + hex(gyro) + ');\n';
};

Arduino.forBlock['qmi8658_read'] = function (block, generator) {
  const what = ['AX', 'AY', 'AZ', 'GX', 'GY', 'GZ', 'TEMP', 'PITCH', 'ROLL'].indexOf(block.getFieldValue('WHAT'));
  Arduino.qmi8658SampleEnsure(generator);
  generator.addFunction('qmi8658_get', [
    'float qmi8658_get(int what) {',
    '  qmi8658_update();',
    '  const QMI8658Data &d = qmi8658_data;',
    '  switch (what) {',
    '    case 0: return d.axg;',
    '    case 1: return d.ayg;',
    '    case 2: return d.azg;',
    '    case 3: return d.gxd;',
    '    case 4: return d.gyd;',
    '    case 5: return d.gzd;',
    '    case 6: return qmi8658_temp;',
    '    case 7: return atan2f(-d.axg, sqrtf(d.ayg * d.ayg + d.azg * d.azg)) * 57.29578f;',
    '    case 8: return atan2f(d.ayg, d.azg) * 57.29578f;',
    '  }',
    '  return 0;',
    '}',
  ].join('\n'));
  return ['qmi8658_get(' + Math.max(0, what) + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['qmi8658_ok'] = function (block, generator) {
  Arduino.qmi8658SampleEnsure(generator);
  generator.addFunction('qmi8658_ok', [
    'bool qmi8658_ok() {',
    '  qmi8658_update();',
    '  return qmi8658_valid;',
    '}',
  ].join('\n'));
  return ['qmi8658_ok()', generator.ORDER_FUNCTION_CALL];
};
