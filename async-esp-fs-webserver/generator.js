'use strict';

function asyncFsAddMacro(generator, key, code) {
  if (typeof generator.addMacro === 'function') {
    generator.addMacro(key, code);
  } else {
    generator.addLibrary(key, code);
  }
}

function asyncFsEnsureFilesystemLibrary(generator, fsName) {
  if (fsName === 'SPIFFS') {
    generator.addLibrary('SPIFFS', '#include <SPIFFS.h>');
  } else if (fsName === 'FFat') {
    generator.addLibrary('FFat', '#include <FFat.h>');
  } else {
    generator.addLibrary('LittleFS', '#include <LittleFS.h>');
  }
}

function asyncFsEnsureLibraries(generator, fsName) {
  const boardConfig = (typeof window !== 'undefined' && window['boardConfig']) ? window['boardConfig'] : null;
  if (boardConfig && boardConfig.core && boardConfig.core.indexOf('esp32') === -1) {
    asyncFsAddMacro(generator, 'asyncfs_esp32_only', '#if !defined(ESP32)\n#error "AsyncFsWebServer Blockly blocks require ESP32."\n#endif');
  } else {
    asyncFsAddMacro(generator, 'asyncfs_esp32_only', '#if !defined(ESP32)\n#error "AsyncFsWebServer Blockly blocks require ESP32."\n#endif');
  }

  generator.addLibrary('FS', '#include <FS.h>');
  generator.addLibrary('WiFi', '#include <WiFi.h>');
  generator.addLibrary('AsyncTCP', '#include <AsyncTCP.h>');
  generator.addLibrary('ArduinoJson', '#include <ArduinoJson.h>');
  generator.addLibrary('ESPAsyncWebServer', '#include <ESPAsyncWebServer.h>');
  generator.addLibrary('AsyncFsWebServer', '#include <AsyncFsWebServer.h>');
  asyncFsEnsureFilesystemLibrary(generator, fsName || 'LittleFS');
}

function asyncFsGetVarName(block, fieldName, defaultName) {
  const varField = block.getField(fieldName);
  return varField ? varField.getText() : defaultName;
}

function asyncFsEnsureServerObject(generator, varName, fsName, port, host) {
  const serverName = varName || 'server';
  const filesystem = fsName || 'LittleFS';
  const serverPort = port || '80';
  const serverHost = host || '"esphost"';

  if (!generator._asyncFsWebServerDeclaredObjects) {
    generator._asyncFsWebServerDeclaredObjects = {};
  }
  if (generator._asyncFsWebServerDeclaredObjects[serverName]) {
    return;
  }

  generator._asyncFsWebServerDeclaredObjects[serverName] = true;
  asyncFsEnsureLibraries(generator, filesystem);
  registerVariableToBlockly(serverName, 'AsyncFsWebServer');
  generator.addVariable(serverName, 'AsyncFsWebServer ' + serverName + '(' + filesystem + ', ' + serverPort + ', ' + serverHost + ');');
}

function asyncFsAttachVarMonitor(block) {
  if (!block._asyncFsWebServerVarMonitorAttached) {
    block._asyncFsWebServerVarMonitorAttached = true;
    block._asyncFsWebServerVarLastName = block.getFieldValue('VAR') || 'server';
    registerVariableToBlockly(block._asyncFsWebServerVarLastName, 'AsyncFsWebServer');
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._asyncFsWebServerVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'AsyncFsWebServer');
          block._asyncFsWebServerVarLastName = newName;
        }
      };
    }
  }
}

function asyncFsNextCallbackName(generator, prefix) {
  if (!generator._asyncFsWebServerCallbackCounter) {
    generator._asyncFsWebServerCallbackCounter = 0;
  }
  generator._asyncFsWebServerCallbackCounter++;
  return '_asyncfs_' + prefix + '_' + generator._asyncFsWebServerCallbackCounter;
}

function asyncFsAddRequestHelpers(generator) {
  generator.addFunction('asyncfs_get_request_param', `
String asyncfs_get_request_param(AsyncWebServerRequest* request, const String& name, bool post) {
  if (request == nullptr) {
    return String();
  }
  const AsyncWebParameter* param = request->getParam(name, post);
  if (param == nullptr) {
    return String();
  }
  return param->value();
}`);

  generator.addFunction('asyncfs_has_request_param', `
bool asyncfs_has_request_param(AsyncWebServerRequest* request, const String& name, bool post) {
  if (request == nullptr) {
    return false;
  }
  return request->hasParam(name, post);
}`);
}

function asyncFsAddWebSocketHandler(generator, block, callbackName) {
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const functionDef =
    'void ' + callbackName + '(AsyncWebSocket* _asyncfs_ws_server, AsyncWebSocketClient* _asyncfs_ws_client, AwsEventType _asyncfs_ws_type, void* _asyncfs_ws_arg, uint8_t* _asyncfs_ws_data, size_t _asyncfs_ws_len) {\n' +
    '  (void)_asyncfs_ws_server;\n' +
    '  String _asyncfs_ws_message = "";\n' +
    '  if (_asyncfs_ws_type == WS_EVT_DATA && _asyncfs_ws_data != nullptr && _asyncfs_ws_len > 0) {\n' +
    '    AwsFrameInfo* _asyncfs_ws_info = (AwsFrameInfo*)_asyncfs_ws_arg;\n' +
    '    if (_asyncfs_ws_info == nullptr || _asyncfs_ws_info->opcode == WS_TEXT) {\n' +
    '      _asyncfs_ws_message.reserve(_asyncfs_ws_len + 1);\n' +
    '      for (size_t _asyncfs_ws_index = 0; _asyncfs_ws_index < _asyncfs_ws_len; ++_asyncfs_ws_index) {\n' +
    '        _asyncfs_ws_message += (char)_asyncfs_ws_data[_asyncfs_ws_index];\n' +
    '      }\n' +
    '    }\n' +
    '  }\n' +
    handlerCode +
    '}\n';

  generator.addFunction(callbackName, functionDef);
}

Arduino.forBlock['async_fs_webserver_create'] = function(block, generator) {
  asyncFsAttachVarMonitor(block);

  const varName = block.getFieldValue('VAR') || 'server';
  const fsName = block.getFieldValue('FS') || 'LittleFS';
  const port = block.getFieldValue('PORT') || '80';
  const host = generator.valueToCode(block, 'HOST', generator.ORDER_ATOMIC) || '"esphost"';

  asyncFsEnsureServerObject(generator, varName, fsName, port, host);

  return '';
};

Arduino.forBlock['async_fs_webserver_mount_fs'] = function(block, generator) {
  const varName = asyncFsGetVarName(block, 'VAR', 'server');
  const fsName = block.getFieldValue('FS') || 'LittleFS';
  const formatOnFail = block.getFieldValue('FORMAT') === 'TRUE' ? 'true' : 'false';

  asyncFsEnsureLibraries(generator, fsName);
  asyncFsEnsureServerObject(generator, varName, fsName);

  return 'if (!' + fsName + '.begin(' + formatOnFail + ')) {\n' +
    '  ESP.restart();\n' +
    '}\n';
};

Arduino.forBlock['async_fs_webserver_connect_or_ap'] = function(block, generator) {
  const varName = asyncFsGetVarName(block, 'VAR', 'server');
  const timeout = generator.valueToCode(block, 'TIMEOUT', generator.ORDER_ATOMIC) || '10000';
  const ssid = generator.valueToCode(block, 'SSID', generator.ORDER_ATOMIC) || '"ESP_AP"';
  const password = generator.valueToCode(block, 'PASSWORD', generator.ORDER_ATOMIC) || '"123456789"';
  const redirect = generator.valueToCode(block, 'REDIRECT', generator.ORDER_ATOMIC) || '"/setup"';

  asyncFsEnsureLibraries(generator, 'LittleFS');
  asyncFsEnsureServerObject(generator, varName, 'LittleFS');

  return 'if (!' + varName + '.startWiFi(' + timeout + ')) {\n' +
    '  ' + varName + '.startCaptivePortal(' + ssid + ', ' + password + ', ' + redirect + ');\n' +
    '}\n';
};

Arduino.forBlock['async_fs_webserver_start_wifi'] = function(block, generator) {
  const varName = asyncFsGetVarName(block, 'VAR', 'server');
  const timeout = generator.valueToCode(block, 'TIMEOUT', generator.ORDER_ATOMIC) || '10000';

  asyncFsEnsureLibraries(generator, 'LittleFS');
  asyncFsEnsureServerObject(generator, varName, 'LittleFS');

  return varName + '.startWiFi(' + timeout + ');\n';
};

Arduino.forBlock['async_fs_webserver_captive_portal'] = function(block, generator) {
  const varName = asyncFsGetVarName(block, 'VAR', 'server');
  const ssid = generator.valueToCode(block, 'SSID', generator.ORDER_ATOMIC) || '"ESP_AP"';
  const password = generator.valueToCode(block, 'PASSWORD', generator.ORDER_ATOMIC) || '"123456789"';
  const redirect = generator.valueToCode(block, 'REDIRECT', generator.ORDER_ATOMIC) || '"/setup"';

  asyncFsEnsureLibraries(generator, 'LittleFS');
  asyncFsEnsureServerObject(generator, varName, 'LittleFS');

  return varName + '.startCaptivePortal(' + ssid + ', ' + password + ', ' + redirect + ');\n';
};

Arduino.forBlock['async_fs_webserver_start_server'] = function(block, generator) {
  const varName = asyncFsGetVarName(block, 'VAR', 'server');

  asyncFsEnsureLibraries(generator, 'LittleFS');
  asyncFsEnsureServerObject(generator, varName, 'LittleFS');
  generator.addLoopBegin('asyncfs_loop_delay', 'delay(10);');

  return varName + '.init();\n';
};

Arduino.forBlock['async_fs_webserver_start_ws_server'] = function(block, generator) {
  const varName = asyncFsGetVarName(block, 'VAR', 'server');
  const callbackName = asyncFsNextCallbackName(generator, 'ws_event');

  asyncFsEnsureLibraries(generator, 'LittleFS');
  asyncFsEnsureServerObject(generator, varName, 'LittleFS');
  asyncFsAddWebSocketHandler(generator, block, callbackName);
  generator.addLoopBegin('asyncfs_loop_delay', 'delay(10);');

  return varName + '.init(' + callbackName + ');\n';
};

Arduino.forBlock['async_fs_webserver_file_editor'] = function(block, generator) {
  const varName = asyncFsGetVarName(block, 'VAR', 'server');

  asyncFsEnsureLibraries(generator, 'LittleFS');
  asyncFsEnsureServerObject(generator, varName, 'LittleFS');

  return varName + '.enableFsCodeEditor();\n';
};

Arduino.forBlock['async_fs_webserver_set_auth'] = function(block, generator) {
  const varName = asyncFsGetVarName(block, 'VAR', 'server');
  const user = generator.valueToCode(block, 'USER', generator.ORDER_ATOMIC) || '"admin"';
  const password = generator.valueToCode(block, 'PASSWORD', generator.ORDER_ATOMIC) || '"admin"';

  asyncFsEnsureLibraries(generator, 'LittleFS');
  asyncFsEnsureServerObject(generator, varName, 'LittleFS');

  return varName + '.setAuthentication(' + user + ', ' + password + ');\n';
};

Arduino.forBlock['async_fs_webserver_require_auth'] = function(block, generator) {
  const varName = asyncFsGetVarName(block, 'VAR', 'server');
  const requireAuth = block.getFieldValue('REQUIRE') === 'TRUE' ? 'true' : 'false';

  asyncFsEnsureLibraries(generator, 'LittleFS');
  asyncFsEnsureServerObject(generator, varName, 'LittleFS');

  return varName + '.requireAuthentication(' + requireAuth + ');\n';
};

Arduino.forBlock['async_fs_webserver_page_title'] = function(block, generator) {
  const varName = asyncFsGetVarName(block, 'VAR', 'server');
  const title = generator.valueToCode(block, 'TITLE', generator.ORDER_ATOMIC) || '"ESP32 Web Server"';

  asyncFsEnsureLibraries(generator, 'LittleFS');
  asyncFsEnsureServerObject(generator, varName, 'LittleFS');

  return varName + '.setSetupPageTitle(' + title + ');\n';
};

Arduino.forBlock['async_fs_webserver_firmware_version'] = function(block, generator) {
  const varName = asyncFsGetVarName(block, 'VAR', 'server');
  const version = generator.valueToCode(block, 'VERSION', generator.ORDER_ATOMIC) || '"1.0.0"';

  asyncFsEnsureLibraries(generator, 'LittleFS');
  asyncFsEnsureServerObject(generator, varName, 'LittleFS');

  return varName + '.setFirmwareVersion(' + version + ');\n';
};

Arduino.forBlock['async_fs_webserver_option_box'] = function(block, generator) {
  const varName = asyncFsGetVarName(block, 'VAR', 'server');
  const title = generator.valueToCode(block, 'TITLE', generator.ORDER_ATOMIC) || '"Options"';

  asyncFsEnsureLibraries(generator, 'LittleFS');
  asyncFsEnsureServerObject(generator, varName, 'LittleFS');

  return varName + '.addOptionBox(' + title + ');\n';
};

Arduino.forBlock['async_fs_webserver_option_text'] = function(block, generator) {
  const varName = asyncFsGetVarName(block, 'VAR', 'server');
  const label = generator.valueToCode(block, 'LABEL', generator.ORDER_ATOMIC) || '"Text option"';
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '"value"';

  asyncFsEnsureLibraries(generator, 'LittleFS');
  asyncFsEnsureServerObject(generator, varName, 'LittleFS');

  return varName + '.addOption(' + label + ', ' + value + ');\n';
};

Arduino.forBlock['async_fs_webserver_option_number'] = function(block, generator) {
  const varName = asyncFsGetVarName(block, 'VAR', 'server');
  const label = generator.valueToCode(block, 'LABEL', generator.ORDER_ATOMIC) || '"Number option"';
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';
  const minValue = generator.valueToCode(block, 'MIN', generator.ORDER_ATOMIC) || '0';
  const maxValue = generator.valueToCode(block, 'MAX', generator.ORDER_ATOMIC) || '100';
  const step = generator.valueToCode(block, 'STEP', generator.ORDER_ATOMIC) || '1';

  asyncFsEnsureLibraries(generator, 'LittleFS');
  asyncFsEnsureServerObject(generator, varName, 'LittleFS');

  return varName + '.addOption(' + label + ', ' + value + ', ' + minValue + ', ' + maxValue + ', ' + step + ');\n';
};

Arduino.forBlock['async_fs_webserver_option_bool'] = function(block, generator) {
  const varName = asyncFsGetVarName(block, 'VAR', 'server');
  const label = generator.valueToCode(block, 'LABEL', generator.ORDER_ATOMIC) || '"Boolean option"';
  const value = block.getFieldValue('VALUE') === 'TRUE' ? 'true' : 'false';

  asyncFsEnsureLibraries(generator, 'LittleFS');
  asyncFsEnsureServerObject(generator, varName, 'LittleFS');

  return varName + '.addOption(' + label + ', ' + value + ');\n';
};

Arduino.forBlock['async_fs_webserver_option_comment'] = function(block, generator) {
  const varName = asyncFsGetVarName(block, 'VAR', 'server');
  const label = generator.valueToCode(block, 'LABEL', generator.ORDER_ATOMIC) || '"Option"';
  const comment = generator.valueToCode(block, 'COMMENT', generator.ORDER_ATOMIC) || '""';

  asyncFsEnsureLibraries(generator, 'LittleFS');
  asyncFsEnsureServerObject(generator, varName, 'LittleFS');

  return varName + '.addComment(' + label + ', ' + comment + ');\n';
};

Arduino.forBlock['async_fs_webserver_route'] = function(block, generator) {
  const varName = asyncFsGetVarName(block, 'VAR', 'server');
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '"/api/status"';
  const method = block.getFieldValue('METHOD') || 'HTTP_GET';
  const callbackName = asyncFsNextCallbackName(generator, 'route');
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';

  asyncFsEnsureLibraries(generator, 'LittleFS');
  asyncFsEnsureServerObject(generator, varName, 'LittleFS');
  asyncFsAddRequestHelpers(generator);

  const functionDef =
    'void ' + callbackName + '(AsyncWebServerRequest* _asyncfs_request) {\n' +
    handlerCode +
    '}\n';

  generator.addFunction(callbackName, functionDef);

  return varName + '.on(' + path + ', ' + method + ', ' + callbackName + ');\n';
};

Arduino.forBlock['async_fs_webserver_response'] = function(block, generator) {
  const status = generator.valueToCode(block, 'STATUS', generator.ORDER_ATOMIC) || '200';
  const contentType = generator.valueToCode(block, 'CONTENT_TYPE', generator.ORDER_ATOMIC) || '"text/plain"';
  const body = generator.valueToCode(block, 'BODY', generator.ORDER_ATOMIC) || '"OK"';

  asyncFsEnsureLibraries(generator, 'LittleFS');

  return 'if (_asyncfs_request != nullptr) {\n' +
    '  _asyncfs_request->send(' + status + ', ' + contentType + ', ' + body + ');\n' +
    '}\n';
};

Arduino.forBlock['async_fs_webserver_response_ok'] = function(block, generator) {
  asyncFsEnsureLibraries(generator, 'LittleFS');

  return 'if (_asyncfs_request != nullptr) {\n' +
    '  _asyncfs_request->send(200, "text/plain", "OK");\n' +
    '}\n';
};

Arduino.forBlock['async_fs_webserver_request_arg'] = function(block, generator) {
  const name = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || '"value"';
  const source = block.getFieldValue('SOURCE') || 'false';

  asyncFsEnsureLibraries(generator, 'LittleFS');
  asyncFsAddRequestHelpers(generator);

  return ['asyncfs_get_request_param(_asyncfs_request, ' + name + ', ' + source + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['async_fs_webserver_request_has_arg'] = function(block, generator) {
  const name = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || '"value"';
  const source = block.getFieldValue('SOURCE') || 'false';

  asyncFsEnsureLibraries(generator, 'LittleFS');
  asyncFsAddRequestHelpers(generator);

  return ['asyncfs_has_request_param(_asyncfs_request, ' + name + ', ' + source + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['async_fs_webserver_request_path'] = function(block, generator) {
  asyncFsEnsureLibraries(generator, 'LittleFS');

  return ['(_asyncfs_request != nullptr ? _asyncfs_request->url() : String(""))', generator.ORDER_ATOMIC];
};

Arduino.forBlock['async_fs_webserver_ws_broadcast'] = function(block, generator) {
  const varName = asyncFsGetVarName(block, 'VAR', 'server');
  const message = generator.valueToCode(block, 'MESSAGE', generator.ORDER_ATOMIC) || '"hello"';

  asyncFsEnsureLibraries(generator, 'LittleFS');
  asyncFsEnsureServerObject(generator, varName, 'LittleFS');

  return varName + '.wsBroadcast(String(' + message + ').c_str());\n';
};

Arduino.forBlock['async_fs_webserver_ws_reply'] = function(block, generator) {
  const message = generator.valueToCode(block, 'MESSAGE', generator.ORDER_ATOMIC) || '"pong"';

  asyncFsEnsureLibraries(generator, 'LittleFS');

  return 'if (_asyncfs_ws_client != nullptr) {\n' +
    '  _asyncfs_ws_client->text(String(' + message + '));\n' +
    '}\n';
};

Arduino.forBlock['async_fs_webserver_ws_event_is'] = function(block, generator) {
  const eventName = block.getFieldValue('EVENT') || 'WS_EVT_DATA';

  asyncFsEnsureLibraries(generator, 'LittleFS');

  return ['(_asyncfs_ws_type == ' + eventName + ')', generator.ORDER_EQUALITY];
};

Arduino.forBlock['async_fs_webserver_ws_message'] = function(block, generator) {
  asyncFsEnsureLibraries(generator, 'LittleFS');

  return ['_asyncfs_ws_message', generator.ORDER_ATOMIC];
};

Arduino.forBlock['async_fs_webserver_ws_client_id'] = function(block, generator) {
  asyncFsEnsureLibraries(generator, 'LittleFS');

  return ['(_asyncfs_ws_client != nullptr ? _asyncfs_ws_client->id() : 0)', generator.ORDER_CONDITIONAL];
};

Arduino.forBlock['async_fs_webserver_server_ip'] = function(block, generator) {
  const varName = asyncFsGetVarName(block, 'VAR', 'server');

  asyncFsEnsureLibraries(generator, 'LittleFS');
  asyncFsEnsureServerObject(generator, varName, 'LittleFS');

  return [varName + '.getServerIP().toString()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['async_fs_webserver_is_ap_mode'] = function(block, generator) {
  const varName = asyncFsGetVarName(block, 'VAR', 'server');

  asyncFsEnsureLibraries(generator, 'LittleFS');
  asyncFsEnsureServerObject(generator, varName, 'LittleFS');
  return [varName + '.isAccessPointMode()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['async_fs_webserver_start_mdns'] = function(block, generator) {
  const varName = asyncFsGetVarName(block, 'VAR', 'server');

  asyncFsEnsureLibraries(generator, 'LittleFS');
  asyncFsEnsureServerObject(generator, varName, 'LittleFS');

  return 'if (WiFi.status() == WL_CONNECTED) {\n' +
    '  (void)' + varName + '.startMDNSResponder();\n' +
    '}\n';
};

Arduino.forBlock['async_fs_webserver_clear_saved_settings'] = function(block, generator) {
  const varName = asyncFsGetVarName(block, 'VAR', 'server');

  asyncFsEnsureLibraries(generator, 'LittleFS');
  asyncFsEnsureServerObject(generator, varName, 'LittleFS');

  return varName + '.clearConfigFile();\n';
};

Arduino.forBlock['async_fs_webserver_settings_file_name'] = function(block, generator) {
  const varName = asyncFsGetVarName(block, 'VAR', 'server');

  asyncFsEnsureLibraries(generator, 'LittleFS');
  asyncFsEnsureServerObject(generator, varName, 'LittleFS');
  return ['String(' + varName + '.getConfiFileName())', generator.ORDER_FUNCTION_CALL];
};
