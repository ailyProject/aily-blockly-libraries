'use strict';

// 确保HTTPClient库被包含
function ensureRPHTTPClientLib(generator) {
  generator.addLibrary('HTTPClient', '#include <HTTPClient.h>');
}

// 获取变量名的工具函数
function getRPHTTPVariableName(block, fieldName, defaultName) {
  const varField = block.getField(fieldName);
  return varField ? varField.getText() : defaultName;
}

// 创建HTTPClient对象
Arduino.forBlock['rp_httpclient_create'] = function(block, generator) {
  // 设置变量重命名监听
  if (!block._rpHttpclientVarMonitorAttached) {
    block._rpHttpclientVarMonitorAttached = true;
    block._rpHttpclientVarLastName = block.getFieldValue('VAR') || 'http';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._rpHttpclientVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'HTTPClient');
          block._rpHttpclientVarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'http';
  
  // 添加库和变量声明
  ensureRPHTTPClientLib(generator);
  registerVariableToBlockly(varName, 'HTTPClient');
  if (isBlockConnected(block)) {
    return 'HTTPClient ' + varName + ';\n';
  } else {
    generator.addObject(varName, 'HTTPClient ' + varName + ';');
  }
  
  return '';
};

// 连接到URL
Arduino.forBlock['rp_httpclient_begin_url'] = function(block, generator) {
  const varName = getRPHTTPVariableName(block, 'VAR', 'http');
  const url = generator.valueToCode(block, 'URL', generator.ORDER_ATOMIC) || '""';
  
  ensureRPHTTPClientLib(generator);
  
  return varName + '.begin(' + url + ');\n';
};

// 连接到主机、端口、路径
Arduino.forBlock['rp_httpclient_begin_host'] = function(block, generator) {
  const varName = getRPHTTPVariableName(block, 'VAR', 'http');
  const host = generator.valueToCode(block, 'HOST', generator.ORDER_ATOMIC) || '""';
  const port = generator.valueToCode(block, 'PORT', generator.ORDER_ATOMIC) || '80';
  const uri = generator.valueToCode(block, 'URI', generator.ORDER_ATOMIC) || '"/"';
  
  ensureRPHTTPClientLib(generator);
  
  return varName + '.begin(' + host + ', ' + port + ', ' + uri + ');\n';
};

// 安全连接到HTTPS URL（跳过证书验证）
Arduino.forBlock['rp_httpclient_begin_https'] = function(block, generator) {
  const varName = getRPHTTPVariableName(block, 'VAR', 'http');
  const url = generator.valueToCode(block, 'URL', generator.ORDER_ATOMIC) || '""';
  
  ensureRPHTTPClientLib(generator);
  
  let code = varName + '.setInsecure();\n';
  code += varName + '.begin(' + url + ');\n';
  return code;
};

// 断开连接
Arduino.forBlock['rp_httpclient_end'] = function(block, generator) {
  const varName = getRPHTTPVariableName(block, 'VAR', 'http');
  
  ensureRPHTTPClientLib(generator);
  
  return varName + '.end();\n';
};

// 设置超时
Arduino.forBlock['rp_httpclient_set_timeout'] = function(block, generator) {
  const varName = getRPHTTPVariableName(block, 'VAR', 'http');
  const timeout = generator.valueToCode(block, 'TIMEOUT', generator.ORDER_ATOMIC) || '5000';
  
  ensureRPHTTPClientLib(generator);
  
  return varName + '.setTimeout(' + timeout + ');\n';
};

// 设置连接复用
Arduino.forBlock['rp_httpclient_set_reuse'] = function(block, generator) {
  const varName = getRPHTTPVariableName(block, 'VAR', 'http');
  const reuse = block.getFieldValue('REUSE') || 'true';
  
  ensureRPHTTPClientLib(generator);
  
  return varName + '.setReuse(' + reuse + ');\n';
};

// 设置用户代理
Arduino.forBlock['rp_httpclient_set_user_agent'] = function(block, generator) {
  const varName = getRPHTTPVariableName(block, 'VAR', 'http');
  const userAgent = generator.valueToCode(block, 'USER_AGENT', generator.ORDER_ATOMIC) || '""';
  
  ensureRPHTTPClientLib(generator);
  
  return varName + '.setUserAgent(' + userAgent + ');\n';
};

// 设置基本认证
Arduino.forBlock['rp_httpclient_set_authorization'] = function(block, generator) {
  const varName = getRPHTTPVariableName(block, 'VAR', 'http');
  const user = generator.valueToCode(block, 'USER', generator.ORDER_ATOMIC) || '""';
  const password = generator.valueToCode(block, 'PASSWORD', generator.ORDER_ATOMIC) || '""';
  
  ensureRPHTTPClientLib(generator);
  
  return varName + '.setAuthorization(' + user + ', ' + password + ');\n';
};

// 设置认证令牌
Arduino.forBlock['rp_httpclient_set_authorization_token'] = function(block, generator) {
  const varName = getRPHTTPVariableName(block, 'VAR', 'http');
  const token = generator.valueToCode(block, 'TOKEN', generator.ORDER_ATOMIC) || '""';
  
  ensureRPHTTPClientLib(generator);
  
  return varName + '.setAuthorization(' + token + ');\n';
};

// 设置重定向跟随
Arduino.forBlock['rp_httpclient_set_follow_redirects'] = function(block, generator) {
  const varName = getRPHTTPVariableName(block, 'VAR', 'http');
  const follow = block.getFieldValue('FOLLOW') || 'HTTPC_DISABLE_FOLLOW_REDIRECTS';
  
  ensureRPHTTPClientLib(generator);
  
  return varName + '.setFollowRedirects(' + follow + ');\n';
};

// 设置重定向限制
Arduino.forBlock['rp_httpclient_set_redirect_limit'] = function(block, generator) {
  const varName = getRPHTTPVariableName(block, 'VAR', 'http');
  const limit = generator.valueToCode(block, 'LIMIT', generator.ORDER_ATOMIC) || '10';
  
  ensureRPHTTPClientLib(generator);
  
  return varName + '.setRedirectLimit(' + limit + ');\n';
};

// 添加请求头
Arduino.forBlock['rp_httpclient_add_header'] = function(block, generator) {
  const varName = getRPHTTPVariableName(block, 'VAR', 'http');
  const name = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || '""';
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '""';
  
  ensureRPHTTPClientLib(generator);
  
  return varName + '.addHeader(' + name + ', ' + value + ');\n';
};

// GET请求
Arduino.forBlock['rp_httpclient_get'] = function(block, generator) {
  const varName = getRPHTTPVariableName(block, 'VAR', 'http');
  
  ensureRPHTTPClientLib(generator);
  
  return 'int httpCode = ' + varName + '.GET();\n';
};

// POST请求
Arduino.forBlock['rp_httpclient_post'] = function(block, generator) {
  const varName = getRPHTTPVariableName(block, 'VAR', 'http');
  const data = generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || '""';
  
  ensureRPHTTPClientLib(generator);
  
  return 'int httpCode = ' + varName + '.POST(' + data + ');\n';
};

// PUT请求
Arduino.forBlock['rp_httpclient_put'] = function(block, generator) {
  const varName = getRPHTTPVariableName(block, 'VAR', 'http');
  const data = generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || '""';
  
  ensureRPHTTPClientLib(generator);
  
  return 'int httpCode = ' + varName + '.PUT(' + data + ');\n';
};

// PATCH请求
Arduino.forBlock['rp_httpclient_patch'] = function(block, generator) {
  const varName = getRPHTTPVariableName(block, 'VAR', 'http');
  const data = generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || '""';
  
  ensureRPHTTPClientLib(generator);
  
  return 'int httpCode = ' + varName + '.PATCH(' + data + ');\n';
};

// DELETE请求
Arduino.forBlock['rp_httpclient_delete'] = function(block, generator) {
  const varName = getRPHTTPVariableName(block, 'VAR', 'http');
  
  ensureRPHTTPClientLib(generator);
  
  return 'int httpCode = ' + varName + '.DELETE();\n';
};

// 获取响应代码
Arduino.forBlock['rp_httpclient_get_response_code'] = function(block, generator) {
  ensureRPHTTPClientLib(generator);
  return ['httpCode', generator.ORDER_ATOMIC];
};

// HTTP状态码列表
Arduino.forBlock['rp_httpclient_code_list'] = function(block, generator) {
  const code = block.getFieldValue('CODE');
  ensureRPHTTPClientLib(generator);
  return [code, generator.ORDER_ATOMIC];
};

// 获取响应大小
Arduino.forBlock['rp_httpclient_get_size'] = function(block, generator) {
  const varName = getRPHTTPVariableName(block, 'VAR', 'http');
  
  ensureRPHTTPClientLib(generator);
  
  return [varName + '.getSize()', generator.ORDER_FUNCTION_CALL];
};

// 获取响应字符串
Arduino.forBlock['rp_httpclient_get_string'] = function(block, generator) {
  const varName = getRPHTTPVariableName(block, 'VAR', 'http');
  
  ensureRPHTTPClientLib(generator);
  
  return [varName + '.getString()', generator.ORDER_FUNCTION_CALL];
};

// 获取响应头
Arduino.forBlock['rp_httpclient_get_header'] = function(block, generator) {
  const varName = getRPHTTPVariableName(block, 'VAR', 'http');
  const name = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || '""';
  
  ensureRPHTTPClientLib(generator);
  
  return [varName + '.header(' + name + '.c_str())', generator.ORDER_FUNCTION_CALL];
};

// 获取重定向位置
Arduino.forBlock['rp_httpclient_get_location'] = function(block, generator) {
  const varName = getRPHTTPVariableName(block, 'VAR', 'http');
  
  ensureRPHTTPClientLib(generator);
  
  return [varName + '.getLocation()', generator.ORDER_FUNCTION_CALL];
};

// 检查连接状态
Arduino.forBlock['rp_httpclient_connected'] = function(block, generator) {
  const varName = getRPHTTPVariableName(block, 'VAR', 'http');
  
  ensureRPHTTPClientLib(generator);
  
  return [varName + '.connected()', generator.ORDER_FUNCTION_CALL];
};

// 错误代码转字符串
Arduino.forBlock['rp_httpclient_error_to_string'] = function(block, generator) {
  const varName = getRPHTTPVariableName(block, 'VAR', 'http');
  const errorCode = generator.valueToCode(block, 'ERROR_CODE', generator.ORDER_ATOMIC) || '0';
  
  ensureRPHTTPClientLib(generator);
  
  return [varName + '.errorToString(' + errorCode + ')', generator.ORDER_FUNCTION_CALL];
};

// 快速GET请求
Arduino.forBlock['rp_httpclient_quick_get'] = function(block, generator) {
  const url = generator.valueToCode(block, 'URL', generator.ORDER_ATOMIC) || '""';
  
  ensureRPHTTPClientLib(generator);
  
  // 定义快速GET辅助函数
  let functionDef = '';
  functionDef += 'String httpQuickGet(const char* url) {\n';
  functionDef += '  HTTPClient http;\n';
  functionDef += '  String result = "";\n';
  functionDef += '  if (http.begin(url)) {\n';
  functionDef += '    int httpCode = http.GET();\n';
  functionDef += '    if (httpCode > 0) {\n';
  functionDef += '      if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_MOVED_PERMANENTLY) {\n';
  functionDef += '        result = http.getString();\n';
  functionDef += '      }\n';
  functionDef += '    } else {\n';
  functionDef += '      Serial.printf("[HTTP] GET failed, error: %s\\n", http.errorToString(httpCode).c_str());\n';
  functionDef += '    }\n';
  functionDef += '    http.end();\n';
  functionDef += '  }\n';
  functionDef += '  return result;\n';
  functionDef += '}\n';
  
  generator.addFunction('httpQuickGet', functionDef, true);
  
  return ['httpQuickGet(' + url + ')', generator.ORDER_FUNCTION_CALL];
};

// 快速POST请求
Arduino.forBlock['rp_httpclient_quick_post'] = function(block, generator) {
  const url = generator.valueToCode(block, 'URL', generator.ORDER_ATOMIC) || '""';
  const data = generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || '""';
  
  ensureRPHTTPClientLib(generator);
  
  // 定义快速POST辅助函数
  let functionDef = '';
  functionDef += 'String httpQuickPost(const char* url, const char* data) {\n';
  functionDef += '  HTTPClient http;\n';
  functionDef += '  String result = "";\n';
  functionDef += '  if (http.begin(url)) {\n';
  functionDef += '    int httpCode = http.POST(data);\n';
  functionDef += '    if (httpCode > 0) {\n';
  functionDef += '      if (httpCode == HTTP_CODE_OK) {\n';
  functionDef += '        result = http.getString();\n';
  functionDef += '      }\n';
  functionDef += '    } else {\n';
  functionDef += '      Serial.printf("[HTTP] POST failed, error: %s\\n", http.errorToString(httpCode).c_str());\n';
  functionDef += '    }\n';
  functionDef += '    http.end();\n';
  functionDef += '  }\n';
  functionDef += '  return result;\n';
  functionDef += '}\n';
  
  generator.addFunction('httpQuickPost', functionDef, true);
  
  return ['httpQuickPost(' + url + ', ' + data + ')', generator.ORDER_FUNCTION_CALL];
};

// 快速POST JSON请求
Arduino.forBlock['rp_httpclient_quick_post_json'] = function(block, generator) {
  const url = generator.valueToCode(block, 'URL', generator.ORDER_ATOMIC) || '""';
  const json = generator.valueToCode(block, 'JSON', generator.ORDER_ATOMIC) || '"{}"';
  
  ensureRPHTTPClientLib(generator);
  
  // 定义快速POST JSON辅助函数
  let functionDef = '';
  functionDef += 'String httpQuickPostJson(const char* url, const char* jsonData) {\n';
  functionDef += '  HTTPClient http;\n';
  functionDef += '  String result = "";\n';
  functionDef += '  if (http.begin(url)) {\n';
  functionDef += '    http.addHeader("Content-Type", "application/json");\n';
  functionDef += '    int httpCode = http.POST(jsonData);\n';
  functionDef += '    if (httpCode > 0) {\n';
  functionDef += '      if (httpCode == HTTP_CODE_OK) {\n';
  functionDef += '        result = http.getString();\n';
  functionDef += '      }\n';
  functionDef += '    } else {\n';
  functionDef += '      Serial.printf("[HTTP] POST JSON failed, error: %s\\n", http.errorToString(httpCode).c_str());\n';
  functionDef += '    }\n';
  functionDef += '    http.end();\n';
  functionDef += '  }\n';
  functionDef += '  return result;\n';
  functionDef += '}\n';
  
  generator.addFunction('httpQuickPostJson', functionDef, true);
  
  return ['httpQuickPostJson(' + url + ', ' + json + ')', generator.ORDER_FUNCTION_CALL];
};
