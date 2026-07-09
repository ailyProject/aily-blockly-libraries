# ESP-NOW communication

ESP32 ESP-NOW wireless communication support library supports point-to-point communication, broadcast mode and network mode

## Library Info
- **Name**: @aily-project/lib-esp32-espnow
- **Version**: 1.0.2

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp_now_master_init` | Statement | CHANNEL(input_value) | `esp_now_master_init(math_number(0))` | Dynamic code |
| `esp_now_slave_init` | Statement | CHANNEL(input_value) | `esp_now_slave_init(math_number(0))` | Dynamic code |
| `esp_now_broadcast_message` | Statement | MESSAGE(input_value) | `esp_now_broadcast_message(text("value"))` | if (esp_now_broadcast != nullptr) {\n |
| `esp_now_on_message_received` | Hat | HANDLER(input_statement) | `esp_now_on_message_received() @HANDLER: child_block()` | Dynamic code |
| `esp_now_received_message` | Value | (none) | `esp_now_received_message()` | esp_now_rx_message |
| `esp_now_received_message_len` | Value | (none) | `esp_now_received_message_len()` | esp_now_rx_len |
| `esp_now_received_is_broadcast` | Value | (none) | `esp_now_received_is_broadcast()` | esp_now_rx_broadcast |
| `esp_now_received_sender_mac` | Value | (none) | `esp_now_received_sender_mac()` | esp_now_rx_sender_mac |
| `esp_now_reply_message` | Statement | MESSAGE(input_value) | `esp_now_reply_message(text("value"))` | espNowReplyMessage( |
| `esp_now_node_init` | Statement | CHANNEL(input_value) | `esp_now_node_init(math_number(0))` | Dynamic code |
| `esp_now_begin` | Statement | (none) | `esp_now_begin()` | Dynamic code |
| `esp_now_begin_with_pmk` | Statement | PMK(input_value) | `esp_now_begin_with_pmk(text("value"))` | Dynamic code |
| `esp_now_end` | Statement | (none) | `esp_now_end()` | ESP_NOW.end();\n |
| `esp_now_wifi_init` | Statement | MODE(dropdown), CHANNEL(input_value) | `esp_now_wifi_init(WIFI_STA, math_number(0))` | Dynamic code |
| `esp_now_create_peer` | Statement | VAR(field_input), MAC(input_value) | `esp_now_create_peer("peer1", text("value"))` | Dynamic code |
| `esp_now_create_peer_advanced` | Statement | VAR(field_input), MAC(input_value), CHANNEL(input_value), LMK(input_value) | `esp_now_create_peer_advanced("peer1", text("value"), math_number(0), text("value"))` | Dynamic code |
| `esp_now_create_broadcast_peer` | Statement | VAR(field_input) | `esp_now_create_broadcast_peer("broadcastPeer")` | Dynamic code |
| `esp_now_remove_peer` | Statement | VAR(field_variable) | `esp_now_remove_peer(variables_get($peer1))` | if ( |
| `esp_now_send` | Statement | VAR(field_variable), MESSAGE(input_value) | `esp_now_send(variables_get($peer1), text("value"))` | if ( |
| `esp_now_send_data` | Statement | VAR(field_variable), DATA(input_value), LEN(input_value) | `esp_now_send_data(variables_get($peer1), math_number(0), math_number(0))` | if ( |
| `esp_now_on_receive` | Hat | VAR(field_variable), HANDLER(input_statement) | `esp_now_on_receive(variables_get($peer1)) @HANDLER: child_block()` | Dynamic code |
| `esp_now_on_sent` | Hat | VAR(field_variable), HANDLER(input_statement) | `esp_now_on_sent(variables_get($peer1)) @HANDLER: child_block()` | Dynamic code |
| `esp_now_on_new_peer` | Hat | HANDLER(input_statement) | `esp_now_on_new_peer() @HANDLER: child_block()` | Dynamic code |
| `esp_now_received_data` | Value | (none) | `esp_now_received_data()` | esp_now_data |
| `esp_now_received_len` | Value | (none) | `esp_now_received_len()` | esp_now_len |
| `esp_now_is_broadcast` | Value | (none) | `esp_now_is_broadcast()` | esp_now_broadcast |
| `esp_now_send_success` | Value | (none) | `esp_now_send_success()` | esp_now_success |
| `esp_now_src_mac` | Value | (none) | `esp_now_src_mac()` | esp_now_src_mac_global |
| `esp_now_serial_create` | Statement | VAR(field_input), MAC(input_value), CHANNEL(input_value), MODE(dropdown) | `esp_now_serial_create("nowSerial", text("value"), math_number(0), WIFI_STA)` | if ( |
| `esp_now_serial_available` | Value | VAR(field_variable) | `esp_now_serial_available(variables_get($nowSerial))` | Dynamic code |
| `esp_now_serial_available_for_write` | Value | VAR(field_variable) | `esp_now_serial_available_for_write(variables_get($nowSerial))` | Dynamic code |
| `esp_now_serial_read` | Value | VAR(field_variable) | `esp_now_serial_read(variables_get($nowSerial))` | Dynamic code |
| `esp_now_serial_read_string` | Value | VAR(field_variable) | `esp_now_serial_read_string(variables_get($nowSerial))` | Dynamic code |
| `esp_now_serial_read_string_until` | Value | VAR(field_variable), TERMINATOR(input_value) | `esp_now_serial_read_string_until(variables_get($nowSerial), math_number(0))` | See generator |
| `esp_now_serial_print` | Statement | VAR(field_variable), DATA(input_value) | `esp_now_serial_print(variables_get($nowSerial), math_number(0))` | Dynamic code |
| `esp_now_serial_println` | Statement | VAR(field_variable), DATA(input_value) | `esp_now_serial_println(variables_get($nowSerial), math_number(0))` | Dynamic code |
| `esp_now_serial_write` | Value | VAR(field_variable), DATA(input_value) | `esp_now_serial_write(variables_get($nowSerial), math_number(0))` | Dynamic code |
| `esp_now_quick_broadcast` | Statement | MESSAGE(input_value), CHANNEL(input_value) | `esp_now_quick_broadcast(text("value"), math_number(0))` | espNowQuickBroadcast( |
| `esp_now_quick_send` | Statement | MAC(input_value), MESSAGE(input_value), CHANNEL(input_value) | `esp_now_quick_send(text("value"), text("value"), math_number(0))` | espNowQuickSend( |
| `esp_now_get_mac` | Value | (none) | `esp_now_get_mac()` | (WiFi.getMode() == WIFI_AP ? WiFi.softAPmacAddress() : WiFi.macAddress()) |
| `esp_now_get_max_data_len` | Value | (none) | `esp_now_get_max_data_len()` | ESP_NOW.getMaxDataLen() |
| `esp_now_get_peer_count` | Value | (none) | `esp_now_get_peer_count()` | ESP_NOW.getTotalPeerCount() |
| `esp_now_get_version` | Value | (none) | `esp_now_get_version()` | ESP_NOW.getVersion() |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | WIFI_STA, WIFI_AP, WIFI_AP_STA | esp_now_wifi_init |
| MODE | WIFI_STA, WIFI_AP | esp_now_serial_create |

## ABS Examples

### Basic Usage
```
arduino_setup()
    esp_now_master_init(math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, esp_now_received_message())
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `esp_now_create_peer("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
4. **Peer declaration order**: peer pointer declarations are emitted in the object section after the generated peer class definition, so create-peer blocks can be placed in setup without C++ type-order errors.
