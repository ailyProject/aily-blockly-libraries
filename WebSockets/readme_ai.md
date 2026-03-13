# WebSockets

WebSocket客户端和服务器库，基于RFC6455标准，支持ESP32/ESP8266等多种硬件平台

## Library Info
- **Name**: @aily-project/lib-websockets
- **Version**: 2.7.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `websocket_client_create` | Statement | VAR(field_input) | `websocket_client_create("wsClient")` | `` |
| `websocket_client_begin` | Statement | VAR(field_variable), HOST(input_value), PORT(input_value), URL(input_value) | `websocket_client_begin($wsClient, math_number(0), math_number(0), math_number(0))` | (dynamic code) |
| `websocket_client_begin_ssl` | Statement | VAR(field_variable), HOST(input_value), PORT(input_value), URL(input_value) | `websocket_client_begin_ssl($wsClient, math_number(0), math_number(0), math_number(0))` | (dynamic code) |
| `websocket_client_on_event` | Statement | VAR(field_variable) | `websocket_client_on_event($wsClient)` | `` |
| `websocket_client_send_text` | Statement | VAR(field_variable), TEXT(input_value) | `websocket_client_send_text($wsClient, text("hello"))` | (dynamic code) |
| `websocket_client_send_binary` | Statement | VAR(field_variable), DATA(input_value) | `websocket_client_send_binary($wsClient, math_number(0))` | (dynamic code) |
| `websocket_client_disconnect` | Statement | VAR(field_variable) | `websocket_client_disconnect($wsClient)` | (dynamic code) |
| `websocket_client_is_connected` | Value | VAR(field_variable) | `websocket_client_is_connected($wsClient)` | (dynamic code) |
| `websocket_client_set_reconnect` | Statement | VAR(field_variable), INTERVAL(input_value) | `websocket_client_set_reconnect($wsClient, math_number(1000))` | (dynamic code) |
| `websocket_client_enable_heartbeat` | Statement | VAR(field_variable), PING_INTERVAL(input_value), PONG_TIMEOUT(input_value), DISCONNECT_COUNT(input_value) | `websocket_client_enable_heartbeat($wsClient, math_number(2), math_number(1000), math_number(0))` | (dynamic code) |
| `websocket_server_create` | Statement | VAR(field_input), PORT(input_value) | `websocket_server_create("wsServer", math_number(0))` | `` |
| `websocket_server_begin` | Statement | VAR(field_variable) | `websocket_server_begin($wsServer)` | (dynamic code) |
| `websocket_server_on_event` | Statement | VAR(field_variable) | `websocket_server_on_event($wsServer)` | `` |
| `websocket_server_send_text` | Statement | VAR(field_variable), CLIENT_NUM(input_value), TEXT(input_value) | `websocket_server_send_text($wsServer, math_number(0), text("hello"))` | (dynamic code) |
| `websocket_server_broadcast_text` | Statement | VAR(field_variable), TEXT(input_value) | `websocket_server_broadcast_text($wsServer, text("hello"))` | (dynamic code) |
| `websocket_server_send_binary` | Statement | VAR(field_variable), CLIENT_NUM(input_value), DATA(input_value) | `websocket_server_send_binary($wsServer, math_number(0), math_number(0))` | (dynamic code) |
| `websocket_server_broadcast_binary` | Statement | VAR(field_variable), DATA(input_value) | `websocket_server_broadcast_binary($wsServer, math_number(0))` | (dynamic code) |
| `websocket_server_disconnect` | Statement | VAR(field_variable), CLIENT_NUM(input_value) | `websocket_server_disconnect($wsServer, math_number(0))` | (dynamic code) |
| `websocket_server_disconnect_all` | Statement | VAR(field_variable) | `websocket_server_disconnect_all($wsServer)` | (dynamic code) |
| `websocket_server_connected_clients` | Value | VAR(field_variable) | `websocket_server_connected_clients($wsServer)` | (dynamic code) |
| `websocket_server_client_connected` | Value | VAR(field_variable), CLIENT_NUM(input_value) | `websocket_server_client_connected($wsServer, math_number(0))` | (dynamic code) |
| `websocket_event_type` | Value | TYPE(dropdown) | `websocket_event_type(WStype_DISCONNECTED)` | `WStype_DISCONNECTED` |
| `websocket_event_payload` | Value | PAYLOAD(dropdown) | `websocket_event_payload(TYPE)` | `type` |
| `websocket_event_payload_length` | Value | (none) | `websocket_event_payload_length()` | `length` |
| `websocket_event_client_num` | Value | (none) | `websocket_event_client_num()` | `num` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| TYPE | WStype_DISCONNECTED, WStype_CONNECTED, WStype_TEXT, WStype_BIN, WStype_PING, WStype_PONG, WStype_ERROR | 断开连接 / 已连接 / 文本消息 / 二进制消息 / Ping / Pong / 错误 |
| PAYLOAD | TYPE, PAYLOAD, PAYLOAD_CHAR | 事件类型 / 事件数据(uint8_t*) / 事件数据(char*) |

## ABS Examples

### Basic Usage
```
arduino_setup()
    websocket_client_create("wsClient")
    websocket_client_begin($wsClient, math_number(0), math_number(0), math_number(0))
    websocket_client_begin_ssl($wsClient, math_number(0), math_number(0), math_number(0))
    websocket_server_create("wsServer", math_number(0))
    websocket_server_begin($wsServer)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, websocket_client_is_connected($wsClient))
    time_delay(math_number(1000))
```

## Notes

1. **Variable Creation**: `websocket_client_create("varName", ...)` creates variable `$varName`; reference with `$varName`
2. **Initialization**: Place init blocks inside `arduino_setup()`
3. **Parameter Order**: Follows `block.json` args0 order
