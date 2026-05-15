'use strict';

function ensureAdafruitMqttLibraries(generator) {
  generator.addLibrary('Adafruit_MQTT', '#include <Adafruit_MQTT.h>');
  generator.addLibrary('Adafruit_MQTT_Client', '#include <Adafruit_MQTT_Client.h>');
}

function ensureAdafruitMqttWiFiLibrary(generator) {
  const boardConfig = (typeof window !== 'undefined' && window['boardConfig']) ? window['boardConfig'] : null;
  const core = boardConfig && boardConfig.core ? boardConfig.core : '';

  if (core.indexOf('esp8266') > -1) {
    generator.addLibrary('Adafruit_MQTT_WiFi', '#include <ESP8266WiFi.h>');
  } else if (core.indexOf('renesas_uno') > -1 || core.indexOf('unor4wifi') > -1) {
    generator.addLibrary('Adafruit_MQTT_WiFi', '#include <WiFiS3.h>');
  } else {
    generator.addLibrary('Adafruit_MQTT_WiFi', '#include <WiFi.h>');
  }
}

function ensureAdafruitMqttSerial(generator) {
  generator.addSetupBegin('adafruit_mqtt_serial_begin', 'Serial.begin(9600);');
}

function getAdafruitMqttOrder(generator) {
  if (generator && generator.ORDER_ATOMIC !== undefined) return generator.ORDER_ATOMIC;
  if (typeof Arduino !== 'undefined' && Arduino.ORDER_ATOMIC !== undefined) return Arduino.ORDER_ATOMIC;
  return 0;
}

function adafruitMqttValueToCode(block, generator, name, fallback) {
  return generator.valueToCode(block, name, getAdafruitMqttOrder(generator)) || fallback;
}

function adafruitMqttQuoteCString(value) {
  return '"' + String(value || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
}

function adafruitMqttSafeIdentifier(value, fallback) {
  let identifier = String(value || fallback || 'mqtt').replace(/[^A-Za-z0-9_]/g, '_');
  if (!identifier) identifier = fallback || 'mqtt';
  if (/^[0-9]/.test(identifier)) identifier = '_' + identifier;
  return identifier;
}

function getAdafruitMqttVarName(block, fieldName, defaultName) {
  const varField = block.getField(fieldName);
  return varField ? varField.getText() : defaultName;
}

function attachAdafruitMqttVarMonitor(block, fieldName, variableType, defaultName, monitorKey) {
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

function ensureAdafruitMqttLastError(generator, mqttName) {
  const errorName = '_adafruit_mqtt_' + adafruitMqttSafeIdentifier(mqttName, 'mqtt') + '_last_error';
  generator.addVariable(errorName, 'int8_t ' + errorName + ' = 0;');
  return errorName;
}

function adafruitMqttStringExpression(code) {
  return 'String(' + code + ')';
}

Arduino.forBlock['adafruit_mqtt_create'] = function(block, generator) {
  attachAdafruitMqttVarMonitor(block, 'VAR', 'Adafruit_MQTT_Client', 'mqtt', '_adafruitMqttClient');

  const mqttName = block.getFieldValue('VAR') || 'mqtt';
  const networkClientName = adafruitMqttSafeIdentifier(mqttName, 'mqtt') + '_wifiClient';
  const server = adafruitMqttQuoteCString(block.getFieldValue('SERVER') || 'io.adafruit.com');
  const port = block.getFieldValue('PORT') || '1883';
  const username = adafruitMqttQuoteCString(block.getFieldValue('USERNAME') || '');
  const password = adafruitMqttQuoteCString(block.getFieldValue('PASSWORD') || '');
  const clientId = block.getFieldValue('CLIENT_ID') || '';

  ensureAdafruitMqttWiFiLibrary(generator);
  ensureAdafruitMqttLibraries(generator);
  ensureAdafruitMqttLastError(generator, mqttName);

  let declaration = 'WiFiClient ' + networkClientName + ';\n';
  if (clientId) {
    declaration += 'Adafruit_MQTT_Client ' + mqttName + '(&' + networkClientName + ', ' + server + ', ' + port + ', ' + adafruitMqttQuoteCString(clientId) + ', ' + username + ', ' + password + ');';
  } else {
    declaration += 'Adafruit_MQTT_Client ' + mqttName + '(&' + networkClientName + ', ' + server + ', ' + port + ', ' + username + ', ' + password + ');';
  }
  generator.addObject('adafruit_mqtt_client_' + adafruitMqttSafeIdentifier(mqttName, 'mqtt'), declaration);

  return '';
};

Arduino.forBlock['adafruit_mqtt_set_keep_alive'] = function(block, generator) {
  const mqttName = getAdafruitMqttVarName(block, 'VAR', 'mqtt');
  const interval = adafruitMqttValueToCode(block, generator, 'INTERVAL', '300');
  ensureAdafruitMqttLibraries(generator);
  return mqttName + '.setKeepAliveInterval((uint16_t)(' + interval + '));\n';
};

Arduino.forBlock['adafruit_mqtt_set_will'] = function(block, generator) {
  const mqttName = getAdafruitMqttVarName(block, 'VAR', 'mqtt');
  const topic = adafruitMqttValueToCode(block, generator, 'TOPIC', '"device/status"');
  const payload = adafruitMqttValueToCode(block, generator, 'PAYLOAD', '"offline"');
  const qos = block.getFieldValue('QOS') || '0';
  const retain = block.getFieldValue('RETAIN') || 'false';
  const safeMqttName = adafruitMqttSafeIdentifier(mqttName, 'mqtt');
  const willTopic = '_adafruit_mqtt_' + safeMqttName + '_will_topic';
  const willPayload = '_adafruit_mqtt_' + safeMqttName + '_will_payload';

  ensureAdafruitMqttLibraries(generator);
  generator.addVariable(willTopic, 'String ' + willTopic + ';');
  generator.addVariable(willPayload, 'String ' + willPayload + ';');

  let code = willTopic + ' = ' + adafruitMqttStringExpression(topic) + ';\n';
  code += willPayload + ' = ' + adafruitMqttStringExpression(payload) + ';\n';
  code += mqttName + '.will(' + willTopic + '.c_str(), ' + willPayload + '.c_str(), ' + qos + ', ' + retain + ');\n';
  return code;
};

Arduino.forBlock['adafruit_mqtt_connect'] = function(block, generator) {
  const mqttName = getAdafruitMqttVarName(block, 'VAR', 'mqtt');
  const retries = adafruitMqttValueToCode(block, generator, 'RETRIES', '3');
  const delayMs = adafruitMqttValueToCode(block, generator, 'DELAY', '5000');
  const lastErrorName = ensureAdafruitMqttLastError(generator, mqttName);

  ensureAdafruitMqttLibraries(generator);
  ensureAdafruitMqttSerial(generator);

  let code = '{\n';
  code += '  if (!' + mqttName + '.connected()) {\n';
  code += '    int8_t adafruitMqttResult = 0;\n';
  code += '    uint8_t adafruitMqttRetries = (uint8_t)(' + retries + ');\n';
  code += '    while ((adafruitMqttResult = ' + mqttName + '.connect()) != 0) {\n';
  code += '      ' + lastErrorName + ' = adafruitMqttResult;\n';
  code += '      Serial.println(' + mqttName + '.connectErrorString(adafruitMqttResult));\n';
  code += '      ' + mqttName + '.disconnect();\n';
  code += '      if (adafruitMqttRetries == 0) {\n';
  code += '        break;\n';
  code += '      }\n';
  code += '      adafruitMqttRetries--;\n';
  code += '      if (adafruitMqttRetries == 0) {\n';
  code += '        break;\n';
  code += '      }\n';
  code += '      delay(' + delayMs + ');\n';
  code += '    }\n';
  code += '    if (adafruitMqttResult == 0) {\n';
  code += '      ' + lastErrorName + ' = 0;\n';
  code += '    }\n';
  code += '  }\n';
  code += '}\n';
  return code;
};

Arduino.forBlock['adafruit_mqtt_disconnect'] = function(block, generator) {
  const mqttName = getAdafruitMqttVarName(block, 'VAR', 'mqtt');
  ensureAdafruitMqttLibraries(generator);
  return mqttName + '.disconnect();\n';
};

Arduino.forBlock['adafruit_mqtt_connected'] = function(block, generator) {
  const mqttName = getAdafruitMqttVarName(block, 'VAR', 'mqtt');
  return [mqttName + '.connected()', getAdafruitMqttOrder(generator)];
};

Arduino.forBlock['adafruit_mqtt_last_error_code'] = function(block, generator) {
  const mqttName = getAdafruitMqttVarName(block, 'VAR', 'mqtt');
  const lastErrorName = ensureAdafruitMqttLastError(generator, mqttName);
  return [lastErrorName, getAdafruitMqttOrder(generator)];
};

Arduino.forBlock['adafruit_mqtt_last_error_text'] = function(block, generator) {
  const mqttName = getAdafruitMqttVarName(block, 'VAR', 'mqtt');
  const lastErrorName = ensureAdafruitMqttLastError(generator, mqttName);
  ensureAdafruitMqttLibraries(generator);
  return ['String(' + mqttName + '.connectErrorString(' + lastErrorName + '))', getAdafruitMqttOrder(generator)];
};

Arduino.forBlock['adafruit_mqtt_ping'] = function(block, generator) {
  const mqttName = getAdafruitMqttVarName(block, 'VAR', 'mqtt');
  const count = adafruitMqttValueToCode(block, generator, 'COUNT', '1');
  ensureAdafruitMqttLibraries(generator);
  return [mqttName + '.ping((uint8_t)(' + count + '))', getAdafruitMqttOrder(generator)];
};

Arduino.forBlock['adafruit_mqtt_create_publisher'] = function(block, generator) {
  attachAdafruitMqttVarMonitor(block, 'VAR', 'Adafruit_MQTT_Publish', 'publisher', '_adafruitMqttPublisher');

  const publisherName = block.getFieldValue('VAR') || 'publisher';
  const mqttName = getAdafruitMqttVarName(block, 'MQTT', 'mqtt');
  const topic = adafruitMqttQuoteCString(block.getFieldValue('TOPIC') || 'username/feeds/data');
  const qos = block.getFieldValue('QOS') || '0';

  ensureAdafruitMqttLibraries(generator);
  generator.addObject('adafruit_mqtt_publisher_' + adafruitMqttSafeIdentifier(publisherName, 'publisher'), 'Adafruit_MQTT_Publish ' + publisherName + '(&' + mqttName + ', ' + topic + ', ' + qos + ');');

  return '';
};

Arduino.forBlock['adafruit_mqtt_publish_text'] = function(block, generator) {
  const publisherName = getAdafruitMqttVarName(block, 'VAR', 'publisher');
  const payload = adafruitMqttValueToCode(block, generator, 'PAYLOAD', '"hello"');
  const retain = block.getFieldValue('RETAIN') || 'false';
  ensureAdafruitMqttLibraries(generator);
  return publisherName + '.publish(' + adafruitMqttStringExpression(payload) + '.c_str(), ' + retain + ');\n';
};

Arduino.forBlock['adafruit_mqtt_publish_number'] = function(block, generator) {
  const publisherName = getAdafruitMqttVarName(block, 'VAR', 'publisher');
  const value = adafruitMqttValueToCode(block, generator, 'VALUE', '0');
  const precision = adafruitMqttValueToCode(block, generator, 'PRECISION', '2');
  const retain = block.getFieldValue('RETAIN') || 'false';
  ensureAdafruitMqttLibraries(generator);
  return publisherName + '.publish((double)(' + value + '), (uint8_t)(' + precision + '), ' + retain + ');\n';
};

Arduino.forBlock['adafruit_mqtt_publish_bytes'] = function(block, generator) {
  const publisherName = getAdafruitMqttVarName(block, 'VAR', 'publisher');
  const buffer = adafruitMqttValueToCode(block, generator, 'BUFFER', '"payload"');
  const length = adafruitMqttValueToCode(block, generator, 'LENGTH', '7');
  const retain = block.getFieldValue('RETAIN') || 'false';
  ensureAdafruitMqttLibraries(generator);
  return publisherName + '.publish((uint8_t *)(' + buffer + '), (uint16_t)(' + length + '), ' + retain + ');\n';
};

Arduino.forBlock['adafruit_mqtt_publish_topic'] = function(block, generator) {
  const mqttName = getAdafruitMqttVarName(block, 'VAR', 'mqtt');
  const topic = adafruitMqttValueToCode(block, generator, 'TOPIC', '"device/data"');
  const payload = adafruitMqttValueToCode(block, generator, 'PAYLOAD', '"hello"');
  const qos = block.getFieldValue('QOS') || '0';
  const retain = block.getFieldValue('RETAIN') || 'false';
  ensureAdafruitMqttLibraries(generator);
  return mqttName + '.publish(' + adafruitMqttStringExpression(topic) + '.c_str(), ' + adafruitMqttStringExpression(payload) + '.c_str(), ' + qos + ', ' + retain + ');\n';
};

Arduino.forBlock['adafruit_mqtt_create_subscriber'] = function(block, generator) {
  attachAdafruitMqttVarMonitor(block, 'VAR', 'Adafruit_MQTT_Subscribe', 'subscriber', '_adafruitMqttSubscriber');

  const subscriberName = block.getFieldValue('VAR') || 'subscriber';
  const mqttName = getAdafruitMqttVarName(block, 'MQTT', 'mqtt');
  const topic = adafruitMqttQuoteCString(block.getFieldValue('TOPIC') || 'username/feeds/control');
  const qos = block.getFieldValue('QOS') || '0';

  ensureAdafruitMqttLibraries(generator);
  generator.addObject('adafruit_mqtt_subscriber_' + adafruitMqttSafeIdentifier(subscriberName, 'subscriber'), 'Adafruit_MQTT_Subscribe ' + subscriberName + '(&' + mqttName + ', ' + topic + ', ' + qos + ');');

  return mqttName + '.subscribe(&' + subscriberName + ');\n';
};

Arduino.forBlock['adafruit_mqtt_subscribe'] = function(block, generator) {
  const mqttName = getAdafruitMqttVarName(block, 'MQTT', 'mqtt');
  const subscriberName = getAdafruitMqttVarName(block, 'VAR', 'subscriber');
  ensureAdafruitMqttLibraries(generator);
  return mqttName + '.subscribe(&' + subscriberName + ');\n';
};

Arduino.forBlock['adafruit_mqtt_unsubscribe'] = function(block, generator) {
  const mqttName = getAdafruitMqttVarName(block, 'MQTT', 'mqtt');
  const subscriberName = getAdafruitMqttVarName(block, 'VAR', 'subscriber');
  ensureAdafruitMqttLibraries(generator);
  return mqttName + '.unsubscribe(&' + subscriberName + ');\n';
};

Arduino.forBlock['adafruit_mqtt_read_subscription'] = function(block, generator) {
  const mqttName = getAdafruitMqttVarName(block, 'MQTT', 'mqtt');
  const subscriberName = getAdafruitMqttVarName(block, 'VAR', 'subscriber');
  const timeout = adafruitMqttValueToCode(block, generator, 'TIMEOUT', '1000');
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';

  ensureAdafruitMqttLibraries(generator);

  let code = '{\n';
  code += '  Adafruit_MQTT_Subscribe *adafruitMqttSubscription = NULL;\n';
  code += '  while ((adafruitMqttSubscription = ' + mqttName + '.readSubscription(' + timeout + '))) {\n';
  code += '    if (adafruitMqttSubscription == &' + subscriberName + ') {\n';
  code += handlerCode;
  code += '    }\n';
  code += '  }\n';
  code += '}\n';
  return code;
};

Arduino.forBlock['adafruit_mqtt_on_message'] = function(block, generator) {
  const mqttName = getAdafruitMqttVarName(block, 'MQTT', 'mqtt');
  const subscriberName = getAdafruitMqttVarName(block, 'VAR', 'subscriber');
  const timeout = adafruitMqttValueToCode(block, generator, 'TIMEOUT', '1000');
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = '_adafruit_mqtt_' + adafruitMqttSafeIdentifier(subscriberName, 'subscriber') + '_callback';

  ensureAdafruitMqttLibraries(generator);

  const functionDef = 'void ' + callbackName + '(char *data, uint16_t len) {\n' +
    '  (void)data;\n' +
    '  (void)len;\n' +
    handlerCode +
    '}\n';

  generator.addFunction(callbackName, functionDef);
  generator.addSetupBegin(callbackName + '_attach', subscriberName + '.setCallback(' + callbackName + ');\n' + mqttName + '.subscribe(&' + subscriberName + ');');
  generator.addLoopBegin('adafruit_mqtt_process_packets_' + adafruitMqttSafeIdentifier(mqttName, 'mqtt'), mqttName + '.processPackets(' + timeout + ');');

  return '';
};

Arduino.forBlock['adafruit_mqtt_process_packets'] = function(block, generator) {
  const mqttName = getAdafruitMqttVarName(block, 'VAR', 'mqtt');
  const timeout = adafruitMqttValueToCode(block, generator, 'TIMEOUT', '1000');
  ensureAdafruitMqttLibraries(generator);
  return mqttName + '.processPackets(' + timeout + ');\n';
};

Arduino.forBlock['adafruit_mqtt_subscriber_payload'] = function(block, generator) {
  const subscriberName = getAdafruitMqttVarName(block, 'VAR', 'subscriber');
  return ['String((char *)' + subscriberName + '.lastread)', getAdafruitMqttOrder(generator)];
};

Arduino.forBlock['adafruit_mqtt_subscriber_payload_length'] = function(block, generator) {
  const subscriberName = getAdafruitMqttVarName(block, 'VAR', 'subscriber');
  return [subscriberName + '.datalen', getAdafruitMqttOrder(generator)];
};

Arduino.forBlock['adafruit_mqtt_subscriber_has_message'] = function(block, generator) {
  const subscriberName = getAdafruitMqttVarName(block, 'VAR', 'subscriber');
  return [subscriberName + '.new_message', getAdafruitMqttOrder(generator)];
};