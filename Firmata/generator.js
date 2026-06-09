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


function firmataEnsure(generator) { generator.addLibrary('Firmata', '#include <Firmata.h>'); }
Arduino.forBlock['firmata_begin'] = function(block, generator) { firmataEnsure(generator); const baud = ailyValue(block, generator, 'BAUD', '57600'); if (block.getFieldValue('AUTO') === 'TRUE') generator.addLoopBegin('firmata_process', 'while (Firmata.available()) { Firmata.processInput(); }'); return 'Firmata.setFirmwareVersion(FIRMATA_FIRMWARE_MAJOR_VERSION, FIRMATA_FIRMWARE_MINOR_VERSION);\nFirmata.begin(' + baud + ');\n'; };
Arduino.forBlock['firmata_process'] = function(block, generator) { firmataEnsure(generator); return 'while (Firmata.available()) {\n  Firmata.processInput();\n}\n'; };
Arduino.forBlock['firmata_available'] = function(block, generator) { firmataEnsure(generator); return ['Firmata.available()', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['firmata_send_analog'] = function(block, generator) { firmataEnsure(generator); return 'Firmata.sendAnalog(' + ailyValue(block, generator, 'PIN', '0') + ', ' + ailyValue(block, generator, 'VALUE', '0') + ');\n'; };
Arduino.forBlock['firmata_send_digital_port'] = function(block, generator) { firmataEnsure(generator); return 'Firmata.sendDigitalPort(' + ailyValue(block, generator, 'PORT', '0') + ', ' + ailyValue(block, generator, 'VALUE', '0') + ');\n'; };
Arduino.forBlock['firmata_send_string'] = function(block, generator) { firmataEnsure(generator); return 'Firmata.sendString(' + ailyValue(block, generator, 'TEXT', '"hello"') + ');\n'; };
Arduino.forBlock['firmata_on_digital_message'] = function(block, generator) { firmataEnsure(generator); const pv = ailySafeName(block.getFieldValue('PORTVAR'), 'firmataPort'); const vv = ailySafeName(block.getFieldValue('VALUEVAR'), 'firmataValue'); const body = generator.statementToCode(block, 'DO') || ''; ailyRegister(pv, 'Number'); ailyRegister(vv, 'Number'); const fn = 'ailyFirmataDigitalMessage'; generator.addFunction(fn, 'void ' + fn + '(byte port, int value) {\n  byte ' + pv + ' = port;\n  int ' + vv + ' = value;\n' + body + '}\n'); generator.addSetupEnd('firmata_digital_cb', 'Firmata.attach(DIGITAL_MESSAGE, ' + fn + ');'); return ''; };
Arduino.forBlock['firmata_on_pin_mode'] = function(block, generator) { firmataEnsure(generator); const pv = ailySafeName(block.getFieldValue('PINVAR'), 'firmataPin'); const mv = ailySafeName(block.getFieldValue('MODEVAR'), 'firmataMode'); const body = generator.statementToCode(block, 'DO') || ''; ailyRegister(pv, 'Number'); ailyRegister(mv, 'Number'); const fn = 'ailyFirmataSetPinMode'; generator.addFunction(fn, 'void ' + fn + '(byte pin, int mode) {\n  byte ' + pv + ' = pin;\n  int ' + mv + ' = mode;\n' + body + '}\n'); generator.addSetupEnd('firmata_pinmode_cb', 'Firmata.attach(SET_PIN_MODE, ' + fn + ');'); return ''; };
Arduino.forBlock['firmata_on_string'] = function(block, generator) { firmataEnsure(generator); const tv = ailySafeName(block.getFieldValue('TEXTVAR'), 'firmataText'); const body = generator.statementToCode(block, 'DO') || ''; ailyRegister(tv, 'String'); const fn = 'ailyFirmataString'; generator.addFunction(fn, 'void ' + fn + '(char *text) {\n  String ' + tv + ' = String(text);\n' + body + '}\n'); generator.addSetupEnd('firmata_string_cb', 'Firmata.attach(STRING_DATA, ' + fn + ');'); return ''; };
