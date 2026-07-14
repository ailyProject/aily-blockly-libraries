'use strict';

function seeedWioRtcCheckBoard() {
  const boardConfig = typeof window !== 'undefined' ? window['boardConfig'] : null;
  const core = boardConfig && boardConfig.core ? String(boardConfig.core) : '';
  if (core && core.indexOf('seeed_wio_terminal') === -1) {
    console.warn('Wio Terminal RTC is intended for Seeeduino:samd:seeed_wio_terminal.');
  }
}

// Kept available for projects that add Serial output around RTC operations.
function seeedWioRtcEnsureSerial(generator) {
  if (typeof ensureSerialBegin === 'function') {
    ensureSerialBegin('Serial', generator);
  }
}

function seeedWioRtcEnsure(generator) {
  seeedWioRtcCheckBoard();
  generator.addLibrary('Seeed_Arduino_RTC',
    '#include <DateTime.h>\n' +
    '#if !defined(__SAMD51__)\n' +
    '#error "Wio Terminal RTC requires the SAMD51-based Wio Terminal board"\n' +
    '#endif\n' +
    '#include <RTC_SAMD51.h>\n' +
    'typedef RTC_SAMD51 SeeedWioRTC;'
  );
}

function seeedWioRtcAttachVarMonitor(block, defaultName) {
  const varName = block.getFieldValue('VAR') || defaultName;
  registerVariableToBlockly(varName, 'SeeedWioRTC');

  if (block._seeedWioRtc_varMonitorAttached) {
    return varName;
  }

  block._seeedWioRtc_varMonitorAttached = true;
  block._seeedWioRtc_varLastName = varName;
  const varField = block.getField('VAR');
  if (varField) {
    const originalFinishEditing = varField.onFinishEditing_;
    varField.onFinishEditing_ = function(newName) {
      if (typeof originalFinishEditing === 'function') {
        originalFinishEditing.call(this, newName);
      }
      const oldName = block._seeedWioRtc_varLastName;
      const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
      if (workspace && newName && newName !== oldName) {
        renameVariableInBlockly(block, oldName, newName, 'SeeedWioRTC');
        block._seeedWioRtc_varLastName = newName;
      }
    };
  }

  return varName;
}

function seeedWioRtcGetVar(block, defaultName) {
  const varField = block.getField('VAR');
  return varField ? varField.getText() : defaultName;
}

function seeedWioRtcSafeName(value, fallback) {
  const cleaned = String(value || '')
    .replace(/[^a-zA-Z0-9_]/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/_+/g, '_');
  if (!cleaned || /^[0-9]/.test(cleaned)) {
    return fallback;
  }
  return cleaned;
}

function seeedWioRtcValue(generator, block, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}

function seeedWioRtcDateTimeFallback() {
  return 'DateTime(2026, 1, 1, 0, 0, 0)';
}

function seeedWioRtcTimeExpr(generator, block, inputName) {
  return generator.valueToCode(block, inputName, generator.ORDER_ATOMIC) || seeedWioRtcDateTimeFallback();
}

Arduino.forBlock['seeed_wio_rtc_init'] = function(block, generator) {
  const varName = seeedWioRtcAttachVarMonitor(block, 'rtc');
  seeedWioRtcEnsure(generator);
  generator.addVariable('SeeedWioRTC ' + varName, 'SeeedWioRTC ' + varName + ';');
  return varName + '.begin();\n';
};

Arduino.forBlock['seeed_wio_rtc_datetime'] = function(block, generator) {
  const year = seeedWioRtcValue(generator, block, 'YEAR', '2026');
  const month = seeedWioRtcValue(generator, block, 'MONTH', '1');
  const day = seeedWioRtcValue(generator, block, 'DAY', '1');
  const hour = seeedWioRtcValue(generator, block, 'HOUR', '0');
  const minute = seeedWioRtcValue(generator, block, 'MINUTE', '0');
  const second = seeedWioRtcValue(generator, block, 'SECOND', '0');
  seeedWioRtcEnsure(generator);
  return ['DateTime(' + year + ', ' + month + ', ' + day + ', ' + hour + ', ' + minute + ', ' + second + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_wio_rtc_build_time'] = function(block, generator) {
  seeedWioRtcEnsure(generator);
  return ['DateTime(F(__DATE__), F(__TIME__))', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_wio_rtc_set_time'] = function(block, generator) {
  const varName = seeedWioRtcGetVar(block, 'rtc');
  const dateTime = seeedWioRtcTimeExpr(generator, block, 'DATETIME');
  seeedWioRtcEnsure(generator);
  return varName + '.adjust(' + dateTime + ');\n';
};

Arduino.forBlock['seeed_wio_rtc_now'] = function(block, generator) {
  const varName = seeedWioRtcGetVar(block, 'rtc');
  seeedWioRtcEnsure(generator);
  return [varName + '.now()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_wio_rtc_datetime_get'] = function(block, generator) {
  const time = seeedWioRtcTimeExpr(generator, block, 'TIME');
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
  seeedWioRtcEnsure(generator);
  return [parts[part] || parts.YEAR, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_wio_rtc_timestamp'] = function(block, generator) {
  const time = seeedWioRtcTimeExpr(generator, block, 'TIME');
  const format = block.getFieldValue('FORMAT') || 'FULL';
  const formats = {
    FULL: 'DateTime::TIMESTAMP_FULL',
    TIME: 'DateTime::TIMESTAMP_TIME',
    DATE: 'DateTime::TIMESTAMP_DATE'
  };
  seeedWioRtcEnsure(generator);
  return ['(' + time + ').timestamp(' + (formats[format] || formats.FULL) + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_wio_rtc_is_valid'] = function(block, generator) {
  const time = seeedWioRtcTimeExpr(generator, block, 'TIME');
  seeedWioRtcEnsure(generator);
  return ['(' + time + ').isValid()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_wio_rtc_set_alarm'] = function(block, generator) {
  const varName = seeedWioRtcGetVar(block, 'rtc');
  const alarmId = block.getFieldValue('ALARM_ID') || '0';
  const dateTime = seeedWioRtcTimeExpr(generator, block, 'DATETIME');
  seeedWioRtcEnsure(generator);
  return varName + '.setAlarm(' + alarmId + ', ' + dateTime + ');\n';
};

Arduino.forBlock['seeed_wio_rtc_get_alarm'] = function(block, generator) {
  const varName = seeedWioRtcGetVar(block, 'rtc');
  const alarmId = block.getFieldValue('ALARM_ID') || '0';
  seeedWioRtcEnsure(generator);
  return [varName + '.alarm(' + alarmId + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_wio_rtc_enable_alarm'] = function(block, generator) {
  const varName = seeedWioRtcGetVar(block, 'rtc');
  const alarmId = block.getFieldValue('ALARM_ID') || '0';
  const match = block.getFieldValue('MATCH') || 'MATCH_HHMMSS';
  seeedWioRtcEnsure(generator);
  return varName + '.enableAlarm(' + alarmId + ', SeeedWioRTC::' + match + ');\n';
};

Arduino.forBlock['seeed_wio_rtc_disable_alarm'] = function(block, generator) {
  const varName = seeedWioRtcGetVar(block, 'rtc');
  const alarmId = block.getFieldValue('ALARM_ID') || '0';
  seeedWioRtcEnsure(generator);
  return varName + '.disableAlarm(' + alarmId + ');\n';
};

Arduino.forBlock['seeed_wio_rtc_on_alarm'] = function(block, generator) {
  const varName = seeedWioRtcGetVar(block, 'rtc');
  const callbackName = 'seeedWioRtcAlarm_' + seeedWioRtcSafeName(varName, 'rtc');
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';

  seeedWioRtcEnsure(generator);
  generator.addVariable('seeed_wio_rtc_alarm_flag', 'volatile uint32_t seeed_wio_rtc_alarm_flag = 0;');
  generator.addFunction(callbackName,
    'void ' + callbackName + '(uint32_t flag) {\n' +
    '  seeed_wio_rtc_alarm_flag = flag;\n' +
    handlerCode +
    '}\n'
  );
  generator.addSetupEnd(varName + '.attachInterrupt(' + callbackName + ');', varName + '.attachInterrupt(' + callbackName + ');');
  return '';
};

Arduino.forBlock['seeed_wio_rtc_alarm_flag'] = function(block, generator) {
  seeedWioRtcEnsure(generator);
  generator.addVariable('seeed_wio_rtc_alarm_flag', 'volatile uint32_t seeed_wio_rtc_alarm_flag = 0;');
  return ['seeed_wio_rtc_alarm_flag', generator.ORDER_ATOMIC];
};

Arduino.forBlock['seeed_wio_rtc_detach_alarm'] = function(block, generator) {
  const varName = seeedWioRtcGetVar(block, 'rtc');
  seeedWioRtcEnsure(generator);
  return varName + '.detachInterrupt();\n';
};

Arduino.forBlock['seeed_wio_rtc_standby'] = function(block, generator) {
  const varName = seeedWioRtcGetVar(block, 'rtc');
  seeedWioRtcEnsure(generator);
  return varName + '.standbyMode();\n';
};
