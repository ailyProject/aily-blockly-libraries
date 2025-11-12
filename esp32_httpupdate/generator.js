'use strict';

// 确保WiFi库
function ensureWiFiLib(generator) {
  const boardConfig = window['boardConfig'];
  
  if (boardConfig && boardConfig.core && boardConfig.core.indexOf('esp32') > -1) {
    generator.addLibrary('WiFi', '#include <WiFi.h>');
  } else if (boardConfig && boardConfig.core && boardConfig.core.indexOf('renesas_uno') > -1) {
    generator.addLibrary('WiFi', '#include <WiFiS3.h>');
  } else {
    generator.addLibrary('WiFi', '#include <WiFi.h>');
  }
}

// 确保HTTPUpdate库
function ensureHTTPUpdateLib(generator) {
  generator.addLibrary('HTTPUpdate', '#include <HTTPUpdate.h>');
  generator.addLibrary('HTTPClient', '#include <HTTPClient.h>');
}

// // 创建HTTPUpdate对象
// Arduino.forBlock['httpupdate_create'] = function(block, generator) {
//   // 设置变量重命名监听
//   if (!block._httpupdateVarMonitorAttached) {
//     block._httpupdateVarMonitorAttached = true;
//     block._httpupdateVarLastName = block.getFieldValue('VAR') || 'httpUpdater';
//     const varField = block.getField('VAR');
//     if (varField && typeof varField.setValidator === 'function') {
//       varField.setValidator(function(newName) {
//         const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
//         const oldName = block._httpupdateVarLastName;
//         if (workspace && newName && newName !== oldName) {
//           renameVariableInBlockly(block, oldName, newName, 'HTTPUpdate');
//           block._httpupdateVarLastName = newName;
//         }
//         return newName;
//       });
//     }
//   }

//   const varName = block.getFieldValue('VAR') || 'httpUpdater';
  
//   // 添加库和变量
//   ensureWiFiLib(generator);
//   ensureHTTPUpdateLib(generator);
//   registerVariableToBlockly(varName, 'HTTPUpdate');
//   generator.addVariable(varName, 'HTTPUpdate ' + varName + ';');
  
//   return '';
// };

// 设置LED引脚
Arduino.forBlock['httpupdate_set_led_pin'] = function(block, generator) {
  // const varField = block.getField('VAR');
  // const varName = varField ? varField.getText() : 'httpUpdater';
  const pin = generator.valueToCode(block, 'PIN', generator.ORDER_ATOMIC) || 'LED_BUILTIN';
  const ledOn = block.getFieldValue('LED_ON');
  
  ensureHTTPUpdateLib(generator);
  
  return 'httpUpdate.setLedPin(' + pin + ', ' + ledOn + ');\n';
};

// 设置MD5校验
Arduino.forBlock['httpupdate_set_md5'] = function(block, generator) {
  // const varField = block.getField('VAR');
  // const varName = varField ? varField.getText() : 'httpUpdater';
  const md5 = generator.valueToCode(block, 'MD5', generator.ORDER_ATOMIC) || '""';
  
  ensureHTTPUpdateLib(generator);
  
  return 'httpUpdate.setMD5sum(' + md5 + ');\n';
};

// 设置认证信息
Arduino.forBlock['httpupdate_set_auth'] = function(block, generator) {
  // const varField = block.getField('VAR');
  // const varName = varField ? varField.getText() : 'httpUpdater';
  const user = generator.valueToCode(block, 'USER', generator.ORDER_ATOMIC) || '""';
  const password = generator.valueToCode(block, 'PASSWORD', generator.ORDER_ATOMIC) || '""';
  
  ensureHTTPUpdateLib(generator);
  
  return 'httpUpdate.setAuthorization(' + user + ', ' + password + ');\n';
};

// 更新固件
Arduino.forBlock['httpupdate_update'] = function(block, generator) {
  // const varField = block.getField('VAR');
  // const varName = varField ? varField.getText() : 'httpUpdater';
  const url = generator.valueToCode(block, 'URL', generator.ORDER_ATOMIC) || '""';
  
  ensureWiFiLib(generator);
  ensureHTTPUpdateLib(generator);
  
  // 创建网络客户端
  generator.addVariable('httpUpdateClient', 'NetworkClient httpUpdateClient;');
  
  return 't_httpUpdate_return ret = httpUpdate.update(httpUpdateClient, ' + url + ');\n';
};

// 更新SPIFFS
Arduino.forBlock['httpupdate_update_spiffs'] = function(block, generator) {
  // const varField = block.getField('VAR');
  // const varName = varField ? varField.getText() : 'httpUpdater';
  const url = generator.valueToCode(block, 'URL', generator.ORDER_ATOMIC) || '""';
  
  ensureWiFiLib(generator);
  ensureHTTPUpdateLib(generator);
  
  // 创建网络客户端
  generator.addVariable('httpUpdateClient', 'NetworkClient httpUpdateClient;');
  
  return 't_httpUpdate_return ret = httpUpdate.updateSpiffs(httpUpdateClient, ' + url + ');\n';
};

Arduino.forBlock['httpupdate_update_secure'] = function(block, generator) {
  // const varField = block.getField('VAR');
  // const varName = varField ? varField.getText() : 'httpUpdater';
  const url = generator.valueToCode(block, 'URL', generator.ORDER_ATOMIC) || '""';
  const caCert = generator.valueToCode(block, 'CA_CERT', generator.ORDER_ATOMIC) || '""';
  const user = generator.valueToCode(block, 'USER', generator.ORDER_ATOMIC) || '""';
  const password = generator.valueToCode(block, 'PASSWORD', generator.ORDER_ATOMIC) || '""';
  
  ensureWiFiLib(generator);
  ensureHTTPUpdateLib(generator);

  // 创建网络客户端
  let code = '';
  code += 'WiFiClientSecure httpUpdateClient;\n';
  code += 'httpUpdateClient.setCACert(' + caCert + ');\n';
  code += 'httpUpdateClient.setTimeout(12000);\n';
  code += 't_httpUpdate_return ret = httpUpdate.update(httpUpdateClient, ' + url + ', \"\", [](HTTPClient *httpUpdateClient) {httpUpdateClient->setAuthorization(' + user + ', ' + password + ');});\n';
  
  return code;
}

// 更新开始回调
Arduino.forBlock['httpupdate_on_start'] = function(block, generator) {
  // const varField = block.getField('VAR');
  // const varName = varField ? varField.getText() : 'httpUpdater';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = 'httpupdate_start_httpUpdate';
  
  const functionDef = 'void ' + callbackName + '() {\n' + handlerCode + '}\n';
  
  ensureHTTPUpdateLib(generator);
  generator.addFunction(callbackName, functionDef);
  
  let code = 'httpUpdate.onStart(' + callbackName + ');\n';
  generator.addSetupEnd(code, code);
  
  return '';
};

// 更新结束回调
Arduino.forBlock['httpupdate_on_end'] = function(block, generator) {
  // const varField = block.getField('VAR');
  // const varName = varField ? varField.getText() : 'httpUpdater';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = 'httpupdate_end_httpUpdate';
  
  const functionDef = 'void ' + callbackName + '() {\n' + handlerCode + '}\n';
  
  ensureHTTPUpdateLib(generator);
  generator.addFunction(callbackName, functionDef);
  
  let code = 'httpUpdate.onEnd(' + callbackName + ');\n';
  generator.addSetupEnd(code, code);
  
  return '';
};

// 更新进度回调
Arduino.forBlock['httpupdate_on_progress'] = function(block, generator) {
  // const varField = block.getField('VAR');
  // const varName = varField ? varField.getText() : 'httpUpdater';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = 'httpupdate_progress_httpUpdate';
  
  const functionDef = 'void ' + callbackName + '(int cur, int total) {\n' + handlerCode + '}\n';
  
  ensureHTTPUpdateLib(generator);
  generator.addFunction(callbackName, functionDef);
  
  let code = 'httpUpdate.onProgress(' + callbackName + ');\n';
  generator.addSetupEnd(code, code);
  
  return '';
};

// 更新错误回调
Arduino.forBlock['httpupdate_on_error'] = function(block, generator) {
  // const varField = block.getField('VAR');
  // const varName = varField ? varField.getText() : 'httpUpdater';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = 'httpupdate_error_httpUpdate';
  
  const functionDef = 'void ' + callbackName + '(int err) {\n' + handlerCode + '}\n';
  
  ensureHTTPUpdateLib(generator);
  generator.addFunction(callbackName, functionDef);
  
  let code = 'httpUpdate.onError(' + callbackName + ');\n';
  generator.addSetupEnd(code, code);
  
  return '';
};

// 获取最后错误代码
Arduino.forBlock['httpupdate_get_last_error'] = function(block, generator) {
  // const varField = block.getField('VAR');
  // const varName = varField ? varField.getText() : 'httpUpdater';
  
  ensureHTTPUpdateLib(generator);
  
  return ['httpUpdate.getLastError()', generator.ORDER_FUNCTION_CALL];
};

// 获取最后错误信息
Arduino.forBlock['httpupdate_get_last_error_string'] = function(block, generator) {
  // const varField = block.getField('VAR');
  // const varName = varField ? varField.getText() : 'httpUpdater';
  
  ensureHTTPUpdateLib(generator);
  
  return ['httpUpdate.getLastErrorString()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['httpupdate_result'] = function(block, generator) {
  const code = 'ret';

  ensureHTTPUpdateLib(generator);

  return [code, generator.ORDER_ATOMIC];
}

// 获取HTTP响应代码列表
Arduino.forBlock['httpupdate_result_list'] = function(block, generator) {
  const code = block.getFieldValue('CODE');

  ensureHTTPUpdateLib(generator);

  return [code, generator.ORDER_ATOMIC];
}