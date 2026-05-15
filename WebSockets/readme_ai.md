# WebSockets

WebSocket client and server library, based on RFC6455 standard, supports multiple hardware platforms such as ESP32/ESP8266

## Library Info
- **Name**: @aily-project/lib-websockets
- **Version**: 2.7.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `websocket_client_create` | Statement | VAR(field_input) | `websocket_client_create("wsClient")` | Dynamic code |
| `websocket_client_begin` | Statement | VAR(field_variable), HOST(input_value), PORT(input_value), URL(input_value) | `websocket_client_begin(variables_get($wsClient), text("value"), math_number(0), text("value"))` | Dynamic code |
| `websocket_client_begin_ssl` | Statement | VAR(field_variable), HOST(input_value), PORT(input_value), URL(input_value) | `websocket_client_begin_ssl(variables_get($wsClient), text("value"), math_number(0), text("value"))` | Dynamic code |
| `websocket_client_on_event` | Hat | VAR(field_variable), HANDLER(input_statement) | `websocket_client_on_event(variables_get($wsClient)) @HANDLER: child_block()` | Dynamic code |
| `websocket_client_send_text` | Statement | VAR(field_variable), TEXT(input_value) | `websocket_client_send_text(variables_get($wsClient), text("value"))` | Dynamic code |
| `websocket_client_send_binary` | Statement | VAR(field_variable), DATA(input_value) | `websocket_client_send_binary(variables_get($wsClient), text("value"))` | Dynamic code |
| `websocket_client_disconnect` | Statement | VAR(field_variable) | `websocket_client_disconnect(variables_get($wsClient))` | Dynamic code |
| `websocket_client_is_connected` | Value | VAR(field_variable) | `websocket_client_is_connected(variables_get($wsClient))` | Dynamic code |
| `websocket_client_set_reconnect` | Statement | VAR(field_variable), INTERVAL(input_value) | `websocket_client_set_reconnect(variables_get($wsClient), math_number(1000))` | Dynamic code |
| `websocket_client_enable_heartbeat` | Statement | VAR(field_variable), PING_INTERVAL(input_value), PONG_TIMEOUT(input_value), DISCONNECT_COUNT(input_value) | `websocket_client_enable_heartbeat(variables_get($wsClient), math_number(2), math_number(1000), math_number(0))` | Dynamic code |
| `websocket_server_create` | Statement | VAR(field_input), PORT(input_value) | `websocket_server_create("wsServer", math_number(0))` | Dynamic code |
| `websocket_server_begin` | Statement | VAR(field_variable) | `websocket_server_begin(variables_get($wsServer))` | Dynamic code |
| `websocket_server_on_event` | Hat | VAR(field_variable), HANDLER(input_statement) | `websocket_server_on_event(variables_get($wsServer)) @HANDLER: child_block()` | Dynamic code |
| `websocket_server_send_text` | Statement | VAR(field_variable), CLIENT_NUM(input_value), TEXT(input_value) | `websocket_server_send_text(variables_get($wsServer), math_number(0), text("value"))` | Dynamic code |
| `websocket_server_broadcast_text` | Statement | VAR(field_variable), TEXT(input_value) | `websocket_server_broadcast_text(variables_get($wsServer), text("value"))` | Dynamic code |
| `websocket_server_send_binary` | Statement | VAR(field_variable), CLIENT_NUM(input_value), DATA(input_value) | `websocket_server_send_binary(variables_get($wsServer), math_number(0), text("value"))` | Dynamic code |
| `websocket_server_broadcast_binary` | Statement | VAR(field_variable), DATA(input_value) | `websocket_server_broadcast_binary(variables_get($wsServer), text("value"))` | Dynamic code |
| `websocket_server_disconnect` | Statement | VAR(field_variable), CLIENT_NUM(input_value) | `websocket_server_disconnect(variables_get($wsServer), math_number(0))` | Dynamic code |
| `websocket_server_disconnect_all` | Statement | VAR(field_variable) | `websocket_server_disconnect_all(variables_get($wsServer))` | Dynamic code |
| `websocket_server_connected_clients` | Value | VAR(field_variable) | `websocket_server_connected_clients(variables_get($wsServer))` | Dynamic code |
| `websocket_server_client_connected` | Value | VAR(field_variable), CLIENT_NUM(input_value) | `websocket_server_client_connected(variables_get($wsServer), math_number(0))` | Dynamic code |
| `websocket_event_type` | Value | TYPE(dropdown) | `websocket_event_type(WStype_DISCONNECTED)` | WStype_DISCONNECTED |
| `websocket_event_payload` | Value | PAYLOAD(dropdown) | `websocket_event_payload(TYPE)` | type |
| `websocket_event_payload_length` | Value | (none) | `websocket_event_payload_length()` | length |
| `websocket_event_client_num` | Value | (none) | `websocket_event_client_num()` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| TYPE | WStype_DISCONNECTED, WStype_CONNECTED, WStype_TEXT, WStype_BIN, WStype_PING, WStype_PONG, WStype_ERROR | websocket_event_type |
| PAYLOAD | TYPE, PAYLOAD, PAYLOAD_CHAR | websocket_event_payload |

## ABS Examples

### Basic Usage
```
arduino_setup()
    websocket_client_create("wsClient")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, websocket_client_is_connected(variables_get($wsClient)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `websocket_client_create("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
