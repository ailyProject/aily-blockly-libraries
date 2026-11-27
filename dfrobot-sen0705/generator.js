
function sen0705GetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'tactile');
}
function sen0705Value(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}
function sen0705Core() {
  if (typeof window === 'undefined' || !window.boardConfig) return '';
  return [window.boardConfig.core, window.boardConfig.board, window.boardConfig.fqbn].filter(Boolean).join(' ');
}
function sen0705AttachVar(block, typeName) {
  if (block.sen0705VarMonitorAttached) return;
  block.sen0705VarMonitorAttached = true;
  block.sen0705VarLastName = block.getFieldValue('VAR') || 'tactile';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block.sen0705VarLastName, typeName);
  }
  var field = block.getField('VAR');
  if (!field) return;
  var originalFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinish === 'function') originalFinish.call(this, newName);
    if (newName && newName !== block.sen0705VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block.sen0705VarLastName, newName, typeName);
      block.sen0705VarLastName = newName;
    }
  };
}

function sen0705EnsureLib(generator) {
  generator.addLibrary('DFRobot_TactileSensor', '#include "DFRobot_TactileSensor.h"');
}
Arduino.forBlock['sen0705_init'] = function(block, generator) {
  sen0705AttachVar(block, 'DFRobot_TactileSensor');
  sen0705EnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'tactile';
  var addr = block.getFieldValue('ADDR') || '1';
  var core = sen0705Core();
  var serialName = block.getFieldValue('SERIAL') || 'Serial1';
  var rx = block.getFieldValue('RX') || '4';
  var tx = block.getFieldValue('TX') || '5';
  const automatic = serialName === 'AUTO';
  const selected = automatic ? 'Serial1' : serialName;
  const numbered = /^Serial(\d+)$/.exec(selected);
  let port = selected;
  let start;
  if (core.indexOf('arduino:avr:uno') !== -1 || core.indexOf('esp8266') !== -1) {
    generator.addLibrary('SoftwareSerial', '#include <SoftwareSerial.h>');
    port = varName + 'Serial';
    generator.addObject(varName + '_serial', 'SoftwareSerial ' + port + '(' +
      (automatic ? '4, 5' : rx + ', ' + tx) + ');');
    start = port + '.begin(115200);';
  } else {
    if (numbered) {
      const n = numbered[1];
      port = 'tactilePort' + n;
      generator.addObject('tactile_uart_' + n, [
        '#if defined(ARDUINO_ARCH_STM32) && defined(USART' + n + ') && !defined(HAVE_HWSERIAL' + n + ')',
        'Uart ' + port + '(USART' + n + ');',
        '#else', 'auto& ' + port + ' = ' + selected + ';', '#endif',
      ].join('\n'));
    }
    start = port + '.begin(115200);';
    if (automatic) {
      start = ['#if defined(ARDUINO_XIAO_ESP32S3)', port + '.begin(115200, SERIAL_8N1, D7, D6);',
        '#else', start, '#endif'].join('\n');
    } else if (core.indexOf('esp32') !== -1) {
      start = port + '.begin(115200, SERIAL_8N1, ' + rx + ', ' + tx + ');';
    } else if (numbered && rx !== tx) {
      start = ['#if defined(ARDUINO_ARCH_STM32)', port + '.setRx(' + rx + ');',
        port + '.setTx(' + tx + ');', '#endif', start].join('\n');
    }
  }
  generator.addObject(varName, 'DFRobot_TactileSensor ' + varName + '(' + addr + ', &' + port + ');');
  const initialize = 'while (' + varName + '.begin(32) == -1) {\n  delay(1000);\n}\n' + varName + '.setSampleRate(eSampleRate20Hz);\n';
  let parent = block;
  while (parent && parent.type !== 'arduino_setup') parent = parent.getSurroundParent?.();
  if (parent) return start + '\n' + initialize;
  generator.addSetupBegin(varName + '_uart', start + '\n');
  return initialize;
};
Arduino.forBlock['sen0705_read'] = function(block, generator) {
  var varName = sen0705GetVar(block);
  generator.addObject(varName + 'Data', 'sAdcDatas_t ' + varName + 'Data;');
  return ['((' + varName + 'Data = ' + varName + '.getDatas()).result == 0)', generator.ORDER_EQUALITY];
};
Arduino.forBlock['sen0705_cell'] = function(block, generator) {
  var varName = sen0705GetVar(block);
  var row = sen0705Value(block, generator, 'ROW', '0');
  var col = sen0705Value(block, generator, 'COL', '0');
  generator.addObject(varName + 'Data', 'sAdcDatas_t ' + varName + 'Data;');
  generator.addFunction('tactileCellAt', 'static uint16_t tactileCellAt(const sAdcDatas_t& sample, long row, long col, int rows, int cols) {\n' +
    '  if (sample.result != 0 || row < 0 || row >= rows || col < 0 || col >= cols) return 0;\n' +
    '  return sample.adcval[row][col];\n}');
  return ['tactileCellAt(' + varName + 'Data, ' + row + ', ' + col + ', 4, 8)', generator.ORDER_FUNCTION_CALL];
};
Arduino.forBlock['sen0705_set_thld'] = function(block, generator) {
  return sen0705GetVar(block) + '.setThld(' + sen0705Value(block, generator, 'THLD', '50') + ');\n';
};
Arduino.forBlock['sen0705_set_rate'] = function(block, generator) {
  return sen0705GetVar(block) + '.setSampleRate(' + (block.getFieldValue('RATE') || 'eSampleRate20Hz') + ');\n';
};
Arduino.forBlock['sen0705_info'] = function(block, generator) {
  var varName = sen0705GetVar(block);
  var info = block.getFieldValue('INFO') || 'VID';
  var map = {VID: varName + '.getDeviceInfo().VID', PID: varName + '.getDeviceInfo().PID', VER: varName + '.getDeviceInfo().version'};
  return [map[info] || map.VID, generator.ORDER_FUNCTION_CALL];
};
Arduino.forBlock['sen0705_restore'] = function(block, generator) {
  return sen0705GetVar(block) + '.restoreSensor();\n';
};
Arduino.forBlock['sen0705_set_addr'] = function(block, generator) {
  return sen0705GetVar(block) + '.setDevAddr(' + sen0705Value(block, generator, 'ADDR', '1') + ');\n';
};
