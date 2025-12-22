'use strict';

// RTC库代码生成器
Arduino.forBlock['renesas_rtc_begin'] = function(block, generator) {
  generator.addLibrary('RTC', '#include <RTC.h>');
  return 'RTC.begin();\n';
};

Arduino.forBlock['renesas_rtc_is_running'] = function(block, generator) {
  generator.addLibrary('RTC', '#include <RTC.h>');
  return ['RTC.isRunning()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['renesas_rtc_set_time'] = function(block, generator) {
  const day = generator.valueToCode(block, 'DAY', generator.ORDER_ATOMIC) || '1';
  const month = generator.valueToCode(block, 'MONTH', generator.ORDER_ATOMIC) || '1';
  const year = generator.valueToCode(block, 'YEAR', generator.ORDER_ATOMIC) || '2023';
  const hour = generator.valueToCode(block, 'HOUR', generator.ORDER_ATOMIC) || '0';
  const minute = generator.valueToCode(block, 'MINUTE', generator.ORDER_ATOMIC) || '0';
  const second = generator.valueToCode(block, 'SECOND', generator.ORDER_ATOMIC) || '0';
  const dayOfWeek = generator.valueToCode(block, 'DAYOFWEEK', generator.ORDER_ATOMIC) || '0';

  generator.addLibrary('RTC', '#include <RTC.h>');
  
  // 月份数字到字符串的转换
  const monthArray = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 
                     'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
  if (parseInt(month) >= 1 && parseInt(month) <= 12) {
    var monthStr = 'Month::' + monthArray[parseInt(month) - 1];
  } else {
    var monthStr = 'Month::JANUARY';
  }
  // const monthStr = '((' + month + ' >= 1 && ' + month + ' <= 12) ? Month::' + 
  //                 '((String[]){""' + monthArray.map(m => ', "' + m + '"').join('') + '})[' + month + '] : Month::JANUARY)';
  
  // 星期数字到字符串的转换
  const dayOfWeekArray = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  if (parseInt(dayOfWeek) >= 0 && parseInt(dayOfWeek) <= 6) {
    var dayOfWeekStr = 'DayOfWeek::' + dayOfWeekArray[parseInt(dayOfWeek)];
  } else {
    var dayOfWeekStr = 'DayOfWeek::SUNDAY';
  }
  // const dayOfWeekStr = '((' + dayOfWeek + ' >= 0 && ' + dayOfWeek + ' <= 6) ? DayOfWeek::' + 
  //                      '((String[]){""' + dayOfWeekArray.map(d => ', "' + d + '"').join('') + '})[' + dayOfWeek + '] : DayOfWeek::SUNDAY)';
  
  let code = 'RTCTime time(' + day + ', ' + monthStr + ', ' + year + ', ' + 
             hour + ', ' + minute + ', ' + second + ', ' + dayOfWeekStr + ', SaveLight::SAVING_TIME_INACTIVE);\n';
  code += 'RTC.setTime(time);\n';
  
  return code;
};

Arduino.forBlock['renesas_rtc_get_time'] = function(block, generator) {
  generator.addLibrary('RTC', '#include <RTC.h>');
  
  // const timeVar = generator.addVariable('rtc_current_time', 'RTCTime rtc_current_time;');
  // const code = 'RTC.getTime(' + timeVar + '), ' + timeVar;

  // 监听VAR输入值的变化，自动重命名变量
  if (!block._rtcVarMonitorAttached) {
    block._rtcVarMonitorAttached = true;
    block._rtcVarLastName = block.getFieldValue('VAR') || 'rtc_current_time';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._rtcVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'RTCTime');
          block._rtcVarLastName = newName;
        }
        return newName;
      });
    }
  }
  
  const timeVarName = block.getFieldValue('VAR') || 'rtc_current_time';
  let code = 'RTCTime ' + timeVarName + ';\n';
  code += 'RTC.getTime(' + timeVarName + ');\n';
  
  return code;
  
  // return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['renesas_rtc_time_get_day'] = function(block, generator) {
  const time = generator.valueToCode(block, 'TIME', generator.ORDER_ATOMIC) || 'rtc_current_time';
  generator.addLibrary('RTC', '#include <RTC.h>');
  return [time + '.getDayOfMonth()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['renesas_rtc_time_get_month'] = function(block, generator) {
  const time = generator.valueToCode(block, 'TIME', generator.ORDER_ATOMIC) || 'rtc_current_time';
  generator.addLibrary('RTC', '#include <RTC.h>');
  return ['Month2int(' + time + '.getMonth())', generator.ORDER_ATOMIC];
};

Arduino.forBlock['renesas_rtc_time_get_year'] = function(block, generator) {
  const time = generator.valueToCode(block, 'TIME', generator.ORDER_ATOMIC) || 'rtc_current_time';
  generator.addLibrary('RTC', '#include <RTC.h>');
  return [time + '.getYear()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['renesas_rtc_time_get_hour'] = function(block, generator) {
  const time = generator.valueToCode(block, 'TIME', generator.ORDER_ATOMIC) || 'rtc_current_time';
  generator.addLibrary('RTC', '#include <RTC.h>');
  return [time + '.getHour()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['renesas_rtc_time_get_minute'] = function(block, generator) {
  const time = generator.valueToCode(block, 'TIME', generator.ORDER_ATOMIC) || 'rtc_current_time';
  generator.addLibrary('RTC', '#include <RTC.h>');
  return [time + '.getMinutes()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['renesas_rtc_time_get_second'] = function(block, generator) {
  const time = generator.valueToCode(block, 'TIME', generator.ORDER_ATOMIC) || 'rtc_current_time';
  generator.addLibrary('RTC', '#include <RTC.h>');
  return [time + '.getSeconds()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['renesas_rtc_time_get_day_of_week'] = function(block, generator) {
  const time = generator.valueToCode(block, 'TIME', generator.ORDER_ATOMIC) || 'rtc_current_time';
  generator.addLibrary('RTC', '#include <RTC.h>');
  return ['DayOfWeek2int(' + time + '.getDayOfWeek(), false)', generator.ORDER_ATOMIC];
};

Arduino.forBlock['renesas_rtc_set_periodic_callback'] = function(block, generator) {
  const period = block.getFieldValue('PERIOD');
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  
  const callbackName = 'rtc_periodic_callback';// + Math.random().toString(36).substr(2, 9);
  
  const functionDef = 'void ' + callbackName + '() {\n' + handlerCode + '}\n';
  
  generator.addLibrary('RTC', '#include <RTC.h>');
  generator.addFunction(callbackName, functionDef);
  
  let code = 'RTC.setPeriodicCallback(' + callbackName + ', Period::' + period + ');\n';
  generator.addSetupEnd(code, code);
  
  return '';
};

Arduino.forBlock['renesas_rtc_set_alarm_callback'] = function(block, generator) {
  const second = generator.valueToCode(block, 'SECOND', generator.ORDER_ATOMIC) || '0';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  
  const callbackName = 'rtc_alarm_callback';// + Math.random().toString(36).substr(2, 9);
  
  const functionDef = 'void ' + callbackName + '() {\n' + handlerCode + '}\n';
  
  generator.addLibrary('RTC', '#include <RTC.h>');
  generator.addFunction(callbackName, functionDef);
  
  let code = 'RTCTime alarmtime;\n';
  code += 'alarmtime.setSecond(' + second + ');\n';
  code += 'AlarmMatch am;\n';
  code += 'am.addMatchSecond();\n';
  code += 'RTC.setAlarmCallback(' + callbackName + ', alarmtime, am);\n';
  
  generator.addSetupEnd(code, code);
  
  return '';
};

// Arduino.forBlock['renesas_rtc_set_time_if_not_running'] = function(block, generator) {
//   const day = generator.valueToCode(block, 'DAY', generator.ORDER_ATOMIC) || '1';
//   const month = block.getFieldValue('MONTH');
//   const year = generator.valueToCode(block, 'YEAR', generator.ORDER_ATOMIC) || '2023';
//   const hour = generator.valueToCode(block, 'HOUR', generator.ORDER_ATOMIC) || '0';
//   const minute = generator.valueToCode(block, 'MINUTE', generator.ORDER_ATOMIC) || '0';
//   const second = generator.valueToCode(block, 'SECOND', generator.ORDER_ATOMIC) || '0';
//   const dayOfWeek = block.getFieldValue('DAYOFWEEK');

//   generator.addLibrary('RTC', '#include <RTC.h>');
  
//   let code = 'if (!RTC.isRunning()) {\n';
//   code += '  RTCTime time(' + day + ', Month::' + month + ', ' + year + ', ' + 
//           hour + ', ' + minute + ', ' + second + ', DayOfWeek::' + dayOfWeek + ', SaveLight::SAVING_TIME_INACTIVE);\n';
//   code += '  RTC.setTime(time);\n';
//   code += '}\n';
  
//   return code;
// };