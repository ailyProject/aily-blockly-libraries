Arduino.forBlock['wind_begin'] = function(block, generator) {
  const speedPin = block.getFieldValue('SPEED_PIN');
  const dirPin = block.getFieldValue('DIR_PIN');
  
  generator.addLibrary('#include <Wind.h>', '#include "Wind.h"');
  generator.addSetupBegin('wind_begin', `  WindSpeed::begin(${speedPin}, ${dirPin});`);
  
  return '';
};

Arduino.forBlock['wind_begin_speed'] = function(block, generator) {
  const speedPin = block.getFieldValue('SPEED_PIN');
  
  generator.addLibrary('#include <Wind.h>', '#include "Wind.h"');
  generator.addSetupBegin('wind_begin_speed', `  WindSpeed::beginWindSpeed(${speedPin});`);
  
  return '';
};

Arduino.forBlock['wind_begin_direction'] = function(block, generator) {
  const dirPin = block.getFieldValue('DIR_PIN');
  
  generator.addLibrary('#include <Wind.h>', '#include "Wind.h"');
  generator.addSetupBegin('wind_begin_direction', `  WindSpeed::beginWindDirection(${dirPin});`);
  
  return '';
};

Arduino.forBlock['wind_update'] = function(block, generator) {
  generator.addLibrary('#include <Wind.h>', '#include "Wind.h"');
  
  return 'WindSpeed::update();\n';
};

Arduino.forBlock['wind_update_speed'] = function(block, generator) {
  generator.addLibrary('#include <Wind.h>', '#include "Wind.h"');
  
  return 'WindSpeed::updateWindSpeed();\n';
};

Arduino.forBlock['wind_update_direction'] = function(block, generator) {
  generator.addLibrary('#include <Wind.h>', '#include "Wind.h"');
  
  return 'WindSpeed::updateWindDirection();\n';
};

Arduino.forBlock['wind_get_speed_kmh'] = function(block, generator) {
  generator.addLibrary('#include <Wind.h>', '#include "Wind.h"');
  
  return ['WindSpeed::getWindSpeed()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['wind_get_speed_mph'] = function(block, generator) {
  generator.addLibrary('#include <Wind.h>', '#include "Wind.h"');
  
  return ['WindSpeed::getWindSpeedMph()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['wind_get_direction'] = function(block, generator) {
  generator.addLibrary('#include <Wind.h>', '#include "Wind.h"');
  
  return ['WindSpeed::getWindDirection()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['wind_get_direction_string'] = function(block, generator) {
  generator.addLibrary('#include <Wind.h>', '#include "Wind.h"');
  
  return ['WindSpeed::getWindDirectionString()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['wind_get_direction_adc'] = function(block, generator) {
  generator.addLibrary('#include <Wind.h>', '#include "Wind.h"');
  
  return ['WindSpeed::getWindDirectionADC()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['wind_is_data_ready'] = function(block, generator) {
  generator.addLibrary('#include <Wind.h>', '#include "Wind.h"');
  
  return ['WindSpeed::isDataReady()', generator.ORDER_ATOMIC];
};