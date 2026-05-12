'use strict';

const ARDUINOOTA_DEFAULT_NAME = '"Arduino"';
const ARDUINOOTA_DEFAULT_PASSWORD = '"password"';
const ARDUINOOTA_PC_SERIAL = 'Serial';
const ARDUINOOTA_PC_BAUD = '115200';

function arduinootaGetBoardConfig() {
  return (typeof window !== 'undefined' && window['boardConfig']) ? window['boardConfig'] : null;
}

function arduinootaGetBoardCore() {
  const boardConfig = arduinootaGetBoardConfig();
  return boardConfig && boardConfig.core ? String(boardConfig.core).toLowerCase() : '';
}

function arduinootaAddMacro(generator, key, code) {
  if (generator && typeof generator.addMacro === 'function') {
    generator.addMacro(key, code);
  } else {
    generator.addLibrary(key, code);
  }
}

function arduinootaValueToCode(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}

function arduinootaSafeIdentifier(value, fallback) {
  let identifier = String(value || fallback || 'value').replace(/[^A-Za-z0-9_]/g, '_');
  if (!identifier) identifier = fallback || 'value';
  if (/^[0-9]/.test(identifier)) identifier = '_' + identifier;
  return identifier;
}

function arduinootaEnsureAutoWiFiLibrary(generator) {
  const core = arduinootaGetBoardCore();

  if (core.indexOf('esp8266') > -1) {
    generator.addLibrary('ArduinoOTA_WiFi', '#include <ESP8266WiFi.h>');
  } else if (core.indexOf('renesas_uno') > -1 || core.indexOf('unor4wifi') > -1) {
    generator.addLibrary('ArduinoOTA_WiFi', '#include <WiFiS3.h>');
  } else if (core.indexOf('esp32') > -1 || core.indexOf('rp2040') > -1) {
    generator.addLibrary('ArduinoOTA_WiFi', '#include <WiFi.h>');
  } else {
    generator.addLibrary('ArduinoOTA_WiFi', '#include <WiFiNINA.h>');
  }
}

function arduinootaEnsureNetworkLibrary(generator, network) {
  switch (network) {
    case 'WIFI_NINA':
      generator.addLibrary('SPI', '#include <SPI.h>');
      generator.addLibrary('ArduinoOTA_WiFiNINA', '#include <WiFiNINA.h>');
      return 'WiFi';
    case 'WIFI101':
      generator.addLibrary('SPI', '#include <SPI.h>');
      generator.addLibrary('ArduinoOTA_WiFi101', '#include <WiFi101.h>');
      return 'WiFi';
    case 'WIFI_S3':
      generator.addLibrary('ArduinoOTA_WiFiS3', '#include <WiFiS3.h>');
      return 'WiFi';
    case 'WIFI_ESP_AT':
      generator.addLibrary('ArduinoOTA_WiFiEspAT', '#include <WiFiEspAT.h>');
      arduinootaAddMacro(generator, 'ARDUINOOTA_NO_PORT', '#define NO_OTA_PORT');
      return 'WiFi';
    case 'ETHERNET':
      arduinootaAddMacro(generator, 'ARDUINOOTA_ETHERNET', '#define OTETHERNET');
      generator.addLibrary('SPI', '#include <SPI.h>');
      generator.addLibrary('ArduinoOTA_Ethernet', '#include <Ethernet.h>');
      return 'Ethernet';
    case 'ETHERNET_ENC':
      arduinootaAddMacro(generator, 'ARDUINOOTA_ETHERNET', '#define OTETHERNET');
      arduinootaAddMacro(generator, 'ARDUINOOTA_NO_PORT', '#define NO_OTA_PORT');
      generator.addLibrary('SPI', '#include <SPI.h>');
      generator.addLibrary('ArduinoOTA_EthernetENC', '#include <EthernetENC.h>');
      return 'Ethernet';
    case 'WIFI_AUTO':
    default:
      arduinootaEnsureAutoWiFiLibrary(generator);
      return 'WiFi';
  }
}

function arduinootaEnsureLibrary(generator, network, discovery) {
  const networkObject = arduinootaEnsureNetworkLibrary(generator, network);
  if (discovery === 'NO_PORT') {
    arduinootaAddMacro(generator, 'ARDUINOOTA_NO_PORT', '#define NO_OTA_PORT');
  }
  generator.addLibrary('ArduinoOTA', '#include <ArduinoOTA.h>');
  return networkObject;
}

function arduinootaEnsurePcSerial(generator) {
  if (typeof ensureSerialBegin === 'function') {
    ensureSerialBegin(ARDUINOOTA_PC_SERIAL, generator, ARDUINOOTA_PC_BAUD);
  } else {
    generator.addSetupBegin('arduinoota_pc_serial_begin', ARDUINOOTA_PC_SERIAL + '.begin(' + ARDUINOOTA_PC_BAUD + ');');
  }
}

function arduinootaEnsurePcEvents(generator) {
  arduinootaEnsurePcSerial(generator);

  const functionDef = String.raw`void arduinoota_pc_print_escaped(const char* value) {
  if (value == nullptr) {
    return;
  }
  while (*value) {
    char c = *value++;
    if (c == '"' || c == '\\') {
      Serial.print('\\');
      Serial.print(c);
    } else if ((uint8_t)c < 32) {
      Serial.print(' ');
    } else {
      Serial.print(c);
    }
  }
}

void arduinoota_pc_event(const char* eventName, int code, const char* message) {
  Serial.print("{\"type\":\"aily_ota\",\"version\":1,\"event\":\"");
  arduinoota_pc_print_escaped(eventName);
  Serial.print("\",\"code\":");
  Serial.print(code);
  if (message != nullptr && message[0] != '\0') {
    Serial.print(",\"message\":\"");
    arduinoota_pc_print_escaped(message);
    Serial.print("\"");
  }
  Serial.println("}");
}

void arduinoota_pc_ready(IPAddress ip) {
  Serial.print("{\"type\":\"aily_ota\",\"version\":1,\"event\":\"ready\",\"ip\":\"");
  Serial.print(ip);
  Serial.print("\",\"port\":65280,\"name\":\"Arduino\",\"authUser\":\"arduino\",\"uploadPath\":\"/sketch\"}");
  Serial.println();
}

void arduinoota_pc_on_start_callback() {
  arduinoota_pc_event("upload_start", 0, "");
}

void arduinoota_pc_before_apply_callback() {
  arduinoota_pc_event("before_apply", 0, "");
  Serial.flush();
}

void arduinoota_pc_on_error_callback(int code, const char* message) {
  arduinoota_pc_event("error", code, message);
}
`;

  generator.addFunction('arduinoota_pc_events', functionDef);
}

Arduino.forBlock['arduinoota_config_begin'] = function(block, generator) {
  const networkObject = arduinootaEnsureLibrary(generator, 'WIFI_AUTO', 'MDNS');
  arduinootaEnsurePcEvents(generator);
  generator.addLoopBegin('arduinoota_poll', 'ArduinoOTA.poll();');

  return 'ArduinoOTA.onStart(arduinoota_pc_on_start_callback);\n' +
    'ArduinoOTA.beforeApply(arduinoota_pc_before_apply_callback);\n' +
    'ArduinoOTA.onError(arduinoota_pc_on_error_callback);\n' +
    'ArduinoOTA.begin(' + networkObject + '.localIP(), ' + ARDUINOOTA_DEFAULT_NAME + ', ' + ARDUINOOTA_DEFAULT_PASSWORD + ', InternalStorage);\n' +
    'arduinoota_pc_ready(' + networkObject + '.localIP());\n';
};

Arduino.forBlock['arduinoota_poll'] = function(block, generator) {
  return 'ArduinoOTA.poll();\n';
};

Arduino.forBlock['arduinoota_end'] = function(block, generator) {
  return 'ArduinoOTA.end();\n';
};

Arduino.forBlock['arduinoota_on_start'] = function(block, generator) {
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = 'arduinoota_on_start_callback';
  const functionDef = 'void ' + callbackName + '() {\n' + handlerCode + '}\n';

  generator.addFunction(callbackName, functionDef);
  generator.addSetupEnd('ArduinoOTA.onStart(' + callbackName + ');', 'ArduinoOTA.onStart(' + callbackName + ');');
  return '';
};

Arduino.forBlock['arduinoota_before_apply'] = function(block, generator) {
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = 'arduinoota_before_apply_callback';
  const functionDef = 'void ' + callbackName + '() {\n' + handlerCode + '}\n';

  generator.addFunction(callbackName, functionDef);
  generator.addSetupEnd('ArduinoOTA.beforeApply(' + callbackName + ');', 'ArduinoOTA.beforeApply(' + callbackName + ');');
  return '';
};

Arduino.forBlock['arduinoota_on_error'] = function(block, generator) {
  const codeVar = arduinootaSafeIdentifier(block.getFieldValue('CODE_VAR'), 'code');
  const messageVar = arduinootaSafeIdentifier(block.getFieldValue('MESSAGE_VAR'), 'message');
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = 'arduinoota_on_error_callback';
  const functionDef = 'void ' + callbackName + '(int ' + codeVar + ', const char* ' + messageVar + ') {\n' + handlerCode + '}\n';

  generator.addFunction(callbackName, functionDef);
  generator.addSetupEnd('ArduinoOTA.onError(' + callbackName + ');', 'ArduinoOTA.onError(' + callbackName + ');');
  return '';
};