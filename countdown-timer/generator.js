// lib-countdown-timer generator.js
// 倒计时+音乐库代码生成器

Arduino.forBlock['cd_begin'] = function(block, generator) {
  const tftField = block.getField('TFT');
  const tftVar = tftField ? tftField.getText() : 'tft';
  const pin = block.getFieldValue('PIN') || '14';

  generator.addLibrary('CountdownTimer', '#include "countdown_timer.h"');

  return 'Countdown.begin(&' + tftVar + ', &u8f);\nCountdown.setBuzzerPin(' + pin + ');\n';
};

Arduino.forBlock['cd_set_font'] = function(block, generator) {
  const font = block.getFieldValue('FONT') || 'chinese_city_gb2312';
  generator.addLibrary('CountdownTimer', '#include "countdown_timer.h"');
  return 'Countdown.setFont(' + font + ');\n';
};

Arduino.forBlock['cd_update'] = function(block, generator) {
  generator.addLibrary('CountdownTimer', '#include "countdown_timer.h"');
  return 'Countdown.update();\n';
};

Arduino.forBlock['cd_show'] = function(block, generator) {
  generator.addLibrary('CountdownTimer', '#include "countdown_timer.h"');
  return 'Countdown.show();\n';
};

Arduino.forBlock['cd_force_redraw'] = function(block, generator) {
  generator.addLibrary('CountdownTimer', '#include "countdown_timer.h"');
  return 'Countdown.forceRedraw();\n';
};

Arduino.forBlock['cd_start'] = function(block, generator) {
  const min = generator.valueToCode(block, 'MIN', generator.ORDER_ATOMIC) || '5';
  generator.addLibrary('CountdownTimer', '#include "countdown_timer.h"');
  return 'Countdown.start(' + min + ');\n';
};

Arduino.forBlock['cd_pause'] = function(block, generator) {
  generator.addLibrary('CountdownTimer', '#include "countdown_timer.h"');
  return 'Countdown.pause();\n';
};

Arduino.forBlock['cd_resume'] = function(block, generator) {
  generator.addLibrary('CountdownTimer', '#include "countdown_timer.h"');
  return 'Countdown.resume();\n';
};

Arduino.forBlock['cd_cancel'] = function(block, generator) {
  generator.addLibrary('CountdownTimer', '#include "countdown_timer.h"');
  return 'Countdown.cancel();\n';
};

Arduino.forBlock['cd_reset'] = function(block, generator) {
  generator.addLibrary('CountdownTimer', '#include "countdown_timer.h"');
  return 'Countdown.reset();\n';
};

Arduino.forBlock['cd_add_minutes'] = function(block, generator) {
  const delta = generator.valueToCode(block, 'DELTA', generator.ORDER_ATOMIC) || '1';
  generator.addLibrary('CountdownTimer', '#include "countdown_timer.h"');
  return 'Countdown.addMinutes(' + delta + ');\n';
};

Arduino.forBlock['cd_get_state'] = function(block, generator) {
  generator.addLibrary('CountdownTimer', '#include "countdown_timer.h"');
  return ['Countdown.getState()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['cd_get_state_str'] = function(block, generator) {
  generator.addLibrary('CountdownTimer', '#include "countdown_timer.h"');
  return ['Countdown.getStateString()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['cd_get_remain_min'] = function(block, generator) {
  generator.addLibrary('CountdownTimer', '#include "countdown_timer.h"');
  return ['Countdown.getRemainMin()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['cd_get_remain_sec'] = function(block, generator) {
  generator.addLibrary('CountdownTimer', '#include "countdown_timer.h"');
  return ['Countdown.getRemainSec()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['cd_get_time_str'] = function(block, generator) {
  generator.addLibrary('CountdownTimer', '#include "countdown_timer.h"');
  return ['Countdown.getTimeString()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['cd_get_set_min'] = function(block, generator) {
  generator.addLibrary('CountdownTimer', '#include "countdown_timer.h"');
  return ['Countdown.getSetMinutes()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['cd_btn_up'] = function(block, generator) {
  generator.addLibrary('CountdownTimer', '#include "countdown_timer.h"');
  return 'Countdown.onBtnUp();\n';
};

Arduino.forBlock['cd_btn_down'] = function(block, generator) {
  generator.addLibrary('CountdownTimer', '#include "countdown_timer.h"');
  return 'Countdown.onBtnDown();\n';
};

Arduino.forBlock['cd_btn_a'] = function(block, generator) {
  generator.addLibrary('CountdownTimer', '#include "countdown_timer.h"');
  return 'Countdown.onBtnA();\n';
};

Arduino.forBlock['cd_btn_b'] = function(block, generator) {
  generator.addLibrary('CountdownTimer', '#include "countdown_timer.h"');
  return 'Countdown.onBtnB();\n';
};
