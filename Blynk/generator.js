'use strict';

function blynkQuoteMacro(value) {
  return JSON.stringify(String(value || ''));
}

function blynkCoreName() {
  const boardConfig = typeof window !== 'undefined' ? window['boardConfig'] : null;
  return boardConfig && boardConfig.core ? String(boardConfig.core).toLowerCase() : '';
}

function blynkResolveTransport(transport) {
  if (transport && transport !== 'AUTO') return transport;
  const core = blynkCoreName();
  if (core.indexOf('esp8266') > -1) return 'ESP8266';
  if (core.indexOf('esp32') > -1) return 'ESP32';
  if (core.indexOf('samd') > -1 || core.indexOf('mbed') > -1 || core.indexOf('renesas') > -1) return 'WIFI_NINA';
  return 'ARDUINO_WIFI';
}

function blynkAddTemplate(generator, templateId, templateName, auth, debug) {
  if (debug === 'TRUE') {
    generator.addLibrary('BLYNK_PRINT', '#define BLYNK_PRINT Serial');
    if (typeof ensureSerialBegin === 'function') {
      ensureSerialBegin('Serial', generator);
    } else {
      generator.addSetup('serial_begin', 'Serial.begin(9600);');
    }
  }
  generator.addLibrary('BLYNK_TEMPLATE_ID', '#define BLYNK_TEMPLATE_ID ' + blynkQuoteMacro(templateId));
  generator.addLibrary('BLYNK_TEMPLATE_NAME', '#define BLYNK_TEMPLATE_NAME ' + blynkQuoteMacro(templateName));
  generator.addLibrary('BLYNK_AUTH_TOKEN', '#define BLYNK_AUTH_TOKEN ' + blynkQuoteMacro(auth));
}

function blynkEnsureWiFiTransport(generator, transport) {
  const resolved = blynkResolveTransport(transport);
  if (resolved === 'ESP8266') {
    generator.addLibrary('ESP8266WiFi', '#include <ESP8266WiFi.h>');
    generator.addLibrary('BlynkSimpleEsp8266', '#include <BlynkSimpleEsp8266.h>');
  } else if (resolved === 'WIFI_NINA') {
    generator.addLibrary('WiFiNINA', '#include <WiFiNINA.h>');
    generator.addLibrary('BlynkSimpleWiFiNINA', '#include <BlynkSimpleWiFiNINA.h>');
  } else if (resolved === 'ARDUINO_WIFI') {
    generator.addLibrary('WiFi', '#include <WiFi.h>');
    generator.addLibrary('BlynkSimpleWifi', '#include <BlynkSimpleWifi.h>');
  } else {
    generator.addLibrary('WiFi', '#include <WiFi.h>');
    generator.addLibrary('WiFiClient', '#include <WiFiClient.h>');
    generator.addLibrary('BlynkSimpleEsp32', '#include <BlynkSimpleEsp32.h>');
  }
}

function blynkEnsureEthernet(generator) {
  generator.addLibrary('SPI', '#include <SPI.h>');
  generator.addLibrary('Ethernet', '#include <Ethernet.h>');
  generator.addLibrary('BlynkSimpleEthernet', '#include <BlynkSimpleEthernet.h>');
}

function blynkValue(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}

function blynkPin(block) {
  const value = Number(block.getFieldValue('VPIN') || 0);
  return Math.max(0, Math.floor(value));
}

function blynkBlockSuffix(block) {
  return String(block.id || Math.random().toString(36).slice(2)).replace(/[^A-Za-z0-9_]/g, '_');
}

function blynkRegisterLocalVar(name, valueType) {
  if (typeof registerVariableToBlockly !== 'function') return;
  const varType = valueType === 'STRING' ? 'String' : 'Number';
  registerVariableToBlockly(name, varType);
}

Arduino.forBlock['blynk_setup_wifi'] = function(block, generator) {
  const templateId = block.getFieldValue('TEMPLATE_ID') || 'TMPxxxxxx';
  const templateName = block.getFieldValue('TEMPLATE_NAME') || 'Device';
  const auth = block.getFieldValue('AUTH') || 'YourAuthToken';
  const ssid = blynkValue(block, generator, 'SSID', '"YourNetworkName"');
  const pass = blynkValue(block, generator, 'PASS', '"YourPassword"');
  const transport = block.getFieldValue('TRANSPORT') || 'AUTO';
  const server = blynkValue(block, generator, 'SERVER', '"blynk.cloud"');
  const port = blynkValue(block, generator, 'PORT', '80');
  const debug = block.getFieldValue('DEBUG') || 'FALSE';

  blynkAddTemplate(generator, templateId, templateName, auth, debug);
  blynkEnsureWiFiTransport(generator, transport);
  generator.addLoopBegin('blynk_run', 'Blynk.run();');

  return 'Blynk.begin(BLYNK_AUTH_TOKEN, ' + ssid + ', ' + pass + ', ' + server + ', ' + port + ');\n';
};

Arduino.forBlock['blynk_setup_ethernet'] = function(block, generator) {
  const templateId = block.getFieldValue('TEMPLATE_ID') || 'TMPxxxxxx';
  const templateName = block.getFieldValue('TEMPLATE_NAME') || 'Device';
  const auth = block.getFieldValue('AUTH') || 'YourAuthToken';
  const server = blynkValue(block, generator, 'SERVER', '"blynk.cloud"');
  const port = blynkValue(block, generator, 'PORT', '80');
  const disableSd = block.getFieldValue('DISABLE_SD') || 'FALSE';
  const debug = block.getFieldValue('DEBUG') || 'FALSE';

  blynkAddTemplate(generator, templateId, templateName, auth, debug);
  blynkEnsureEthernet(generator);
  generator.addLoopBegin('blynk_run', 'Blynk.run();');

  let code = '';
  if (disableSd === 'TRUE') {
    code += 'pinMode(4, OUTPUT);\n';
    code += 'digitalWrite(4, HIGH);\n';
  }
  code += 'Blynk.begin(BLYNK_AUTH_TOKEN, ' + server + ', ' + port + ');\n';
  return code;
};

Arduino.forBlock['blynk_run'] = function() {
  return 'Blynk.run();\n';
};

Arduino.forBlock['blynk_connected'] = function(block, generator) {
  return ['Blynk.connected()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['blynk_connect'] = function(block, generator) {
  const timeout = blynkValue(block, generator, 'TIMEOUT', '30000');
  return ['Blynk.connect(' + timeout + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['blynk_disconnect'] = function() {
  return 'Blynk.disconnect();\n';
};

Arduino.forBlock['blynk_virtual_write'] = function(block, generator) {
  const pin = blynkPin(block);
  const value = blynkValue(block, generator, 'VALUE', '0');
  return 'Blynk.virtualWrite(V' + pin + ', ' + value + ');\n';
};

Arduino.forBlock['blynk_sync_virtual'] = function(block) {
  const pin = blynkPin(block);
  return 'Blynk.syncVirtual(V' + pin + ');\n';
};

Arduino.forBlock['blynk_sync_all'] = function() {
  return 'Blynk.syncAll();\n';
};

Arduino.forBlock['blynk_set_property'] = function(block, generator) {
  const pin = blynkPin(block);
  const property = block.getFieldValue('PROPERTY') || 'label';
  const value = blynkValue(block, generator, 'VALUE', '""');
  return 'Blynk.setProperty(V' + pin + ', ' + JSON.stringify(property) + ', ' + value + ');\n';
};

Arduino.forBlock['blynk_log_event'] = function(block, generator) {
  const eventName = blynkValue(block, generator, 'EVENT', '"event_code"');
  const description = blynkValue(block, generator, 'DESCRIPTION', '""');
  return 'Blynk.logEvent(' + eventName + ', ' + description + ');\n';
};

Arduino.forBlock['blynk_resolve_event'] = function(block, generator) {
  const eventName = blynkValue(block, generator, 'EVENT', '"event_code"');
  const mode = block.getFieldValue('MODE') || 'ONE';
  if (mode === 'ALL') return 'Blynk.resolveAllEvents(' + eventName + ');\n';
  return 'Blynk.resolveEvent(' + eventName + ');\n';
};

Arduino.forBlock['blynk_on_virtual_write'] = function(block, generator) {
  const pin = blynkPin(block);
  const valueType = block.getFieldValue('VALUE_TYPE') || 'INT';
  const varName = block.getFieldValue('VAR') || 'blynkValue';
  const handlerCode = generator.statementToCode(block, 'DO') || '';

  blynkRegisterLocalVar(varName, valueType);

  const typeMap = {
    INT: ['int', 'param.asInt()'],
    FLOAT: ['float', 'param.asFloat()'],
    DOUBLE: ['double', 'param.asDouble()'],
    STRING: ['String', 'param.asStr()']
  };
  const typeInfo = typeMap[valueType] || typeMap.INT;
  const functionDef =
    'BLYNK_WRITE(V' + pin + ') {\n' +
    '  ' + typeInfo[0] + ' ' + varName + ' = ' + typeInfo[1] + ';\n' +
    handlerCode +
    '}\n';

  generator.addFunction('blynk_write_v' + pin, functionDef);
  return '';
};

Arduino.forBlock['blynk_on_connected'] = function(block, generator) {
  const handlerCode = generator.statementToCode(block, 'DO') || '';
  const functionDef = 'BLYNK_CONNECTED() {\n' + handlerCode + '}\n';
  generator.addFunction('blynk_connected_handler', functionDef);
  return '';
};

Arduino.forBlock['blynk_param_int'] = function(block, generator) {
  return ['param.asInt()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['blynk_param_float'] = function(block, generator) {
  return ['param.asFloat()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['blynk_param_string'] = function(block, generator) {
  return ['String(param.asStr())', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['blynk_timer_every'] = function(block, generator) {
  const interval = blynkValue(block, generator, 'INTERVAL', '1000');
  const handlerCode = generator.statementToCode(block, 'DO') || '';
  const suffix = blynkBlockSuffix(block);
  const callbackName = '_blynk_timer_' + suffix;

  generator.addLibrary('BlynkTimer', '#include <Blynk/BlynkTimer.h>');
  generator.addObject('blynk_timer_object', 'BlynkTimer blynkTimer;');
  generator.addLoopBegin('blynk_timer_run', 'blynkTimer.run();');
  generator.addFunction(callbackName, 'void ' + callbackName + '() {\n' + handlerCode + '}\n');
  generator.addSetupEnd('blynk_timer_setup_' + suffix, 'blynkTimer.setInterval(' + interval + ', ' + callbackName + ');');
  return '';
};
