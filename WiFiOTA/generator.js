'use strict';

const ARDUINOOTA_DEFAULT_NAME = JSON.stringify(window['boardConfig'].name);;
const ARDUINOOTA_DEFAULT_PASSWORD = '"password"';

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

function arduinootaAddObject(generator, key, code) {
  if (generator && typeof generator.addObject === 'function') {
    generator.addObject(key, code);
  } else {
    generator.addVariable(key, code);
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

function arduinootaEnsureStorageLibrary(generator, storage) {
  switch (storage) {
    case 'SDStorage':
      generator.addLibrary('SPI', '#include <SPI.h>');
      generator.addLibrary('ArduinoOTA_SD', '#include <SD.h>');
      return 'SDStorage';
    case 'InternalStorage':
    default:
      return 'InternalStorage';
  }
}

function arduinootaEnsureTextHelpers(generator) {
  const functionDef = String.raw`const char* arduinoota_to_cstr(const char* value) {
  return value;
}

const char* arduinoota_to_cstr(const String& value) {
  return value.c_str();
}
`;

  generator.addFunction('arduinoota_text_helpers', functionDef);
}

function arduinootaEnsureLibrary(generator, network, discovery, storage) {
  const networkObject = arduinootaEnsureNetworkLibrary(generator, network);
  const storageObject = arduinootaEnsureStorageLibrary(generator, storage);
  if (discovery === 'NO_PORT') {
    arduinootaAddMacro(generator, 'ARDUINOOTA_NO_PORT', '#define NO_OTA_PORT');
  }
  generator.addLibrary('ArduinoOTA', '#include <ArduinoOTA.h>');
  arduinootaEnsureTextHelpers(generator);
  return { networkObject, storageObject };
}

function arduinootaEnsureUserCallbackPointers(generator) {
  const objectDef = String.raw`typedef void (*ArduinoOTAUserStartCallback)();
typedef void (*ArduinoOTAUserBeforeApplyCallback)();
typedef void (*ArduinoOTAUserErrorCallback)(int code, const char* message);

ArduinoOTAUserStartCallback arduinoota_user_on_start = nullptr;
ArduinoOTAUserBeforeApplyCallback arduinoota_user_before_apply = nullptr;
ArduinoOTAUserErrorCallback arduinoota_user_on_error = nullptr;
`;

  arduinootaAddObject(generator, 'arduinoota_user_callback_pointers', objectDef);
}

function arduinootaEnsureUserCallbackDispatchers(generator) {
  arduinootaEnsureUserCallbackPointers(generator);

  const functionDef = String.raw`void arduinoota_on_start_dispatch() {
  if (arduinoota_user_on_start != nullptr) {
    arduinoota_user_on_start();
  }
}

void arduinoota_before_apply_dispatch() {
  if (arduinoota_user_before_apply != nullptr) {
    arduinoota_user_before_apply();
  }
}

void arduinoota_on_error_dispatch(int code, const char* message) {
  if (arduinoota_user_on_error != nullptr) {
    arduinoota_user_on_error(code, message);
  }
}
`;

  generator.addFunction('arduinoota_user_callback_dispatchers', functionDef);
}

function arduinootaBeginCode(generator, network, discovery, storage, name, password, autoPoll) {
  const objects = arduinootaEnsureLibrary(generator, network, discovery, storage);
  const safeName = 'arduinoota_to_cstr(' + name + ')';
  const safePassword = 'arduinoota_to_cstr(' + password + ')';
  arduinootaEnsureUserCallbackDispatchers(generator);
  if (autoPoll) {
    generator.addLoopBegin('arduinoota_poll', 'ArduinoOTA.poll();');
  }

  return 'ArduinoOTA.onStart(arduinoota_on_start_dispatch);\n' +
    'ArduinoOTA.beforeApply(arduinoota_before_apply_dispatch);\n' +
    'ArduinoOTA.onError(arduinoota_on_error_dispatch);\n' +
    'ArduinoOTA.begin(' + objects.networkObject + '.localIP(), ' + safeName + ', ' + safePassword + ', ' + objects.storageObject + ');\n';
}

Arduino.forBlock['arduinoota_config_auto'] = function(block, generator) {
  return arduinootaBeginCode(generator, 'WIFI_AUTO', 'MDNS', 'InternalStorage', ARDUINOOTA_DEFAULT_NAME, ARDUINOOTA_DEFAULT_PASSWORD, true);
};

Arduino.forBlock['arduinoota_begin'] = function(block, generator) {
  const name = arduinootaValueToCode(block, generator, 'NAME', ARDUINOOTA_DEFAULT_NAME);
  const password = arduinootaValueToCode(block, generator, 'PASSWORD', ARDUINOOTA_DEFAULT_PASSWORD);
  return arduinootaBeginCode(generator, 'WIFI_AUTO', 'MDNS', 'InternalStorage', name, password, false);
};

Arduino.forBlock['arduinoota_begin_advanced'] = function(block, generator) {
  const network = block.getFieldValue('NETWORK') || 'WIFI_AUTO';
  const storage = block.getFieldValue('STORAGE') || 'InternalStorage';
  const discovery = block.getFieldValue('DISCOVERY') || 'MDNS';
  const name = arduinootaValueToCode(block, generator, 'NAME', ARDUINOOTA_DEFAULT_NAME);
  const password = arduinootaValueToCode(block, generator, 'PASSWORD', ARDUINOOTA_DEFAULT_PASSWORD);
  return arduinootaBeginCode(generator, network, discovery, storage, name, password, false);
};

Arduino.forBlock['arduinoota_poll'] = function(block, generator) {
  return 'ArduinoOTA.poll();\n';
};

Arduino.forBlock['arduinoota_handle'] = function(block, generator) {
  return 'ArduinoOTA.handle();\n';
};

Arduino.forBlock['arduinoota_end'] = function(block, generator) {
  return 'ArduinoOTA.end();\n';
};

Arduino.forBlock['arduinoota_on_start'] = function(block, generator) {
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = 'arduinoota_user_on_start_callback';
  const functionDef = 'void ' + callbackName + '() {\n' + handlerCode + '}\n';

  arduinootaEnsureUserCallbackPointers(generator);
  generator.addFunction(callbackName, functionDef);
  generator.addSetupEnd('arduinoota_user_on_start = ' + callbackName + ';', 'arduinoota_user_on_start = ' + callbackName + ';');
  return '';
};

Arduino.forBlock['arduinoota_before_apply'] = function(block, generator) {
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = 'arduinoota_user_before_apply_callback';
  const functionDef = 'void ' + callbackName + '() {\n' + handlerCode + '}\n';

  arduinootaEnsureUserCallbackPointers(generator);
  generator.addFunction(callbackName, functionDef);
  generator.addSetupEnd('arduinoota_user_before_apply = ' + callbackName + ';', 'arduinoota_user_before_apply = ' + callbackName + ';');
  return '';
};

Arduino.forBlock['arduinoota_on_error'] = function(block, generator) {
  const codeVar = arduinootaSafeIdentifier(block.getFieldValue('CODE_VAR'), 'code');
  const messageVar = arduinootaSafeIdentifier(block.getFieldValue('MESSAGE_VAR'), 'message');
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = 'arduinoota_user_on_error_callback';
  const functionDef = 'void ' + callbackName + '(int ' + codeVar + ', const char* ' + messageVar + ') {\n' + handlerCode + '}\n';

  arduinootaEnsureUserCallbackPointers(generator);
  generator.addFunction(callbackName, functionDef);
  generator.addSetupEnd('arduinoota_user_on_error = ' + callbackName + ';', 'arduinoota_user_on_error = ' + callbackName + ';');
  return '';
};