'use strict';

function ft6336uEnsureLibrary(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('FT6336U', '#include <FT6336U.h>');
}

function ft6336uGetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'touch');
}

function ft6336uRegisterVar(varName) {
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(varName, 'FT6336U');
  }
}

function ft6336uAttachVarMonitor(block) {
  if (block._varMonitorAttached) return;
  block._varMonitorAttached = true;
  block._varLastName = block.getFieldValue('VAR') || 'touch';
  ft6336uRegisterVar(block._varLastName);

  var field = block.getField('VAR');
  if (!field) return;

  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') {
      oldFinish.call(this, newName);
    }
    if (newName && newName !== block._varLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._varLastName, newName, 'FT6336U');
      block._varLastName = newName;
    }
  };
}

function ft6336uValue(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}

function ft6336uAddDefaultObject(generator, varName, rstPin, intPin) {
  generator.addObject('ft6336u_' + varName, 'FT6336U ' + varName + '(' + rstPin + ', ' + intPin + ');');
}

function ft6336uAddCustomPinObject(generator, varName, sdaPin, sclPin, rstPin, intPin) {
  var code = '';
  code += '#if defined(ARDUINO_ARCH_ESP32) || defined(ARDUINO_ARCH_ESP8266) || defined(ARDUINO_TEENSY41) || defined(ARDUINO_TEENSY40) || defined(TEENSYDUINO)\n';
  code += 'FT6336U ' + varName + '(' + sdaPin + ', ' + sclPin + ', ' + rstPin + ', ' + intPin + ');\n';
  code += '#else\n';
  code += 'FT6336U ' + varName + '(' + rstPin + ', ' + intPin + ');\n';
  code += '#endif';
  generator.addObject('ft6336u_' + varName, code);
}

function ft6336uEnsureScanCache(generator, varName) {
  generator.addObject('ft6336u_' + varName + '_points', 'FT6336U_TouchPointType ' + varName + '_points;');
}

var FT6336U_TOUCH_READERS = {
  x: 'x',
  y: 'y',
  event: 'event',
  id: 'id',
  weight: 'weight',
  misc: 'misc'
};

var FT6336U_MODE_PARAM_READERS = {
  threshold: 'read_touch_threshold()',
  filter: 'read_filter_coefficient()',
  ctrl: 'read_ctrl_mode()',
  monitor_time: 'read_time_period_enter_monitor()',
  active_rate: 'read_active_rate()',
  monitor_rate: 'read_monitor_rate()'
};

var FT6336U_GESTURE_PARAM_READERS = {
  radian: 'read_radian_value()',
  offset_lr: 'read_offset_left_right()',
  offset_ud: 'read_offset_up_down()',
  distance_lr: 'read_distance_left_right()',
  distance_ud: 'read_distance_up_down()',
  distance_zoom: 'read_distance_zoom()'
};

var FT6336U_GESTURE_PARAM_WRITERS = {
  radian: 'write_radian_value',
  offset_lr: 'write_offset_left_right',
  offset_ud: 'write_offset_up_down',
  distance_lr: 'write_distance_left_right',
  distance_ud: 'write_distance_up_down',
  distance_zoom: 'write_distance_zoom'
};

var FT6336U_SYSTEM_INFO_READERS = {
  library_version: 'read_library_version()',
  chip_id: 'read_chip_id()',
  g_mode: 'read_g_mode()',
  power_mode: 'read_pwrmode()',
  firmware_id: 'read_firmware_id()',
  focaltech_id: 'read_focaltech_id()',
  release_code_id: 'read_release_code_id()',
  state: 'read_state()'
};

Arduino.forBlock['ft6336u_init'] = function(block, generator) {
  ft6336uAttachVarMonitor(block);
  ft6336uEnsureLibrary(generator);

  var varName = block.getFieldValue('VAR') || 'touch';
  var rstPin = ft6336uValue(block, generator, 'RST', '21');
  var intPin = ft6336uValue(block, generator, 'INT', '34');

  ft6336uRegisterVar(varName);
  ft6336uAddDefaultObject(generator, varName, rstPin, intPin);

  return varName + '.begin();\n';
};

Arduino.forBlock['ft6336u_init_with_pins'] = function(block, generator) {
  ft6336uAttachVarMonitor(block);
  ft6336uEnsureLibrary(generator);

  var varName = block.getFieldValue('VAR') || 'touch';
  var sdaPin = ft6336uValue(block, generator, 'SDA', '22');
  var sclPin = ft6336uValue(block, generator, 'SCL', '23');
  var rstPin = ft6336uValue(block, generator, 'RST', '21');
  var intPin = ft6336uValue(block, generator, 'INT', '34');

  ft6336uRegisterVar(varName);
  ft6336uAddCustomPinObject(generator, varName, sdaPin, sclPin, rstPin, intPin);

  return varName + '.begin();\n';
};

Arduino.forBlock['ft6336u_touch_count'] = function(block, generator) {
  ft6336uEnsureLibrary(generator);
  return [ft6336uGetVar(block) + '.read_touch_number()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['ft6336u_read_gesture'] = function(block, generator) {
  ft6336uEnsureLibrary(generator);
  return [ft6336uGetVar(block) + '.read_gesture_id()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['ft6336u_read_touch'] = function(block, generator) {
  ft6336uEnsureLibrary(generator);
  var varName = ft6336uGetVar(block);
  var touch = block.getFieldValue('TOUCH') || '1';
  var field = block.getFieldValue('FIELD') || 'x';
  var suffix = FT6336U_TOUCH_READERS[field] || 'x';
  return [varName + '.read_touch' + touch + '_' + suffix + '()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['ft6336u_scan'] = function(block, generator) {
  ft6336uEnsureLibrary(generator);
  var varName = ft6336uGetVar(block);
  ft6336uEnsureScanCache(generator, varName);
  return varName + '_points = ' + varName + '.scan();\n';
};

Arduino.forBlock['ft6336u_scan_touch_count'] = function(block, generator) {
  ft6336uEnsureLibrary(generator);
  var varName = ft6336uGetVar(block);
  ft6336uEnsureScanCache(generator, varName);
  return [varName + '_points.touch_count', generator.ORDER_MEMBER];
};

Arduino.forBlock['ft6336u_scan_point'] = function(block, generator) {
  ft6336uEnsureLibrary(generator);
  var varName = ft6336uGetVar(block);
  var point = block.getFieldValue('POINT') || '0';
  var field = block.getFieldValue('FIELD') || 'status';
  ft6336uEnsureScanCache(generator, varName);
  return [varName + '_points.tp[' + point + '].' + field, generator.ORDER_MEMBER];
};

Arduino.forBlock['ft6336u_scan_point_pressed'] = function(block, generator) {
  ft6336uEnsureLibrary(generator);
  var varName = ft6336uGetVar(block);
  var point = block.getFieldValue('POINT') || '0';
  ft6336uEnsureScanCache(generator, varName);
  return [varName + '_points.tp[' + point + '].status != release', generator.ORDER_RELATIONAL];
};

Arduino.forBlock['ft6336u_set_device_mode'] = function(block, generator) {
  ft6336uEnsureLibrary(generator);
  return ft6336uGetVar(block) + '.write_device_mode(' + (block.getFieldValue('MODE') || 'working_mode') + ');\n';
};

Arduino.forBlock['ft6336u_set_ctrl_mode'] = function(block, generator) {
  ft6336uEnsureLibrary(generator);
  return ft6336uGetVar(block) + '.write_ctrl_mode(' + (block.getFieldValue('MODE') || 'keep_active_mode') + ');\n';
};

Arduino.forBlock['ft6336u_set_g_mode'] = function(block, generator) {
  ft6336uEnsureLibrary(generator);
  return ft6336uGetVar(block) + '.write_g_mode(' + (block.getFieldValue('MODE') || 'pollingMode') + ');\n';
};

Arduino.forBlock['ft6336u_read_mode_param'] = function(block, generator) {
  ft6336uEnsureLibrary(generator);
  var method = FT6336U_MODE_PARAM_READERS[block.getFieldValue('PARAM') || 'threshold'] || 'read_touch_threshold()';
  return [ft6336uGetVar(block) + '.' + method, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['ft6336u_read_gesture_param'] = function(block, generator) {
  ft6336uEnsureLibrary(generator);
  var method = FT6336U_GESTURE_PARAM_READERS[block.getFieldValue('PARAM') || 'radian'] || 'read_radian_value()';
  return [ft6336uGetVar(block) + '.' + method, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['ft6336u_write_gesture_param'] = function(block, generator) {
  ft6336uEnsureLibrary(generator);
  var method = FT6336U_GESTURE_PARAM_WRITERS[block.getFieldValue('PARAM') || 'radian'] || 'write_radian_value';
  var value = ft6336uValue(block, generator, 'VALUE', '16');
  return ft6336uGetVar(block) + '.' + method + '(' + value + ');\n';
};

Arduino.forBlock['ft6336u_read_system_info'] = function(block, generator) {
  ft6336uEnsureLibrary(generator);
  var method = FT6336U_SYSTEM_INFO_READERS[block.getFieldValue('PARAM') || 'chip_id'] || 'read_chip_id()';
  return [ft6336uGetVar(block) + '.' + method, generator.ORDER_FUNCTION_CALL];
};
