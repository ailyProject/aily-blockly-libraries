
function sen0704GetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'tactile');
}
function sen0704Value(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}
function sen0704Core() {
  if (typeof window === 'undefined' || !window.boardConfig) return '';
  return String(window.boardConfig.core || window.boardConfig.board || '');
}
function sen0704AttachVar(block, typeName) {
  if (block.sen0704VarMonitorAttached) return;
  block.sen0704VarMonitorAttached = true;
  block.sen0704VarLastName = block.getFieldValue('VAR') || 'tactile';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block.sen0704VarLastName, typeName);
  }
  var field = block.getField('VAR');
  if (!field) return;
  var originalFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinish === 'function') originalFinish.call(this, newName);
    if (newName && newName !== block.sen0704VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block.sen0704VarLastName, newName, typeName);
      block.sen0704VarLastName = newName;
    }
  };
}

function sen0704EnsureLib(generator) {
  generator.addLibrary('DFRobot_TactileSensor', '#include "DFRobot_TactileSensor.h"');
}
Arduino.forBlock['sen0704_init'] = function(block, generator) {
  sen0704AttachVar(block, 'DFRobot_TactileSensor');
  sen0704EnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'tactile';
  var addr = block.getFieldValue('ADDR') || '1';
  var core = sen0704Core();
  var serialName = block.getFieldValue('SERIAL') || 'Serial1';
  var rx = block.getFieldValue('RX') || '4';
  var tx = block.getFieldValue('TX') || '5';
  if (core.indexOf('arduino:avr:uno') !== -1 || core.indexOf('esp8266') !== -1) {
    generator.addLibrary('SoftwareSerial', '#include <SoftwareSerial.h>');
    generator.addObject(varName + '_serial', 'SoftwareSerial ' + varName + 'Serial(' + rx + ', ' + tx + ');');
    generator.addObject(varName, 'DFRobot_TactileSensor ' + varName + '(' + addr + ', &' + varName + 'Serial);');
    generator.addSetupBegin(varName + '_uart', varName + 'Serial.begin(115200);\n');
  } else if (core.indexOf('esp32') !== -1) {
    generator.addObject(varName, 'DFRobot_TactileSensor ' + varName + '(' + addr + ', &' + serialName + ');');
    generator.addSetupBegin(varName + '_uart', serialName + '.begin(115200, SERIAL_8N1, ' + rx + ', ' + tx + ');\n');
  } else {
    generator.addObject(varName, 'DFRobot_TactileSensor ' + varName + '(' + addr + ', &' + serialName + ');');
    generator.addSetupBegin(varName + '_uart', serialName + '.begin(115200);\n');
  }
  return 'while (' + varName + '.begin(36) == -1) {\n  delay(1000);\n}\n' + varName + '.setSampleRate(eSampleRate20Hz);\n';
};
Arduino.forBlock['sen0704_read'] = function(block, generator) {
  var varName = sen0704GetVar(block);
  generator.addObject(varName + 'Data', 'sAdcDatas_t ' + varName + 'Data;');
  return ['((' + varName + 'Data = ' + varName + '.getDatas()).result == 0)', generator.ORDER_EQUALITY];
};
Arduino.forBlock['sen0704_cell'] = function(block, generator) {
  var varName = sen0704GetVar(block);
  var row = sen0704Value(block, generator, 'ROW', '0');
  var col = sen0704Value(block, generator, 'COL', '0');
  generator.addObject(varName + 'Data', 'sAdcDatas_t ' + varName + 'Data;');
  return [varName + 'Data.adcval[' + row + '][' + col + ']', generator.ORDER_ATOMIC];
};
Arduino.forBlock['sen0704_set_thld'] = function(block, generator) {
  return sen0704GetVar(block) + '.setThld(' + sen0704Value(block, generator, 'THLD', '50') + ');\n';
};
Arduino.forBlock['sen0704_set_rate'] = function(block, generator) {
  return sen0704GetVar(block) + '.setSampleRate(' + (block.getFieldValue('RATE') || 'eSampleRate20Hz') + ');\n';
};
Arduino.forBlock['sen0704_info'] = function(block, generator) {
  var varName = sen0704GetVar(block);
  var info = block.getFieldValue('INFO') || 'VID';
  var map = {VID: varName + '.getDeviceInfo().VID', PID: varName + '.getDeviceInfo().PID', VER: varName + '.getDeviceInfo().version'};
  return [map[info] || map.VID, generator.ORDER_FUNCTION_CALL];
};
Arduino.forBlock['sen0704_restore'] = function(block, generator) {
  return sen0704GetVar(block) + '.restoreSensor();\n';
};
Arduino.forBlock['sen0704_set_addr'] = function(block, generator) {
  return sen0704GetVar(block) + '.setDevAddr(' + sen0704Value(block, generator, 'ADDR', '1') + ');\n';
};
