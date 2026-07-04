function c4001EnsureLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('DFRobot_C4001', '#include <DFRobot_C4001.h>');
}

function c4001GetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'c4001');
}

function c4001Value(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}

function c4001Core() {
  if (typeof window === 'undefined' || !window.boardConfig) return '';
  return String(window.boardConfig.core || window.boardConfig.board || '');
}

function c4001AttachVar(block) {
  if (block._c4001VarAttached) return;
  block._c4001VarAttached = true;
  block._c4001VarLastName = block.getFieldValue('VAR') || 'c4001';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._c4001VarLastName, 'DFRobot_C4001');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var originalFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinish === 'function') originalFinish.call(this, newName);
    if (newName && newName !== block._c4001VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._c4001VarLastName, newName, 'DFRobot_C4001');
      block._c4001VarLastName = newName;
    }
  };
}

Arduino.forBlock['c4001_init_i2c'] = function(block, generator) {
  c4001AttachVar(block);
  c4001EnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'c4001';
  var wire = block.getFieldValue('WIRE') || 'Wire';
  var address = block.getFieldValue('ADDRESS') || 'DEVICE_ADDR_0';
  generator.addObject(varName, 'DFRobot_C4001_I2C ' + varName + '(&' + wire + ', ' + address + ');');
  return 'while (!' + varName + '.begin()) {\n  delay(1000);\n}\n';
};

Arduino.forBlock['c4001_init_uart'] = function(block, generator) {
  c4001AttachVar(block);
  c4001EnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'c4001';
  var serialName = block.getFieldValue('SERIAL') || 'Serial1';
  var rx = c4001Value(block, generator, 'RX', 'D2');
  var tx = c4001Value(block, generator, 'TX', 'D3');
  var core = c4001Core();
  if (core.indexOf('arduino:avr:uno') !== -1 || core.indexOf('esp8266') !== -1) {
    generator.addLibrary('SoftwareSerial', '#include <SoftwareSerial.h>');
    generator.addObject(varName + '_serial', 'SoftwareSerial ' + varName + 'Serial(' + rx + ', ' + tx + ');');
    generator.addObject(varName, 'DFRobot_C4001_UART ' + varName + '(&' + varName + 'Serial, 9600);');
  } else if (core.indexOf('esp32') !== -1) {
    generator.addObject(varName, 'DFRobot_C4001_UART ' + varName + '(&' + serialName + ', 9600, ' + rx + ', ' + tx + ');');
  } else {
    generator.addObject(varName, 'DFRobot_C4001_UART ' + varName + '(&' + serialName + ', 9600);');
  }
  return 'while (!' + varName + '.begin()) {\n  delay(1000);\n}\n';
};

Arduino.forBlock['c4001_motion_detected'] = function(block, generator) {
  c4001EnsureLib(generator);
  return [c4001GetVar(block) + '.motionDetection()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['c4001_set_mode'] = function(block, generator) {
  c4001EnsureLib(generator);
  return c4001GetVar(block) + '.setSensorMode(' + (block.getFieldValue('MODE') || 'eExitMode') + ');\n';
};

Arduino.forBlock['c4001_sensor_command'] = function(block, generator) {
  c4001EnsureLib(generator);
  return c4001GetVar(block) + '.setSensor(' + (block.getFieldValue('COMMAND') || 'eStartSen') + ');\n';
};

Arduino.forBlock['c4001_get_status'] = function(block, generator) {
  c4001EnsureLib(generator);
  var member = { WORK: 'workStatus', MODE: 'workMode', INIT: 'initStatus' }[block.getFieldValue('STATUS') || 'WORK'];
  return [c4001GetVar(block) + '.getStatus().' + member, generator.ORDER_ATOMIC];
};

Arduino.forBlock['c4001_set_presence_range'] = function(block, generator) {
  c4001EnsureLib(generator);
  var min = c4001Value(block, generator, 'MIN', '30');
  var max = c4001Value(block, generator, 'MAX', '1000');
  var trig = c4001Value(block, generator, 'TRIG', max);
  return c4001GetVar(block) + '.setDetectionRange(' + min + ', ' + max + ', ' + trig + ');\n';
};

Arduino.forBlock['c4001_set_sensitivity'] = function(block, generator) {
  c4001EnsureLib(generator);
  var method = (block.getFieldValue('TYPE') || 'TRIG') === 'KEEP' ? 'setKeepSensitivity' : 'setTrigSensitivity';
  var sensitivity = c4001Value(block, generator, 'SENSITIVITY', '5');
  return c4001GetVar(block) + '.' + method + '(' + sensitivity + ');\n';
};

Arduino.forBlock['c4001_set_delay'] = function(block, generator) {
  c4001EnsureLib(generator);
  var trig = c4001Value(block, generator, 'TRIG', '100');
  var keep = c4001Value(block, generator, 'KEEP', '4');
  return c4001GetVar(block) + '.setDelay(' + trig + ', ' + keep + ');\n';
};

Arduino.forBlock['c4001_get_presence_config'] = function(block, generator) {
  c4001EnsureLib(generator);
  var varName = c4001GetVar(block);
  var data = block.getFieldValue('DATA') || 'MIN';
  var map = {
    MIN: varName + '.getMinRange()',
    MAX: varName + '.getMaxRange()',
    TRIG_RANGE: varName + '.getTrigRange()',
    TRIG_SENS: varName + '.getTrigSensitivity()',
    KEEP_SENS: varName + '.getKeepSensitivity()',
    TRIG_DELAY: varName + '.getTrigDelay()',
    KEEP_TIMEOUT: varName + '.getKeepTimerout()',
    IO_POLARITY: varName + '.getIoPolaity()',
    PWM1: varName + '.getPwm().pwm1',
    PWM2: varName + '.getPwm().pwm2',
    PWM_TIMER: varName + '.getPwm().timer'
  };
  return [map[data] || map.MIN, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['c4001_set_io_polarity'] = function(block, generator) {
  c4001EnsureLib(generator);
  return c4001GetVar(block) + '.setIoPolaity(' + (block.getFieldValue('POLARITY') || '1') + ');\n';
};

Arduino.forBlock['c4001_set_pwm'] = function(block, generator) {
  c4001EnsureLib(generator);
  var pwm1 = c4001Value(block, generator, 'PWM1', '50');
  var pwm2 = c4001Value(block, generator, 'PWM2', '0');
  var timer = c4001Value(block, generator, 'TIMER', '10');
  return c4001GetVar(block) + '.setPwm(' + pwm1 + ', ' + pwm2 + ', ' + timer + ');\n';
};

Arduino.forBlock['c4001_get_target'] = function(block, generator) {
  c4001EnsureLib(generator);
  var varName = c4001GetVar(block);
  var data = block.getFieldValue('DATA') || 'NUMBER';
  var map = {
    NUMBER: varName + '.getTargetNumber()',
    SPEED: varName + '.getTargetSpeed()',
    RANGE: varName + '.getTargetRange()',
    ENERGY: varName + '.getTargetEnergy()'
  };
  return [map[data] || map.NUMBER, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['c4001_set_speed_threshold'] = function(block, generator) {
  c4001EnsureLib(generator);
  var min = c4001Value(block, generator, 'MIN', '30');
  var max = c4001Value(block, generator, 'MAX', '1200');
  var threshold = c4001Value(block, generator, 'THRESHOLD', '10');
  return c4001GetVar(block) + '.setDetectThres(' + min + ', ' + max + ', ' + threshold + ');\n';
};

Arduino.forBlock['c4001_set_micro_motion'] = function(block, generator) {
  c4001EnsureLib(generator);
  return c4001GetVar(block) + '.setFrettingDetection(' + (block.getFieldValue('STATE') || 'eON') + ');\n';
};

Arduino.forBlock['c4001_get_speed_config'] = function(block, generator) {
  c4001EnsureLib(generator);
  var varName = c4001GetVar(block);
  var data = block.getFieldValue('DATA') || 'MIN';
  var map = {
    MIN: varName + '.getTMinRange()',
    MAX: varName + '.getTMaxRange()',
    THRESHOLD: varName + '.getThresRange()',
    MICRO_MOTION: varName + '.getFrettingDetection()'
  };
  return [map[data] || map.MIN, generator.ORDER_FUNCTION_CALL];
};
