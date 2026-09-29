// @aily-project/lib-waqi

Arduino.forBlock["waqi_begin"] = function (block, generator) {
  generator.addLibrary('WaqiAqi', '#include "WaqiAqi.h"');
  var esc = function (v) { return String(v == null ? '' : v).replace(/\\/g, '\\\\').replace(/"/g, '\\"'); };
  return 'waqi.begin("' + esc(block.getFieldValue('WIFI_SSID')) + '", "' + esc(block.getFieldValue('WIFI_PASS')) + '");\n';
};

Arduino.forBlock["waqi_fetch"] = function (block, generator) {
  generator.addLibrary('WaqiAqi', '#include "WaqiAqi.h"');
  var esc = function (v) { return String(v == null ? '' : v).replace(/\\/g, '\\\\').replace(/"/g, '\\"'); };
  return ['waqi.fetch("' + esc(block.getFieldValue('STATION')) + '", "' + esc(block.getFieldValue('TOKEN')) + '")', generator.ORDER_ATOMIC];
};

Arduino.forBlock["waqi_draw"] = function (block, generator) {
  generator.addLibrary('WaqiAqi', '#include "WaqiAqi.h"');
  var v = generator.getValue(block, 'VAR', 'field_variable');
  return 'waqi.draw(' + (v || 'display') + ');\n';
};

Arduino.forBlock["waqi_draw_error"] = function (block, generator) {
  generator.addLibrary('WaqiAqi', '#include "WaqiAqi.h"');
  var v = generator.getValue(block, 'VAR', 'field_variable');
  var msg = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '""';
  return 'waqi.drawError(' + (v || 'display') + ', ' + msg + ');\n';
};

Arduino.forBlock["waqi_aqi"] = function (block, generator) {
  generator.addLibrary('WaqiAqi', '#include "WaqiAqi.h"');
  return ['waqi.aqi()', generator.ORDER_ATOMIC];
};

Arduino.forBlock["waqi_level_cn"] = function (block, generator) {
  generator.addLibrary('WaqiAqi', '#include "WaqiAqi.h"');
  return ['waqi.levelCn()', generator.ORDER_ATOMIC];
};

Arduino.forBlock["waqi_city"] = function (block, generator) {
  generator.addLibrary('WaqiAqi', '#include "WaqiAqi.h"');
  return ['waqi.city()', generator.ORDER_ATOMIC];
};

Arduino.forBlock["waqi_time_short"] = function (block, generator) {
  generator.addLibrary('WaqiAqi', '#include "WaqiAqi.h"');
  return ['waqi.timeShort()', generator.ORDER_ATOMIC];
};

Arduino.forBlock["waqi_dominentpol"] = function (block, generator) {
  generator.addLibrary('WaqiAqi', '#include "WaqiAqi.h"');
  return ['waqi.dominentpol()', generator.ORDER_ATOMIC];
};

Arduino.forBlock["waqi_pm25"] = function (block, generator) {
  generator.addLibrary('WaqiAqi', '#include "WaqiAqi.h"');
  return ['waqi.pm25()', generator.ORDER_ATOMIC];
};

Arduino.forBlock["waqi_pm10"] = function (block, generator) {
  generator.addLibrary('WaqiAqi', '#include "WaqiAqi.h"');
  return ['waqi.pm10()', generator.ORDER_ATOMIC];
};

Arduino.forBlock["waqi_temp"] = function (block, generator) {
  generator.addLibrary('WaqiAqi', '#include "WaqiAqi.h"');
  return ['waqi.temp()', generator.ORDER_ATOMIC];
};

Arduino.forBlock["waqi_hum"] = function (block, generator) {
  generator.addLibrary('WaqiAqi', '#include "WaqiAqi.h"');
  return ['waqi.hum()', generator.ORDER_ATOMIC];
};
