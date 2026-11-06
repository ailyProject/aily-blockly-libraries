
function sen0755GetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'lidar');
}
function sen0755Value(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}
function sen0755Core() {
  if (typeof window === 'undefined' || !window.boardConfig) return '';
  return String(window.boardConfig.core || window.boardConfig.board || '');
}
function sen0755AttachVar(block, typeName) {
  if (block.sen0755VarMonitorAttached) return;
  block.sen0755VarMonitorAttached = true;
  block.sen0755VarLastName = block.getFieldValue('VAR') || 'lidar';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block.sen0755VarLastName, typeName);
  }
  var field = block.getField('VAR');
  if (!field) return;
  var originalFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinish === 'function') originalFinish.call(this, newName);
    if (newName && newName !== block.sen0755VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block.sen0755VarLastName, newName, typeName);
      block.sen0755VarLastName = newName;
    }
  };
}

function sen0755EnsureLib(generator) {
  generator.addLibrary('DFRobot_TFUW500', '#include "DFRobot_TFUW500.h"');
}
Arduino.forBlock['sen0755_init_uart'] = function(block, generator) {
  sen0755AttachVar(block, 'DFRobot_TFUW500');
  sen0755EnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'lidar';
  var core = sen0755Core();
  var serialName = block.getFieldValue('SERIAL') || 'Serial1';
  var rx = block.getFieldValue('RX') || '16';
  var tx = block.getFieldValue('TX') || '17';
  if (core.indexOf('arduino:avr') !== -1 || core.indexOf('esp8266') !== -1) {
    generator.addLibrary('SoftwareSerial', '#include <SoftwareSerial.h>');
    generator.addObject(varName + '_serial', 'SoftwareSerial ' + varName + 'Serial(' + rx + ', ' + tx + ');');
    generator.addObject(varName, 'DFRobot_TFUW500_UART ' + varName + '(&' + varName + 'Serial, 115200);');
  } else if (core.indexOf('esp32') !== -1) {
    generator.addObject(varName, 'DFRobot_TFUW500_UART ' + varName + '(&' + serialName + ', 115200, ' + rx + ', ' + tx + ');');
  } else {
    generator.addObject(varName, 'DFRobot_TFUW500_UART ' + varName + '(&' + serialName + ', 115200);');
  }
  return varName + '.begin();\n';
};
Arduino.forBlock['sen0755_init_i2c'] = function(block, generator) {
  sen0755AttachVar(block, 'DFRobot_TFUW500');
  sen0755EnsureLib(generator);
  generator.addLibrary('Wire', '#include <Wire.h>');
  var varName = block.getFieldValue('VAR') || 'lidar';
  var wire = block.getFieldValue('WIRE') || 'Wire';
  var address = block.getFieldValue('ADDRESS') || '0x10';
  generator.addObject(varName, 'DFRobot_TFUW500_I2C ' + varName + '(&' + wire + ', ' + address + ');');
  return varName + '.begin();\n';
};
Arduino.forBlock['sen0755_read'] = function(block, generator) {
  sen0755EnsureLib(generator);
  return [sen0755GetVar(block) + '.readFrame()', generator.ORDER_FUNCTION_CALL];
};
Arduino.forBlock['sen0755_get_data'] = function(block, generator) {
  var varName = sen0755GetVar(block);
  var data = block.getFieldValue('DATA') || 'DIST';
  var map = {DIST: varName + '.getDistanceMm()', PEAK: varName + '.getPeak()', TEMP: varName + '.getTemperatureC()', CONF: varName + '.getConfidence()'};
  return [map[data] || map.DIST, generator.ORDER_FUNCTION_CALL];
};
Arduino.forBlock['sen0755_valid'] = function(block, generator) {
  return [sen0755GetVar(block) + '.isValid()', generator.ORDER_FUNCTION_CALL];
};
