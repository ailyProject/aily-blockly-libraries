# ESP32 网络通信库

ESP32网络通信库，提供TCP客户端、TCP安全客户端（SSL/TLS）、TCP服务器和UDP通信功能

## Library Info
- **Name**: @aily-project/lib-esp32-network
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp32_network_client_create` | Statement | VAR(field_input) | `esp32_network_client_create("client")` | `NetworkClient` |
| `esp32_network_client_connect_ip` | Statement | VAR(field_variable), IP(input_value), PORT(input_value) | `esp32_network_client_connect_ip(variables_get($client), math_number(0), math_number(0))` | — |
| `esp32_network_client_connect_host` | Statement | VAR(field_variable), HOST(input_value), PORT(input_value) | `esp32_network_client_connect_host(variables_get($client), math_number(0), math_number(0))` | (dynamic code) |
| `esp32_networkclientsecure_create` | Statement | VAR(field_input) | `esp32_networkclientsecure_create("client")` | `NetworkClientSecure` |
| `esp32_networkclientsecure_set_insecure` | Statement | VAR(field_variable) | `esp32_networkclientsecure_set_insecure(variables_get($client))` | (dynamic code) |
| `esp32_networkclientsecure_set_ca_cert` | Statement | VAR(field_variable), CA_CERT(input_value) | `esp32_networkclientsecure_set_ca_cert(variables_get($client), math_number(0))` | (dynamic code) |
| `esp32_networkclientsecure_set_certificate` | Statement | VAR(field_variable), CERT(input_value) | `esp32_networkclientsecure_set_certificate(variables_get($client), math_number(0))` | (dynamic code) |
| `esp32_networkclientsecure_set_private_key` | Statement | VAR(field_variable), PRIVATE_KEY(input_value) | `esp32_networkclientsecure_set_private_key(variables_get($client), math_number(0))` | (dynamic code) |
| `esp32_networkclientsecure_set_psk` | Statement | VAR(field_variable), PSK_IDENT(input_value), PSK_KEY(input_value) | `esp32_networkclientsecure_set_psk(variables_get($client), math_number(0), math_number(0))` | (dynamic code) |
| `esp32_networkclientsecure_set_plain_start` | Statement | VAR(field_variable) | `esp32_networkclientsecure_set_plain_start(variables_get($client))` | (dynamic code) |
| `esp32_networkclientsecure_start_tls` | Value | VAR(field_variable) | `esp32_networkclientsecure_start_tls(variables_get($client))` | (dynamic code) |
| `esp32_networkclientsecure_set_handshake_timeout` | Statement | VAR(field_variable), TIMEOUT(input_value) | `esp32_networkclientsecure_set_handshake_timeout(variables_get($client), math_number(1000))` | (dynamic code) |
| `esp32_networkclientsecure_verify_fingerprint` | Value | VAR(field_variable), FINGERPRINT(input_value), DOMAIN(input_value) | `esp32_networkclientsecure_verify_fingerprint(variables_get($client), math_number(0), math_number(0))` | (dynamic code) |
| `esp32_networkclientsecure_get_peer_fingerprint` | Value | VAR(field_variable) | `esp32_networkclientsecure_get_peer_fingerprint(variables_get($client))` | `` |
| `esp32_networkclientsecure_last_error` | Value | VAR(field_variable) | `esp32_networkclientsecure_last_error(variables_get($client))` | `No error` |
| `esp32_network_client_print` | Statement | VAR(field_variable), DATA(input_value) | `esp32_network_client_print(variables_get($client), math_number(0))` | (dynamic code) |
| `esp32_network_client_println` | Statement | VAR(field_variable), DATA(input_value) | `esp32_network_client_println(variables_get($client), math_number(0))` | (dynamic code) |
| `esp32_network_client_available` | Value | VAR(field_variable) | `esp32_network_client_available(variables_get($client))` | (dynamic code) |
| `esp32_network_client_read` | Value | VAR(field_variable), TYPE(dropdown) | `esp32_network_client_read(variables_get($client), BYTE)` | (dynamic code) |
| `esp32_network_client_connected` | Value | VAR(field_variable) | `esp32_network_client_connected(variables_get($client))` | (dynamic code) |
| `esp32_network_client_stop` | Statement | VAR(field_variable) | `esp32_network_client_stop(variables_get($client))` | (dynamic code) |
| `esp32_network_server_create` | Statement | VAR(field_input), PORT(input_value), MAX_CLIENTS(input_value) | `esp32_network_server_create("server", math_number(0), math_number(0))` | `` |
| `esp32_network_server_begin` | Statement | VAR(field_variable) | `esp32_network_server_begin(variables_get($server))` | (dynamic code) |
| `esp32_network_server_accept` | Statement | VAR(field_variable), CLIENT_VAR(field_input) | `esp32_network_server_accept(variables_get($server), "client")` | `NetworkClient` |
| `esp32_network_server_stop` | Statement | VAR(field_variable) | `esp32_network_server_stop(variables_get($server))` | (dynamic code) |
| `esp32_network_udp_create` | Statement | VAR(field_input) | `esp32_network_udp_create("udp")` | `NetworkUDP` |
| `esp32_network_udp_begin` | Statement | VAR(field_variable), PORT(input_value) | `esp32_network_udp_begin(variables_get($udp), math_number(0))` | (dynamic code) |
| `esp32_network_udp_begin_packet` | Statement | VAR(field_variable), IP(input_value), PORT(input_value) | `esp32_network_udp_begin_packet(variables_get($udp), math_number(0), math_number(0))` | (dynamic code) |
| `esp32_network_udp_write` | Statement | VAR(field_variable), DATA(input_value) | `esp32_network_udp_write(variables_get($udp), math_number(0))` | (dynamic code) |
| `esp32_network_udp_end_packet` | Statement | VAR(field_variable) | `esp32_network_udp_end_packet(variables_get($udp))` | (dynamic code) |
| `esp32_network_udp_parse_packet` | Value | VAR(field_variable) | `esp32_network_udp_parse_packet(variables_get($udp))` | (dynamic code) |
| `esp32_network_udp_available` | Value | VAR(field_variable) | `esp32_network_udp_available(variables_get($udp))` | (dynamic code) |
| `esp32_network_udp_read` | Value | VAR(field_variable) | `esp32_network_udp_read(variables_get($udp))` | (dynamic code) |
| `esp32_network_udp_remote_ip` | Value | VAR(field_variable) | `esp32_network_udp_remote_ip(variables_get($udp))` | (dynamic code) |
| `esp32_network_udp_remote_port` | Value | VAR(field_variable) | `esp32_network_udp_remote_port(variables_get($udp))` | (dynamic code) |
| `esp32_network_udp_stop` | Statement | VAR(field_variable) | `esp32_network_udp_stop(variables_get($udp))` | (dynamic code) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| TYPE | BYTE, STRING, LINE | 单个字节 / 字符串 / 读到换行符 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    esp32_network_client_create("client")
    esp32_networkclientsecure_create("client")
    esp32_network_server_create("server", math_number(0), math_number(0))
    esp32_network_server_begin(variables_get($server))
    esp32_network_udp_create("udp")
    esp32_network_udp_begin(variables_get($udp), math_number(0))
    esp32_network_udp_begin_packet(variables_get($udp), math_number(0), math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, esp32_networkclientsecure_start_tls(variables_get($client)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable Creation**: `esp32_network_client_create("varName", ...)` creates variable `$varName`; reference with `variables_get($varName)`
2. **Initialization**: Place init blocks inside `arduino_setup()`
3. **Parameter Order**: Follows `block.json` args0 order
