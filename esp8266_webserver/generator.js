'use strict';

// 确保ESP8266WebServer库被包含
function esp8266EnsureWebServerLib(generator) {
  generator.addLibrary('ESP8266WebServer', '#include <ESP8266WebServer.h>');
}

// 获取变量名的工具函数
function getVariableName(block, fieldName, defaultName) {
  const varField = block.getField(fieldName);
  return varField ? varField.getText() : defaultName;
}

// 生成安全的回调函数名
function sanitizeCallbackName(varName, path, suffix) {
  const cleanPath = path.replace(/^["']|["']$/g, '')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/_+/g, '_') || 'root';
  return 'handle_' + varName + '_' + cleanPath + '_' + suffix;
}

// 创建ESP8266WebServer对象
Arduino.forBlock['esp8266_webserver_create'] = function(block, generator) {
  // 设置变量重命名监听
  if (!block._webserverVarMonitorAttached) {
    block._webserverVarMonitorAttached = true;
    block._webserverVarLastName = block.getFieldValue('VAR') || 'server';
    // 初次注册变量到 Blockly 系统（仅执行一次）
    registerVariableToBlockly(block._webserverVarLastName, 'ESP8266WebServer');
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._webserverVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'ESP8266WebServer');
          block._webserverVarLastName = newName;
        }
      };
    }
  }

  const varName = block.getFieldValue('VAR') || 'server';
  const port = block.getFieldValue('PORT') || 80;
  
  // 添加库和变量声明
  esp8266EnsureWebServerLib(generator);
  generator.addObject(varName, 'ESP8266WebServer ' + varName + '(' + port + ');');
  
  return '';
};

// 启动Web服务器
Arduino.forBlock['esp8266_webserver_begin'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  
  esp8266EnsureWebServerLib(generator);
  
  return varName + '.begin();\n';
};

// 停止Web服务器
Arduino.forBlock['esp8266_webserver_stop'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  
  esp8266EnsureWebServerLib(generator);
  
  return varName + '.stop();\n';
};

// 处理客户端请求
Arduino.forBlock['esp8266_webserver_handle_client'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  
  esp8266EnsureWebServerLib(generator);
  
  return varName + '.handleClient();\n';
};

// 注册路由处理函数
Arduino.forBlock['esp8266_webserver_on'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const method = block.getFieldValue('METHOD') || 'HTTP_GET';
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '"/"';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  
  // 生成唯一的回调函数名
  const callbackName = sanitizeCallbackName(varName, path, method.toLowerCase());
  
  // 创建回调函数
  const functionDef = 'void ' + callbackName + '() {\n' + handlerCode + '}\n';
  generator.addFunction(callbackName, functionDef);
  
  esp8266EnsureWebServerLib(generator);
  
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
Arduino.forBlock['esp8266_webserver_on_not_found'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  
  const callbackName = 'handle_' + varName + '_notfound';
  
  // 创建回调函数
  const functionDef = 'void ' + callbackName + '() {\n' + handlerCode + '}\n';
  generator.addFunction(callbackName, functionDef);
  
  esp8266EnsureWebServerLib(generator);
  
  const code = varName + '.onNotFound(' + callbackName + ');\n';
  generator.addSetupEnd(code, code);
  
  return '';
};

// 发送响应
Arduino.forBlock['esp8266_webserver_send'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const code = generator.valueToCode(block, 'CODE', generator.ORDER_ATOMIC) || '200';
  const contentType = generator.valueToCode(block, 'TYPE', generator.ORDER_ATOMIC) || '"text/plain"';
  const content = generator.valueToCode(block, 'CONTENT', generator.ORDER_ATOMIC) || '""';
  
  esp8266EnsureWebServerLib(generator);
  
  return varName + '.send(' + code + ', ' + contentType + ', ' + content + ');\n';
};

// 发送简单文本响应
Arduino.forBlock['esp8266_webserver_send_simple'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const content = generator.valueToCode(block, 'CONTENT', generator.ORDER_ATOMIC) || '""';
  
  esp8266EnsureWebServerLib(generator);
  
  return varName + '.send(200, "text/plain", ' + content + ');\n';
};

// 发送HTML响应
Arduino.forBlock['esp8266_webserver_send_html'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const content = generator.valueToCode(block, 'CONTENT', generator.ORDER_ATOMIC) || '""';
  
  esp8266EnsureWebServerLib(generator);
  
  return varName + '.send(200, "text/html", ' + content + ');\n';
};

// 发送JSON响应
Arduino.forBlock['esp8266_webserver_send_json'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const content = generator.valueToCode(block, 'CONTENT', generator.ORDER_ATOMIC) || '""';
  
  esp8266EnsureWebServerLib(generator);
  
  return varName + '.send(200, "application/json", ' + content + ');\n';
};

// 发送错误响应
Arduino.forBlock['esp8266_webserver_send_error'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const code = block.getFieldValue('CODE') || '404';
  const message = generator.valueToCode(block, 'MESSAGE', generator.ORDER_ATOMIC) || '""';
  
  esp8266EnsureWebServerLib(generator);
  
  return varName + '.send(' + code + ', "text/plain", ' + message + ');\n';
};

// 添加响应头
Arduino.forBlock['esp8266_webserver_send_header'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const name = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || '""';
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '""';
  
  esp8266EnsureWebServerLib(generator);
  
  return varName + '.sendHeader(' + name + ', ' + value + ');\n';
};

// 获取请求路径
Arduino.forBlock['esp8266_webserver_uri'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  
  esp8266EnsureWebServerLib(generator);
  
  return [varName + '.uri()', generator.ORDER_ATOMIC];
};

// 获取请求方法
Arduino.forBlock['esp8266_webserver_method'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  
  esp8266EnsureWebServerLib(generator);
  
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
Arduino.forBlock['esp8266_webserver_arg'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const name = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || '""';
  
  esp8266EnsureWebServerLib(generator);
  
  return [varName + '.arg(' + name + ')', generator.ORDER_ATOMIC];
};

// 检查参数是否存在
Arduino.forBlock['esp8266_webserver_has_arg'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const name = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || '""';
  
  esp8266EnsureWebServerLib(generator);
  
  return [varName + '.hasArg(' + name + ')', generator.ORDER_ATOMIC];
};

// 获取参数数量
Arduino.forBlock['esp8266_webserver_args_count'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  
  esp8266EnsureWebServerLib(generator);
  
  return [varName + '.args()', generator.ORDER_ATOMIC];
};

// 通过索引获取参数值
Arduino.forBlock['esp8266_webserver_arg_by_index'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  
  esp8266EnsureWebServerLib(generator);
  
  return [varName + '.arg(' + index + ')', generator.ORDER_ATOMIC];
};

// 通过索引获取参数名称
Arduino.forBlock['esp8266_webserver_arg_name'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  
  esp8266EnsureWebServerLib(generator);
  
  return [varName + '.argName(' + index + ')', generator.ORDER_ATOMIC];
};

// 获取请求头值
Arduino.forBlock['esp8266_webserver_header'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const name = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || '""';
  
  esp8266EnsureWebServerLib(generator);
  
  return [varName + '.header(' + name + ')', generator.ORDER_ATOMIC];
};

// 检查请求头是否存在
Arduino.forBlock['esp8266_webserver_has_header'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const name = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || '""';
  
  esp8266EnsureWebServerLib(generator);
  
  return [varName + '.hasHeader(' + name + ')', generator.ORDER_ATOMIC];
};

// 收集所有请求头


// 获取Host请求头
Arduino.forBlock['esp8266_webserver_host_header'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  
  esp8266EnsureWebServerLib(generator);
  
  return [varName + '.hostHeader()', generator.ORDER_ATOMIC];
};

// 获取路径参数
Arduino.forBlock['esp8266_webserver_path_arg'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  
  esp8266EnsureWebServerLib(generator);
  
  return [varName + '.pathArg(' + index + ')', generator.ORDER_ATOMIC];
};

// 验证用户
Arduino.forBlock['esp8266_webserver_authenticate'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const username = generator.valueToCode(block, 'USERNAME', generator.ORDER_ATOMIC) || '""';
  const password = generator.valueToCode(block, 'PASSWORD', generator.ORDER_ATOMIC) || '""';
  
  esp8266EnsureWebServerLib(generator);
  
  return [varName + '.authenticate(' + username + ', ' + password + ')', generator.ORDER_ATOMIC];
};

// 请求用户认证
Arduino.forBlock['esp8266_webserver_request_authentication'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const method = block.getFieldValue('METHOD') || 'BASIC_AUTH';
  
  esp8266EnsureWebServerLib(generator);
  
  return varName + '.requestAuthentication(' + method + ');\n';
};

// 启用CORS跨域
Arduino.forBlock['esp8266_webserver_enable_cors'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const enable = block.getFieldValue('ENABLE') === 'TRUE' ? 'true' : 'false';
  
  esp8266EnsureWebServerLib(generator);
  
  return varName + '.enableCORS(' + enable + ');\n';
};

// 获取客户端IP
Arduino.forBlock['esp8266_webserver_client_ip'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  
  esp8266EnsureWebServerLib(generator);
  
  return [varName + '.client().remoteIP().toString()', generator.ORDER_ATOMIC];
};

// 获取请求体长度


// 提供静态文件服务
Arduino.forBlock['esp8266_webserver_serve_static'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const uri = generator.valueToCode(block, 'URI', generator.ORDER_ATOMIC) || '"/"';
  const fsType = block.getFieldValue('FS') || 'SPIFFS';
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '"/"';
  
  esp8266EnsureWebServerLib(generator);
  
  if (fsType === 'SPIFFS') {
    generator.addLibrary('SPIFFS', '#include <FS.h>');
  } else if (fsType === 'LittleFS') {
    generator.addLibrary('LittleFS', '#include <LittleFS.h>');
  } else if (fsType === 'SD') {
    generator.addLibrary('FS', '#include <FS.h>');
    generator.addLibrary('SD', '#include <SD.h>');
  }
  
  return varName + '.serveStatic(' + uri + ', ' + fsType + ', ' + path + ');\n';
};
