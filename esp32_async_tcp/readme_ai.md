# ESP32 Asynchronous TCP Library

ESP32 asynchronous TCP client and server library, supporting non-blocking TCP connections, data sending and receiving, and event callback processing

## Library Info
- **Name**: @aily-project/lib-esp32-async-tcp
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `async_tcp_client_create` | Statement | VAR(field_input) | `async_tcp_client_create("tcpClient")` | Dynamic code |
| `async_tcp_client_connect` | Statement | VAR(field_variable), HOST(input_value), PORT(input_value) | `async_tcp_client_connect(variables_get($tcpClient), text("value"), math_number(0))` | Dynamic code |
| `async_tcp_client_close` | Statement | VAR(field_variable) | `async_tcp_client_close(variables_get($tcpClient))` | Dynamic code |
| `async_tcp_client_write` | Statement | VAR(field_variable), DATA(input_value) | `async_tcp_client_write(variables_get($tcpClient), text("value"))` | Dynamic code |
| `async_tcp_client_connected` | Value | VAR(field_variable) | `async_tcp_client_connected(variables_get($tcpClient))` | Dynamic code |
| `async_tcp_client_connecting` | Value | VAR(field_variable) | `async_tcp_client_connecting(variables_get($tcpClient))` | Dynamic code |
| `async_tcp_client_space` | Value | VAR(field_variable) | `async_tcp_client_space(variables_get($tcpClient))` | Dynamic code |
| `async_tcp_client_can_send` | Value | VAR(field_variable) | `async_tcp_client_can_send(variables_get($tcpClient))` | Dynamic code |
| `async_tcp_client_set_no_delay` | Statement | VAR(field_variable), NODELAY(field_checkbox) | `async_tcp_client_set_no_delay(variables_get($tcpClient), TRUE)` | Dynamic code |
| `async_tcp_client_set_rx_timeout` | Statement | VAR(field_variable), TIMEOUT(input_value) | `async_tcp_client_set_rx_timeout(variables_get($tcpClient), math_number(1000))` | Dynamic code |
| `async_tcp_client_remote_ip` | Value | VAR(field_variable) | `async_tcp_client_remote_ip(variables_get($tcpClient))` | Dynamic code |
| `async_tcp_client_remote_port` | Value | VAR(field_variable) | `async_tcp_client_remote_port(variables_get($tcpClient))` | Dynamic code |
| `async_tcp_client_local_port` | Value | VAR(field_variable) | `async_tcp_client_local_port(variables_get($tcpClient))` | Dynamic code |
| `async_tcp_client_on_connect` | Hat | VAR(field_variable), HANDLER(input_statement) | `async_tcp_client_on_connect(variables_get($tcpClient)) @HANDLER: child_block()` | Dynamic code |
| `async_tcp_client_on_disconnect` | Hat | VAR(field_variable), HANDLER(input_statement) | `async_tcp_client_on_disconnect(variables_get($tcpClient)) @HANDLER: child_block()` | Dynamic code |
| `async_tcp_client_on_data` | Hat | VAR(field_variable), DATA_VAR(field_input), LEN_VAR(field_input), HANDLER(input_statement) | `async_tcp_client_on_data(variables_get($tcpClient), "receivedData", "dataLength") @HANDLER: child_block()` | Dynamic code |
| `async_tcp_client_on_error` | Hat | VAR(field_variable), ERROR_VAR(field_input), HANDLER(input_statement) | `async_tcp_client_on_error(variables_get($tcpClient), "errorCode") @HANDLER: child_block()` | Dynamic code |
| `async_tcp_client_on_ack` | Hat | VAR(field_variable), LEN_VAR(field_input), TIME_VAR(field_input), HANDLER(input_statement) | `async_tcp_client_on_ack(variables_get($tcpClient), "ackLength", "ackTime") @HANDLER: child_block()` | Dynamic code |
| `async_tcp_client_on_timeout` | Hat | VAR(field_variable), TIME_VAR(field_input), HANDLER(input_statement) | `async_tcp_client_on_timeout(variables_get($tcpClient), "timeoutMs") @HANDLER: child_block()` | Dynamic code |
| `async_tcp_client_error_to_string` | Value | ERROR(input_value) | `async_tcp_client_error_to_string(math_number(0))` | AsyncClient::errorToString( |
| `async_tcp_server_create` | Statement | VAR(field_input), PORT(input_value) | `async_tcp_server_create("tcpServer", math_number(0))` | Dynamic code |
| `async_tcp_server_begin` | Statement | VAR(field_variable) | `async_tcp_server_begin(variables_get($tcpServer))` | Dynamic code |
| `async_tcp_server_end` | Statement | VAR(field_variable) | `async_tcp_server_end(variables_get($tcpServer))` | Dynamic code |
| `async_tcp_server_set_no_delay` | Statement | VAR(field_variable), NODELAY(field_checkbox) | `async_tcp_server_set_no_delay(variables_get($tcpServer), TRUE)` | Dynamic code |
| `async_tcp_server_on_client` | Hat | VAR(field_variable), CLIENT_VAR(field_input), HANDLER(input_statement) | `async_tcp_server_on_client(variables_get($tcpServer), "newClient") @HANDLER: child_block()` | Dynamic code |

## ABS Examples

### Basic Usage
```
arduino_setup()
    async_tcp_client_create("tcpClient")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, async_tcp_client_connected(variables_get($tcpClient)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `async_tcp_client_create("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
