# Xiaozhi MCP Client

## Library Info

- **Name**: `@aily-project/lib-xiaozhi-mcp`
- **Directory**: `xiaozhi_mcp`
- **Purpose**: ESP32 WebSocket MCP client for Xiaozhi AI service.

## Block Definitions

| Block Type | Connection | Parameters | Generated Behavior |
|------------|------------|------------|--------------------|
| `xiaozhi_mcp_wifi_init` | Statement | SSID, PASSWORD | Adds WiFi include/config and `keepXiaozhiMcpWiFiAlive()` setup call |
| `xiaozhi_mcp_init` | Statement | ENDPOINT | Creates global `WebSocketMCP xiaozhiMcpClient`, connection callback, and setup begin |
| `xiaozhi_mcp_loop` | Statement | none | Calls `xiaozhiMcpClient.loop()` and checks WiFi every 10s |
| `xiaozhi_mcp_add_tool_param` | Statement | TOOL_NAME, PARAM_NAME, PARAM_TITLE, PARAM_TYPE, PARAM_DESC | Queues schema parameter for the named tool |
| `xiaozhi_mcp_register_tool` | Statement | TOOL_NAME, DESCRIPTION | Registers tool with generated JSON schema and callback bridge |
| `xiaozhi_mcp_on_tool` | Hat/container | TOOL_NAME, DO | Generates `void onXiaozhiMcpTool_<tool>()` |
| `xiaozhi_mcp_get_string` | Value String | KEY | Reads current call arg with `xiaozhiMcpGetStringParam()` |
| `xiaozhi_mcp_get_number` | Value Number | KEY | Reads current call arg with `xiaozhiMcpGetNumberParam()` |
| `xiaozhi_mcp_get_bool` | Value Boolean | KEY | Reads current call arg with `xiaozhiMcpGetBoolParam()` |
| `xiaozhi_mcp_return_result` | Statement | KEY, VALUE | Serializes a one-key JSON result to `xiaozhiMcpReturnValue` |

## Ordering Notes

- Put `xiaozhi_mcp_add_tool_param` blocks before `xiaozhi_mcp_register_tool`.
- `xiaozhi_mcp_register_tool` and `xiaozhi_mcp_on_tool` must use the same literal tool name.
- Put `xiaozhi_mcp_loop` inside `arduino_loop`.

## Dependencies

- `src/WebSocketMCP.h`
- `src/WebSocketMCP.cpp`
- Bundled ArduinoJson source
- Bundled WebSockets source
- ESP32 WiFi
