'use strict';

function seeedRtcBoardCore() {
  const boardConfig = typeof window !== 'undefined' ? window['boardConfig'] : null;
  return boardConfig && boardConfig.core ? String(boardConfig.core) : '';
}

function seeedRtcEnsureSerial(generator) {
  if (typeof ensureSerialBegin === 'function') {
    ensureSerialBegin('Serial', generator);
  }
}

function seeedRtcEnsure(generator) {
  seeedRtcBoardCore();
  generator.addLibrary('Seeed_Arduino_RTC',
    '#include <DateTime.h>\n' +
    '#if defined(__SAMD21__)\n' +
    '#include <RTC_SAMD21.h>\n' +
    'typedef RTC_SAMD21 SeeedRTC;\n' +
    '#elif defined(__SAMD51__)\n' +
    '#include <RTC_SAMD51.h>\n' +
    'typedef RTC_SAMD51 SeeedRTC;\n' +
    '#else\n' +
    '#error "Seeed Arduino RTC supports SAMD21 and SAMD51 boards only"\n' +
    '#endif'
  );
  seeedRtcAddAlarmHelpers(generator);
}

function seeedRtcAddAlarmHelpers(generator) {
  generator.addFunction('seeedRtcAlarmHelpers',
    'void seeedRtcSetAlarm(SeeedRTC& rtc, uint8_t id, const DateTime& dt) {\n' +
    '#if defined(__SAMD51__)\n' +
    '  rtc.setAlarm(id, dt);\n' +
    '#else\n' +
    '  (void)id;\n' +
    '  rtc.setAlarm(dt);\n' +
    '#endif\n' +
    '}\n\n' +
    'DateTime seeedRtcGetAlarm(SeeedRTC& rtc, uint8_t id) {\n' +
    '#if defined(__SAMD51__)\n' +
    '  return rtc.alarm(id);\n' +
    '#else\n' +
    '  (void)id;\n' +
    '  return rtc.alarm();\n' +
    '#endif\n' +
    '}\n\n' +
    'void seeedRtcEnableAlarm(SeeedRTC& rtc, uint8_t id, SeeedRTC::Alarm_Match match) {\n' +
    '#if defined(__SAMD51__)\n' +
    '  rtc.enableAlarm(id, match);\n' +
    '#else\n' +
    '  (void)id;\n' +
    '  rtc.enableAlarm(match);\n' +
    '#endif\n' +
    '}\n\n' +
    'void seeedRtcDisableAlarm(SeeedRTC& rtc, uint8_t id) {\n' +
    '#if defined(__SAMD51__)\n' +
    '  rtc.disableAlarm(id);\n' +
    '#else\n' +
    '  (void)id;\n' +
    '  rtc.disableAlarm();\n' +
    '#endif\n' +
    '}\n'
  );
}

function seeedRtcAttachVarMonitor(block, defaultName) {
  const varName = block.getFieldValue('VAR') || defaultName;
  registerVariableToBlockly(varName, 'SeeedRTC');

  if (block._seeedRtc_varMonitorAttached) {
    return varName;
  }

  block._seeedRtc_varMonitorAttached = true;
  block._seeedRtc_varLastName = varName;
  const varField = block.getField('VAR');
  if (varField) {
    const originalFinishEditing = varField.onFinishEditing_;
    varField.onFinishEditing_ = function(newName) {
      if (typeof originalFinishEditing === 'function') {
        originalFinishEditing.call(this, newName);
      }
      const oldName = block._seeedRtc_varLastName;
      const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
      if (workspace && newName && newName !== oldName) {
        renameVariableInBlockly(block, oldName, newName, 'SeeedRTC');
        block._seeedRtc_varLastName = newName;
      }
    };
  }

  return varName;
}

function seeedRtcGetVar(block, defaultName) {
  const varField = block.getField('VAR');
  return varField ? varField.getText() : defaultName;
}

function seeedRtcSafeName(value, fallback) {
  const cleaned = String(value || '')
    .replace(/[^a-zA-Z0-9_]/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/_+/g, '_');
  if (!cleaned || /^[0-9]/.test(cleaned)) {
    return fallback;
  }
  return cleaned;
}

function seeedRtcValue(generator, block, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}

function seeedRtcDateTimeFallback() {
  return 'DateTime(2026, 1, 1, 0, 0, 0)';
}

function seeedRtcTimeExpr(generator, block, inputName) {
  return generator.valueToCode(block, inputName, generator.ORDER_ATOMIC) || seeedRtcDateTimeFallback();
}

Arduino.forBlock['seeed_rtc_init'] = function(block, generator) {
  const varName = seeedRtcAttachVarMonitor(block, 'rtc');
  seeedRtcEnsure(generator);
  generator.addVariable('SeeedRTC ' + varName, 'SeeedRTC ' + varName + ';');
  return varName + '.begin();\n';
};

Arduino.forBlock['seeed_rtc_datetime'] = function(block, generator) {
  const year = seeedRtcValue(generator, block, 'YEAR', '2026');
  const month = seeedRtcValue(generator, block, 'MONTH', '1');
  const day = seeedRtcValue(generator, block, 'DAY', '1');
  const hour = seeedRtcValue(generator, block, 'HOUR', '0');
  const minute = seeedRtcValue(generator, block, 'MINUTE', '0');
  const second = seeedRtcValue(generator, block, 'SECOND', '0');
  seeedRtcEnsure(generator);
  return ['DateTime(' + year + ', ' + month + ', ' + day + ', ' + hour + ', ' + minute + ', ' + second + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rtc_build_time'] = function(block, generator) {
  seeedRtcEnsure(generator);
  return ['DateTime(F(__DATE__), F(__TIME__))', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rtc_set_time'] = function(block, generator) {
  const varName = seeedRtcGetVar(block, 'rtc');
  const dateTime = seeedRtcTimeExpr(generator, block, 'DATETIME');
  seeedRtcEnsure(generator);
  return varName + '.adjust(' + dateTime + ');\n';
};

Arduino.forBlock['seeed_rtc_now'] = function(block, generator) {
  const varName = seeedRtcGetVar(block, 'rtc');
  seeedRtcEnsure(generator);
  return [varName + '.now()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rtc_datetime_get'] = function(block, generator) {
  const time = seeedRtcTimeExpr(generator, block, 'TIME');
  const part = block.getFieldValue('PART') || 'YEAR';
  const expr = '(' + time + ')';
  const parts = {
    YEAR: expr + '.year()',
    MONTH: expr + '.month()',
    DAY: expr + '.day()',
    HOUR: expr + '.hour()',
    MINUTE: expr + '.minute()',
    SECOND: expr + '.second()',
    DAY_OF_WEEK: expr + '.dayOfTheWeek()',
    TWELVE_HOUR: expr + '.twelveHour()',
    IS_PM: expr + '.isPM()',
    UNIXTIME: expr + '.unixtime()',
    SECONDSTIME: expr + '.secondstime()'
  };
  seeedRtcEnsure(generator);
  return [parts[part] || parts.YEAR, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rtc_timestamp'] = function(block, generator) {
  const time = seeedRtcTimeExpr(generator, block, 'TIME');
  const format = block.getFieldValue('FORMAT') || 'FULL';
  const formats = {
    FULL: 'DateTime::TIMESTAMP_FULL',
    TIME: 'DateTime::TIMESTAMP_TIME',
    DATE: 'DateTime::TIMESTAMP_DATE'
  };
  seeedRtcEnsure(generator);
  return ['(' + time + ').timestamp(' + (formats[format] || formats.FULL) + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rtc_is_valid'] = function(block, generator) {
  const time = seeedRtcTimeExpr(generator, block, 'TIME');
  seeedRtcEnsure(generator);
  return ['(' + time + ').isValid()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rtc_set_alarm'] = function(block, generator) {
  const varName = seeedRtcGetVar(block, 'rtc');
  const alarmId = block.getFieldValue('ALARM_ID') || '0';
  const dateTime = seeedRtcTimeExpr(generator, block, 'DATETIME');
  seeedRtcEnsure(generator);
  return 'seeedRtcSetAlarm(' + varName + ', ' + alarmId + ', ' + dateTime + ');\n';
};

Arduino.forBlock['seeed_rtc_get_alarm'] = function(block, generator) {
  const varName = seeedRtcGetVar(block, 'rtc');
  const alarmId = block.getFieldValue('ALARM_ID') || '0';
  seeedRtcEnsure(generator);
  return ['seeedRtcGetAlarm(' + varName + ', ' + alarmId + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rtc_enable_alarm'] = function(block, generator) {
  const varName = seeedRtcGetVar(block, 'rtc');
  const alarmId = block.getFieldValue('ALARM_ID') || '0';
  const match = block.getFieldValue('MATCH') || 'MATCH_HHMMSS';
  seeedRtcEnsure(generator);
  return 'seeedRtcEnableAlarm(' + varName + ', ' + alarmId + ', SeeedRTC::' + match + ');\n';
};

Arduino.forBlock['seeed_rtc_disable_alarm'] = function(block, generator) {
  const varName = seeedRtcGetVar(block, 'rtc');
  const alarmId = block.getFieldValue('ALARM_ID') || '0';
  seeedRtcEnsure(generator);
  return 'seeedRtcDisableAlarm(' + varName + ', ' + alarmId + ');\n';
};

Arduino.forBlock['seeed_rtc_on_alarm'] = function(block, generator) {
  const varName = seeedRtcGetVar(block, 'rtc');
  const callbackName = 'seeedRtcAlarm_' + seeedRtcSafeName(varName, 'rtc');
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';

  seeedRtcEnsure(generator);
  generator.addVariable('seeed_rtc_alarm_flag', 'volatile uint32_t seeed_rtc_alarm_flag = 0;');
  generator.addFunction(callbackName,
    '#if defined(__SAMD51__)\n' +
    'void ' + callbackName + '(uint32_t flag) {\n' +
    '  seeed_rtc_alarm_flag = flag;\n' +
    handlerCode +
    '}\n' +
    '#else\n' +
    'void ' + callbackName + '() {\n' +
    '  seeed_rtc_alarm_flag = 1;\n' +
    handlerCode +
    '}\n' +
    '#endif\n'
  );
  generator.addSetupEnd(varName + '.attachInterrupt(' + callbackName + ');', varName + '.attachInterrupt(' + callbackName + ');');
  return '';
};

Arduino.forBlock['seeed_rtc_alarm_flag'] = function(block, generator) {
  seeedRtcEnsure(generator);
  generator.addVariable('seeed_rtc_alarm_flag', 'volatile uint32_t seeed_rtc_alarm_flag = 0;');
  return ['seeed_rtc_alarm_flag', generator.ORDER_ATOMIC];
};

Arduino.forBlock['seeed_rtc_detach_alarm'] = function(block, generator) {
  const varName = seeedRtcGetVar(block, 'rtc');
  seeedRtcEnsure(generator);
  return varName + '.detachInterrupt();\n';
};

Arduino.forBlock['seeed_rtc_standby'] = function(block, generator) {
  const varName = seeedRtcGetVar(block, 'rtc');
  seeedRtcEnsure(generator);
  return varName + '.standbyMode();\n';
};
