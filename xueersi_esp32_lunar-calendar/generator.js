// lib-lunar-calendar generator.js
// 农历/节气/日历计算库代码生成器

Arduino.forBlock['lunar_to_lunar'] = function(block, generator) {
  const year = generator.valueToCode(block, 'YEAR', generator.ORDER_ATOMIC) || '2026';
  const month = generator.valueToCode(block, 'MONTH', generator.ORDER_ATOMIC) || '1';
  const day = generator.valueToCode(block, 'DAY', generator.ORDER_ATOMIC) || '1';
  
  generator.addLibrary('LunarCalendar', '#include "lunar_calendar.h"');
  
  return ['getLunarDateString(' + year + ', ' + month + ', ' + day + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['lunar_ganzhi_year'] = function(block, generator) {
  const year = generator.valueToCode(block, 'YEAR', generator.ORDER_ATOMIC) || '2026';
  
  generator.addLibrary('LunarCalendar', '#include "lunar_calendar.h"');
  
  return ['getGanzhiYear(' + year + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['lunar_jieqi_name'] = function(block, generator) {
  const year = generator.valueToCode(block, 'YEAR', generator.ORDER_ATOMIC) || '2026';
  const month = generator.valueToCode(block, 'MONTH', generator.ORDER_ATOMIC) || '1';
  const day = generator.valueToCode(block, 'DAY', generator.ORDER_ATOMIC) || '1';
  
  generator.addLibrary('LunarCalendar', '#include "lunar_calendar.h"');
  
  return ['getJieqiName(' + year + ', ' + month + ', ' + day + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['lunar_is_jieqi'] = function(block, generator) {
  const year = generator.valueToCode(block, 'YEAR', generator.ORDER_ATOMIC) || '2026';
  const month = generator.valueToCode(block, 'MONTH', generator.ORDER_ATOMIC) || '1';
  const day = generator.valueToCode(block, 'DAY', generator.ORDER_ATOMIC) || '1';
  
  generator.addLibrary('LunarCalendar', '#include "lunar_calendar.h"');
  
  return ['isJieqiDay(' + year + ', ' + month + ', ' + day + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['lunar_jieqi_day'] = function(block, generator) {
  const year = generator.valueToCode(block, 'YEAR', generator.ORDER_ATOMIC) || '2026';
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  
  generator.addLibrary('LunarCalendar', '#include "lunar_calendar.h"');
  
  return ['getJieqiDay(' + year + ', ' + index + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['lunar_weekday'] = function(block, generator) {
  const year = generator.valueToCode(block, 'YEAR', generator.ORDER_ATOMIC) || '2026';
  const month = generator.valueToCode(block, 'MONTH', generator.ORDER_ATOMIC) || '1';
  const day = generator.valueToCode(block, 'DAY', generator.ORDER_ATOMIC) || '1';
  
  generator.addLibrary('LunarCalendar', '#include "lunar_calendar.h"');
  
  return ['getWeekdayName(calcWeekday(' + year + ', ' + month + ', ' + day + '))', generator.ORDER_ATOMIC];
};

Arduino.forBlock['lunar_weekday_num'] = function(block, generator) {
  const year = generator.valueToCode(block, 'YEAR', generator.ORDER_ATOMIC) || '2026';
  const month = generator.valueToCode(block, 'MONTH', generator.ORDER_ATOMIC) || '1';
  const day = generator.valueToCode(block, 'DAY', generator.ORDER_ATOMIC) || '1';
  
  generator.addLibrary('LunarCalendar', '#include "lunar_calendar.h"');
  
  return ['calcWeekday(' + year + ', ' + month + ', ' + day + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['lunar_days_in_month'] = function(block, generator) {
  const year = generator.valueToCode(block, 'YEAR', generator.ORDER_ATOMIC) || '2026';
  const month = generator.valueToCode(block, 'MONTH', generator.ORDER_ATOMIC) || '1';
  
  generator.addLibrary('LunarCalendar', '#include "lunar_calendar.h"');
  
  return ['getDaysInMonth(' + year + ', ' + month + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['lunar_jieqi_name_by_index'] = function(block, generator) {
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  
  generator.addLibrary('LunarCalendar', '#include "lunar_calendar.h"');
  
  return ['getJieqiNameByIndex(' + index + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['lunar_zodiac_name'] = function(block, generator) {
  const year = generator.valueToCode(block, 'YEAR', generator.ORDER_ATOMIC) || '2026';
  
  generator.addLibrary('LunarCalendar', '#include "lunar_calendar.h"');
  
  return ['getZodiacName(' + year + ')', generator.ORDER_ATOMIC];
};
