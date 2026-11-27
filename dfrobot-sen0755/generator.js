
function sen0755GetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'lidar');
}
function sen0755Value(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}
function sen0755Core() {
  if (typeof window === 'undefined' || !window.boardConfig) return '';
  return [window.boardConfig.core, window.boardConfig.board, window.boardConfig.fqbn].filter(Boolean).join(' ');
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
// The editor refreshes SERIAL from the active board. Keep the routing choice in a stable field.
if (typeof Blockly !== 'undefined') {
  const extension = 'sen0755_port_mode';
  if (Blockly.Extensions.isRegistered(extension)) Blockly.Extensions.unregister(extension);
  Blockly.Extensions.register(extension, function () {
    const mode = this.getField('PORT_MODE');
    const show = value => {
      this.getField('SERIAL').setVisible(value === 'BOARD');
      if (this.rendered) this.render();
    };
    mode.setValidator(value => { show(value); return value; });
    show(mode.getValue());
  });
}

Arduino.forBlock['sen0755_init_uart'] = function(block, generator) {
  sen0755AttachVar(block, 'DFRobot_TFUW500');
  sen0755EnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'lidar';
  var core = sen0755Core();
  const mode = block.getFieldValue('PORT_MODE') || 'BOARD';
  const automatic = mode === 'AUTO';
  const selected = mode === 'BOARD' ? (block.getFieldValue('SERIAL') || 'Serial1') :
    mode === 'ROUTED2' ? 'Serial2' : 'Serial1';
  const rx = block.getFieldValue('RX') || '16';
  const tx = block.getFieldValue('TX') || '17';
  const numbered = /^Serial([12])$/.exec(selected);
  let port = selected;
  let beforeBegin = '';
  if (core.includes('arduino:avr') || core.includes('esp8266')) {
    generator.addLibrary('SoftwareSerial', '#include <SoftwareSerial.h>');
    port = varName + 'Serial';
    generator.addObject(varName + '_serial', 'SoftwareSerial ' + port + '(' + rx + ', ' + tx + ');');
  } else if (numbered) {
    port = 'sen0755Port' + numbered[1];
    const n = numbered[1];
    generator.addObject('sen0755_uart_' + n, [
      '#if defined(ARDUINO_ARCH_STM32) && defined(USART' + n + ') && !defined(HAVE_HWSERIAL' + n + ')',
      'Uart ' + port + '(USART' + n + ');',
      '#else', 'auto& ' + port + ' = ' + selected + ';', '#endif',
    ].join('\n'));
    if (mode === 'ROUTED1' || mode === 'ROUTED2') {
      beforeBegin = ['#if defined(ARDUINO_ARCH_STM32)', port + '.setRx(' + rx + ');',
        port + '.setTx(' + tx + ');', '#endif', ''].join('\n');
    }
  }
  const decl = 'DFRobot_TFUW500_UART ' + varName + '(&' + port + ', 115200';
  // The packed driver opens the port in begin(). Supply pins to its ESP32 constructor.
  const object = automatic
    ? ['#if defined(ARDUINO_XIAO_ESP32S3)', decl + ', D7, D6);', '#else', decl + ');', '#endif'].join('\n')
    : decl + (core.includes('esp32') ? ', ' + rx + ', ' + tx : '') + ');';
  generator.addObject(varName, object);
  return beforeBegin + varName + '.begin();\n';
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
