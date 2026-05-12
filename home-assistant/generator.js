'use strict';

function haOrder(generator) {
  if (generator && generator.ORDER_ATOMIC !== undefined) return generator.ORDER_ATOMIC;
  if (typeof Arduino !== 'undefined' && Arduino.ORDER_ATOMIC !== undefined) return Arduino.ORDER_ATOMIC;
  return 0;
}

function haValueToCode(block, generator, name, fallback) {
  return generator.valueToCode(block, name, haOrder(generator)) || fallback;
}

function haQuote(value) {
  return '"' + String(value || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
}

function haSafeIdentifier(value, fallback) {
  let identifier = String(value || fallback || 'ha').replace(/[^A-Za-z0-9_]/g, '_');
  if (!identifier) identifier = fallback || 'ha';
  if (/^[0-9]/.test(identifier)) identifier = '_' + identifier;
  return identifier;
}

function haGetVarName(block, fieldName, defaultName) {
  const varField = block.getField(fieldName);
  return varField ? varField.getText() : defaultName;
}

function haAttachVarMonitor(block, fieldName, variableType, defaultName, monitorKey) {
  const currentName = block.getFieldValue(fieldName) || defaultName;
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(currentName, variableType);
  }

  const monitorFlag = monitorKey + 'VarMonitorAttached';
  const lastNameKey = monitorKey + 'VarLastName';
  if (block[monitorFlag]) return;

  block[monitorFlag] = true;
  block[lastNameKey] = currentName;

  const varField = block.getField(fieldName);
  if (varField) {
    const originalFinishEditing = varField.onFinishEditing_;
    varField.onFinishEditing_ = function(newName) {
      if (typeof originalFinishEditing === 'function') {
        originalFinishEditing.call(this, newName);
      }
      const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
      const oldName = block[lastNameKey];
      if (workspace && newName && newName !== oldName && typeof renameVariableInBlockly === 'function') {
        renameVariableInBlockly(block, oldName, newName, variableType);
        block[lastNameKey] = newName;
      }
    };
  }
}

function haEnsureLibraries(generator) {
  generator.addLibrary('ArduinoHA', '#include <ArduinoHA.h>');
  generator.addLibrary('PubSubClient', '#include <PubSubClient.h>');
}

function haEnsureNetworkClient(generator, networkType) {
  const boardConfig = (typeof window !== 'undefined' && window['boardConfig']) ? window['boardConfig'] : null;
  const core = boardConfig && boardConfig.core ? boardConfig.core : '';

  if (networkType === 'ETHERNET') {
    generator.addLibrary('SPI', '#include <SPI.h>');
    generator.addLibrary('Ethernet', '#include <Ethernet.h>');
    return 'EthernetClient';
  }

  if (core.indexOf('esp8266') > -1) {
    generator.addLibrary('HAWiFi', '#include <ESP8266WiFi.h>');
  } else if (core.indexOf('renesas_uno') > -1 || core.indexOf('unor4wifi') > -1) {
    generator.addLibrary('HAWiFi', '#include <WiFiS3.h>');
  } else {
    generator.addLibrary('HAWiFi', '#include <WiFi.h>');
  }

  return 'WiFiClient';
}

function haAddStringStorage(generator, name) {
  generator.addVariable(name, 'String ' + name + ';');
  return name;
}

function haAddPayloadHelper(generator) {
  generator.addFunction('_ha_payload_to_string',
    'String _ha_payload_to_string(const uint8_t* payload, uint16_t length) {\n' +
    '  String result;\n' +
    '  result.reserve(length);\n' +
    '  for (uint16_t i = 0; i < length; i++) {\n' +
    '    result += (char)payload[i];\n' +
    '  }\n' +
    '  return result;\n' +
    '}\n');
}

function haAddFieldSetter(code, varName, method, value) {
  if (!value) return code;
  return code + varName + '.' + method + '(' + haQuote(value) + ');\n';
}

function haCreateEntity(block, generator, blockType, variableType, cppType, defaultName) {
  haAttachVarMonitor(block, 'VAR', variableType, defaultName, '_' + blockType);
  const varName = block.getFieldValue('VAR') || defaultName;
  const uniqueId = haQuote(block.getFieldValue('UNIQUE_ID') || varName);
  haEnsureLibraries(generator);
  generator.addObject(blockType + '_' + haSafeIdentifier(varName, defaultName), cppType + ' ' + varName + '(' + uniqueId + ');');
  return '';
}

function haAddCallback(generator, callbackName, functionDef, setupCode) {
  generator.addFunction(callbackName, functionDef);
  generator.addSetupEnd(callbackName + '_attach', setupCode);
}

Arduino.forBlock['ha_device_create'] = function(block, generator) {
  haAttachVarMonitor(block, 'VAR', 'HADevice', 'device', '_haDevice');
  const varName = block.getFieldValue('VAR') || 'device';
  const uniqueId = haQuote(block.getFieldValue('UNIQUE_ID') || 'ailyDevice');
  haEnsureLibraries(generator);
  generator.addObject('ha_device_' + haSafeIdentifier(varName, 'device'), 'HADevice ' + varName + '(' + uniqueId + ');');
  return '';
};

Arduino.forBlock['ha_device_set_info'] = function(block) {
  const varName = haGetVarName(block, 'VAR', 'device');
  let code = '';
  code = haAddFieldSetter(code, varName, 'setName', block.getFieldValue('NAME'));
  code = haAddFieldSetter(code, varName, 'setManufacturer', block.getFieldValue('MANUFACTURER'));
  code = haAddFieldSetter(code, varName, 'setModel', block.getFieldValue('MODEL'));
  code = haAddFieldSetter(code, varName, 'setSoftwareVersion', block.getFieldValue('SOFTWARE'));
  code = haAddFieldSetter(code, varName, 'setConfigurationUrl', block.getFieldValue('CONFIG_URL'));
  return code;
};

Arduino.forBlock['ha_device_enable_availability'] = function(block) {
  const varName = haGetVarName(block, 'VAR', 'device');
  const shared = block.getFieldValue('SHARED') === 'true';
  const lastWill = block.getFieldValue('LAST_WILL') === 'true';
  let code = '';
  if (shared || lastWill) code += varName + '.enableSharedAvailability();\n';
  if (lastWill) code += varName + '.enableLastWill();\n';
  return code;
};

Arduino.forBlock['ha_mqtt_create'] = function(block, generator) {
  haAttachVarMonitor(block, 'VAR', 'HAMqtt', 'mqtt', '_haMqtt');
  const varName = block.getFieldValue('VAR') || 'mqtt';
  const clientName = block.getFieldValue('CLIENT') || 'client';
  const deviceName = haGetVarName(block, 'DEVICE', 'device');
  const maxDevices = block.getFieldValue('MAX_DEVICES') || '24';
  const clientClass = haEnsureNetworkClient(generator, block.getFieldValue('NETWORK'));
  haEnsureLibraries(generator);
  generator.addObject('ha_network_client_' + haSafeIdentifier(clientName, 'client'), clientClass + ' ' + clientName + ';');
  generator.addObject('ha_mqtt_' + haSafeIdentifier(varName, 'mqtt'), 'HAMqtt ' + varName + '(' + clientName + ', ' + deviceName + ', ' + maxDevices + ');');
  generator.addLoopBegin('ha_mqtt_loop_' + haSafeIdentifier(varName, 'mqtt'), varName + '.loop();');
  return '';
};

Arduino.forBlock['ha_mqtt_begin'] = function(block, generator) {
  const varName = haGetVarName(block, 'VAR', 'mqtt');
  const safeName = haSafeIdentifier(varName, 'mqtt');
  const host = haValueToCode(block, generator, 'HOST', '"homeassistant.local"');
  const port = haValueToCode(block, generator, 'PORT', '1883');
  const username = haValueToCode(block, generator, 'USERNAME', '""');
  const password = haValueToCode(block, generator, 'PASSWORD', '""');
  const hostVar = haAddStringStorage(generator, '_ha_' + safeName + '_host');
  const userVar = haAddStringStorage(generator, '_ha_' + safeName + '_username');
  const passVar = haAddStringStorage(generator, '_ha_' + safeName + '_password');
  haEnsureLibraries(generator);

  let code = hostVar + ' = String(' + host + ');\n';
  code += userVar + ' = String(' + username + ');\n';
  code += passVar + ' = String(' + password + ');\n';
  code += varName + '.begin(' + hostVar + '.c_str(), (uint16_t)(' + port + '), ' +
    '(' + userVar + '.length() ? ' + userVar + '.c_str() : nullptr), ' +
    '(' + passVar + '.length() ? ' + passVar + '.c_str() : nullptr));\n';
  return code;
};

Arduino.forBlock['ha_mqtt_set_prefixes'] = function(block) {
  const varName = haGetVarName(block, 'VAR', 'mqtt');
  let code = '';
  code = haAddFieldSetter(code, varName, 'setDiscoveryPrefix', block.getFieldValue('DISCOVERY'));
  code = haAddFieldSetter(code, varName, 'setDataPrefix', block.getFieldValue('DATA'));
  return code;
};

Arduino.forBlock['ha_mqtt_set_keep_alive'] = function(block, generator) {
  const varName = haGetVarName(block, 'VAR', 'mqtt');
  const interval = haValueToCode(block, generator, 'INTERVAL', '15');
  return varName + '.setKeepAlive((uint16_t)(' + interval + '));\n';
};

Arduino.forBlock['ha_mqtt_set_buffer_size'] = function(block, generator) {
  const varName = haGetVarName(block, 'VAR', 'mqtt');
  const size = haValueToCode(block, generator, 'SIZE', '512');
  return varName + '.setBufferSize((uint16_t)(' + size + '));\n';
};

Arduino.forBlock['ha_mqtt_loop'] = function(block) {
  const varName = haGetVarName(block, 'VAR', 'mqtt');
  return varName + '.loop();\n';
};

Arduino.forBlock['ha_mqtt_connected'] = function(block, generator) {
  const varName = haGetVarName(block, 'VAR', 'mqtt');
  return [varName + '.isConnected()', haOrder(generator)];
};

Arduino.forBlock['ha_mqtt_state'] = function(block, generator) {
  const varName = haGetVarName(block, 'VAR', 'mqtt');
  return [varName + '.getState()', haOrder(generator)];
};

Arduino.forBlock['ha_mqtt_publish'] = function(block, generator) {
  const varName = haGetVarName(block, 'VAR', 'mqtt');
  const topic = haValueToCode(block, generator, 'TOPIC', '"device/topic"');
  const payload = haValueToCode(block, generator, 'PAYLOAD', '"hello"');
  const retain = block.getFieldValue('RETAIN') || 'false';
  return varName + '.publish(String(' + topic + ').c_str(), String(' + payload + ').c_str(), ' + retain + ');\n';
};

Arduino.forBlock['ha_mqtt_subscribe'] = function(block, generator) {
  const varName = haGetVarName(block, 'VAR', 'mqtt');
  const topic = haValueToCode(block, generator, 'TOPIC', '"device/topic"');
  return varName + '.subscribe(String(' + topic + ').c_str());\n';
};

Arduino.forBlock['ha_mqtt_disconnect'] = function(block) {
  const varName = haGetVarName(block, 'VAR', 'mqtt');
  return varName + '.disconnect();\n';
};

Arduino.forBlock['ha_mqtt_on_connected'] = function(block, generator) {
  const varName = haGetVarName(block, 'VAR', 'mqtt');
  const safeName = haSafeIdentifier(varName, 'mqtt');
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = '_ha_' + safeName + '_connected';
  const functionDef = 'void ' + callbackName + '() {\n' + handlerCode + '}\n';
  haEnsureLibraries(generator);
  haAddCallback(generator, callbackName, functionDef, varName + '.onConnected(' + callbackName + ');');
  return '';
};

Arduino.forBlock['ha_mqtt_on_message'] = function(block, generator) {
  const varName = haGetVarName(block, 'VAR', 'mqtt');
  const safeName = haSafeIdentifier(varName, 'mqtt');
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = '_ha_' + safeName + '_message';
  const functionDef = 'void ' + callbackName + '(const char* topic, const uint8_t* payload, uint16_t length) {\n' +
    '  (void)topic;\n' +
    '  (void)payload;\n' +
    '  (void)length;\n' +
    handlerCode +
    '}\n';
  haEnsureLibraries(generator);
  haAddCallback(generator, callbackName, functionDef, varName + '.onMessage(' + callbackName + ');');
  return '';
};

Arduino.forBlock['ha_mqtt_message_topic'] = function(block, generator) {
  return ['String(topic)', haOrder(generator)];
};

Arduino.forBlock['ha_mqtt_message_payload'] = function(block, generator) {
  haAddPayloadHelper(generator);
  return ['_ha_payload_to_string(payload, length)', haOrder(generator)];
};

Arduino.forBlock['ha_mqtt_message_length'] = function(block, generator) {
  return ['length', haOrder(generator)];
};

Arduino.forBlock['ha_entity_set_info'] = function(block) {
  const varName = haGetVarName(block, 'VAR', 'entity');
  let code = '';
  code = haAddFieldSetter(code, varName, 'setName', block.getFieldValue('NAME'));
  code = haAddFieldSetter(code, varName, 'setObjectId', block.getFieldValue('OBJECT_ID'));
  code = haAddFieldSetter(code, varName, 'setIcon', block.getFieldValue('ICON'));
  return code;
};

Arduino.forBlock['ha_entity_set_availability'] = function(block, generator) {
  const varName = haGetVarName(block, 'VAR', 'entity');
  const online = haValueToCode(block, generator, 'ONLINE', 'true');
  return varName + '.setAvailability((bool)(' + online + '));\n';
};

Arduino.forBlock['ha_sensor_create_text'] = function(block, generator) {
  haAttachVarMonitor(block, 'VAR', 'HASensor', 'sensor', '_haSensor');
  const varName = block.getFieldValue('VAR') || 'sensor';
  const uniqueId = haQuote(block.getFieldValue('UNIQUE_ID') || varName);
  const features = block.getFieldValue('FEATURES') || 'HASensor::DefaultFeatures';
  haEnsureLibraries(generator);
  generator.addObject('ha_sensor_' + haSafeIdentifier(varName, 'sensor'), 'HASensor ' + varName + '(' + uniqueId + ', ' + features + ');');
  return '';
};

Arduino.forBlock['ha_sensor_create_number'] = function(block, generator) {
  haAttachVarMonitor(block, 'VAR', 'HASensorNumber', 'numSensor', '_haSensorNumber');
  const varName = block.getFieldValue('VAR') || 'numSensor';
  const uniqueId = haQuote(block.getFieldValue('UNIQUE_ID') || varName);
  const precision = block.getFieldValue('PRECISION') || 'HASensorNumber::PrecisionP0';
  const features = block.getFieldValue('FEATURES') || 'HASensor::DefaultFeatures';
  haEnsureLibraries(generator);
  generator.addObject('ha_sensor_number_' + haSafeIdentifier(varName, 'numSensor'), 'HASensorNumber ' + varName + '(' + uniqueId + ', ' + precision + ', ' + features + ');');
  return '';
};

Arduino.forBlock['ha_sensor_settings'] = function(block, generator) {
  const varName = haGetVarName(block, 'VAR', 'sensor');
  const expireAfter = haValueToCode(block, generator, 'EXPIRE_AFTER', '0');
  let code = '';
  code = haAddFieldSetter(code, varName, 'setDeviceClass', block.getFieldValue('DEVICE_CLASS'));
  code = haAddFieldSetter(code, varName, 'setStateClass', block.getFieldValue('STATE_CLASS'));
  code = haAddFieldSetter(code, varName, 'setUnitOfMeasurement', block.getFieldValue('UNIT'));
  code += varName + '.setExpireAfter((uint16_t)(' + expireAfter + '));\n';
  code += varName + '.setForceUpdate(' + (block.getFieldValue('FORCE_UPDATE') || 'false') + ');\n';
  return code;
};

Arduino.forBlock['ha_sensor_set_value'] = function(block, generator) {
  const varName = haGetVarName(block, 'VAR', 'sensor');
  const value = haValueToCode(block, generator, 'VALUE', '"open"');
  return varName + '.setValue(String(' + value + ').c_str());\n';
};

Arduino.forBlock['ha_sensor_set_json_attributes'] = function(block, generator) {
  const varName = haGetVarName(block, 'VAR', 'sensor');
  const json = haValueToCode(block, generator, 'JSON', '"{}"');
  return varName + '.setJsonAttributes(String(' + json + ').c_str());\n';
};

Arduino.forBlock['ha_sensor_number_set_value'] = function(block, generator) {
  const varName = haGetVarName(block, 'VAR', 'numSensor');
  const value = haValueToCode(block, generator, 'VALUE', '0');
  const force = block.getFieldValue('FORCE') || 'false';
  return varName + '.setValue((float)(' + value + '), ' + force + ');\n';
};

Arduino.forBlock['ha_binary_sensor_create'] = function(block, generator) {
  return haCreateEntity(block, generator, 'ha_binary_sensor', 'HABinarySensor', 'HABinarySensor', 'binarySensor');
};

Arduino.forBlock['ha_binary_sensor_settings'] = function(block, generator) {
  const varName = haGetVarName(block, 'VAR', 'binarySensor');
  const expireAfter = haValueToCode(block, generator, 'EXPIRE_AFTER', '0');
  let code = '';
  code = haAddFieldSetter(code, varName, 'setDeviceClass', block.getFieldValue('DEVICE_CLASS'));
  code += varName + '.setExpireAfter((uint16_t)(' + expireAfter + '));\n';
  return code;
};

Arduino.forBlock['ha_binary_sensor_set_state'] = function(block, generator) {
  const varName = haGetVarName(block, 'VAR', 'binarySensor');
  const state = haValueToCode(block, generator, 'STATE', 'false');
  const force = block.getFieldValue('FORCE') || 'false';
  return varName + '.setState((bool)(' + state + '), ' + force + ');\n';
};

Arduino.forBlock['ha_binary_sensor_get_state'] = function(block, generator) {
  const varName = haGetVarName(block, 'VAR', 'binarySensor');
  return [varName + '.getCurrentState()', haOrder(generator)];
};

Arduino.forBlock['ha_switch_create'] = function(block, generator) {
  return haCreateEntity(block, generator, 'ha_switch', 'HASwitch', 'HASwitch', 'haSwitch');
};

Arduino.forBlock['ha_switch_settings'] = function(block) {
  const varName = haGetVarName(block, 'VAR', 'haSwitch');
  let code = '';
  code = haAddFieldSetter(code, varName, 'setDeviceClass', block.getFieldValue('DEVICE_CLASS'));
  code += varName + '.setRetain(' + (block.getFieldValue('RETAIN') || 'false') + ');\n';
  code += varName + '.setOptimistic(' + (block.getFieldValue('OPTIMISTIC') || 'false') + ');\n';
  return code;
};

Arduino.forBlock['ha_switch_set_state'] = function(block, generator) {
  const varName = haGetVarName(block, 'VAR', 'haSwitch');
  const state = haValueToCode(block, generator, 'STATE', 'false');
  const force = block.getFieldValue('FORCE') || 'false';
  return varName + '.setState((bool)(' + state + '), ' + force + ');\n';
};

Arduino.forBlock['ha_switch_get_state'] = function(block, generator) {
  const varName = haGetVarName(block, 'VAR', 'haSwitch');
  return [varName + '.getCurrentState()', haOrder(generator)];
};

Arduino.forBlock['ha_switch_on_command'] = function(block, generator) {
  const varName = haGetVarName(block, 'VAR', 'haSwitch');
  const safeName = haSafeIdentifier(varName, 'haSwitch');
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = '_ha_' + safeName + '_switch_command';
  const functionDef = 'void ' + callbackName + '(bool state, HASwitch* sender) {\n' +
    '  (void)sender;\n' +
    handlerCode +
    '}\n';
  haAddCallback(generator, callbackName, functionDef, varName + '.onCommand(' + callbackName + ');');
  return '';
};

Arduino.forBlock['ha_button_create'] = function(block, generator) {
  return haCreateEntity(block, generator, 'ha_button', 'HAButton', 'HAButton', 'button');
};

Arduino.forBlock['ha_button_settings'] = function(block) {
  const varName = haGetVarName(block, 'VAR', 'button');
  let code = '';
  code = haAddFieldSetter(code, varName, 'setDeviceClass', block.getFieldValue('DEVICE_CLASS'));
  code += varName + '.setRetain(' + (block.getFieldValue('RETAIN') || 'false') + ');\n';
  return code;
};

Arduino.forBlock['ha_button_on_command'] = function(block, generator) {
  const varName = haGetVarName(block, 'VAR', 'button');
  const safeName = haSafeIdentifier(varName, 'button');
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = '_ha_' + safeName + '_button_command';
  const functionDef = 'void ' + callbackName + '(HAButton* sender) {\n' +
    '  (void)sender;\n' +
    handlerCode +
    '}\n';
  haAddCallback(generator, callbackName, functionDef, varName + '.onCommand(' + callbackName + ');');
  return '';
};

Arduino.forBlock['ha_light_create'] = function(block, generator) {
  haAttachVarMonitor(block, 'VAR', 'HALight', 'light', '_haLight');
  const varName = block.getFieldValue('VAR') || 'light';
  const uniqueId = haQuote(block.getFieldValue('UNIQUE_ID') || varName);
  const features = block.getFieldValue('FEATURES') || 'HALight::DefaultFeatures';
  haEnsureLibraries(generator);
  generator.addObject('ha_light_' + haSafeIdentifier(varName, 'light'), 'HALight ' + varName + '(' + uniqueId + ', ' + features + ');');
  return '';
};

Arduino.forBlock['ha_light_settings'] = function(block, generator) {
  const varName = haGetVarName(block, 'VAR', 'light');
  const brightnessScale = haValueToCode(block, generator, 'BRIGHTNESS_SCALE', '255');
  const minMireds = haValueToCode(block, generator, 'MIN_MIREDS', '153');
  const maxMireds = haValueToCode(block, generator, 'MAX_MIREDS', '500');
  let code = '';
  code += varName + '.setRetain(' + (block.getFieldValue('RETAIN') || 'false') + ');\n';
  code += varName + '.setOptimistic(' + (block.getFieldValue('OPTIMISTIC') || 'false') + ');\n';
  code += varName + '.setBrightnessScale((uint8_t)(' + brightnessScale + '));\n';
  code += varName + '.setMinMireds((uint16_t)(' + minMireds + '));\n';
  code += varName + '.setMaxMireds((uint16_t)(' + maxMireds + '));\n';
  return code;
};

Arduino.forBlock['ha_light_set_state'] = function(block, generator) {
  const varName = haGetVarName(block, 'VAR', 'light');
  const state = haValueToCode(block, generator, 'STATE', 'false');
  const force = block.getFieldValue('FORCE') || 'false';
  return varName + '.setState((bool)(' + state + '), ' + force + ');\n';
};

Arduino.forBlock['ha_light_set_brightness'] = function(block, generator) {
  const varName = haGetVarName(block, 'VAR', 'light');
  const brightness = haValueToCode(block, generator, 'BRIGHTNESS', '255');
  const force = block.getFieldValue('FORCE') || 'false';
  return varName + '.setBrightness((uint8_t)(' + brightness + '), ' + force + ');\n';
};

Arduino.forBlock['ha_light_set_color_temperature'] = function(block, generator) {
  const varName = haGetVarName(block, 'VAR', 'light');
  const temperature = haValueToCode(block, generator, 'TEMPERATURE', '250');
  const force = block.getFieldValue('FORCE') || 'false';
  return varName + '.setColorTemperature((uint16_t)(' + temperature + '), ' + force + ');\n';
};

Arduino.forBlock['ha_light_set_rgb'] = function(block, generator) {
  const varName = haGetVarName(block, 'VAR', 'light');
  const red = haValueToCode(block, generator, 'RED', '255');
  const green = haValueToCode(block, generator, 'GREEN', '255');
  const blue = haValueToCode(block, generator, 'BLUE', '255');
  const force = block.getFieldValue('FORCE') || 'false';
  return varName + '.setRGBColor(HALight::RGBColor((uint8_t)(' + red + '), (uint8_t)(' + green + '), (uint8_t)(' + blue + ')), ' + force + ');\n';
};

Arduino.forBlock['ha_light_get_state'] = function(block, generator) {
  const varName = haGetVarName(block, 'VAR', 'light');
  return [varName + '.getCurrentState()', haOrder(generator)];
};

Arduino.forBlock['ha_light_get_brightness'] = function(block, generator) {
  const varName = haGetVarName(block, 'VAR', 'light');
  return [varName + '.getCurrentBrightness()', haOrder(generator)];
};

Arduino.forBlock['ha_light_on_state_command'] = function(block, generator) {
  const varName = haGetVarName(block, 'VAR', 'light');
  const safeName = haSafeIdentifier(varName, 'light');
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = '_ha_' + safeName + '_light_state';
  const functionDef = 'void ' + callbackName + '(bool state, HALight* sender) {\n' +
    '  (void)sender;\n' +
    handlerCode +
    '}\n';
  haAddCallback(generator, callbackName, functionDef, varName + '.onStateCommand(' + callbackName + ');');
  return '';
};

Arduino.forBlock['ha_light_on_brightness_command'] = function(block, generator) {
  const varName = haGetVarName(block, 'VAR', 'light');
  const safeName = haSafeIdentifier(varName, 'light');
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = '_ha_' + safeName + '_light_brightness';
  const functionDef = 'void ' + callbackName + '(uint8_t brightness, HALight* sender) {\n' +
    '  (void)sender;\n' +
    handlerCode +
    '}\n';
  haAddCallback(generator, callbackName, functionDef, varName + '.onBrightnessCommand(' + callbackName + ');');
  return '';
};

Arduino.forBlock['ha_light_on_color_temperature_command'] = function(block, generator) {
  const varName = haGetVarName(block, 'VAR', 'light');
  const safeName = haSafeIdentifier(varName, 'light');
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = '_ha_' + safeName + '_light_temperature';
  const functionDef = 'void ' + callbackName + '(uint16_t temperature, HALight* sender) {\n' +
    '  (void)sender;\n' +
    handlerCode +
    '}\n';
  haAddCallback(generator, callbackName, functionDef, varName + '.onColorTemperatureCommand(' + callbackName + ');');
  return '';
};

Arduino.forBlock['ha_light_on_rgb_command'] = function(block, generator) {
  const varName = haGetVarName(block, 'VAR', 'light');
  const safeName = haSafeIdentifier(varName, 'light');
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = '_ha_' + safeName + '_light_rgb';
  const functionDef = 'void ' + callbackName + '(HALight::RGBColor color, HALight* sender) {\n' +
    '  (void)sender;\n' +
    handlerCode +
    '}\n';
  haAddCallback(generator, callbackName, functionDef, varName + '.onRGBColorCommand(' + callbackName + ');');
  return '';
};

Arduino.forBlock['ha_number_create'] = function(block, generator) {
  haAttachVarMonitor(block, 'VAR', 'HANumber', 'number', '_haNumber');
  const varName = block.getFieldValue('VAR') || 'number';
  const uniqueId = haQuote(block.getFieldValue('UNIQUE_ID') || varName);
  const precision = block.getFieldValue('PRECISION') || 'HANumber::PrecisionP0';
  haEnsureLibraries(generator);
  generator.addObject('ha_number_' + haSafeIdentifier(varName, 'number'), 'HANumber ' + varName + '(' + uniqueId + ', ' + precision + ');');
  return '';
};

Arduino.forBlock['ha_number_settings'] = function(block, generator) {
  const varName = haGetVarName(block, 'VAR', 'number');
  const minValue = haValueToCode(block, generator, 'MIN', '0');
  const maxValue = haValueToCode(block, generator, 'MAX', '100');
  const step = haValueToCode(block, generator, 'STEP', '1');
  let code = '';
  code = haAddFieldSetter(code, varName, 'setDeviceClass', block.getFieldValue('DEVICE_CLASS'));
  code = haAddFieldSetter(code, varName, 'setUnitOfMeasurement', block.getFieldValue('UNIT'));
  code += varName + '.setMode(' + (block.getFieldValue('MODE') || 'HANumber::ModeAuto') + ');\n';
  code += varName + '.setMin((float)(' + minValue + '));\n';
  code += varName + '.setMax((float)(' + maxValue + '));\n';
  code += varName + '.setStep((float)(' + step + '));\n';
  code += varName + '.setRetain(' + (block.getFieldValue('RETAIN') || 'false') + ');\n';
  code += varName + '.setOptimistic(' + (block.getFieldValue('OPTIMISTIC') || 'false') + ');\n';
  return code;
};

Arduino.forBlock['ha_number_set_state'] = function(block, generator) {
  const varName = haGetVarName(block, 'VAR', 'number');
  const value = haValueToCode(block, generator, 'VALUE', '0');
  const force = block.getFieldValue('FORCE') || 'false';
  return varName + '.setState((float)(' + value + '), ' + force + ');\n';
};

Arduino.forBlock['ha_number_get_state'] = function(block, generator) {
  const varName = haGetVarName(block, 'VAR', 'number');
  return [varName + '.getCurrentState().toFloat()', haOrder(generator)];
};

Arduino.forBlock['ha_number_on_command'] = function(block, generator) {
  const varName = haGetVarName(block, 'VAR', 'number');
  const safeName = haSafeIdentifier(varName, 'number');
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = '_ha_' + safeName + '_number_command';
  const functionDef = 'void ' + callbackName + '(HANumeric number, HANumber* sender) {\n' +
    '  (void)sender;\n' +
    handlerCode +
    '}\n';
  haAddCallback(generator, callbackName, functionDef, varName + '.onCommand(' + callbackName + ');');
  return '';
};

Arduino.forBlock['ha_select_create'] = function(block, generator) {
  return haCreateEntity(block, generator, 'ha_select', 'HASelect', 'HASelect', 'select');
};

Arduino.forBlock['ha_select_settings'] = function(block) {
  const varName = haGetVarName(block, 'VAR', 'select');
  const options = block.getFieldValue('OPTIONS') || 'Auto;Heat;Cool';
  let code = varName + '.setOptions(' + haQuote(options) + ');\n';
  code += varName + '.setRetain(' + (block.getFieldValue('RETAIN') || 'false') + ');\n';
  code += varName + '.setOptimistic(' + (block.getFieldValue('OPTIMISTIC') || 'false') + ');\n';
  return code;
};

Arduino.forBlock['ha_select_set_state'] = function(block, generator) {
  const varName = haGetVarName(block, 'VAR', 'select');
  const index = haValueToCode(block, generator, 'INDEX', '0');
  const force = block.getFieldValue('FORCE') || 'false';
  return varName + '.setState((int8_t)(' + index + '), ' + force + ');\n';
};

Arduino.forBlock['ha_select_get_state'] = function(block, generator) {
  const varName = haGetVarName(block, 'VAR', 'select');
  return [varName + '.getCurrentState()', haOrder(generator)];
};

Arduino.forBlock['ha_select_get_option'] = function(block, generator) {
  const varName = haGetVarName(block, 'VAR', 'select');
  return ['String(' + varName + '.getCurrentOption() ? ' + varName + '.getCurrentOption() : "")', haOrder(generator)];
};

Arduino.forBlock['ha_select_on_command'] = function(block, generator) {
  const varName = haGetVarName(block, 'VAR', 'select');
  const safeName = haSafeIdentifier(varName, 'select');
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = '_ha_' + safeName + '_select_command';
  const functionDef = 'void ' + callbackName + '(int8_t index, HASelect* sender) {\n' +
    '  (void)sender;\n' +
    handlerCode +
    '}\n';
  haAddCallback(generator, callbackName, functionDef, varName + '.onCommand(' + callbackName + ');');
  return '';
};

Arduino.forBlock['ha_command_bool_state'] = function(block, generator) {
  return ['state', haOrder(generator)];
};

Arduino.forBlock['ha_command_brightness'] = function(block, generator) {
  return ['brightness', haOrder(generator)];
};

Arduino.forBlock['ha_command_color_temperature'] = function(block, generator) {
  return ['temperature', haOrder(generator)];
};

Arduino.forBlock['ha_command_rgb_red'] = function(block, generator) {
  return ['color.red', haOrder(generator)];
};

Arduino.forBlock['ha_command_rgb_green'] = function(block, generator) {
  return ['color.green', haOrder(generator)];
};

Arduino.forBlock['ha_command_rgb_blue'] = function(block, generator) {
  return ['color.blue', haOrder(generator)];
};

Arduino.forBlock['ha_number_command_is_set'] = function(block, generator) {
  return ['number.isSet()', haOrder(generator)];
};

Arduino.forBlock['ha_number_command_value'] = function(block, generator) {
  return ['number.toFloat()', haOrder(generator)];
};

Arduino.forBlock['ha_select_command_index'] = function(block, generator) {
  return ['index', haOrder(generator)];
};