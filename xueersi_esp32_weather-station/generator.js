// lib-weather-station generator.js
// 天气站库代码生成器

Arduino.forBlock['ws_auto_connect'] = function(block, generator) {
  const apSsid = block.getFieldValue('AP_SSID') || 'WeatherConfig';

  generator.addLibrary('WeatherStation', '#include "weather_station.h"');

  return 'WS.autoConnect("' + apSsid + '");\n';
};

Arduino.forBlock['ws_config_loop'] = function(block, generator) {
  generator.addLibrary('WeatherStation', '#include "weather_station.h"');

  return 'WS.configLoop();\n';
};

Arduino.forBlock['ws_is_config_mode'] = function(block, generator) {
  generator.addLibrary('WeatherStation', '#include "weather_station.h"');

  return ['WS.isConfigMode()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['ws_fetch_weather'] = function(block, generator) {
  generator.addLibrary('WeatherStation', '#include "weather_station.h"');

  return 'WS.fetchWeather();\n';
};

Arduino.forBlock['ws_fetch_weather_result'] = function(block, generator) {
  generator.addLibrary('WeatherStation', '#include "weather_station.h"');

  return ['WS.fetchWeather()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['ws_get_city'] = function(block, generator) {
  generator.addLibrary('WeatherStation', '#include "weather_station.h"');
  return ['WS.getCity()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['ws_get_temp'] = function(block, generator) {
  generator.addLibrary('WeatherStation', '#include "weather_station.h"');
  return ['WS.getTemp()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['ws_get_humidity'] = function(block, generator) {
  generator.addLibrary('WeatherStation', '#include "weather_station.h"');
  return ['WS.getHumidity()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['ws_get_weather'] = function(block, generator) {
  generator.addLibrary('WeatherStation', '#include "weather_station.h"');
  return ['WS.getWeather()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['ws_get_wind'] = function(block, generator) {
  generator.addLibrary('WeatherStation', '#include "weather_station.h"');
  return ['WS.getWind()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['ws_get_wind_dir'] = function(block, generator) {
  generator.addLibrary('WeatherStation', '#include "weather_station.h"');
  return ['WS.getWindDir()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['ws_is_wifi_connected'] = function(block, generator) {
  generator.addLibrary('WeatherStation', '#include "weather_station.h"');
  return ['WS.isWifiConnected()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['ws_get_ip'] = function(block, generator) {
  generator.addLibrary('WeatherStation', '#include "weather_station.h"');
  return ['WS.getLocalIP()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['ws_save_config'] = function(block, generator) {
  const ssid = generator.valueToCode(block, 'SSID', generator.ORDER_ATOMIC) || '""';
  const pass = generator.valueToCode(block, 'PASS', generator.ORDER_ATOMIC) || '""';
  const apikey = generator.valueToCode(block, 'APIKEY', generator.ORDER_ATOMIC) || '""';
  const city = generator.valueToCode(block, 'CITY', generator.ORDER_ATOMIC) || '""';

  generator.addLibrary('WeatherStation', '#include "weather_station.h"');

  return 'WS.saveConfig(' + ssid + ', ' + pass + ', ' + apikey + ', ' + city + ');\n';
};
