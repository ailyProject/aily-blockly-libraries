'use strict';

// 确保HTTPClient库被包含
function ensureHTTPClientLib(generator) {
  generator.addLibrary('HTTPClient', '#include <HTTPClient.h>');
}

// 获取变量名的工具函数
function getVariableName(block, fieldName, defaultName) {
  const varField = block.getField(fieldName);
  return varField ? varField.getText() : defaultName;
}

// 创建HTTPClient对象
Arduino.forBlock['esp32_httpclient_create'] = function(block, generator) {
  // 设置变量重命名监听
  if (!block._httpclientVarMonitorAttached) {
    block._httpclientVarMonitorAttached = true;
    block._httpclientVarLastName = block.getFieldValue('VAR') || 'http';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._httpclientVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'HTTPClient');
          block._httpclientVarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'http';
  
  // 添加库和变量声明
  ensureHTTPClientLib(generator);
  registerVariableToBlockly(varName, 'HTTPClient');
  generator.addVariable(varName, 'HTTPClient ' + varName + ';');
  
  return '';
};

// 连接到URL
Arduino.forBlock['esp32_httpclient_begin_url'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'http');
  const url = generator.valueToCode(block, 'URL', generator.ORDER_ATOMIC) || '""';
  
  ensureHTTPClientLib(generator);
  
  return varName + '.begin(' + url + ');\n';
};

// 连接到主机、端口、路径
Arduino.forBlock['esp32_httpclient_begin_host'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'http');
  const host = generator.valueToCode(block, 'HOST', generator.ORDER_ATOMIC) || '""';
  const port = generator.valueToCode(block, 'PORT', generator.ORDER_ATOMIC) || '80';
  const uri = generator.valueToCode(block, 'URI', generator.ORDER_ATOMIC) || '"/"';
  
  ensureHTTPClientLib(generator);
  
  return varName + '.begin(' + host + ', ' + port + ', ' + uri + ');\n';
};

// 安全连接到URL（带CA证书）
Arduino.forBlock['esp32_httpclient_begin_secure'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'http');
  const url = generator.valueToCode(block, 'URL', generator.ORDER_ATOMIC) || '""';
  const caCert = generator.valueToCode(block, 'CA_CERT', generator.ORDER_ATOMIC) || '""';
  
  ensureHTTPClientLib(generator);
  
  return varName + '.begin(' + url + ', ' + caCert + ');\n';
};

// 双向认证连接
Arduino.forBlock['esp32_httpclient_begin_secure_full'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'http');
  const url = generator.valueToCode(block, 'URL', generator.ORDER_ATOMIC) || '""';
  const caCert = generator.valueToCode(block, 'CA_CERT', generator.ORDER_ATOMIC) || '""';
  const clientCert = generator.valueToCode(block, 'CLIENT_CERT', generator.ORDER_ATOMIC) || '""';
  const clientKey = generator.valueToCode(block, 'CLIENT_KEY', generator.ORDER_ATOMIC) || '""';
  
  ensureHTTPClientLib(generator);
  
  return varName + '.begin(' + url + ', ' + caCert + ', ' + clientCert + ', ' + clientKey + ');\n';
};

// 断开连接
Arduino.forBlock['esp32_httpclient_end'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'http');
  
  ensureHTTPClientLib(generator);
  
  return varName + '.end();\n';
};

// 设置用户代理
Arduino.forBlock['esp32_httpclient_set_user_agent'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'http');
  const userAgent = generator.valueToCode(block, 'USER_AGENT', generator.ORDER_ATOMIC) || '""';
  
  ensureHTTPClientLib(generator);
  
  return varName + '.setUserAgent(' + userAgent + ');\n';
};

// 设置基本认证
Arduino.forBlock['esp32_httpclient_set_authorization'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'http');
  const user = generator.valueToCode(block, 'USER', generator.ORDER_ATOMIC) || '""';
  const password = generator.valueToCode(block, 'PASSWORD', generator.ORDER_ATOMIC) || '""';
  
  ensureHTTPClientLib(generator);
  
  return varName + '.setAuthorization(' + user + ', ' + password + ');\n';
};

// 设置认证令牌
Arduino.forBlock['esp32_httpclient_set_authorization_token'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'http');
  const token = generator.valueToCode(block, 'TOKEN', generator.ORDER_ATOMIC) || '""';
  
  ensureHTTPClientLib(generator);
  
  return varName + '.setAuthorization(' + token + ');\n';
};

// 设置超时
Arduino.forBlock['esp32_httpclient_set_timeout'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'http');
  const timeout = generator.valueToCode(block, 'TIMEOUT', generator.ORDER_ATOMIC) || '5000';
  
  ensureHTTPClientLib(generator);
  
  return varName + '.setTimeout(' + timeout + ');\n';
};

// 设置连接超时
Arduino.forBlock['esp32_httpclient_set_connect_timeout'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'http');
  const timeout = generator.valueToCode(block, 'TIMEOUT', generator.ORDER_ATOMIC) || '5000';
  
  ensureHTTPClientLib(generator);
  
  return varName + '.setConnectTimeout(' + timeout + ');\n';
};

// 设置连接复用
Arduino.forBlock['esp32_httpclient_set_reuse'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'http');
  const reuse = block.getFieldValue('REUSE') || 'true';
  
  ensureHTTPClientLib(generator);
  
  return varName + '.setReuse(' + reuse + ');\n';
};

// 设置重定向跟随
Arduino.forBlock['esp32_httpclient_set_follow_redirects'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'http');
  const follow = block.getFieldValue('FOLLOW') || 'HTTPC_DISABLE_FOLLOW_REDIRECTS';
  
  ensureHTTPClientLib(generator);
  
  return varName + '.setFollowRedirects(' + follow + ');\n';
};

// 设置重定向限制
Arduino.forBlock['esp32_httpclient_set_redirect_limit'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'http');
  const limit = generator.valueToCode(block, 'LIMIT', generator.ORDER_ATOMIC) || '10';
  
  ensureHTTPClientLib(generator);
  
  return varName + '.setRedirectLimit(' + limit + ');\n';
};

// 添加请求头
Arduino.forBlock['esp32_httpclient_add_header'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'http');
  const name = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || '""';
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '""';
  
  ensureHTTPClientLib(generator);
  
  return varName + '.addHeader(' + name + ', ' + value + ');\n';
};

// GET请求
Arduino.forBlock['esp32_httpclient_get'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'http');
  
  ensureHTTPClientLib(generator);
  
  const code = 'int httpCode = ' + varName + '.GET();\n';
  return code;
};

// POST请求
Arduino.forBlock['esp32_httpclient_post'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'http');
  const data = generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || '""';
  
  ensureHTTPClientLib(generator);
  
  const code = 'int httpCode = ' + varName + '.POST(' + data + ');\n';
  return code;
};

// PUT请求
Arduino.forBlock['esp32_httpclient_put'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'http');
  const data = generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || '""';
  
  ensureHTTPClientLib(generator);
  
  const code = 'int httpCode = ' + varName + '.PUT(' + data + ');\n';
  return code;
};

// PATCH请求
Arduino.forBlock['esp32_httpclient_patch'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'http');
  const data = generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || '""';
  
  ensureHTTPClientLib(generator);
  
  const code = 'int httpCode = ' + varName + '.PATCH(' + data + ');\n';
  return code;
};

// 获取响应代码
Arduino.forBlock['esp32_httpclient_get_response_code'] = function(block, generator) {
  const code = 'httpCode';
  
  ensureHTTPClientLib(generator);

  return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['esp32_httpclient_code_list'] = function(block, generator) {
  const code = block.getFieldValue('CODE');

  ensureHTTPClientLib(generator);

  return [code, generator.ORDER_ATOMIC];
}

// 获取响应大小
Arduino.forBlock['esp32_httpclient_get_size'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'http');
  
  ensureHTTPClientLib(generator);
  
  const code = varName + '.getSize()';
  return [code, generator.ORDER_FUNCTION_CALL];
};

// 获取响应字符串
Arduino.forBlock['esp32_httpclient_get_string'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'http');
  
  ensureHTTPClientLib(generator);
  
  const code = varName + '.getString()';
  return [code, generator.ORDER_FUNCTION_CALL];
};

// 获取响应头
Arduino.forBlock['esp32_httpclient_get_header'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'http');
  const name = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || '""';
  
  ensureHTTPClientLib(generator);
  
  const code = varName + '.header(' + name + '.c_str())';
  return [code, generator.ORDER_FUNCTION_CALL];
};

// 获取重定向位置
Arduino.forBlock['esp32_httpclient_get_location'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'http');
  
  ensureHTTPClientLib(generator);
  
  const code = varName + '.getLocation()';
  return [code, generator.ORDER_FUNCTION_CALL];
};

// 获取数据流
Arduino.forBlock['esp32_httpclient_get_stream'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'http');
  
  ensureHTTPClientLib(generator);
  
  const code = varName + '.getStream()';
  return [code, generator.ORDER_FUNCTION_CALL];
};

// // 写入到流
// Arduino.forBlock['esp32_httpclient_write_to_stream'] = function(block, generator) {
//   const varName = getVariableName(block, 'VAR', 'http');
//   const stream = generator.valueToCode(block, 'STREAM', generator.ORDER_ATOMIC) || '""';
  
//   ensureHTTPClientLib(generator);
  
//   const code = varName + '.writeToStream(' + stream + ')';
//   return [code, generator.ORDER_FUNCTION_CALL];
// };

// 检查连接状态
Arduino.forBlock['esp32_httpclient_connected'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'http');
  
  ensureHTTPClientLib(generator);
  
  const code = varName + '.connected()';
  return [code, generator.ORDER_FUNCTION_CALL];
};

// 错误代码转字符串
Arduino.forBlock['esp32_httpclient_error_to_string'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'http');

  const errorCode = generator.valueToCode(block, 'ERROR_CODE', generator.ORDER_ATOMIC) || '0';
  
  ensureHTTPClientLib(generator);
  
  const code = varName + '.errorToString(' + errorCode + ')';
  return [code, generator.ORDER_FUNCTION_CALL];
};