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

// 生成唯一的回调函数名
function generateCallbackName(varName, path, method) {
  // 清理路径字符，生成合法的C函数名
  let cleanPath = path.replace(/^["']|["']$/g, ''); // 移除引号
  cleanPath = cleanPath.replace(/[^a-zA-Z0-9]/g, '_'); // 替换非法字符
  if (cleanPath.startsWith('_')) {
    cleanPath = cleanPath.substring(1);
  }
  return 'handle_' + varName + '_' + cleanPath + '_' + method.toLowerCase().replace('http_', '');
}

// 创建WebServer对象
Arduino.forBlock['rp_webserver_create'] = function(block, generator) {
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

// 启动服务器
Arduino.forBlock['rp_webserver_begin'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  
  ensureWebServerLib(generator);
  
  return varName + '.begin();\n';
};

// 处理客户端请求
Arduino.forBlock['rp_webserver_handle_client'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  
  ensureWebServerLib(generator);
  
  return varName + '.handleClient();\n';
};

// 注册路由处理函数
Arduino.forBlock['rp_webserver_on'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const method = block.getFieldValue('METHOD') || 'HTTP_ANY';
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '"/"';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  
  ensureWebServerLib(generator);
  
  const callbackName = generateCallbackName(varName, path, method);
  
  // 生成回调函数
  const functionDef = 'void ' + callbackName + '() {\n' + handlerCode + '}\n';
  generator.addFunction(callbackName, functionDef);
  
  // 根据方法类型生成不同的注册代码
  let code;
  if (method === 'HTTP_ANY') {
    code = varName + '.on(' + path + ', ' + callbackName + ');\n';
  } else {
    code = varName + '.on(' + path + ', ' + method + ', ' + callbackName + ');\n';
  }
  
  generator.addSetupEnd(callbackName, code);
  
  return '';
};

// 处理404
Arduino.forBlock['rp_webserver_on_not_found'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  
  ensureWebServerLib(generator);
  
  const callbackName = 'handle_' + varName + '_not_found';
  
  // 生成回调函数
  const functionDef = 'void ' + callbackName + '() {\n' + handlerCode + '}\n';
  generator.addFunction(callbackName, functionDef);
  
  const code = varName + '.onNotFound(' + callbackName + ');\n';
  generator.addSetupEnd(callbackName, code);
  
  return '';
};

// 发送响应
Arduino.forBlock['rp_webserver_send'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const code_num = generator.valueToCode(block, 'CODE', generator.ORDER_ATOMIC) || '200';
  const contentType = block.getFieldValue('CONTENT_TYPE') || 'text/plain';
  const content = generator.valueToCode(block, 'CONTENT', generator.ORDER_ATOMIC) || '""';
  
  ensureWebServerLib(generator);
  
  return varName + '.send(' + code_num + ', "' + contentType + '", ' + content + ');\n';
};

// 发送自定义类型响应
Arduino.forBlock['rp_webserver_send_custom_type'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const code_num = generator.valueToCode(block, 'CODE', generator.ORDER_ATOMIC) || '200';
  const contentType = generator.valueToCode(block, 'CONTENT_TYPE', generator.ORDER_ATOMIC) || '"text/plain"';
  const content = generator.valueToCode(block, 'CONTENT', generator.ORDER_ATOMIC) || '""';
  
  ensureWebServerLib(generator);
  
  return varName + '.send(' + code_num + ', ' + contentType + ', ' + content + ');\n';
};

// 发送响应头
Arduino.forBlock['rp_webserver_send_header'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const name = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || '""';
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '""';
  
  ensureWebServerLib(generator);
  
  return varName + '.sendHeader(' + name + ', ' + value + ');\n';
};

// 获取请求URI
Arduino.forBlock['rp_webserver_uri'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  
  ensureWebServerLib(generator);
  
  return [varName + '.uri()', generator.ORDER_ATOMIC];
};

// 获取请求方法（返回字符串）
Arduino.forBlock['rp_webserver_method'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  
  ensureWebServerLib(generator);
  
  // 生成辅助函数将HTTPMethod转换为字符串
  const helperFunc = `String httpMethodToString(HTTPMethod method) {
  switch(method) {
    case HTTP_GET: return "GET";
    case HTTP_POST: return "POST";
    case HTTP_PUT: return "PUT";
    case HTTP_DELETE: return "DELETE";
    case HTTP_PATCH: return "PATCH";
    case HTTP_OPTIONS: return "OPTIONS";
    default: return "UNKNOWN";
  }
}`;
  generator.addFunction('httpMethodToString', helperFunc);
  
  return ['httpMethodToString(' + varName + '.method())', generator.ORDER_ATOMIC];
};

// 判断请求方法
Arduino.forBlock['rp_webserver_method_is'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const method = block.getFieldValue('METHOD') || 'HTTP_GET';
  
  ensureWebServerLib(generator);
  
  return ['(' + varName + '.method() == ' + method + ')', generator.ORDER_ATOMIC];
};

// 根据名称获取参数值
Arduino.forBlock['rp_webserver_arg_by_name'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const name = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || '""';
  
  ensureWebServerLib(generator);
  
  return [varName + '.arg(' + name + ')', generator.ORDER_ATOMIC];
};

// 根据索引获取参数值
Arduino.forBlock['rp_webserver_arg_by_index'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  
  ensureWebServerLib(generator);
  
  return [varName + '.arg(' + index + ')', generator.ORDER_ATOMIC];
};

// 获取参数名称
Arduino.forBlock['rp_webserver_arg_name'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  
  ensureWebServerLib(generator);
  
  return [varName + '.argName(' + index + ')', generator.ORDER_ATOMIC];
};

// 获取参数数量
Arduino.forBlock['rp_webserver_args_count'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  
  ensureWebServerLib(generator);
  
  return [varName + '.args()', generator.ORDER_ATOMIC];
};

// 检查是否存在参数
Arduino.forBlock['rp_webserver_has_arg'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const name = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || '""';
  
  ensureWebServerLib(generator);
  
  return [varName + '.hasArg(' + name + ')', generator.ORDER_ATOMIC];
};

// 获取请求头值
Arduino.forBlock['rp_webserver_header'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const name = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || '""';
  
  ensureWebServerLib(generator);
  
  return [varName + '.header(' + name + ')', generator.ORDER_ATOMIC];
};

// 检查是否存在请求头
Arduino.forBlock['rp_webserver_has_header'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const name = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || '""';
  
  ensureWebServerLib(generator);
  
  return [varName + '.hasHeader(' + name + ')', generator.ORDER_ATOMIC];
};

// 获取Host请求头
Arduino.forBlock['rp_webserver_host_header'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  
  ensureWebServerLib(generator);
  
  return [varName + '.hostHeader()', generator.ORDER_ATOMIC];
};

// 收集请求头
Arduino.forBlock['rp_webserver_collect_headers'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const headers = generator.valueToCode(block, 'HEADERS', generator.ORDER_ATOMIC) || '""';
  
  ensureWebServerLib(generator);
  
  return varName + '.collectHeaders(' + headers + ');\n';
};

// 启用CORS
Arduino.forBlock['rp_webserver_enable_cors'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  
  ensureWebServerLib(generator);
  
  return varName + '.enableCORS(true);\n';
};

// 停止服务器
Arduino.forBlock['rp_webserver_stop'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  
  ensureWebServerLib(generator);
  
  return varName + '.stop();\n';
};

// HTTP认证验证
Arduino.forBlock['rp_webserver_authenticate'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const username = generator.valueToCode(block, 'USERNAME', generator.ORDER_ATOMIC) || '""';
  const password = generator.valueToCode(block, 'PASSWORD', generator.ORDER_ATOMIC) || '""';
  
  ensureWebServerLib(generator);
  
  return [varName + '.authenticate(' + username + ', ' + password + ')', generator.ORDER_ATOMIC];
};

// 请求认证
Arduino.forBlock['rp_webserver_request_authentication'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'server');
  const realm = generator.valueToCode(block, 'REALM', generator.ORDER_ATOMIC) || '"Login Required"';
  
  ensureWebServerLib(generator);
  
  return varName + '.requestAuthentication(BASIC_AUTH, ' + realm + ');\n';
};
