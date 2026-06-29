function dfrobotC4002FieldVar(block) {
  const field = block.getField('VAR');
  return field ? field.getText() : 'c4002';
}

function dfrobotC4002Value(block, generator, name, fallback) {
  return generator.valueToCode(block, name, Arduino.ORDER_ATOMIC) || fallback;
}

function dfrobotC4002BoardCore() {
  if (typeof window === 'undefined' || !window.boardConfig) return '';
  return String(window.boardConfig.core || window.boardConfig.board || '');
}

function dfrobotC4002RegisterInitVariable(block, varType) {
  if (block._dfrobotC4002VarMonitorAttached) return;
  block._dfrobotC4002VarMonitorAttached = true;
  block._dfrobotC4002VarLastName = block.getFieldValue('VAR') || 'c4002';

  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._dfrobotC4002VarLastName, varType);
  }

  const varField = block.getField('VAR');
  if (!varField) return;
  const originalFinishEditing = varField.onFinishEditing_;
  varField.onFinishEditing_ = function(newName) {
    if (typeof originalFinishEditing === 'function') {
      originalFinishEditing.call(this, newName);
    }
    const oldName = block._dfrobotC4002VarLastName;
    if (newName && newName !== oldName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, oldName, newName, varType);
      block._dfrobotC4002VarLastName = newName;
    }
  };
}

function dfrobotC4002EnsureNote(generator, varName) {
  const noteName = varName + 'Note';
  generator.addObject(varName + '_note', 'sRetResult_t ' + noteName + ';');
  return noteName;
}

function dfrobotC4002EnsureGateHelpers(generator) {
  generator.addFunction('dfrobotC4002ConfigureAllGates', [
    'bool dfrobotC4002ConfigureAllGates(DFRobot_C4002 &sensor, eDistanceGateType_t gateType, uint8_t state) {',
    '  uint8_t gateData[25];',
    '  for (uint8_t i = 0; i < 25; i++) {',
    '    gateData[i] = state;',
    '  }',
    '  return sensor.configureGate(gateType, gateData);',
    '}'
  ].join('\n'));
  generator.addFunction('dfrobotC4002SetAllGateThresholds', [
    'bool dfrobotC4002SetAllGateThresholds(DFRobot_C4002 &sensor, eDistanceGateType_t gateType, uint8_t threshold) {',
    '  uint8_t gateData[25];',
    '  for (uint8_t i = 0; i < 25; i++) {',
    '    gateData[i] = threshold;',
    '  }',
    '  return sensor.setGateThresh(gateType, gateData);',
    '}'
  ].join('\n'));
}

Arduino.forBlock['dfrobot_c4002_init'] = function(block, generator) {
  dfrobotC4002RegisterInitVariable(block, 'DFRobot_C4002');

  const varName = block.getFieldValue('VAR') || 'c4002';
  const serialName = block.getFieldValue('SERIAL') || 'Serial1';
  const baud = dfrobotC4002Value(block, generator, 'BAUD', '115200');
  const rxPin = dfrobotC4002Value(block, generator, 'RX', '26');
  const txPin = dfrobotC4002Value(block, generator, 'TX', '25');
  const outPin = dfrobotC4002Value(block, generator, 'OUT_PIN', '255');
  const core = dfrobotC4002BoardCore();

  generator.addLibrary('DFRobot_C4002', '#include <DFRobot_C4002.h>');

  if (core.indexOf('arduino:avr:uno') !== -1 || core.indexOf('esp8266') !== -1) {
    generator.addLibrary('SoftwareSerial', '#include <SoftwareSerial.h>');
    generator.addObject(varName + '_serial', 'SoftwareSerial ' + varName + 'Serial(' + rxPin + ', ' + txPin + ');');
    generator.addObject(varName, 'DFRobot_C4002 ' + varName + '(&' + varName + 'Serial, ' + baud + ');');
  } else if (core.indexOf('esp32') !== -1) {
    generator.addObject(varName, 'DFRobot_C4002 ' + varName + '(&' + serialName + ', ' + baud + ', ' + rxPin + ', ' + txPin + ');');
  } else {
    generator.addObject(varName, 'DFRobot_C4002 ' + varName + '(&' + serialName + ', ' + baud + ');');
  }

  return 'while (' + varName + '.begin(' + outPin + ') != true) {\n  delay(1000);\n}\n';
};

Arduino.forBlock['dfrobot_c4002_update'] = function(block, generator) {
  const varName = dfrobotC4002FieldVar(block);
  const noteName = dfrobotC4002EnsureNote(generator, varName);
  return noteName + ' = ' + varName + '.getNoteInfo();\n';
};

Arduino.forBlock['dfrobot_c4002_get_note'] = function(block, generator) {
  const varName = dfrobotC4002FieldVar(block);
  const noteName = dfrobotC4002EnsureNote(generator, varName);
  const note = block.getFieldValue('NOTE') || 'NOTE_TYPE';
  const member = note === 'CALIB_COUNTDOWN' ? 'calibCountdown' : 'noteType';
  return [noteName + '.' + member, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['dfrobot_c4002_get_value'] = function(block) {
  const varName = dfrobotC4002FieldVar(block);
  const value = block.getFieldValue('VALUE') || 'TARGET_STATE';
  const expressions = {
    TARGET_STATE: varName + '.getTargetState()',
    LIGHT: varName + '.getLightIntensity()',
    PRESENCE_COUNTDOWN: varName + '.getPresenceCountDown()',
    PRESENCE_GATE_INDEX: varName + '.getPresenceGateIndex()',
    PRESENCE_DISTANCE: varName + '.getPresenceTargetInfo().distance',
    PRESENCE_ENERGY: varName + '.getPresenceTargetInfo().energy',
    MOTION_DISTANCE: varName + '.getMotionTargetInfo().distance',
    MOTION_SPEED: varName + '.getMotionTargetInfo().speed',
    MOTION_ENERGY: varName + '.getMotionTargetInfo().energy',
    MOTION_DIRECTION: varName + '.getMotionTargetInfo().direction',
    OUT_TARGET_STATE: varName + '.getOutTargetState()',
    LIGHT_THRESHOLD: varName + '.getLightThresh()',
    RANGE_CLOSEST: varName + '.getDetectRange().closest',
    RANGE_FARTHEST: varName + '.getDetectRange().farthest',
    DISAPPEAR_DELAY: varName + '.getTargetDisappearDelay()',
    OUT_PIN_MODE: varName + '.getOutPinMode()',
    RESOLUTION_MODE: varName + '.getResolutionMode()',
    MOTION_SENSITIVITY: varName + '.getSensitivity(eMotionDistGate)',
    PRESENCE_SENSITIVITY: varName + '.getSensitivity(ePresenceDistGate)'
  };
  return [expressions[value] || expressions.TARGET_STATE, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['dfrobot_c4002_set_led'] = function(block) {
  const varName = dfrobotC4002FieldVar(block);
  const led = block.getFieldValue('LED') || 'RUN';
  const state = block.getFieldValue('STATE') || 'eLedOff';
  const method = led === 'OUT' ? 'setOutLedState' : 'setRunLedState';
  return varName + '.' + method + '(' + state + ');\n';
};

Arduino.forBlock['dfrobot_c4002_set_out_pin_mode'] = function(block) {
  const varName = dfrobotC4002FieldVar(block);
  const mode = block.getFieldValue('MODE') || 'eOutpinMode3';
  return varName + '.setOutPinMode(' + mode + ');\n';
};

Arduino.forBlock['dfrobot_c4002_set_resolution'] = function(block) {
  const varName = dfrobotC4002FieldVar(block);
  const mode = block.getFieldValue('MODE') || 'eResolution80Cm';
  return varName + '.setResolutionMode(' + mode + ');\n';
};

Arduino.forBlock['dfrobot_c4002_set_detect_range'] = function(block, generator) {
  const varName = dfrobotC4002FieldVar(block);
  const closest = dfrobotC4002Value(block, generator, 'CLOSEST', '0');
  const farthest = dfrobotC4002Value(block, generator, 'FARTHEST', '1100');
  return varName + '.setDetectRange(' + closest + ', ' + farthest + ');\n';
};

Arduino.forBlock['dfrobot_c4002_set_report_period'] = function(block, generator) {
  const varName = dfrobotC4002FieldVar(block);
  const period = dfrobotC4002Value(block, generator, 'PERIOD', '10');
  return varName + '.setReportPeriod(' + period + ');\n';
};

Arduino.forBlock['dfrobot_c4002_set_light_threshold'] = function(block, generator) {
  const varName = dfrobotC4002FieldVar(block);
  const threshold = dfrobotC4002Value(block, generator, 'THRESHOLD', '0');
  return varName + '.setLightThresh(' + threshold + ');\n';
};

Arduino.forBlock['dfrobot_c4002_set_target_disappear_delay'] = function(block, generator) {
  const varName = dfrobotC4002FieldVar(block);
  const seconds = dfrobotC4002Value(block, generator, 'SECONDS', '1');
  return varName + '.setTargetDisappearDelay(' + seconds + ');\n';
};

Arduino.forBlock['dfrobot_c4002_set_lock_time'] = function(block, generator) {
  const varName = dfrobotC4002FieldVar(block);
  const seconds = dfrobotC4002Value(block, generator, 'SECONDS', '1');
  return varName + '.setLockTime(' + seconds + ');\n';
};

Arduino.forBlock['dfrobot_c4002_set_sensitivity'] = function(block) {
  const varName = dfrobotC4002FieldVar(block);
  const gate = block.getFieldValue('GATE') || 'eMotionDistGate';
  const sensitivity = block.getFieldValue('SENSITIVITY') || 'eMidThreshGroup';
  return varName + '.setSensitivity(' + gate + ', ' + sensitivity + ');\n';
};

Arduino.forBlock['dfrobot_c4002_configure_all_gates'] = function(block, generator) {
  const varName = dfrobotC4002FieldVar(block);
  const gate = block.getFieldValue('GATE') || 'eMotionDistGate';
  const state = block.getFieldValue('STATE') || 'C4002_ENABLE';
  dfrobotC4002EnsureGateHelpers(generator);
  return 'dfrobotC4002ConfigureAllGates(' + varName + ', ' + gate + ', ' + state + ');\n';
};

Arduino.forBlock['dfrobot_c4002_set_gate_threshold_all'] = function(block, generator) {
  const varName = dfrobotC4002FieldVar(block);
  const gate = block.getFieldValue('GATE') || 'eMotionDistGate';
  const threshold = dfrobotC4002Value(block, generator, 'THRESHOLD', '50');
  dfrobotC4002EnsureGateHelpers(generator);
  return 'dfrobotC4002SetAllGateThresholds(' + varName + ', ' + gate + ', ' + threshold + ');\n';
};

Arduino.forBlock['dfrobot_c4002_start_calibration'] = function(block, generator) {
  const varName = dfrobotC4002FieldVar(block);
  const delayTime = dfrobotC4002Value(block, generator, 'DELAY_TIME', '10');
  const contTime = dfrobotC4002Value(block, generator, 'CONT_TIME', '30');
  return varName + '.startEnvCalibration(' + delayTime + ', ' + contTime + ');\n';
};

Arduino.forBlock['dfrobot_c4002_factory_reset'] = function(block) {
  const varName = dfrobotC4002FieldVar(block);
  return varName + '.factoryReset();\n';
};

Arduino.forBlock['dfrobot_c4002_set_baudrate'] = function(block) {
  const varName = dfrobotC4002FieldVar(block);
  const baud = block.getFieldValue('BAUD') || 'eBaud115200';
  return varName + '.setBaudrate(' + baud + ');\n';
};
