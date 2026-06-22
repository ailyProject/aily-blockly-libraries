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


function tinygsmEnsure(generator, block) {
  const modem = block && block.getFieldValue ? (block.getFieldValue('MODEM') || 'TINY_GSM_MODEM_SIM800') : 'TINY_GSM_MODEM_SIM800';
  const serial = block && block.getFieldValue ? (block.getFieldValue('SERIAL') || 'Serial1') : 'Serial1';
  generator.addLibrary('TinyGsmModem', '#define ' + modem);
  generator.addLibrary('TinyGsmSerialAT', '#define SerialAT ' + serial);
  generator.addLibrary('TinyGsmClient', '#include <TinyGsmClient.h>');
  generator.addObject('tinygsm_modem', 'TinyGsm modem(SerialAT);\nTinyGsmClient tinyGsmClient(modem);');
}
Arduino.forBlock['tinygsm_setup'] = function(block, generator) { tinygsmEnsure(generator, block); const baud = ailyValue(block, generator, 'BAUD', '9600'); return 'SerialAT.begin(' + baud + ');\n'; };
Arduino.forBlock['tinygsm_restart'] = function(block, generator) { tinygsmEnsure(generator); return 'modem.restart();\n'; };
Arduino.forBlock['tinygsm_wait_network'] = function(block, generator) { tinygsmEnsure(generator); const timeout = ailyValue(block, generator, 'TIMEOUT', '60000'); return ['modem.waitForNetwork(' + timeout + ')', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['tinygsm_gprs_connect'] = function(block, generator) { tinygsmEnsure(generator); const apn = ailyValue(block, generator, 'APN', '"internet"'); const user = ailyValue(block, generator, 'USER', '""'); const pass = ailyValue(block, generator, 'PASS', '""'); return ['modem.gprsConnect(' + apn + ', ' + user + ', ' + pass + ')', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['tinygsm_is_network_connected'] = function(block, generator) { tinygsmEnsure(generator); return ['modem.isNetworkConnected()', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['tinygsm_is_gprs_connected'] = function(block, generator) { tinygsmEnsure(generator); return ['modem.isGprsConnected()', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['tinygsm_modem_info'] = function(block, generator) { tinygsmEnsure(generator); return ['modem.getModemInfo()', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['tinygsm_local_ip'] = function(block, generator) { tinygsmEnsure(generator); return ['modem.localIP().toString()', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['tinygsm_client_connect'] = function(block, generator) { tinygsmEnsure(generator); const host = ailyValue(block, generator, 'HOST', '"example.com"'); const port = ailyValue(block, generator, 'PORT', '80'); return ['tinyGsmClient.connect(' + host + ', ' + port + ')', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['tinygsm_client_print'] = function(block, generator) { tinygsmEnsure(generator); const text = ailyValue(block, generator, 'TEXT', '""'); return 'tinyGsmClient.print(' + text + ');\n'; };
Arduino.forBlock['tinygsm_client_available'] = function(block, generator) { tinygsmEnsure(generator); return ['tinyGsmClient.available()', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['tinygsm_client_read'] = function(block, generator) { tinygsmEnsure(generator); return ['tinyGsmClient.read()', generator.ORDER_FUNCTION_CALL]; };
