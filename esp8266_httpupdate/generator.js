'use strict';

// 确保WiFi库
function esp8266HttpUpdateEnsureWiFiLib(generator) {
  const boardConfig = window['boardConfig'];
  
  if (boardConfig && boardConfig.core && true) {
    generator.addLibrary('WiFi', '#include <ESP8266WiFi.h>');
  } else if (boardConfig && boardConfig.core && boardConfig.core.indexOf('renesas_uno') > -1) {
    generator.addLibrary('WiFi', '#include <WiFiS3.h>');
  } else {
    generator.addLibrary('WiFi', '#include <ESP8266WiFi.h>');
  }
}

// 确保HTTPUpdate库
function esp8266EnsureHTTPUpdateLib(generator) {
  generator.addLibrary('HTTPUpdate', '#include <ESP8266httpUpdate.h>');
  generator.addLibrary('HTTPClient', '#include <ESP8266HTTPClient.h>');
}

// 设置LED引脚
Arduino.forBlock['esp8266_httpupdate_set_led_pin'] = function(block, generator) {
  const pin = generator.valueToCode(block, 'PIN', generator.ORDER_ATOMIC) || 'LED_BUILTIN';
  const ledOn = block.getFieldValue('LED_ON');
  
  esp8266EnsureHTTPUpdateLib(generator);
  
  return 'ESPhttpUpdate.setLedPin(' + pin + ', ' + ledOn + ');\n';
};

// 设置MD5校验
Arduino.forBlock['esp8266_httpupdate_set_md5'] = function(block, generator) {
  const md5 = generator.valueToCode(block, 'MD5', generator.ORDER_ATOMIC) || '""';
  
  esp8266EnsureHTTPUpdateLib(generator);
  
  return 'ESPhttpUpdate.setMD5sum(' + md5 + ');\n';
};

// 设置认证信息
Arduino.forBlock['esp8266_httpupdate_set_auth'] = function(block, generator) {
  const user = generator.valueToCode(block, 'USER', generator.ORDER_ATOMIC) || '""';
  const password = generator.valueToCode(block, 'PASSWORD', generator.ORDER_ATOMIC) || '""';
  
  esp8266EnsureHTTPUpdateLib(generator);
  
  return 'ESPhttpUpdate.setAuthorization(' + user + ', ' + password + ');\n';
};

// 更新固件
Arduino.forBlock['esp8266_httpupdate_update'] = function(block, generator) {
  const url = generator.valueToCode(block, 'URL', generator.ORDER_ATOMIC) || '""';
  esp8266HttpUpdateEnsureWiFiLib(generator);
  esp8266EnsureHTTPUpdateLib(generator);
  generator.addObject('esp8266_httpupdate_client', 'WiFiClient esp8266HttpUpdateClient;');
  generator.addVariable('esp8266_httpupdate_result', 't_httpUpdate_return ret = HTTP_UPDATE_NO_UPDATES;');
  return 'ret = ESPhttpUpdate.update(esp8266HttpUpdateClient, ' + url + ');\n';
};

// 更新SPIFFS
Arduino.forBlock['esp8266_httpupdate_update_spiffs'] = function(block, generator) {
  const url = generator.valueToCode(block, 'URL', generator.ORDER_ATOMIC) || '""';
  esp8266HttpUpdateEnsureWiFiLib(generator);
  esp8266EnsureHTTPUpdateLib(generator);
  generator.addObject('esp8266_httpupdate_client', 'WiFiClient esp8266HttpUpdateClient;');
  generator.addVariable('esp8266_httpupdate_result', 't_httpUpdate_return ret = HTTP_UPDATE_NO_UPDATES;');
  return 'ret = ESPhttpUpdate.updateFS(esp8266HttpUpdateClient, ' + url + ');\n';
};

// 更新开始回调
Arduino.forBlock['esp8266_httpupdate_on_start'] = function(block, generator) {
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = 'httpupdate_start_httpUpdate';
  
  const functionDef = 'void ' + callbackName + '() {\n' + handlerCode + '}\n';
  
  esp8266EnsureHTTPUpdateLib(generator);
  generator.addFunction(callbackName, functionDef);
  
  let code = 'ESPhttpUpdate.onStart(' + callbackName + ');\n';
  generator.addSetupEnd(code, code);
  
  return '';
};

// 更新结束回调
Arduino.forBlock['esp8266_httpupdate_on_end'] = function(block, generator) {
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = 'httpupdate_end_httpUpdate';
  
  const functionDef = 'void ' + callbackName + '() {\n' + handlerCode + '}\n';
  
  esp8266EnsureHTTPUpdateLib(generator);
  generator.addFunction(callbackName, functionDef);
  
  let code = 'ESPhttpUpdate.onEnd(' + callbackName + ');\n';
  generator.addSetupEnd(code, code);
  
  return '';
};

// 更新进度回调
Arduino.forBlock['esp8266_httpupdate_on_progress'] = function(block, generator) {
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = 'httpupdate_progress_httpUpdate';
  
  const functionDef = 'void ' + callbackName + '(int cur, int total) {\n' + handlerCode + '}\n';
  
  esp8266EnsureHTTPUpdateLib(generator);
  generator.addFunction(callbackName, functionDef);
  
  let code = 'ESPhttpUpdate.onProgress(' + callbackName + ');\n';
  generator.addSetupEnd(code, code);
  
  return '';
};

// 更新错误回调
Arduino.forBlock['esp8266_httpupdate_on_error'] = function(block, generator) {
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = 'httpupdate_error_httpUpdate';
  
  const functionDef = 'void ' + callbackName + '(int err) {\n' + handlerCode + '}\n';
  
  esp8266EnsureHTTPUpdateLib(generator);
  generator.addFunction(callbackName, functionDef);
  
  let code = 'ESPhttpUpdate.onError(' + callbackName + ');\n';
  generator.addSetupEnd(code, code);
  
  return '';
};

// 获取最后错误代码
Arduino.forBlock['esp8266_httpupdate_get_last_error'] = function(block, generator) {
  esp8266EnsureHTTPUpdateLib(generator);
  
  return ['ESPhttpUpdate.getLastError()', generator.ORDER_FUNCTION_CALL];
};

// 获取最后错误信息
Arduino.forBlock['esp8266_httpupdate_get_last_error_string'] = function(block, generator) {
  esp8266EnsureHTTPUpdateLib(generator);
  
  return ['ESPhttpUpdate.getLastErrorString()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp8266_httpupdate_result'] = function(block, generator) {
  const code = 'ret';

  esp8266EnsureHTTPUpdateLib(generator);

  return [code, generator.ORDER_ATOMIC];
}

// 获取HTTP响应代码列表
Arduino.forBlock['esp8266_httpupdate_result_list'] = function(block, generator) {
  const code = block.getFieldValue('CODE');

  esp8266EnsureHTTPUpdateLib(generator);

  return [code, generator.ORDER_ATOMIC];
}

Arduino.forBlock['esp8266_httpupdate_process_current'] = function(block, generator) {
  const code = 'cur';
  return [code, generator.ORDER_ATOMIC];
}

Arduino.forBlock['esp8266_httpupdate_process_total'] = function(block, generator) {
  const code = 'total';
  return [code, generator.ORDER_ATOMIC];
}