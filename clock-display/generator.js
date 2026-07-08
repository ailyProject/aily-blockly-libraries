// lib-clock-display generator.js
// 时钟显示库代码生成器

Arduino.forBlock['clk_begin'] = function(block, generator) {
  const tftField = block.getField('TFT');
  const tftVar = tftField ? tftField.getText() : 'tft';
  const font = block.getFieldValue('FONT') || 'chinese_city_gb2312';

  generator.addLibrary('ClockDisplay', '#include "clock_display.h"');

  return 'Clock.begin(&' + tftVar + ', &u8f);\nClock.setFont(' + font + ');\n';
};

Arduino.forBlock['clk_sync_ntp'] = function(block, generator) {
  const tz = block.getFieldValue('TZ') || '8';
  const ntp1 = block.getFieldValue('NTP1') || 'ntp1.aliyun.com';
  const ntp2 = block.getFieldValue('NTP2') || 'ntp2.aliyun.com';
  const ntp3 = block.getFieldValue('NTP3') || 'ntp3.aliyun.com';

  generator.addLibrary('ClockDisplay', '#include "clock_display.h"');

  return 'Clock.syncNTP(' + tz + ' * 3600, "' + ntp1 + '", "' + ntp2 + '", "' + ntp3 + '");\n';
};

Arduino.forBlock['clk_show'] = function(block, generator) {
  generator.addLibrary('ClockDisplay', '#include "clock_display.h"');
  return 'Clock.showClock();\n';
};

Arduino.forBlock['clk_force_redraw'] = function(block, generator) {
  generator.addLibrary('ClockDisplay', '#include "clock_display.h"');
  return 'Clock.forceRedraw();\n';
};

Arduino.forBlock['clk_read_temp'] = function(block, generator) {
  const pin = block.getFieldValue('PIN') || '39';
  generator.addLibrary('ClockDisplay', '#include "clock_display.h"');
  return 'Clock.readIndoorTemp(' + pin + ');\n';
};

Arduino.forBlock['clk_get_temp'] = function(block, generator) {
  generator.addLibrary('ClockDisplay', '#include "clock_display.h"');
  return ['Clock.getIndoorTemp()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['clk_get_year'] = function(block, generator) {
  generator.addLibrary('ClockDisplay', '#include "clock_display.h"');
  return ['Clock.getYear()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['clk_get_month'] = function(block, generator) {
  generator.addLibrary('ClockDisplay', '#include "clock_display.h"');
  return ['Clock.getMonth()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['clk_get_day'] = function(block, generator) {
  generator.addLibrary('ClockDisplay', '#include "clock_display.h"');
  return ['Clock.getDay()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['clk_get_hour'] = function(block, generator) {
  generator.addLibrary('ClockDisplay', '#include "clock_display.h"');
  return ['Clock.getHour()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['clk_get_minute'] = function(block, generator) {
  generator.addLibrary('ClockDisplay', '#include "clock_display.h"');
  return ['Clock.getMinute()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['clk_get_second'] = function(block, generator) {
  generator.addLibrary('ClockDisplay', '#include "clock_display.h"');
  return ['Clock.getSecond()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['clk_get_weekday'] = function(block, generator) {
  generator.addLibrary('ClockDisplay', '#include "clock_display.h"');
  return ['Clock.getWeekday()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['clk_get_time_str'] = function(block, generator) {
  generator.addLibrary('ClockDisplay', '#include "clock_display.h"');
  return ['Clock.getTimeString()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['clk_get_date_str'] = function(block, generator) {
  generator.addLibrary('ClockDisplay', '#include "clock_display.h"');
  return ['Clock.getDateString()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['clk_get_weekday_str'] = function(block, generator) {
  generator.addLibrary('ClockDisplay', '#include "clock_display.h"');
  return ['Clock.getWeekdayString()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['clk_draw_bg'] = function(block, generator) {
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const w = generator.valueToCode(block, 'W', generator.ORDER_ATOMIC) || '160';
  const h = generator.valueToCode(block, 'H', generator.ORDER_ATOMIC) || '128';
  generator.addLibrary('ClockDisplay', '#include "clock_display.h"');
  return 'Clock.drawBg(' + x + ', ' + y + ', ' + w + ', ' + h + ');\n';
};

Arduino.forBlock['clk_draw_stars'] = function(block, generator) {
  generator.addLibrary('ClockDisplay', '#include "clock_display.h"');
  return 'Clock.drawStars();\n';
};

Arduino.forBlock['clk_show_temp'] = function(block, generator) {
  generator.addLibrary('ClockDisplay', '#include "clock_display.h"');
  return 'Clock.showIndoorTemp();\n';
};
