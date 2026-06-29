# Xiaozhi MCP Client

## Library Info

- **Name**: `@aily-project/lib-xiaozhi-mcp`
- **Version**: `0.0.2`
- **Directory**: `xiaozhi_mcp`
- **Purpose**: ESP32 WebSocket MCP client for Xiaozhi AI service.

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `xiaozhi_mcp_wifi_init` | Statement | SSID(input_value), PASSWORD(input_value) | `xiaozhi_mcp_wifi_init(text("ssid"), text("password"))` | Adds WiFi include/config, setup WiFi connect, and 10s reconnect check |
| `xiaozhi_mcp_init` | Statement | ENDPOINT(input_value) | `xiaozhi_mcp_init(text("wss://api.xiaozhi.me/mcp/?token=token"))` | Creates global `WebSocketMCP xiaozhiMcpClient`, endpoint, connection callback, and setup begin |
| `xiaozhi_mcp_loop` | Statement | none | `xiaozhi_mcp_loop()` | Calls `xiaozhiMcpClient.loop()` |
| `xiaozhi_mcp_register_tool` | Statement | TOOL_NAME(input_value), DESCRIPTION(input_value) | `xiaozhi_mcp_register_tool(text("lamp"), text("Control lamp"))` | Registers the tool with generated JSON schema and callback bridge |
| `xiaozhi_mcp_add_tool_param` | Statement | TOOL_NAME(input_value), PARAM_NAME(input_value), PARAM_TITLE(input_value), PARAM_TYPE(dropdown), PARAM_DESC(input_value) | `xiaozhi_mcp_add_tool_param(text("lamp"), text("state"), text("State"), string, text("on/off"))` | Queues an inputSchema parameter for the named tool |
| `xiaozhi_mcp_on_tool` | Hat/container | TOOL_NAME(input_value), input_dummy, DO(input_statement) | `xiaozhi_mcp_on_tool(text("lamp")) @DO: ...` | Generates `void onXiaozhiMcpTool_<tool>()` |
| `xiaozhi_mcp_get_string` | Value String | KEY(input_value) | `xiaozhi_mcp_get_string(text("state"))` | Reads current call arg with `xiaozhiMcpGetStringParam()` |
| `xiaozhi_mcp_get_number` | Value Number | KEY(input_value) | `xiaozhi_mcp_get_number(text("value"))` | Reads current call arg with `xiaozhiMcpGetNumberParam()` |
| `xiaozhi_mcp_get_bool` | Value Boolean | KEY(input_value) | `xiaozhi_mcp_get_bool(text("enabled"))` | Reads current call arg with `xiaozhiMcpGetBoolParam()` |
| `xiaozhi_mcp_return_result` | Statement | KEY(input_value), VALUE(input_value) | `xiaozhi_mcp_return_result(text("success"), logic_boolean(TRUE))` | Serializes a one-key JSON result to `xiaozhiMcpReturnValue` |

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
        xiaozhi_mcp_return_result(text("success"), logic_boolean(TRUE))
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
