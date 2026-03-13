# ESP32 网络通信库

ESP32网络通信库，提供TCP客户端、TCP安全客户端（SSL/TLS）、TCP服务器和UDP通信功能

## Library Info
- **Name**: @aily-project/lib-esp32-network
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp32_network_client_create` | Statement | VAR(field_input) | `esp32_network_client_create("client")` | `NetworkClient` |
| `esp32_network_client_connect_ip` | Statement | VAR(field_variable), IP(input_value), PORT(input_value) | `esp32_network_client_connect_ip($client, math_number(0), math_number(0))` | — |
| `esp32_network_client_connect_host` | Statement | VAR(field_variable), HOST(input_value), PORT(input_value) | `esp32_network_client_connect_host($client, math_number(0), math_number(0))` | (dynamic code) |
| `esp32_networkclientsecure_create` | Statement | VAR(field_input) | `esp32_networkclientsecure_create("client")` | `NetworkClientSecure` |
| `esp32_networkclientsecure_set_insecure` | Statement | VAR(field_variable) | `esp32_networkclientsecure_set_insecure($client)` | (dynamic code) |
| `esp32_networkclientsecure_set_ca_cert` | Statement | VAR(field_variable), CA_CERT(input_value) | `esp32_networkclientsecure_set_ca_cert($client, math_number(0))` | (dynamic code) |
| `esp32_networkclientsecure_set_certificate` | Statement | VAR(field_variable), CERT(input_value) | `esp32_networkclientsecure_set_certificate($client, math_number(0))` | (dynamic code) |
| `esp32_networkclientsecure_set_private_key` | Statement | VAR(field_variable), PRIVATE_KEY(input_value) | `esp32_networkclientsecure_set_private_key($client, math_number(0))` | (dynamic code) |
| `esp32_networkclientsecure_set_psk` | Statement | VAR(field_variable), PSK_IDENT(input_value), PSK_KEY(input_value) | `esp32_networkclientsecure_set_psk($client, math_number(0), math_number(0))` | (dynamic code) |
| `esp32_networkclientsecure_set_plain_start` | Statement | VAR(field_variable) | `esp32_networkclientsecure_set_plain_start($client)` | (dynamic code) |
| `esp32_networkclientsecure_start_tls` | Value | VAR(field_variable) | `esp32_networkclientsecure_start_tls($client)` | (dynamic code) |
| `esp32_networkclientsecure_set_handshake_timeout` | Statement | VAR(field_variable), TIMEOUT(input_value) | `esp32_networkclientsecure_set_handshake_timeout($client, math_number(1000))` | (dynamic code) |
| `esp32_networkclientsecure_verify_fingerprint` | Value | VAR(field_variable), FINGERPRINT(input_value), DOMAIN(input_value) | `esp32_networkclientsecure_verify_fingerprint($client, math_number(0), math_number(0))` | (dynamic code) |
| `esp32_networkclientsecure_get_peer_fingerprint` | Value | VAR(field_variable) | `esp32_networkclientsecure_get_peer_fingerprint($client)` | `` |
| `esp32_networkclientsecure_last_error` | Value | VAR(field_variable) | `esp32_networkclientsecure_last_error($client)` | `No error` |
| `esp32_network_client_print` | Statement | VAR(field_variable), DATA(input_value) | `esp32_network_client_print($client, math_number(0))` | (dynamic code) |
| `esp32_network_client_println` | Statement | VAR(field_variable), DATA(input_value) | `esp32_network_client_println($client, math_number(0))` | (dynamic code) |
| `esp32_network_client_available` | Value | VAR(field_variable) | `esp32_network_client_available($client)` | (dynamic code) |
| `esp32_network_client_read` | Value | VAR(field_variable), TYPE(dropdown) | `esp32_network_client_read($client, BYTE)` | (dynamic code) |
| `esp32_network_client_connected` | Value | VAR(field_variable) | `esp32_network_client_connected($client)` | (dynamic code) |
| `esp32_network_client_stop` | Statement | VAR(field_variable) | `esp32_network_client_stop($client)` | (dynamic code) |
| `esp32_network_server_create` | Statement | VAR(field_input), PORT(input_value), MAX_CLIENTS(input_value) | `esp32_network_server_create("server", math_number(0), math_number(0))` | `` |
| `esp32_network_server_begin` | Statement | VAR(field_variable) | `esp32_network_server_begin($server)` | (dynamic code) |
| `esp32_network_server_accept` | Statement | VAR(field_variable), CLIENT_VAR(field_input) | `esp32_network_server_accept($server, "client")` | `NetworkClient` |
| `esp32_network_server_stop` | Statement | VAR(field_variable) | `esp32_network_server_stop($server)` | (dynamic code) |
| `esp32_network_udp_create` | Statement | VAR(field_input) | `esp32_network_udp_create("udp")` | `NetworkUDP` |
| `esp32_network_udp_begin` | Statement | VAR(field_variable), PORT(input_value) | `esp32_network_udp_begin($udp, math_number(0))` | (dynamic code) |
| `esp32_network_udp_begin_packet` | Statement | VAR(field_variable), IP(input_value), PORT(input_value) | `esp32_network_udp_begin_packet($udp, math_number(0), math_number(0))` | (dynamic code) |
| `esp32_network_udp_write` | Statement | VAR(field_variable), DATA(input_value) | `esp32_network_udp_write($udp, math_number(0))` | (dynamic code) |
| `esp32_network_udp_end_packet` | Statement | VAR(field_variable) | `esp32_network_udp_end_packet($udp)` | (dynamic code) |
| `esp32_network_udp_parse_packet` | Value | VAR(field_variable) | `esp32_network_udp_parse_packet($udp)` | (dynamic code) |
| `esp32_network_udp_available` | Value | VAR(field_variable) | `esp32_network_udp_available($udp)` | (dynamic code) |
| `esp32_network_udp_read` | Value | VAR(field_variable) | `esp32_network_udp_read($udp)` | (dynamic code) |
| `esp32_network_udp_remote_ip` | Value | VAR(field_variable) | `esp32_network_udp_remote_ip($udp)` | (dynamic code) |
| `esp32_network_udp_remote_port` | Value | VAR(field_variable) | `esp32_network_udp_remote_port($udp)` | (dynamic code) |
| `esp32_network_udp_stop` | Statement | VAR(field_variable) | `esp32_network_udp_stop($udp)` | (dynamic code) |

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
    esp32_network_server_begin($server)
    esp32_network_udp_create("udp")
    esp32_network_udp_begin($udp, math_number(0))
    esp32_network_udp_begin_packet($udp, math_number(0), math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, esp32_networkclientsecure_start_tls($client))
    time_delay(math_number(1000))
```

## Notes

1. **Variable Creation**: `esp32_network_client_create("varName", ...)` creates variable `$varName`; reference with `$varName`
2. **Initialization**: Place init blocks inside `arduino_setup()`
3. **Parameter Order**: Follows `block.json` args0 order
