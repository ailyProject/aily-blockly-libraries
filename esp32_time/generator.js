'use strict';

// 确保库引用
function ensureESP32TimeLib(generator) {
  generator.addLibrary('ESP32Time', '#include <ESP32Time.h>');
}

// 设置时间（年月日时分秒）
Arduino.forBlock['esp32time_set_time'] = function(block, generator) {
  const year = generator.valueToCode(block, 'YEAR', generator.ORDER_ATOMIC) || '2021';
  const month = generator.valueToCode(block, 'MONTH', generator.ORDER_ATOMIC) || '1';
  const day = generator.valueToCode(block, 'DAY', generator.ORDER_ATOMIC) || '1';
  const hour = generator.valueToCode(block, 'HOUR', generator.ORDER_ATOMIC) || '0';
  const minute = generator.valueToCode(block, 'MINUTE', generator.ORDER_ATOMIC) || '0';
  const second = generator.valueToCode(block, 'SECOND', generator.ORDER_ATOMIC) || '0';
  
  ensureESP32TimeLib(generator);
  generator.addObject('rtc', 'ESP32Time rtc;');
  
  return 'rtc.setTime(' + second + ', ' + minute + ', ' + hour + ', ' + day + ', ' + month + ', ' + year + ');\n';
};

// 设置时间（Unix时间戳）
Arduino.forBlock['esp32time_set_time_epoch'] = function(block, generator) {
  const epoch = generator.valueToCode(block, 'EPOCH', generator.ORDER_ATOMIC) || '1609459200';
  
  ensureESP32TimeLib(generator);
  generator.addObject('rtc', 'ESP32Time rtc;');
  
  return 'rtc.setTime(' + epoch + ');\n';
};

// 获取时间字符串
Arduino.forBlock['esp32time_get_time'] = function(block, generator) {
  ensureESP32TimeLib(generator);
  generator.addObject('rtc', 'ESP32Time rtc;');
  
  return ['rtc.getTime()', generator.ORDER_FUNCTION_CALL];
};

// 获取日期字符串
Arduino.forBlock['esp32time_get_date'] = function(block, generator) {
  const format = block.getFieldValue('FORMAT') || 'false';
  
  ensureESP32TimeLib(generator);
  generator.addObject('rtc', 'ESP32Time rtc;');
  
  return ['rtc.getDate(' + format + ')', generator.ORDER_FUNCTION_CALL];
};

// 获取日期时间字符串
Arduino.forBlock['esp32time_get_datetime'] = function(block, generator) {
  const format = block.getFieldValue('FORMAT') || 'false';
  
  ensureESP32TimeLib(generator);
  generator.addObject('rtc', 'ESP32Time rtc;');
  
  return ['rtc.getDateTime(' + format + ')', generator.ORDER_FUNCTION_CALL];
};

// 获取自定义格式时间字符串
Arduino.forBlock['esp32time_get_formatted_time'] = function(block, generator) {
  const format = generator.valueToCode(block, 'FORMAT', generator.ORDER_ATOMIC) || '"%H:%M:%S"';
  
  ensureESP32TimeLib(generator);
  generator.addObject('rtc', 'ESP32Time rtc;');
  
  return ['rtc.getTime(' + format + ')', generator.ORDER_FUNCTION_CALL];
};

// 获取Unix时间戳
Arduino.forBlock['esp32time_get_epoch'] = function(block, generator) {
  ensureESP32TimeLib(generator);
  generator.addObject('rtc', 'ESP32Time rtc;');
  
  return ['rtc.getEpoch()', generator.ORDER_FUNCTION_CALL];
};

// 获取秒数
Arduino.forBlock['esp32time_get_second'] = function(block, generator) {
  ensureESP32TimeLib(generator);
  generator.addObject('rtc', 'ESP32Time rtc;');
  
  return ['rtc.getSecond()', generator.ORDER_FUNCTION_CALL];
};

// 获取分钟数
Arduino.forBlock['esp32time_get_minute'] = function(block, generator) {
  ensureESP32TimeLib(generator);
  generator.addObject('rtc', 'ESP32Time rtc;');
  
  return ['rtc.getMinute()', generator.ORDER_FUNCTION_CALL];
};

// 获取小时数
Arduino.forBlock['esp32time_get_hour'] = function(block, generator) {
  const mode = block.getFieldValue('MODE') || 'false';
  
  ensureESP32TimeLib(generator);
  generator.addObject('rtc', 'ESP32Time rtc;');
  return ['rtc.getHour(' + mode + ')', generator.ORDER_FUNCTION_CALL];
};

// 获取星期几
Arduino.forBlock['esp32time_get_wday'] = function(block, generator) {
  ensureESP32TimeLib(generator);
  generator.addObject('rtc', 'ESP32Time rtc;');
  
  return ['rtc.getDayofWeek()', generator.ORDER_FUNCTION_CALL];
};

// 获取日期
Arduino.forBlock['esp32time_get_day'] = function(block, generator) {
  ensureESP32TimeLib(generator);
  generator.addObject('rtc', 'ESP32Time rtc;');
  
  return ['rtc.getDay()', generator.ORDER_FUNCTION_CALL];
};

// 获取月份
Arduino.forBlock['esp32time_get_month'] = function(block, generator) {
  ensureESP32TimeLib(generator);
  generator.addObject('rtc', 'ESP32Time rtc;');
  
  return ['rtc.getMonth()', generator.ORDER_FUNCTION_CALL];
};

// 获取年份
Arduino.forBlock['esp32time_get_year'] = function(block, generator) {
  ensureESP32TimeLib(generator);
  generator.addObject('rtc', 'ESP32Time rtc;');
  
  return ['rtc.getYear()', generator.ORDER_FUNCTION_CALL];
};

// 获取上午/下午
Arduino.forBlock['esp32time_get_ampm'] = function(block, generator) {
  const caseType = block.getFieldValue('CASE') || 'false';
  
  ensureESP32TimeLib(generator);
  generator.addObject('rtc', 'ESP32Time rtc;');
  return ['rtc.getAmPm(' + caseType + ')', generator.ORDER_FUNCTION_CALL];
};

// 设置时区偏移
Arduino.forBlock['esp32time_set_offset'] = function(block, generator) {
  const offset = generator.valueToCode(block, 'OFFSET', generator.ORDER_ATOMIC) || '0';
  
  ensureESP32TimeLib(generator);
  generator.addObject('rtc', 'ESP32Time rtc;');
  return 'rtc.offset = ' + offset + ';\n';
};

Arduino.forBlock['esp32time_get_yday'] = function(block, generator) {
  ensureESP32TimeLib(generator);
  generator.addObject('rtc', 'ESP32Time rtc;');
  
  return ['rtc.getYDay()', generator.ORDER_FUNCTION_CALL];
}