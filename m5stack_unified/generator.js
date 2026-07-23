'use strict';

function m5stackBoardName() {
  const config = (typeof window !== 'undefined' && window['boardConfig']) ? window['boardConfig'] : {};
  return String(config.name || config.board || '');
}

function m5stackDeviceKind() {
  const name = m5stackBoardName().toLowerCase();
  if (name.indexOf('cardputer') >= 0) return 'cardputer';
  if (name.indexOf('dinmeter') >= 0) return 'dinmeter';
  if (name === 'm5dial' || name.indexOf('m5dial') >= 0) return 'dial';
  return 'unified';
}

function ensureM5StackDevice(generator) {
  const kind = m5stackDeviceKind();
  const boardName = m5stackBoardName().toLowerCase();
  let beginCode = 'auto ailyM5Config = M5.config();\nM5.begin(ailyM5Config);';
  let updateCode = 'M5.update();';

  if (kind === 'cardputer') {
    generator.addLibrary('m5stack_cardputer', '#include <M5Cardputer.h>');
    beginCode = 'auto ailyM5Config = M5.config();\nM5Cardputer.begin(ailyM5Config, true);';
    updateCode = 'M5Cardputer.update();';
  } else if (kind === 'dial') {
    generator.addLibrary('m5stack_dial', '#include <M5Dial.h>');
    beginCode = 'auto ailyM5Config = M5.config();\nM5Dial.begin(ailyM5Config, true, true);';
    updateCode = 'M5Dial.update();';
  } else if (kind === 'dinmeter') {
    generator.addLibrary('m5stack_dinmeter', '#include <M5DinMeter.h>');
    beginCode = 'auto ailyM5Config = M5.config();\nDinMeter.begin(ailyM5Config, true);';
    updateCode = 'DinMeter.update();';
  } else {
    generator.addLibrary('m5stack_unified', '#include <M5Unified.h>');
  }

  generator.addSetupBegin('m5stack_device_begin', beginCode);
  if (boardName.indexOf('nanoc6') >= 0) {
    generator.addSetupBegin(
      'm5stack_nanoc6_rgb_power',
      'pinMode(19, OUTPUT);\ndigitalWrite(19, HIGH);'
    );
  }
  generator.addLoopBegin('m5stack_device_update', updateCode);
}

function m5stackValue(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC || Arduino.ORDER_ATOMIC) || fallback;
}

Arduino.forBlock['m5stack_init'] = function(block, generator) {
  ensureM5StackDevice(generator);
  return '';
};

Arduino.forBlock['m5stack_has_feature'] = function(block, generator) {
  ensureM5StackDevice(generator);
  const feature = block.getFieldValue('FEATURE') || 'DISPLAY';
  const expressions = {
    DISPLAY: '(M5.Display.width() > 0)',
    TOUCH: 'M5.Touch.isEnabled()',
    IMU: 'M5.Imu.isEnabled()',
    RTC: 'M5.Rtc.isEnabled()',
    SPEAKER: 'M5.Speaker.isEnabled()',
    MIC: 'M5.Mic.isEnabled()',
    LED: 'M5.Led.isEnabled()',
    SD: '(M5.hasSD() || M5.getBoard() == m5::board_t::board_M5Tough)',
    BATTERY: '(M5.Power.getBatteryLevel() != -2)'
  };
  return [expressions[feature] || 'false', generator.ORDER_ATOMIC];
};

Arduino.forBlock['m5stack_display_fill'] = function(block, generator) {
  ensureM5StackDevice(generator);
  return 'M5.Display.fillScreen(' + m5stackValue(block, generator, 'COLOR', 'TFT_BLACK') + ');\n';
};

Arduino.forBlock['m5stack_display_refresh'] = function(block, generator) {
  ensureM5StackDevice(generator);
  return 'M5.Display.display();\n';
};

Arduino.forBlock['m5stack_display_set_rotation'] = function(block, generator) {
  ensureM5StackDevice(generator);
  return 'M5.Display.setRotation(' + (block.getFieldValue('ROTATION') || '0') + ');\n';
};

Arduino.forBlock['m5stack_display_set_brightness'] = function(block, generator) {
  ensureM5StackDevice(generator);
  return 'M5.Display.setBrightness((uint8_t)constrain(' + m5stackValue(block, generator, 'VALUE', '128') + ', 0, 255));\n';
};

Arduino.forBlock['m5stack_display_draw_pixel'] = function(block, generator) {
  ensureM5StackDevice(generator);
  const x = m5stackValue(block, generator, 'X', '0');
  const y = m5stackValue(block, generator, 'Y', '0');
  const color = m5stackValue(block, generator, 'COLOR', 'TFT_WHITE');
  return 'M5.Display.drawPixel(' + x + ', ' + y + ', ' + color + ');\n';
};

Arduino.forBlock['m5stack_display_draw_line'] = function(block, generator) {
  ensureM5StackDevice(generator);
  const x1 = m5stackValue(block, generator, 'X1', '0');
  const y1 = m5stackValue(block, generator, 'Y1', '0');
  const x2 = m5stackValue(block, generator, 'X2', '10');
  const y2 = m5stackValue(block, generator, 'Y2', '10');
  const color = m5stackValue(block, generator, 'COLOR', 'TFT_WHITE');
  return 'M5.Display.drawLine(' + x1 + ', ' + y1 + ', ' + x2 + ', ' + y2 + ', ' + color + ');\n';
};

Arduino.forBlock['m5stack_display_rect'] = function(block, generator) {
  ensureM5StackDevice(generator);
  const method = block.getFieldValue('MODE') === 'FILL' ? 'fillRect' : 'drawRect';
  const args = ['X', 'Y', 'W', 'H'].map(function(name) {
    return m5stackValue(block, generator, name, name === 'W' || name === 'H' ? '20' : '0');
  });
  args.push(m5stackValue(block, generator, 'COLOR', 'TFT_WHITE'));
  return 'M5.Display.' + method + '(' + args.join(', ') + ');\n';
};

Arduino.forBlock['m5stack_display_circle'] = function(block, generator) {
  ensureM5StackDevice(generator);
  const method = block.getFieldValue('MODE') === 'FILL' ? 'fillCircle' : 'drawCircle';
  const x = m5stackValue(block, generator, 'X', '0');
  const y = m5stackValue(block, generator, 'Y', '0');
  const radius = m5stackValue(block, generator, 'R', '10');
  const color = m5stackValue(block, generator, 'COLOR', 'TFT_WHITE');
  return 'M5.Display.' + method + '(' + x + ', ' + y + ', ' + radius + ', ' + color + ');\n';
};

Arduino.forBlock['m5stack_display_text_style'] = function(block, generator) {
  ensureM5StackDevice(generator);
  const color = m5stackValue(block, generator, 'COLOR', 'TFT_WHITE');
  const background = m5stackValue(block, generator, 'BACKGROUND', 'TFT_BLACK');
  const size = m5stackValue(block, generator, 'SIZE', '1');
  return 'M5.Display.setTextColor(' + color + ', ' + background + ');\nM5.Display.setTextSize(' + size + ');\n';
};

Arduino.forBlock['m5stack_display_set_cursor'] = function(block, generator) {
  ensureM5StackDevice(generator);
  return 'M5.Display.setCursor(' + m5stackValue(block, generator, 'X', '0') + ', ' + m5stackValue(block, generator, 'Y', '0') + ');\n';
};

Arduino.forBlock['m5stack_display_print'] = function(block, generator) {
  ensureM5StackDevice(generator);
  const method = block.getFieldValue('NEWLINE') === 'FALSE' ? 'print' : 'println';
  return 'M5.Display.' + method + '(' + m5stackValue(block, generator, 'TEXT', '""') + ');\n';
};

Arduino.forBlock['m5stack_display_draw_string'] = function(block, generator) {
  ensureM5StackDevice(generator);
  const text = m5stackValue(block, generator, 'TEXT', '""');
  const x = m5stackValue(block, generator, 'X', '0');
  const y = m5stackValue(block, generator, 'Y', '0');
  return 'M5.Display.drawString(String(' + text + '), ' + x + ', ' + y + ');\n';
};

Arduino.forBlock['m5stack_display_size'] = function(block, generator) {
  ensureM5StackDevice(generator);
  const method = block.getFieldValue('DIMENSION') === 'HEIGHT' ? 'height' : 'width';
  return ['M5.Display.' + method + '()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['m5stack_color'] = function(block, generator) {
  ensureM5StackDevice(generator);
  return [block.getFieldValue('COLOR') || 'TFT_WHITE', generator.ORDER_ATOMIC];
};

Arduino.forBlock['m5stack_color_rgb'] = function(block, generator) {
  ensureM5StackDevice(generator);
  const r = m5stackValue(block, generator, 'R', '255');
  const g = m5stackValue(block, generator, 'G', '255');
  const b = m5stackValue(block, generator, 'B', '255');
  return ['M5.Display.color565(' + r + ', ' + g + ', ' + b + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['m5stack_button_state'] = function(block, generator) {
  ensureM5StackDevice(generator);
  const button = block.getFieldValue('BUTTON') || 'BtnA';
  const method = block.getFieldValue('STATE') || 'isPressed';
  return ['M5.' + button + '.' + method + '()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['m5stack_button_event'] = function(block, generator) {
  ensureM5StackDevice(generator);
  const button = block.getFieldValue('BUTTON') || 'BtnA';
  const method = block.getFieldValue('EVENT') || 'wasClicked';
  return ['M5.' + button + '.' + method + '()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['m5stack_touch_state'] = function(block, generator) {
  ensureM5StackDevice(generator);
  const method = block.getFieldValue('STATE') || 'isPressed';
  return ['M5.Touch.getDetail().' + method + '()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['m5stack_touch_coordinate'] = function(block, generator) {
  ensureM5StackDevice(generator);
  const member = block.getFieldValue('AXIS') === 'Y' ? 'y' : 'x';
  return ['M5.Touch.getDetail().' + member, generator.ORDER_ATOMIC];
};

Arduino.forBlock['m5stack_imu_value'] = function(block, generator) {
  ensureM5StackDevice(generator);
  generator.addFunction('aily_m5_imu_value',
    'float ailyM5ImuValue(uint8_t sensor, uint8_t axis) {\n' +
    '  float x = 0, y = 0, z = 0;\n' +
    '  if (!M5.Imu.isEnabled()) return 0;\n' +
    '  if (sensor == 0) M5.Imu.getAccel(&x, &y, &z);\n' +
    '  else if (sensor == 1) M5.Imu.getGyro(&x, &y, &z);\n' +
    '  else if (sensor == 2) M5.Imu.getMag(&x, &y, &z);\n' +
    '  else { M5.Imu.getTemp(&x); return x; }\n' +
    '  return axis == 0 ? x : (axis == 1 ? y : z);\n' +
    '}\n');
  const sensors = { ACCEL: '0', GYRO: '1', MAG: '2', TEMP: '3' };
  const axes = { X: '0', Y: '1', Z: '2' };
  return ['ailyM5ImuValue(' + (sensors[block.getFieldValue('SENSOR')] || '0') + ', ' + (axes[block.getFieldValue('AXIS')] || '0') + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['m5stack_rtc_get'] = function(block, generator) {
  ensureM5StackDevice(generator);
  generator.addFunction('aily_m5_rtc_part',
    'int ailyM5RtcPart(uint8_t part) {\n' +
    '  if (!M5.Rtc.isEnabled()) return 0;\n' +
    '  auto dt = M5.Rtc.getDateTime();\n' +
    '  switch (part) {\n' +
    '    case 0: return dt.date.year; case 1: return dt.date.month; case 2: return dt.date.date;\n' +
    '    case 3: return dt.time.hours; case 4: return dt.time.minutes; default: return dt.time.seconds;\n' +
    '  }\n' +
    '}\n');
  const parts = { YEAR: '0', MONTH: '1', DAY: '2', HOUR: '3', MINUTE: '4', SECOND: '5' };
  return ['ailyM5RtcPart(' + (parts[block.getFieldValue('PART')] || '0') + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['m5stack_rtc_set'] = function(block, generator) {
  ensureM5StackDevice(generator);
  generator.addFunction('aily_m5_rtc_set',
    'void ailyM5RtcSet(int year, int month, int day, int hour, int minute, int second) {\n' +
    '  if (!M5.Rtc.isEnabled()) return;\n' +
    '  m5::rtc_datetime_t dt(m5::rtc_date_t(year, month, day), m5::rtc_time_t(hour, minute, second));\n' +
    '  M5.Rtc.setDateTime(dt);\n' +
    '}\n');
  const values = ['YEAR', 'MONTH', 'DAY', 'HOUR', 'MINUTE', 'SECOND'].map(function(name) {
    return m5stackValue(block, generator, name, name === 'YEAR' ? '2026' : (name === 'MONTH' || name === 'DAY' ? '1' : '0'));
  });
  return 'ailyM5RtcSet(' + values.join(', ') + ');\n';
};

Arduino.forBlock['m5stack_speaker_tone'] = function(block, generator) {
  ensureM5StackDevice(generator);
  const frequency = m5stackValue(block, generator, 'FREQUENCY', '1000');
  const duration = m5stackValue(block, generator, 'DURATION', '200');
  return 'if (M5.Speaker.isEnabled()) M5.Speaker.tone(' + frequency + ', ' + duration + ');\n';
};

Arduino.forBlock['m5stack_speaker_stop'] = function(block, generator) {
  ensureM5StackDevice(generator);
  return 'M5.Speaker.stop();\n';
};

Arduino.forBlock['m5stack_speaker_volume'] = function(block, generator) {
  ensureM5StackDevice(generator);
  return 'M5.Speaker.setVolume((uint8_t)constrain(' + m5stackValue(block, generator, 'VALUE', '128') + ', 0, 255));\n';
};

Arduino.forBlock['m5stack_mic_level'] = function(block, generator) {
  ensureM5StackDevice(generator);
  generator.addFunction('aily_m5_mic_level',
    'float ailyM5MicLevel() {\n' +
    '  static int16_t samples[128] = {};\n' +
    '  static bool started = false;\n' +
    '  static float level = 0;\n' +
    '  if (!M5.Mic.isEnabled()) return 0;\n' +
    '  if (!started) { M5.Mic.begin(); started = M5.Mic.record(samples, 128, 16000); return 0; }\n' +
    '  if (!M5.Mic.isRecording()) {\n' +
    '    uint32_t sum = 0;\n' +
    '    for (size_t i = 0; i < 128; ++i) { int32_t value = samples[i]; sum += value < 0 ? -value : value; }\n' +
    '    level = (float)sum / 128.0f;\n' +
    '    started = M5.Mic.record(samples, 128, 16000);\n' +
    '  }\n' +
    '  return level;\n' +
    '}\n');
  return ['ailyM5MicLevel()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['m5stack_power_value'] = function(block, generator) {
  ensureM5StackDevice(generator);
  const kind = block.getFieldValue('VALUE') || 'LEVEL';
  const expressions = {
    LEVEL: 'M5.Power.getBatteryLevel()',
    VOLTAGE: 'M5.Power.getBatteryVoltage()',
    CURRENT: 'M5.Power.getBatteryCurrent()'
  };
  return [expressions[kind] || '0', generator.ORDER_ATOMIC];
};

Arduino.forBlock['m5stack_power_charging'] = function(block, generator) {
  ensureM5StackDevice(generator);
  return ['(M5.Power.isCharging() == m5::Power_Class::is_charging)', generator.ORDER_ATOMIC];
};

Arduino.forBlock['m5stack_power_ext_output'] = function(block, generator) {
  ensureM5StackDevice(generator);
  const enabled = block.getFieldValue('ENABLED') === 'FALSE' ? 'false' : 'true';
  return 'M5.Power.setExtOutput(' + enabled + ');\n';
};

Arduino.forBlock['m5stack_power_sleep'] = function(block, generator) {
  ensureM5StackDevice(generator);
  const seconds = m5stackValue(block, generator, 'SECONDS', '10');
  const mode = block.getFieldValue('MODE') || 'TIMER';
  if (mode === 'DEEP') {
    return 'M5.Power.deepSleep((uint64_t)max(0, (int)(' + seconds + ')) * 1000000ULL);\n';
  }
  if (mode === 'LIGHT') {
    return 'M5.Power.lightSleep((uint64_t)max(0, (int)(' + seconds + ')) * 1000000ULL);\n';
  }
  return 'M5.Power.timerSleep(max(1, (int)(' + seconds + ')));\n';
};

Arduino.forBlock['m5stack_vibration'] = function(block, generator) {
  ensureM5StackDevice(generator);
  return 'M5.Power.setVibration((uint8_t)constrain(' + m5stackValue(block, generator, 'VALUE', '0') + ', 0, 255));\n';
};

Arduino.forBlock['m5stack_status_led'] = function(block, generator) {
  ensureM5StackDevice(generator);
  return 'M5.Power.setLed((uint8_t)constrain(' + m5stackValue(block, generator, 'VALUE', '0') + ', 0, 255));\n';
};

Arduino.forBlock['m5stack_power_off'] = function(block, generator) {
  ensureM5StackDevice(generator);
  return 'M5.Power.powerOff();\n';
};

Arduino.forBlock['m5stack_led_set_all'] = function(block, generator) {
  ensureM5StackDevice(generator);
  const values = ['R', 'G', 'B'].map(function(name) { return m5stackValue(block, generator, name, '0'); });
  return 'if (M5.Led.isEnabled()) M5.Led.setAllColor(' + values.join(', ') + ');\n';
};

Arduino.forBlock['m5stack_led_set_one'] = function(block, generator) {
  ensureM5StackDevice(generator);
  const index = m5stackValue(block, generator, 'INDEX', '0');
  const values = ['R', 'G', 'B'].map(function(name) { return m5stackValue(block, generator, name, '0'); });
  return 'if (M5.Led.isEnabled()) M5.Led.setColor(' + index + ', ' + values.join(', ') + ');\n';
};

Arduino.forBlock['m5stack_led_brightness'] = function(block, generator) {
  ensureM5StackDevice(generator);
  return 'if (M5.Led.isEnabled()) M5.Led.setBrightness((uint8_t)constrain(' + m5stackValue(block, generator, 'VALUE', '128') + ', 0, 255));\n';
};

Arduino.forBlock['m5stack_led_count'] = function(block, generator) {
  ensureM5StackDevice(generator);
  return ['M5.Led.getCount()', generator.ORDER_ATOMIC];
};
