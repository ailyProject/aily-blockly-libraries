// @aily-project/lib-rlcd42-rtc

Arduino.forBlock["rlcd42_rtc_init"] = function (block, generator) {
  generator.addLibrary('rlcd42_rtc', '#include "Rtc42.h"');
  const cal = block.getFieldValue('CALIBRATE') === 'TRUE' ? 'true' : 'false';
  return 'rtc42Begin(' + cal + ');\n';
};

Arduino.forBlock["rlcd42_rtc_read"] = function (block, generator) {
  generator.addLibrary('rlcd42_rtc', '#include "Rtc42.h"');
  return 'rtc42Read();\n';
};

Arduino.forBlock["rlcd42_rtc_get"] = function (block, generator) {
  generator.addLibrary('rlcd42_rtc', '#include "Rtc42.h"');
  const map = { year: 0, month: 1, day: 2, hour: 3, minute: 4, second: 5, weekday: 6 };
  const key = block.getFieldValue('FIELD');
  return ['rtc42Get(' + (map[key] !== undefined ? map[key] : 5) + ')', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock["rlcd42_rtc_format"] = function (block, generator) {
  generator.addLibrary('rlcd42_rtc', '#include "Rtc42.h"');
  const map = { timeText: 0, dateText: 1, datetime: 2 };
  const key = block.getFieldValue('FMT');
  return ['rtc42Format(' + (map[key] !== undefined ? map[key] : 0) + ')', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock["rlcd42_env_read"] = function (block, generator) {
  generator.addLibrary('rlcd42_rtc', '#include "Rtc42.h"');
  return 'env42Read();\n';
};

Arduino.forBlock["rlcd42_env_temp"] = function (block, generator) {
  generator.addLibrary('rlcd42_rtc', '#include "Rtc42.h"');
  return ['env42Temp()', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock["rlcd42_env_humi"] = function (block, generator) {
  generator.addLibrary('rlcd42_rtc', '#include "Rtc42.h"');
  return ['env42Humi()', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock["rlcd42_rtc_ntp"] = function (block, generator) {
  generator.addLibrary('rlcd42_rtc', '#include "Rtc42.h"');
  generator.addLibrary('rlcd42_wifi_udp', '#include <WiFiUdp.h>');
  return ['rtc42SyncNtp()', Arduino.ORDER_FUNCTION_CALL];
};
