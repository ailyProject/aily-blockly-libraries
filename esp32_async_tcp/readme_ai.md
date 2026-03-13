# ESP32异步TCP库

ESP32异步TCP客户端和服务器库，支持非阻塞的TCP连接、数据收发和事件回调处理

## Library Info
- **Name**: @aily-project/lib-esp32-async-tcp
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `async_tcp_client_create` | Statement | VAR(field_input) | `async_tcp_client_create("tcpClient")` | `` |
| `async_tcp_client_connect` | Statement | VAR(field_variable), HOST(input_value), PORT(input_value) | `async_tcp_client_connect($tcpClient, math_number(0), math_number(0))` | (dynamic code) |
| `async_tcp_client_close` | Statement | VAR(field_variable) | `async_tcp_client_close($tcpClient)` | (dynamic code) |
| `async_tcp_client_write` | Statement | VAR(field_variable), DATA(input_value) | `async_tcp_client_write($tcpClient, math_number(0))` | (dynamic code) |
| `async_tcp_client_connected` | Value | VAR(field_variable) | `async_tcp_client_connected($tcpClient)` | (dynamic code) |
| `async_tcp_client_connecting` | Value | VAR(field_variable) | `async_tcp_client_connecting($tcpClient)` | (dynamic code) |
| `async_tcp_client_space` | Value | VAR(field_variable) | `async_tcp_client_space($tcpClient)` | (dynamic code) |
| `async_tcp_client_can_send` | Value | VAR(field_variable) | `async_tcp_client_can_send($tcpClient)` | (dynamic code) |
| `async_tcp_client_set_no_delay` | Statement | VAR(field_variable), NODELAY(field_checkbox) | `async_tcp_client_set_no_delay($tcpClient, TRUE)` | (dynamic code) |
| `async_tcp_client_set_rx_timeout` | Statement | VAR(field_variable), TIMEOUT(input_value) | `async_tcp_client_set_rx_timeout($tcpClient, math_number(1000))` | (dynamic code) |
| `async_tcp_client_remote_ip` | Value | VAR(field_variable) | `async_tcp_client_remote_ip($tcpClient)` | (dynamic code) |
| `async_tcp_client_remote_port` | Value | VAR(field_variable) | `async_tcp_client_remote_port($tcpClient)` | (dynamic code) |
| `async_tcp_client_local_port` | Value | VAR(field_variable) | `async_tcp_client_local_port($tcpClient)` | (dynamic code) |
| `async_tcp_client_on_connect` | Statement | VAR(field_variable) | `async_tcp_client_on_connect($tcpClient)` | `` |
| `async_tcp_client_on_disconnect` | Statement | VAR(field_variable) | `async_tcp_client_on_disconnect($tcpClient)` | `` |
| `async_tcp_client_on_data` | Statement | VAR(field_variable) | `async_tcp_client_on_data($tcpClient)` | `` |
| `async_tcp_client_on_error` | Statement | VAR(field_variable) | `async_tcp_client_on_error($tcpClient)` | `` |
| `async_tcp_client_on_ack` | Statement | VAR(field_variable) | `async_tcp_client_on_ack($tcpClient)` | `` |
| `async_tcp_client_on_timeout` | Statement | VAR(field_variable) | `async_tcp_client_on_timeout($tcpClient)` | `` |
| `async_tcp_client_error_to_string` | Value | ERROR(input_value) | `async_tcp_client_error_to_string(math_number(0))` | `AsyncClient::errorToString(` |
| `async_tcp_server_create` | Statement | VAR(field_input), PORT(input_value) | `async_tcp_server_create("tcpServer", math_number(0))` | `` |
| `async_tcp_server_begin` | Statement | VAR(field_variable) | `async_tcp_server_begin($tcpServer)` | (dynamic code) |
| `async_tcp_server_end` | Statement | VAR(field_variable) | `async_tcp_server_end($tcpServer)` | (dynamic code) |
| `async_tcp_server_set_no_delay` | Statement | VAR(field_variable), NODELAY(field_checkbox) | `async_tcp_server_set_no_delay($tcpServer, TRUE)` | (dynamic code) |
| `async_tcp_server_on_client` | Statement | VAR(field_variable) | `async_tcp_server_on_client($tcpServer)` | `` |

## ABS Examples

### Basic Usage
```
arduino_setup()
    async_tcp_client_create("tcpClient")
    async_tcp_server_create("tcpServer", math_number(0))
    async_tcp_server_begin($tcpServer)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, async_tcp_client_connected($tcpClient))
    time_delay(math_number(1000))
```

## Notes

1. **Variable Creation**: `async_tcp_client_create("varName", ...)` creates variable `$varName`; reference with `$varName`
2. **Initialization**: Place init blocks inside `arduino_setup()`
3. **Parameter Order**: Follows `block.json` args0 order
