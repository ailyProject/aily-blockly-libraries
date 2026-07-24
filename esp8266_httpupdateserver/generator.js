'use strict';

function ensureHTTPUpdateServerLib(generator) {
  generator.addLibrary('ESP8266WebServer', '#include <ESP8266WebServer.h>');
  generator.addLibrary('ESP8266HTTPUpdateServer', '#include <ESP8266HTTPUpdateServer.h>');
  generator.addObject('httpUpdater', 'ESP8266HTTPUpdateServer httpUpdater;');
}

function getVariableName(block, fieldName, defaultName) {
  const varField = block.getField(fieldName);
  return varField ? varField.getText() : defaultName;
}

Arduino.forBlock['esp8266_httpupdateserver_setup'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  ensureHTTPUpdateServerLib(generator);
  return 'httpUpdater.setup(&' + varName + ');\n';
};

Arduino.forBlock['esp8266_httpupdateserver_setup_path'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '"/update"';
  ensureHTTPUpdateServerLib(generator);
  return 'httpUpdater.setup(&' + varName + ', ' + path + ');\n';
};

Arduino.forBlock['esp8266_httpupdateserver_setup_auth'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const username = generator.valueToCode(block, 'USERNAME', generator.ORDER_ATOMIC) || '"admin"';
  const password = generator.valueToCode(block, 'PASSWORD', generator.ORDER_ATOMIC) || '"password"';
  ensureHTTPUpdateServerLib(generator);
  return 'httpUpdater.setup(&' + varName + ', ' + username + ', ' + password + ');\n';
};

Arduino.forBlock['esp8266_httpupdateserver_setup_full'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '"/update"';
  const username = generator.valueToCode(block, 'USERNAME', generator.ORDER_ATOMIC) || '"admin"';
  const password = generator.valueToCode(block, 'PASSWORD', generator.ORDER_ATOMIC) || '"password"';
  ensureHTTPUpdateServerLib(generator);
  return 'httpUpdater.setup(&' + varName + ', ' + path + ', ' + username + ', ' + password + ');\n';
};

Arduino.forBlock['esp8266_httpupdateserver_update_credentials'] = function(block, generator) {
  const username = generator.valueToCode(block, 'USERNAME', generator.ORDER_ATOMIC) || '"admin"';
  const password = generator.valueToCode(block, 'PASSWORD', generator.ORDER_ATOMIC) || '"password"';
  ensureHTTPUpdateServerLib(generator);
  return 'httpUpdater.updateCredentials(' + username + ', ' + password + ');\n';
};
