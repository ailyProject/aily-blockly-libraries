'use strict';

// 确保WebServer库被包含
function ensureWebServerLib(generator) {
  generator.addLibrary('WebServer', '#include <WebServer.h>');
}

// 获取变量名的工具函数
function getVariableName(block, fieldName, defaultName) {
  const varField = block.getField(fieldName);
  return varField ? varField.getText() : defaultName;
}

// 创建WebServer对象
Arduino.forBlock['esp32_webserver_create'] = function(block, generator) {
  // 设置变量重命名监听
  if (!block._webserverVarMonitorAttached) {
    block._webserverVarMonitorAttached = true;
    block._webserverVarLastName = block.getFieldValue('VAR') || 'server';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._webserverVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'WebServer');
          block._webserverVarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'server';
  const port = block.getFieldValue('PORT') || 80;
  
  // 添加库和变量声明
  ensureWebServerLib(generator);
  registerVariableToBlockly(varName, 'WebServer');
  generator.addObject(varName, 'WebServer ' + varName + '(' + port + ');');
  
  return '';
};

// 启动Web服务器
Arduino.forBlock['esp32_webserver_begin'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  
  ensureWebServerLib(generator);
  
  return varName + '.begin();\n';
};

// 停止Web服务器
Arduino.forBlock['esp32_webserver_stop'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  
  ensureWebServerLib(generator);
  
  return varName + '.stop();\n';
};

// 处理客户端请求
Arduino.forBlock['esp32_webserver_handle_client'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  
  ensureWebServerLib(generator);
  
  return varName + '.handleClient();\n';
};

// 注册路由处理函数
Arduino.forBlock['esp32_webserver_on'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const method = block.getFieldValue('METHOD') || 'HTTP_GET';
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '"/"';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  
  // 生成唯一的回调函数名
  const safePath = path.replace(/[^a-zA-Z0-9]/g, '_').replace(/__+/g, '_');
  const callbackName = 'webserver_handler_' + safePath + '_' + method.toLowerCase();
  
  // 创建回调函数
  const functionDef = 'void ' + callbackName + '() {\n' + handlerCode + '}\n';
  generator.addFunction(callbackName, functionDef);
  
  ensureWebServerLib(generator);
  
  // 根据方法类型生成代码
  let code;
  if (method === 'HTTP_ANY') {
    code = varName + '.on(' + path + ', ' + callbackName + ');\n';
  } else {
    code = varName + '.on(' + path + ', ' + method + ', ' + callbackName + ');\n';
  }
  
  generator.addSetupEnd(code, code);
  return '';
};

// 注册404处理函数
Arduino.forBlock['esp32_webserver_on_not_found'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  
  const callbackName = 'webserver_notfound_handler';
  
  // 创建回调函数
  const functionDef = 'void ' + callbackName + '() {\n' + handlerCode + '}\n';
  generator.addFunction(callbackName, functionDef);
  
  ensureWebServerLib(generator);
  
  const code = varName + '.onNotFound(' + callbackName + ');\n';
  generator.addSetupEnd(code, code);
  
  return '';
};

// 发送响应
Arduino.forBlock['esp32_webserver_send'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const code = generator.valueToCode(block, 'CODE', generator.ORDER_ATOMIC) || '200';
  const contentType = generator.valueToCode(block, 'TYPE', generator.ORDER_ATOMIC) || '"text/plain"';
  const content = generator.valueToCode(block, 'CONTENT', generator.ORDER_ATOMIC) || '""';
  
  ensureWebServerLib(generator);
  
  return varName + '.send(' + code + ', ' + contentType + ', ' + content + ');\n';
};

// 发送简单文本响应
Arduino.forBlock['esp32_webserver_send_simple'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const content = generator.valueToCode(block, 'CONTENT', generator.ORDER_ATOMIC) || '""';
  
  ensureWebServerLib(generator);
  
  return varName + '.send(200, "text/plain", ' + content + ');\n';
};

// 发送HTML响应
Arduino.forBlock['esp32_webserver_send_html'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const content = generator.valueToCode(block, 'CONTENT', generator.ORDER_ATOMIC) || '""';
  
  ensureWebServerLib(generator);
  
  return varName + '.send(200, "text/html", ' + content + ');\n';
};

// 发送JSON响应
Arduino.forBlock['esp32_webserver_send_json'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const content = generator.valueToCode(block, 'CONTENT', generator.ORDER_ATOMIC) || '""';
  
  ensureWebServerLib(generator);
  
  return varName + '.send(200, "application/json", ' + content + ');\n';
};

// 发送错误响应
Arduino.forBlock['esp32_webserver_send_error'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const code = block.getFieldValue('CODE') || '404';
  const message = generator.valueToCode(block, 'MESSAGE', generator.ORDER_ATOMIC) || '""';
  
  ensureWebServerLib(generator);
  
  return varName + '.send(' + code + ', "text/plain", ' + message + ');\n';
};

// 添加响应头
Arduino.forBlock['esp32_webserver_send_header'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const name = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || '""';
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '""';
  
  ensureWebServerLib(generator);
  
  return varName + '.sendHeader(' + name + ', ' + value + ');\n';
};

// 获取请求路径
Arduino.forBlock['esp32_webserver_uri'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  
  ensureWebServerLib(generator);
  
  return [varName + '.uri()', generator.ORDER_ATOMIC];
};

// 获取请求方法
Arduino.forBlock['esp32_webserver_method'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  
  ensureWebServerLib(generator);
  
  // 添加方法转换辅助函数
  const methodToStringFunc = `String httpMethodToString(HTTPMethod method) {
  switch(method) {
    case HTTP_GET: return "GET";
    case HTTP_POST: return "POST";
    case HTTP_PUT: return "PUT";
    case HTTP_DELETE: return "DELETE";
    case HTTP_PATCH: return "PATCH";
    case HTTP_OPTIONS: return "OPTIONS";
    case HTTP_HEAD: return "HEAD";
    default: return "UNKNOWN";
  }
}
`;
  generator.addFunction('httpMethodToString', methodToStringFunc);
  
  return ['httpMethodToString(' + varName + '.method())', generator.ORDER_ATOMIC];
};

// 获取参数值
Arduino.forBlock['esp32_webserver_arg'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const name = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || '""';
  
  ensureWebServerLib(generator);
  
  return [varName + '.arg(' + name + ')', generator.ORDER_ATOMIC];
};

// 检查参数是否存在
Arduino.forBlock['esp32_webserver_has_arg'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const name = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || '""';
  
  ensureWebServerLib(generator);
  
  return [varName + '.hasArg(' + name + ')', generator.ORDER_ATOMIC];
};

// 获取参数数量
Arduino.forBlock['esp32_webserver_args_count'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  
  ensureWebServerLib(generator);
  
  return [varName + '.args()', generator.ORDER_ATOMIC];
};

// 通过索引获取参数值
Arduino.forBlock['esp32_webserver_arg_by_index'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  
  ensureWebServerLib(generator);
  
  return [varName + '.arg(' + index + ')', generator.ORDER_ATOMIC];
};

// 通过索引获取参数名称
Arduino.forBlock['esp32_webserver_arg_name'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  
  ensureWebServerLib(generator);
  
  return [varName + '.argName(' + index + ')', generator.ORDER_ATOMIC];
};

// 获取请求头值
Arduino.forBlock['esp32_webserver_header'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const name = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || '""';
  
  ensureWebServerLib(generator);
  
  return [varName + '.header(' + name + ')', generator.ORDER_ATOMIC];
};

// 检查请求头是否存在
Arduino.forBlock['esp32_webserver_has_header'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const name = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || '""';
  
  ensureWebServerLib(generator);
  
  return [varName + '.hasHeader(' + name + ')', generator.ORDER_ATOMIC];
};

// 收集所有请求头
Arduino.forBlock['esp32_webserver_collect_headers'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  
  ensureWebServerLib(generator);
  
  return varName + '.collectAllHeaders();\n';
};

// 获取Host请求头
Arduino.forBlock['esp32_webserver_host_header'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  
  ensureWebServerLib(generator);
  
  return [varName + '.hostHeader()', generator.ORDER_ATOMIC];
};

// 获取路径参数
Arduino.forBlock['esp32_webserver_path_arg'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  
  ensureWebServerLib(generator);
  
  return [varName + '.pathArg(' + index + ')', generator.ORDER_ATOMIC];
};

// 验证用户
Arduino.forBlock['esp32_webserver_authenticate'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const username = generator.valueToCode(block, 'USERNAME', generator.ORDER_ATOMIC) || '""';
  const password = generator.valueToCode(block, 'PASSWORD', generator.ORDER_ATOMIC) || '""';
  
  ensureWebServerLib(generator);
  
  return [varName + '.authenticate(' + username + ', ' + password + ')', generator.ORDER_ATOMIC];
};

// 请求用户认证
Arduino.forBlock['esp32_webserver_request_authentication'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const method = block.getFieldValue('METHOD') || 'BASIC_AUTH';
  
  ensureWebServerLib(generator);
  
  return varName + '.requestAuthentication(' + method + ');\n';
};

// 启用CORS跨域
Arduino.forBlock['esp32_webserver_enable_cors'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const enable = block.getFieldValue('ENABLE') === 'TRUE' ? 'true' : 'false';
  
  ensureWebServerLib(generator);
  
  return varName + '.enableCORS(' + enable + ');\n';
};

// 获取客户端IP
Arduino.forBlock['esp32_webserver_client_ip'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  
  ensureWebServerLib(generator);
  
  return [varName + '.client().remoteIP().toString()', generator.ORDER_ATOMIC];
};

// 获取请求体长度
Arduino.forBlock['esp32_webserver_content_length'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  
  ensureWebServerLib(generator);
  
  return [varName + '.clientContentLength()', generator.ORDER_ATOMIC];
};
