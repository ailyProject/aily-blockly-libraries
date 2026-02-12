'use strict';

// ============================================================================
// AsyncHTTP Blockly Library - Code Generator
// 非阻塞异步HTTP客户端，支持Arduino UNO R4 WiFi和ESP32
// ============================================================================

// 确保AsyncHTTP库被包含
function ensureAsyncHTTPLib(generator) {
  generator.addLibrary('AsyncHTTP', '#include <AsyncHTTP.h>');
}

// 获取变量名的工具函数
function getAsyncHTTPVarName(block, fieldName, defaultName) {
  const varField = block.getField(fieldName);
  return varField ? varField.getText() : defaultName;
}

// ============================================================================
// 初始化
// ============================================================================

// 创建异步HTTP客户端
Arduino.forBlock['async_http_create'] = function(block, generator) {
  // 设置变量重命名监听
  if (!block._asyncHttpVarMonitorAttached) {
    block._asyncHttpVarMonitorAttached = true;
    block._asyncHttpVarLastName = block.getFieldValue('VAR') || 'http';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._asyncHttpVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'AsyncHTTP');
          block._asyncHttpVarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'http';

  // 添加库和变量声明
  ensureAsyncHTTPLib(generator);
  registerVariableToBlockly(varName, 'AsyncHTTP');
  generator.addVariable(varName, 'AsyncHTTP ' + varName + ';');

  // 自动在loop中添加update()
  generator.addLoopBegin(varName + '_update', varName + '.update();');

  return varName + '.begin();\n';
};

// 设置超时时间
Arduino.forBlock['async_http_set_timeout'] = function(block, generator) {
  const varName = getAsyncHTTPVarName(block, 'VAR', 'http');
  const timeout = generator.valueToCode(block, 'TIMEOUT', generator.ORDER_ATOMIC) || '10000';

  ensureAsyncHTTPLib(generator);

  return varName + '.setTimeout(' + timeout + ');\n';
};

// 设置默认请求头
Arduino.forBlock['async_http_set_header'] = function(block, generator) {
  const varName = getAsyncHTTPVarName(block, 'VAR', 'http');
  const name = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || '"User-Agent"';
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '"AsyncHTTP/1.0"';

  ensureAsyncHTTPLib(generator);

  return varName + '.setHeader(' + name + ', ' + value + ');\n';
};

// 清除所有默认请求头
Arduino.forBlock['async_http_clear_headers'] = function(block, generator) {
  const varName = getAsyncHTTPVarName(block, 'VAR', 'http');

  ensureAsyncHTTPLib(generator);

  return varName + '.clearHeaders();\n';
};

// ============================================================================
// 请求发送（混合模式块 - 带回调）
// ============================================================================

// 生成唯一的回调函数名
function _asyncHttpNextCbName(generator, prefix) {
  if (!generator._asyncHttpCbCounter) generator._asyncHttpCbCounter = 0;
  generator._asyncHttpCbCounter++;
  return '_asynchttp_' + prefix + '_cb_' + generator._asyncHttpCbCounter;
}

// 生成响应回调函数并注册
function _asyncHttpRegisterResponseCb(generator, block, callbackName) {
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';

  const functionDef =
    'void ' + callbackName + '(const AsyncHTTPResponse& _asynchttp_response, void* _asynchttp_userData) {\n' +
    handlerCode +
    '}\n';

  generator.addFunction(callbackName, functionDef);
}

// GET请求
Arduino.forBlock['async_http_get'] = function(block, generator) {
  const varName = getAsyncHTTPVarName(block, 'VAR', 'http');
  const url = generator.valueToCode(block, 'URL', generator.ORDER_ATOMIC) || '"http://example.com"';

  ensureAsyncHTTPLib(generator);

  const callbackName = _asyncHttpNextCbName(generator, 'get');
  _asyncHttpRegisterResponseCb(generator, block, callbackName);

  return varName + '.get(' + url + ', ' + callbackName + ');\n';
};

// POST JSON请求
Arduino.forBlock['async_http_post_json'] = function(block, generator) {
  const varName = getAsyncHTTPVarName(block, 'VAR', 'http');
  const url = generator.valueToCode(block, 'URL', generator.ORDER_ATOMIC) || '"http://example.com"';
  const body = generator.valueToCode(block, 'BODY', generator.ORDER_ATOMIC) || '"{}"';

  ensureAsyncHTTPLib(generator);

  const callbackName = _asyncHttpNextCbName(generator, 'postjson');
  _asyncHttpRegisterResponseCb(generator, block, callbackName);

  return varName + '.postJson(' + url + ', ' + body + ', ' + callbackName + ');\n';
};

// POST请求（自定义Content-Type）
Arduino.forBlock['async_http_post'] = function(block, generator) {
  const varName = getAsyncHTTPVarName(block, 'VAR', 'http');
  const url = generator.valueToCode(block, 'URL', generator.ORDER_ATOMIC) || '"http://example.com"';
  const body = generator.valueToCode(block, 'BODY', generator.ORDER_ATOMIC) || '""';
  const contentType = generator.valueToCode(block, 'CONTENT_TYPE', generator.ORDER_ATOMIC) || '"text/plain"';

  ensureAsyncHTTPLib(generator);

  const callbackName = _asyncHttpNextCbName(generator, 'post');
  _asyncHttpRegisterResponseCb(generator, block, callbackName);

  return varName + '.post(' + url + ', ' + body + ', ' + contentType + ', ' + callbackName + ');\n';
};

// PUT JSON请求
Arduino.forBlock['async_http_put_json'] = function(block, generator) {
  const varName = getAsyncHTTPVarName(block, 'VAR', 'http');
  const url = generator.valueToCode(block, 'URL', generator.ORDER_ATOMIC) || '"http://example.com"';
  const body = generator.valueToCode(block, 'BODY', generator.ORDER_ATOMIC) || '"{}"';

  ensureAsyncHTTPLib(generator);

  const callbackName = _asyncHttpNextCbName(generator, 'putjson');
  _asyncHttpRegisterResponseCb(generator, block, callbackName);

  return varName + '.putJson(' + url + ', ' + body + ', ' + callbackName + ');\n';
};

// DELETE请求
Arduino.forBlock['async_http_del'] = function(block, generator) {
  const varName = getAsyncHTTPVarName(block, 'VAR', 'http');
  const url = generator.valueToCode(block, 'URL', generator.ORDER_ATOMIC) || '"http://example.com"';

  ensureAsyncHTTPLib(generator);

  const callbackName = _asyncHttpNextCbName(generator, 'del');
  _asyncHttpRegisterResponseCb(generator, block, callbackName);

  return varName + '.del(' + url + ', ' + callbackName + ');\n';
};

// ============================================================================
// 错误回调（Hat模式块）
// ============================================================================

Arduino.forBlock['async_http_on_error'] = function(block, generator) {
  const varName = getAsyncHTTPVarName(block, 'VAR', 'http');
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';

  ensureAsyncHTTPLib(generator);

  const callbackName = '_asynchttp_err_cb_' + varName;

  const functionDef =
    'void ' + callbackName + '(int _asynchttp_err_code, const String& _asynchttp_err_msg, void* _asynchttp_userData) {\n' +
    handlerCode +
    '}\n';

  generator.addFunction(callbackName, functionDef);
  generator.addSetupEnd(
    varName + '_onError',
    varName + '.onError(' + callbackName + ');'
  );

  return '';
};

// ============================================================================
// 响应数据值块（仅在请求回调中使用）
// ============================================================================

// 获取响应状态码
Arduino.forBlock['async_http_response_status'] = function(block, generator) {
  return ['_asynchttp_response.statusCode()', generator.ORDER_FUNCTION_CALL];
};

// 获取响应内容
Arduino.forBlock['async_http_response_body'] = function(block, generator) {
  return ['_asynchttp_response.body()', generator.ORDER_FUNCTION_CALL];
};

// 响应是否成功
Arduino.forBlock['async_http_response_is_success'] = function(block, generator) {
  return ['_asynchttp_response.isSuccess()', generator.ORDER_FUNCTION_CALL];
};

// 获取响应头
Arduino.forBlock['async_http_response_header'] = function(block, generator) {
  const name = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || '"Content-Type"';
  return ['_asynchttp_response.header(' + name + ')', generator.ORDER_FUNCTION_CALL];
};

// ============================================================================
// 错误数据值块（仅在错误回调中使用）
// ============================================================================

// 获取错误代码
Arduino.forBlock['async_http_error_code'] = function(block, generator) {
  return ['_asynchttp_err_code', generator.ORDER_ATOMIC];
};

// 获取错误信息
Arduino.forBlock['async_http_error_message'] = function(block, generator) {
  return ['_asynchttp_err_msg', generator.ORDER_ATOMIC];
};

// ============================================================================
// 管理
// ============================================================================

// 获取待处理请求数
Arduino.forBlock['async_http_pending'] = function(block, generator) {
  const varName = getAsyncHTTPVarName(block, 'VAR', 'http');

  ensureAsyncHTTPLib(generator);

  return [varName + '.pending()', generator.ORDER_FUNCTION_CALL];
};

// 取消所有请求
Arduino.forBlock['async_http_abort_all'] = function(block, generator) {
  const varName = getAsyncHTTPVarName(block, 'VAR', 'http');

  ensureAsyncHTTPLib(generator);

  return varName + '.abortAll();\n';
};
