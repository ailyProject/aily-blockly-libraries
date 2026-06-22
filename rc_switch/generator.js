'use strict';

function ailySafeName(name, fallback) {
  const raw = String(name || fallback || 'obj').trim();
  const safe = raw.replace(/[^A-Za-z0-9_]/g, '_').replace(/^[^A-Za-z_]+/, '');
  return safe || fallback || 'obj';
}

function ailyFieldVar(block, field, fallback) {
  const varField = block.getField(field);
  return ailySafeName(varField ? varField.getText() : block.getFieldValue(field), fallback);
}

function ailyValue(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}

function ailyRegister(name, type) {
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(name, type);
  }
}

function ailyBlockId(block) {
  return String(block.id || Math.random().toString(36).slice(2)).replace(/[^A-Za-z0-9_]/g, '_');
}


function rcsEnsure(generator) { generator.addLibrary('RCSwitch', '#include <RCSwitch.h>'); }
Arduino.forBlock['rcswitch_create'] = function(block, generator) { rcsEnsure(generator); const name = ailySafeName(block.getFieldValue('VAR'), 'mySwitch'); ailyRegister(name, 'RCSwitch'); generator.addObject('rcswitch_' + name, 'RCSwitch ' + name + ' = RCSwitch();'); return ''; };
Arduino.forBlock['rcswitch_enable_transmit'] = function(block, generator) { rcsEnsure(generator); return ailyFieldVar(block, 'VAR', 'mySwitch') + '.enableTransmit(' + ailyValue(block, generator, 'PIN', '10') + ');\n'; };
Arduino.forBlock['rcswitch_enable_receive'] = function(block, generator) { rcsEnsure(generator); return ailyFieldVar(block, 'VAR', 'mySwitch') + '.enableReceive(' + ailyValue(block, generator, 'INTERRUPT', '0') + ');\n'; };
Arduino.forBlock['rcswitch_set_protocol'] = function(block, generator) { const name = ailyFieldVar(block, 'VAR', 'mySwitch'); return name + '.setProtocol(' + ailyValue(block, generator, 'PROTOCOL', '1') + ', ' + ailyValue(block, generator, 'PULSE', '350') + ');\n'; };
Arduino.forBlock['rcswitch_set_repeat'] = function(block, generator) { return ailyFieldVar(block, 'VAR', 'mySwitch') + '.setRepeatTransmit(' + ailyValue(block, generator, 'REPEAT', '10') + ');\n'; };
Arduino.forBlock['rcswitch_send_decimal'] = function(block, generator) { return ailyFieldVar(block, 'VAR', 'mySwitch') + '.send(' + ailyValue(block, generator, 'CODE', '0') + ', ' + ailyValue(block, generator, 'BITS', '24') + ');\n'; };
Arduino.forBlock['rcswitch_send_binary'] = function(block, generator) { return ailyFieldVar(block, 'VAR', 'mySwitch') + '.send(' + ailyValue(block, generator, 'CODE', '"0"') + ');\n'; };
Arduino.forBlock['rcswitch_send_tristate'] = function(block, generator) { return ailyFieldVar(block, 'VAR', 'mySwitch') + '.sendTriState(' + ailyValue(block, generator, 'CODE', '"0F"') + ');\n'; };
Arduino.forBlock['rcswitch_available'] = function(block, generator) { return [ailyFieldVar(block, 'VAR', 'mySwitch') + '.available()', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['rcswitch_received_value'] = function(block, generator) { return [ailyFieldVar(block, 'VAR', 'mySwitch') + '.' + block.getFieldValue('FIELD') + '()', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['rcswitch_reset_available'] = function(block) { return ailyFieldVar(block, 'VAR', 'mySwitch') + '.resetAvailable();\n'; };
