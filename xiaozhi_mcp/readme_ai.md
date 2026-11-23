# Xiaozhi MCP Client

## Library Info

- **Name**: `@aily-project/lib-xiaozhi-mcp`
- **Version**: `0.0.2`
- **Directory**: `xiaozhi_mcp`
- **Purpose**: ESP32 WebSocket MCP client for Xiaozhi AI service.

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `xiaozhi_mcp_wifi_init` | Statement | SSID(input_value), PASSWORD(input_value) | `xiaozhi_mcp_wifi_init(text("ssid"), text("password"))` | `const char* xiaozhiMcpWiFiSsid = "value"; ↵ const char* xiaozhiMcpWiFiPassword = "value"; ↵ void keepXiaozhiMcpWiFiAlive() { ↵ if (WiFi.status() == WL_CONNECTED) { ↵ return; ↵ } ↵ Serial.println("[WiFi] Connecting..."); ↵ WiFi.disconnect(); ↵ WiFi.begin(xiaozhiMcpWiFiSsid, xiaozhiMcpWiFiPassword); ↵ int retry = 0; ↵ while (WiFi.status() != WL_CONNECTED && retry < 20) { ↵ delay(500); ↵ Serial.print("."); ↵ retry++; ↵ } ↵ if (WiFi.status() == WL_CONNECTED) { ↵ Serial.println("\n[WiFi] Connected!"); ↵ Serial.println(WiFi.localIP()); ↵ } else { ↵ Serial.println("\n[WiFi] Connect timeout."); ↵ } ↵ } ↵ keepXiaozhiMcpWiFiAlive(); ↵ static unsigned long xiaozhiMcpLastWiFiCheck = 0; ↵ if (millis() - xiaozhiMcpLastWiFiCheck > 10000) { ↵ keepXiaozhiMcpWiFiAlive(); ↵ xiaozhiMcpLastWiFiCheck = millis(); ↵ }` |
| `xiaozhi_mcp_init` | Statement | ENDPOINT(input_value) | `xiaozhi_mcp_init(text("wss://api.xiaozhi.me/mcp/?token=token"))` | `WebSocketMCP xiaozhiMcpClient; ↵ String xiaozhiMcpCurrentArgs = ""; ↵ String xiaozhiMcpReturnValue = "{}"; ↵ JsonDocument xiaozhiMcpDoc; ↵ void xiaozhiMcpParseArgs() { ↵ xiaozhiMcpDoc.clear(); ↵ deserializeJson(xiaozhiMcpDoc, xiaozhiMcpCurrentArgs); ↵ } ↵ String xiaozhiMcpGetStringParam(const char* key) { ↵ const char* value = xiaozhiMcpDoc[key] &#124; ""; ↵ return String(value); ↵ } ↵ float xiaozhiMcpGetNumberParam(const char* key) { ↵ return xiaozhiMcpDoc[key] &#124; 0.0f; ↵ } ↵ bool xiaozhiMcpGetBoolParam(const char* key) { ↵ return xiaozhiMcpDoc[key] &#124; false; ↵ } ↵ const char* xiaozhiMcpEndpoint = "value"; ↵ void onXiaozhiMcpConnectionChange(bool connected) { ↵ if (connected) { ↵ Serial.println("[MCP] Connected!"); ↵ registerAllXiaozhiMcpTools(); ↵ } else { ↵ Serial.println("[MCP] Disconnected!"); ↵ } ↵ } ↵ void registerAllXiaozhiMcpTools(); ↵ void registerAllXiaozhiMcpTools() { ↵ // No MCP tools registered yet. ↵ } ↵ xiaozhiMcpClient.begin(xiaozhiMcpEndpoint, onXiaozhiMcpConnectionChange);` |
| `xiaozhi_mcp_loop` | Statement | (none) | `xiaozhi_mcp_loop()` | `xiaozhiMcpClient.loop();` |
| `xiaozhi_mcp_register_tool` | Statement | TOOL_NAME(input_value), DESCRIPTION(input_value) | `xiaozhi_mcp_register_tool(text("lamp"), text("Control lamp"))` | `void onXiaozhiMcpTool_value_425ed3ca(); ↵ void onXiaozhiMcpTool_value_425ed3ca() { ↵ } ↵ WebSocketMCP xiaozhiMcpClient; ↵ String xiaozhiMcpCurrentArgs = ""; ↵ String xiaozhiMcpReturnValue = "{}"; ↵ JsonDocument xiaozhiMcpDoc; ↵ void xiaozhiMcpParseArgs() { ↵ xiaozhiMcpDoc.clear(); ↵ deserializeJson(xiaozhiMcpDoc, xiaozhiMcpCurrentArgs); ↵ } ↵ String xiaozhiMcpGetStringParam(const char* key) { ↵ const char* value = xiaozhiMcpDoc[key] &#124; ""; ↵ return String(value); ↵ } ↵ float xiaozhiMcpGetNumberParam(const char* key) { ↵ return xiaozhiMcpDoc[key] &#124; 0.0f; ↵ } ↵ bool xiaozhiMcpGetBoolParam(const char* key) { ↵ return xiaozhiMcpDoc[key] &#124; false; ↵ } ↵ void registerAllXiaozhiMcpTools(); ↵ void registerAllXiaozhiMcpTools() { ↵ xiaozhiMcpClient.registerTool("value", "value", R"json({"type":"object","properties":{},"required":[]})json", [](const String& args) -> WebSocketMCP::ToolResponse { ↵ xiaozhiMcpCurrentArgs = args; ↵ xiaozhiMcpReturnValue = "{}"; ↵ xiaozhiMcpParseArgs(); ↵ onXiaozhiMcpTool_value_425ed3ca(); ↵ return WebSocketMCP::ToolResponse(xiaozhiMcpReturnValue); ↵ }); ↵ }` |
| `xiaozhi_mcp_add_tool_param` | Statement | TOOL_NAME(input_value), PARAM_NAME(input_value), PARAM_TITLE(input_value), PARAM_TYPE(dropdown), PARAM_DESC(input_value) | `xiaozhi_mcp_add_tool_param(text("lamp"), text("state"), text("State"), string, text("on/off"))` | `No direct code emitted; stores parameter metadata for xiaozhi_mcp_register_tool.` |
| `xiaozhi_mcp_on_tool` | Hat/container | TOOL_NAME(input_value), DO(input_statement) | `xiaozhi_mcp_on_tool(text("lamp"))` | `WebSocketMCP xiaozhiMcpClient; ↵ String xiaozhiMcpCurrentArgs = ""; ↵ String xiaozhiMcpReturnValue = "{}"; ↵ JsonDocument xiaozhiMcpDoc; ↵ void xiaozhiMcpParseArgs() { ↵ xiaozhiMcpDoc.clear(); ↵ deserializeJson(xiaozhiMcpDoc, xiaozhiMcpCurrentArgs); ↵ } ↵ String xiaozhiMcpGetStringParam(const char* key) { ↵ const char* value = xiaozhiMcpDoc[key] &#124; ""; ↵ return String(value); ↵ } ↵ float xiaozhiMcpGetNumberParam(const char* key) { ↵ return xiaozhiMcpDoc[key] &#124; 0.0f; ↵ } ↵ bool xiaozhiMcpGetBoolParam(const char* key) { ↵ return xiaozhiMcpDoc[key] &#124; false; ↵ } ↵ void onXiaozhiMcpTool_value_425ed3ca(); ↵ void onXiaozhiMcpTool_value_425ed3ca() { ↵ }` |
| `xiaozhi_mcp_get_string` | Value String | KEY(input_value) | `xiaozhi_mcp_get_string(text("state"))` | `xiaozhiMcpGetStringParam("value")` |
| `xiaozhi_mcp_get_number` | Value Number | KEY(input_value) | `xiaozhi_mcp_get_number(text("value"))` | `xiaozhiMcpGetNumberParam("value")` |
| `xiaozhi_mcp_get_bool` | Value Boolean | KEY(input_value) | `xiaozhi_mcp_get_bool(text("enabled"))` | `xiaozhiMcpGetBoolParam("value")` |
| `xiaozhi_mcp_return_result` | Statement | KEY(input_value), VALUE(input_value) | `xiaozhi_mcp_return_result(text("success"), logic_boolean(true))` | `{ ↵ JsonDocument xiaozhiMcpResultDoc; ↵ xiaozhiMcpResultDoc["value"] = 1; ↵ serializeJson(xiaozhiMcpResultDoc, xiaozhiMcpReturnValue); ↵ }` |

## Parameter Options

| Parameter | Values | Notes |
|-----------|--------|-------|
| PARAM_TYPE | `string`, `number`, `boolean` | MCP inputSchema JSON type for the tool parameter |

## ABS Example

```text
arduino_setup()
    xiaozhi_mcp_wifi_init(text("your-ssid"), text("your-password"))
    xiaozhi_mcp_add_tool_param(text("lamp"), text("state"), text("State"), string, text("on/off"))
    xiaozhi_mcp_register_tool(text("lamp"), text("Control lamp"))
    xiaozhi_mcp_init(text("wss://api.xiaozhi.me/mcp/?token=your_token"))

arduino_loop()
    xiaozhi_mcp_loop()

xiaozhi_mcp_on_tool(text("lamp"))
    @DO:
        xiaozhi_mcp_return_result(text("success"), logic_boolean(true))
```

## Ordering Notes

- Put `xiaozhi_mcp_add_tool_param` blocks before `xiaozhi_mcp_register_tool`.
- `xiaozhi_mcp_register_tool` and `xiaozhi_mcp_on_tool` must use the same literal tool name.
- Put `xiaozhi_mcp_loop` inside `arduino_loop`.
- Use `text(...)`, `math_number(...)`, or `logic_boolean(...)` wrappers for all `input_value` parameters in ABS.

## Dependencies

- Bundled `src.7z` contains `WebSocketMCP.h` and `WebSocketMCP.cpp`
- Bundled ArduinoJson source
- Bundled WebSockets source
- ESP32 WiFi
## ABS Examples

### Minimal Executable Usage

```abs
arduino_setup()
    xiaozhi_mcp_wifi_init(text("ssid"), text("password"))
```
