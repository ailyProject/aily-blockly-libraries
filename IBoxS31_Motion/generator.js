// IBoxS31_IMU：板载 QMI8658 六轴（I2C 0x6B，备用 0x6A）+ QMC6309 地磁罗盘（I2C 0x7C，备用 0x2C）

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

Arduino.iboxs31ImuEnsure = function (generator) {
  generator.addLibrary('IBoxS31_IMU', '#include <IBoxS31_IMU.h>');
  generator.addVariable('iboxs31_imu', 'IBoxS31_QMI8658 iboxs31_imu;\nIBoxS31_QMC6309 iboxs31_imu_mag;');
};

// 六轴：10 毫秒内重复取值共用一次采样，各轴读数来自同一时刻
Arduino.iboxs31ImuSixEnsure = function (generator) {
  Arduino.iboxs31ImuEnsure(generator);
  generator.addVariable('iboxs31_imu_state', [
    'IBoxS31_IMUData iboxs31_imu_data = {};',
    'float iboxs31_imu_temp = 0;',
    'bool iboxs31_imu_valid = false;',
    'uint32_t iboxs31_imu_at = 0;',
  ].join('\n'));
  generator.addFunction('iboxs31_imu_update', [
    'void iboxs31_imu_update() {',
    '  if (iboxs31_imu_at && millis() - iboxs31_imu_at < 10) return;',
    '  iboxs31_imu_at = millis() | 1;',
    '  IBoxS31_IMUData d;',
    '  iboxs31_imu_valid = iboxs31_imu.read(d);',
    '  if (iboxs31_imu_valid) iboxs31_imu_data = d;',
    '  float t;',
    '  if (iboxs31_imu.readTemperature(t)) iboxs31_imu_temp = t;',
    '}',
  ].join('\n'));
};

// 罗盘：同样 10 毫秒内共用一次采样
Arduino.iboxs31ImuMagEnsure = function (generator) {
  Arduino.iboxs31ImuEnsure(generator);
  generator.addVariable('iboxs31_imu_mag_state', [
    'int16_t iboxs31_imu_mag_x = 0, iboxs31_imu_mag_y = 0, iboxs31_imu_mag_z = 0;',
    'float iboxs31_imu_mag_heading = 0;',
    'bool iboxs31_imu_mag_valid = false;',
    'uint32_t iboxs31_imu_mag_at = 0;',
  ].join('\n'));
  generator.addFunction('iboxs31_imu_mag_update', [
    'void iboxs31_imu_mag_update() {',
    '  if (iboxs31_imu_mag_at && millis() - iboxs31_imu_mag_at < 10) return;',
    '  iboxs31_imu_mag_at = millis() | 1;',
    '  int16_t x, y, z;',
    '  float heading;',
    '  iboxs31_imu_mag_valid = iboxs31_imu_mag.readRaw(x, y, z) && iboxs31_imu_mag.readHeading(heading);',
    '  if (iboxs31_imu_mag_valid) {',
    '    iboxs31_imu_mag_x = x; iboxs31_imu_mag_y = y; iboxs31_imu_mag_z = z;',
    '    iboxs31_imu_mag_heading = heading;',
    '  }',
    '}',
  ].join('\n'));
};

Arduino.forBlock['iboxs31_imu_init'] = function (block, generator) {
  Arduino.iboxs31ImuEnsure(generator);
  return Arduino.iboxs31BoardNote()
    + 'iboxs31_imu.begin(Wire, IBoxS31_QMI8658::ADDR_DEFAULT, 0, 1);\n'
    + 'iboxs31_imu_mag.begin(Wire, 0, 1);\n';
};

Arduino.forBlock['iboxs31_imu_range'] = function (block, generator) {
  // CTRL2/CTRL3 的 bit[6:4] 是量程，低 4 位 ODR 保持 board_test 的 0x4
  const acc = Math.min(3, Math.max(0, Number(block.getFieldValue('ACC')) || 0));
  const gyro = Math.min(7, Math.max(4, Number(block.getFieldValue('GYRO')) || 6));
  const hex = v => '0x' + ((v << 4) | 0x04).toString(16).toUpperCase().padStart(2, '0');
  Arduino.iboxs31ImuEnsure(generator);
  return 'iboxs31_imu.configure(' + hex(acc) + ', ' + hex(gyro) + ');\n';
};

Arduino.forBlock['iboxs31_imu_read'] = function (block, generator) {
  const what = ['AX', 'AY', 'AZ', 'GX', 'GY', 'GZ', 'TEMP', 'PITCH', 'ROLL'].indexOf(block.getFieldValue('WHAT'));
  Arduino.iboxs31ImuSixEnsure(generator);
  generator.addFunction('iboxs31_imu_get', [
    'float iboxs31_imu_get(int what) {',
    '  iboxs31_imu_update();',
    '  const IBoxS31_IMUData &d = iboxs31_imu_data;',
    '  switch (what) {',
    '    case 0: return d.axg;',
    '    case 1: return d.ayg;',
    '    case 2: return d.azg;',
    '    case 3: return d.gxd;',
    '    case 4: return d.gyd;',
    '    case 5: return d.gzd;',
    '    case 6: return iboxs31_imu_temp;',
    '    case 7: return atan2f(-d.axg, sqrtf(d.ayg * d.ayg + d.azg * d.azg)) * 57.29578f;',
    '    case 8: return atan2f(d.ayg, d.azg) * 57.29578f;',
    '  }',
    '  return 0;',
    '}',
  ].join('\n'));
  return ['iboxs31_imu_get(' + Math.max(0, what) + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['iboxs31_imu_ok'] = function (block, generator) {
  Arduino.iboxs31ImuSixEnsure(generator);
  generator.addFunction('iboxs31_imu_ok', [
    'bool iboxs31_imu_ok() {',
    '  iboxs31_imu_update();',
    '  return iboxs31_imu_valid;',
    '}',
  ].join('\n'));
  return ['iboxs31_imu_ok()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['iboxs31_imu_mag_read'] = function (block, generator) {
  const what = { X: 1, Y: 2, Z: 3 }[block.getFieldValue('WHAT')] || 0;
  Arduino.iboxs31ImuMagEnsure(generator);
  generator.addFunction('iboxs31_imu_mag_get', [
    'float iboxs31_imu_mag_get(int what) {',
    '  iboxs31_imu_mag_update();',
    '  if (what == 1) return iboxs31_imu_mag_x;',
    '  if (what == 2) return iboxs31_imu_mag_y;',
    '  if (what == 3) return iboxs31_imu_mag_z;',
    '  return iboxs31_imu_mag_heading;',
    '}',
  ].join('\n'));
  return ['iboxs31_imu_mag_get(' + what + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['iboxs31_imu_mag_calibrate'] = function (block, generator) {
  const seconds = generator.valueToCode(block, 'SECONDS', generator.ORDER_ATOMIC) || '10';
  Arduino.iboxs31ImuMagEnsure(generator);
  generator.addFunction('iboxs31_imu_mag_calibrate', [
    'void iboxs31_imu_mag_calibrate(float seconds) {',
    '  iboxs31_imu_mag.calibrateReset();',
    '  const uint32_t start = millis();',
    '  const uint32_t span = (uint32_t)(constrain(seconds, 1.0f, 120.0f) * 1000);',
    '  while (millis() - start < span) {',
    '    iboxs31_imu_mag.calibrateUpdate();',
    '    delay(20);',
    '  }',
    '  iboxs31_imu_mag.calibrateApply();',
    '  iboxs31_imu_mag_at = 0;',
    '}',
  ].join('\n'));
  return 'iboxs31_imu_mag_calibrate(' + seconds + ');\n';
};

Arduino.forBlock['iboxs31_imu_mag_declination'] = function (block, generator) {
  const degrees = generator.valueToCode(block, 'DEGREES', generator.ORDER_ATOMIC) || '0';
  Arduino.iboxs31ImuEnsure(generator);
  return 'iboxs31_imu_mag.setDeclination(' + degrees + ');\n';
};

Arduino.forBlock['iboxs31_imu_mag_set_offsets'] = function (block, generator) {
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const z = generator.valueToCode(block, 'Z', generator.ORDER_ATOMIC) || '0';
  Arduino.iboxs31ImuEnsure(generator);
  return 'iboxs31_imu_mag.setOffsets((int16_t)(' + x + '), (int16_t)(' + y + '), (int16_t)(' + z + '));\n';
};

Arduino.forBlock['iboxs31_imu_mag_offset'] = function (block, generator) {
  const axis = { Y: 1, Z: 2 }[block.getFieldValue('AXIS')] || 0;
  Arduino.iboxs31ImuEnsure(generator);
  generator.addFunction('iboxs31_imu_mag_offset', [
    'int iboxs31_imu_mag_offset(int axis) {',
    '  int16_t x, y, z;',
    '  iboxs31_imu_mag.getOffsets(x, y, z);',
    '  return axis == 1 ? y : axis == 2 ? z : x;',
    '}',
  ].join('\n'));
  return ['iboxs31_imu_mag_offset(' + axis + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['iboxs31_imu_mag_ok'] = function (block, generator) {
  Arduino.iboxs31ImuMagEnsure(generator);
  generator.addFunction('iboxs31_imu_mag_ok', [
    'bool iboxs31_imu_mag_ok() {',
    '  iboxs31_imu_mag_update();',
    '  return iboxs31_imu_mag_valid;',
    '}',
  ].join('\n'));
  return ['iboxs31_imu_mag_ok()', generator.ORDER_FUNCTION_CALL];
};
