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


function pjonEnsure(generator) {
  generator.addLibrary('PJONSoftwareBitBang', '#include <PJONSoftwareBitBang.h>');
}

Arduino.forBlock['pjon_sbb_begin'] = function(block, generator) {
  pjonEnsure(generator);
  const name = ailySafeName(block.getFieldValue('VAR'), 'bus');
  const id = ailyValue(block, generator, 'ID', '44');
  const pin = ailyValue(block, generator, 'PIN', '12');
  ailyRegister(name, 'PJONSoftwareBitBang');
  generator.addObject('pjon_sbb_' + name, 'PJONSoftwareBitBang ' + name + '(' + id + ');');
  generator.addLoopBegin('pjon_update_' + name, name + '.update();');
  generator.addLoopBegin('pjon_receive_' + name, name + '.receive(1000);');
  return name + '.strategy.set_pin(' + pin + ');\n' + name + '.begin();\n';
};

Arduino.forBlock['pjon_sbb_update_receive'] = function(block, generator) {
  const name = ailyFieldVar(block, 'VAR', 'bus');
  const timeout = ailyValue(block, generator, 'TIMEOUT', '1000');
  return name + '.update();\n' + name + '.receive(' + timeout + ');\n';
};

Arduino.forBlock['pjon_sbb_send_text'] = function(block, generator) {
  pjonEnsure(generator);
  const name = ailyFieldVar(block, 'VAR', 'bus');
  const text = ailyValue(block, generator, 'TEXT', '"B"');
  const device = ailyValue(block, generator, 'DEVICE', '45');
  generator.addFunction('aily_pjon_send_text', 'void aily_pjon_send_text(PJONSoftwareBitBang &bus, uint8_t deviceId, const char *text) {\n  bus.send(deviceId, text, strlen(text));\n}\n');
  return 'aily_pjon_send_text(' + name + ', ' + device + ', ' + text + ');\n';
};

Arduino.forBlock['pjon_sbb_send_repeated_text'] = function(block, generator) {
  pjonEnsure(generator);
  const name = ailyFieldVar(block, 'VAR', 'bus');
  const text = ailyValue(block, generator, 'TEXT', '"B"');
  const device = ailyValue(block, generator, 'DEVICE', '45');
  const interval = ailyValue(block, generator, 'INTERVAL', '1000000');
  generator.addFunction('aily_pjon_send_repeated_text', 'void aily_pjon_send_repeated_text(PJONSoftwareBitBang &bus, uint8_t deviceId, const char *text, uint32_t intervalUs) {\n  bus.send_repeatedly(deviceId, text, strlen(text), intervalUs);\n}\n');
  return 'aily_pjon_send_repeated_text(' + name + ', ' + device + ', ' + text + ', ' + interval + ');\n';
};

Arduino.forBlock['pjon_sbb_reply_text'] = function(block, generator) {
  const name = ailyFieldVar(block, 'VAR', 'bus');
  const text = ailyValue(block, generator, 'TEXT', '"OK"');
  generator.addFunction('aily_pjon_reply_text', 'void aily_pjon_reply_text(PJONSoftwareBitBang &bus, const char *text) {\n  bus.reply(text, strlen(text));\n}\n');
  return 'aily_pjon_reply_text(' + name + ', ' + text + ');\n';
};

Arduino.forBlock['pjon_sbb_on_receive'] = function(block, generator) {
  pjonEnsure(generator);
  const name = ailyFieldVar(block, 'VAR', 'bus');
  const byteVar = ailySafeName(block.getFieldValue('BYTEVAR'), 'pjonByte');
  const lenVar = ailySafeName(block.getFieldValue('LENVAR'), 'pjonLength');
  const body = generator.statementToCode(block, 'DO') || '';
  ailyRegister(byteVar, 'Number');
  ailyRegister(lenVar, 'Number');
  const cb = 'aily_pjon_receive_' + name;
  const fn = 'void ' + cb + '(uint8_t *payload, uint16_t length, const PJON_Packet_Info &packet_info) {\n' +
    '  (void)packet_info;\n' +
    '  uint8_t ' + byteVar + ' = length ? payload[0] : 0;\n' +
    '  uint16_t ' + lenVar + ' = length;\n' +
    body +
    '}\n';
  generator.addFunction(cb, fn);
  generator.addSetupEnd('pjon_receiver_' + name, name + '.set_receiver(' + cb + ');');
  return '';
};
