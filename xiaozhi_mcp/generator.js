'use strict';

function xiaozhiMcpOrder(generator) {
  if (generator && generator.ORDER_ATOMIC !== undefined) return generator.ORDER_ATOMIC;
  if (typeof Arduino !== 'undefined' && Arduino.ORDER_ATOMIC !== undefined) return Arduino.ORDER_ATOMIC;
  return 0;
}

function xiaozhiMcpValueToCode(block, generator, name, fallback) {
  return generator.valueToCode(block, name, xiaozhiMcpOrder(generator)) || fallback;
}

function xiaozhiMcpResetState(generator) {
  generator._xiaozhiMcpState = {
    pendingParamsByTool: {},
    toolRegistrations: {},
    toolHandlers: {}
  };
}

function xiaozhiMcpState(generator) {
  if (!generator._xiaozhiMcpState) {
    xiaozhiMcpResetState(generator);
  }
  return generator._xiaozhiMcpState;
}

function xiaozhiMcpInstallGenerationReset() {
  if (typeof Arduino === 'undefined' || Arduino._xiaozhiMcpGenerationResetInstalled) {
    return;
  }
  if (typeof Arduino.workspaceToCode !== 'function') {
    return;
  }

  Arduino._xiaozhiMcpGenerationResetInstalled = true;
  const originalWorkspaceToCode = Arduino.workspaceToCode;
  Arduino.workspaceToCode = function(workspace) {
    xiaozhiMcpResetState(this);
    return originalWorkspaceToCode.call(this, workspace);
  };
}

xiaozhiMcpInstallGenerationReset();

function xiaozhiMcpLiteralFromCode(code) {
  const text = String(code || '').trim();
  const match = text.match(/^["']([\s\S]*)["']$/);
  if (!match) return text;
  const quote = text[0];
  if (quote === '"') {
    try {
      return JSON.parse(text);
    } catch (error) {
      // Fall through to the conservative unescape below.
    }
  }
  return match[1]
    .replace(/\\u([0-9a-fA-F]{4})/g, function(_, hex) {
      return String.fromCharCode(parseInt(hex, 16));
    })
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, '\\');
}

function xiaozhiMcpHashIdentifier(value) {
  const text = String(value || '');
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16);
}

function xiaozhiMcpSafeIdentifier(value, fallback) {
  const text = String(value || fallback || 'tool');
  const safe = text.replace(/[^a-zA-Z0-9_]/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '');
  const base = safe || fallback || 'tool';
  const identifier = /^[0-9]/.test(base) ? '_' + base : base;
  return identifier + '_' + xiaozhiMcpHashIdentifier(text);
}

function xiaozhiMcpJsonEscape(value) {
  return String(value || '')
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n');
}

function xiaozhiMcpEnsureLibraries(generator) {
  generator.addLibrary('WiFi', '#include <WiFi.h>');
  generator.addLibrary('WebSocketMCP', '#include <WebSocketMCP.h>');
  generator.addLibrary('ArduinoJson', '#include <ArduinoJson.h>');
}

function xiaozhiMcpEnsureGlobals(generator) {
  xiaozhiMcpEnsureLibraries(generator);
  generator.addObject('xiaozhi_mcp_client', 'WebSocketMCP xiaozhiMcpClient;');
  generator.addObject('xiaozhi_mcp_state', `String xiaozhiMcpCurrentArgs = "";
String xiaozhiMcpReturnValue = "{}";
JsonDocument xiaozhiMcpDoc;`);
  generator.addFunction('xiaozhi_mcp_helpers', `void xiaozhiMcpParseArgs() {
  xiaozhiMcpDoc.clear();
  deserializeJson(xiaozhiMcpDoc, xiaozhiMcpCurrentArgs);
}

String xiaozhiMcpGetStringParam(const char* key) {
  const char* value = xiaozhiMcpDoc[key] | "";
  return String(value);
}

float xiaozhiMcpGetNumberParam(const char* key) {
  return xiaozhiMcpDoc[key] | 0.0f;
}

bool xiaozhiMcpGetBoolParam(const char* key) {
  return xiaozhiMcpDoc[key] | false;
}`);
}

function xiaozhiMcpBuildSchema(generator, toolName) {
  const state = xiaozhiMcpState(generator);
  const params = state.pendingParamsByTool[toolName] || [];
  const properties = {};
  const required = [];
  params.forEach((param) => {
    const definition = { type: param.type || 'string' };
    if (param.title) definition.title = param.title;
    if (param.description) definition.description = param.description;
    if (param.enumValues && param.enumValues.length) definition.enum = param.enumValues;
    properties[param.name] = definition;
    required.push(param.name);
  });
  delete state.pendingParamsByTool[toolName];
  return JSON.stringify({ type: 'object', properties, required });
}

function xiaozhiMcpEnsureToolHandler(generator, toolName, body) {
  const state = xiaozhiMcpState(generator);
  const callbackName = 'onXiaozhiMcpTool_' + xiaozhiMcpSafeIdentifier(toolName, 'tool');
  state.toolHandlers[callbackName] = body || '';
  generator.addFunction(callbackName + '_prototype', `void ${callbackName}();`, true);
  generator.addFunction(callbackName, `void ${callbackName}() {
${state.toolHandlers[callbackName]}}`, true);
  return callbackName;
}

function xiaozhiMcpEnsureRegisterFunction(generator) {
  const state = xiaozhiMcpState(generator);
  const registrations = Object.keys(state.toolRegistrations).map((key) => state.toolRegistrations[key]);
  const body = registrations.length ? registrations.join('\n\n  ') : '// No MCP tools registered yet.';
  generator.addFunction('registerAllXiaozhiMcpTools_prototype', 'void registerAllXiaozhiMcpTools();', true);
  generator.addFunction('registerAllXiaozhiMcpTools', `void registerAllXiaozhiMcpTools() {
  ${body}
}`, true);
}

Arduino.forBlock['xiaozhi_mcp_wifi_init'] = function(block, generator) {
  const ssid = xiaozhiMcpValueToCode(block, generator, 'SSID', '"your-ssid"');
  const password = xiaozhiMcpValueToCode(block, generator, 'PASSWORD', '"your-password"');

  generator.addLibrary('WiFi', '#include <WiFi.h>');
  generator.addObject('xiaozhi_mcp_wifi_config', 'const char* xiaozhiMcpWiFiSsid = ' + ssid + ';\nconst char* xiaozhiMcpWiFiPassword = ' + password + ';');
  generator.addFunction('xiaozhi_mcp_wifi_keepalive', `void keepXiaozhiMcpWiFiAlive() {
  if (WiFi.status() == WL_CONNECTED) {
    return;
  }
  Serial.println("[WiFi] Connecting...");
  WiFi.disconnect();
  WiFi.begin(xiaozhiMcpWiFiSsid, xiaozhiMcpWiFiPassword);
  int retry = 0;
  while (WiFi.status() != WL_CONNECTED && retry < 20) {
    delay(500);
    Serial.print(".");
    retry++;
  }
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\\n[WiFi] Connected!");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\\n[WiFi] Connect timeout.");
  }
}`);
  generator.addSetupBegin('xiaozhi_mcp_wifi_init', '  keepXiaozhiMcpWiFiAlive();');
  generator.addLoopBegin('xiaozhi_mcp_wifi_keepalive_loop', `static unsigned long xiaozhiMcpLastWiFiCheck = 0;
if (millis() - xiaozhiMcpLastWiFiCheck > 10000) {
  keepXiaozhiMcpWiFiAlive();
  xiaozhiMcpLastWiFiCheck = millis();
}`);
  return '';
};

Arduino.forBlock['xiaozhi_mcp_init'] = function(block, generator) {
  const endpoint = xiaozhiMcpValueToCode(block, generator, 'ENDPOINT', '"wss://api.xiaozhi.me/mcp/?token=your_token"');

  xiaozhiMcpEnsureGlobals(generator);
  generator.addObject('xiaozhi_mcp_endpoint', 'const char* xiaozhiMcpEndpoint = ' + endpoint + ';');
  generator.addFunction('xiaozhi_mcp_connection_callback', `void onXiaozhiMcpConnectionChange(bool connected) {
  if (connected) {
    Serial.println("[MCP] Connected!");
    registerAllXiaozhiMcpTools();
  } else {
    Serial.println("[MCP] Disconnected!");
  }
}`);
  xiaozhiMcpEnsureRegisterFunction(generator);
  generator.addSetupBegin('xiaozhi_mcp_init', '  xiaozhiMcpClient.begin(xiaozhiMcpEndpoint, onXiaozhiMcpConnectionChange);');
  return '';
};

Arduino.forBlock['xiaozhi_mcp_loop'] = function(block, generator) {
  xiaozhiMcpEnsureGlobals(generator);
  xiaozhiMcpEnsureRegisterFunction(generator);
  return `xiaozhiMcpClient.loop();
`;
};

Arduino.forBlock['xiaozhi_mcp_add_tool_param'] = function(block, generator) {
  const toolName = xiaozhiMcpLiteralFromCode(xiaozhiMcpValueToCode(block, generator, 'TOOL_NAME', '"my_tool"'));
  const paramName = xiaozhiMcpLiteralFromCode(xiaozhiMcpValueToCode(block, generator, 'PARAM_NAME', '"state"'));
  const paramTitle = xiaozhiMcpLiteralFromCode(xiaozhiMcpValueToCode(block, generator, 'PARAM_TITLE', '""'));
  const paramDesc = xiaozhiMcpLiteralFromCode(xiaozhiMcpValueToCode(block, generator, 'PARAM_DESC', '""'));
  const paramType = block.getFieldValue('PARAM_TYPE') || 'string';

  if (!toolName || !paramName) return '';
  const state = xiaozhiMcpState(generator);
  const params = state.pendingParamsByTool[toolName] || [];
  const existingIndex = params.findIndex((item) => item.name === paramName);
  const nextParam = {
    name: paramName,
    title: paramTitle,
    type: paramType,
    description: paramDesc,
    enumValues: existingIndex >= 0 ? params[existingIndex].enumValues : []
  };
  if (existingIndex >= 0) {
    params[existingIndex] = nextParam;
  } else {
    params.push(nextParam);
  }
  state.pendingParamsByTool[toolName] = params;
  return '';
};

Arduino.forBlock['xiaozhi_mcp_register_tool'] = function(block, generator) {
  const toolNameCode = xiaozhiMcpValueToCode(block, generator, 'TOOL_NAME', '"my_tool"');
  const descriptionCode = xiaozhiMcpValueToCode(block, generator, 'DESCRIPTION', '"Control device"');
  const toolName = xiaozhiMcpLiteralFromCode(toolNameCode);
  const state = xiaozhiMcpState(generator);
  const handlerName = 'onXiaozhiMcpTool_' + xiaozhiMcpSafeIdentifier(toolName, 'tool');
  const callbackName = xiaozhiMcpEnsureToolHandler(generator, toolName, state.toolHandlers[handlerName] || '');
  const schema = xiaozhiMcpBuildSchema(generator, toolName);

  xiaozhiMcpEnsureGlobals(generator);
  state.toolRegistrations[toolName] = `xiaozhiMcpClient.registerTool(${toolNameCode}, ${descriptionCode}, R"json(${schema})json", [](const String& args) -> WebSocketMCP::ToolResponse {
    xiaozhiMcpCurrentArgs = args;
    xiaozhiMcpReturnValue = "{}";
    xiaozhiMcpParseArgs();
    ${callbackName}();
    return WebSocketMCP::ToolResponse(xiaozhiMcpReturnValue);
  });`;
  xiaozhiMcpEnsureRegisterFunction(generator);
  return '';
};

Arduino.forBlock['xiaozhi_mcp_on_tool'] = function(block, generator) {
  const toolName = xiaozhiMcpLiteralFromCode(xiaozhiMcpValueToCode(block, generator, 'TOOL_NAME', '"my_tool"'));
  const body = generator.statementToCode(block, 'DO') || '';
  xiaozhiMcpEnsureGlobals(generator);
  xiaozhiMcpEnsureToolHandler(generator, toolName, body);
  return '';
};

Arduino.forBlock['xiaozhi_mcp_get_string'] = function(block, generator) {
  const key = xiaozhiMcpLiteralFromCode(xiaozhiMcpValueToCode(block, generator, 'KEY', '"state"'));
  xiaozhiMcpEnsureGlobals(generator);
  return ['xiaozhiMcpGetStringParam("' + xiaozhiMcpJsonEscape(key) + '")', xiaozhiMcpOrder(generator)];
};

Arduino.forBlock['xiaozhi_mcp_get_number'] = function(block, generator) {
  const key = xiaozhiMcpLiteralFromCode(xiaozhiMcpValueToCode(block, generator, 'KEY', '"value"'));
  xiaozhiMcpEnsureGlobals(generator);
  return ['xiaozhiMcpGetNumberParam("' + xiaozhiMcpJsonEscape(key) + '")', xiaozhiMcpOrder(generator)];
};

Arduino.forBlock['xiaozhi_mcp_get_bool'] = function(block, generator) {
  const key = xiaozhiMcpLiteralFromCode(xiaozhiMcpValueToCode(block, generator, 'KEY', '"enabled"'));
  xiaozhiMcpEnsureGlobals(generator);
  return ['xiaozhiMcpGetBoolParam("' + xiaozhiMcpJsonEscape(key) + '")', xiaozhiMcpOrder(generator)];
};

Arduino.forBlock['xiaozhi_mcp_return_result'] = function(block, generator) {
  const key = xiaozhiMcpLiteralFromCode(xiaozhiMcpValueToCode(block, generator, 'KEY', '"result"'));
  const value = xiaozhiMcpValueToCode(block, generator, 'VALUE', '"ok"');
  xiaozhiMcpEnsureGlobals(generator);
  return `{
  JsonDocument xiaozhiMcpResultDoc;
  xiaozhiMcpResultDoc["${xiaozhiMcpJsonEscape(key)}"] = ${value};
  serializeJson(xiaozhiMcpResultDoc, xiaozhiMcpReturnValue);
}
`;
};
