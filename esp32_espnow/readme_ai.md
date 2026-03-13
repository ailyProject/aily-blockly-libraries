# ESP-NOW通信

ESP32 ESP-NOW无线通信支持库，支持点对点通信、广播模式和网络模式

## Library Info
- **Name**: @aily-project/lib-esp32-espnow
- **Version**: 1.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp_now_master_init` | Statement | CHANNEL(input_value) | `esp_now_master_init(math_number(0))` | `` |
| `esp_now_slave_init` | Statement | CHANNEL(input_value) | `esp_now_slave_init(math_number(0))` | `` |
| `esp_now_broadcast_message` | Statement | MESSAGE(input_value) | `esp_now_broadcast_message(text("hello"))` | `if (esp_now_broadcast != nullptr) {\n` |
| `esp_now_on_message_received` | Statement | (none) | `esp_now_on_message_received()` | `` |
| `esp_now_received_message` | Value | (none) | `esp_now_received_message()` | `esp_now_rx_message` |
| `esp_now_received_message_len` | Value | (none) | `esp_now_received_message_len()` | `esp_now_rx_len` |
| `esp_now_received_is_broadcast` | Value | (none) | `esp_now_received_is_broadcast()` | `esp_now_rx_broadcast` |
| `esp_now_received_sender_mac` | Value | (none) | `esp_now_received_sender_mac()` | `esp_now_rx_sender_mac` |
| `esp_now_reply_message` | Statement | MESSAGE(input_value) | `esp_now_reply_message(text("hello"))` | `espNowReplyMessage(` |
| `esp_now_node_init` | Statement | CHANNEL(input_value) | `esp_now_node_init(math_number(0))` | `` |
| `esp_now_begin` | Statement | (none) | `esp_now_begin()` | `` |
| `esp_now_begin_with_pmk` | Statement | PMK(input_value) | `esp_now_begin_with_pmk(math_number(0))` | `` |
| `esp_now_end` | Statement | (none) | `esp_now_end()` | `ESP_NOW.end();\n` |
| `esp_now_wifi_init` | Statement | MODE(dropdown), CHANNEL(input_value) | `esp_now_wifi_init(WIFI_STA, math_number(0))` | `` |
| `esp_now_create_peer` | Statement | VAR(field_input), MAC(input_value) | `esp_now_create_peer("peer1", math_number(0))` | `` |
| `esp_now_create_peer_advanced` | Statement | VAR(field_input), MAC(input_value), CHANNEL(input_value), LMK(input_value) | `esp_now_create_peer_advanced("peer1", math_number(0), math_number(0), math_number(0))` | `` |
| `esp_now_create_broadcast_peer` | Statement | VAR(field_input) | `esp_now_create_broadcast_peer("broadcastPeer")` | `` |
| `esp_now_remove_peer` | Statement | VAR(field_variable) | `esp_now_remove_peer($peer1)` | `if (` |
| `esp_now_send` | Statement | VAR(field_variable), MESSAGE(input_value) | `esp_now_send($peer1, text("hello"))` | `if (` |
| `esp_now_send_data` | Statement | VAR(field_variable), DATA(input_value), LEN(input_value) | `esp_now_send_data($peer1, math_number(0), math_number(0))` | `if (` |
| `esp_now_on_receive` | Statement | VAR(field_variable) | `esp_now_on_receive($peer1)` | `` |
| `esp_now_on_sent` | Statement | VAR(field_variable) | `esp_now_on_sent($peer1)` | `` |
| `esp_now_on_new_peer` | Statement | (none) | `esp_now_on_new_peer()` | `` |
| `esp_now_received_data` | Value | (none) | `esp_now_received_data()` | `esp_now_data` |
| `esp_now_received_len` | Value | (none) | `esp_now_received_len()` | `esp_now_len` |
| `esp_now_is_broadcast` | Value | (none) | `esp_now_is_broadcast()` | `esp_now_broadcast` |
| `esp_now_send_success` | Value | (none) | `esp_now_send_success()` | `esp_now_success` |
| `esp_now_src_mac` | Value | (none) | `esp_now_src_mac()` | `esp_now_src_mac_global` |
| `esp_now_serial_create` | Statement | VAR(field_input), MAC(input_value), CHANNEL(input_value), MODE(dropdown) | `esp_now_serial_create("nowSerial", math_number(0), math_number(0), WIFI_STA)` | `` |
| `esp_now_serial_available` | Value | VAR(field_variable) | `esp_now_serial_available($nowSerial)` | (dynamic code) |
| `esp_now_serial_available_for_write` | Value | VAR(field_variable) | `esp_now_serial_available_for_write($nowSerial)` | (dynamic code) |
| `esp_now_serial_read` | Value | VAR(field_variable) | `esp_now_serial_read($nowSerial)` | (dynamic code) |
| `esp_now_serial_read_string` | Value | VAR(field_variable) | `esp_now_serial_read_string($nowSerial)` | (dynamic code) |
| `esp_now_serial_read_string_until` | Value | VAR(field_variable), TERMINATOR(input_value) | `esp_now_serial_read_string_until($nowSerial, math_number(0))` | — |
| `esp_now_serial_print` | Statement | VAR(field_variable), DATA(input_value) | `esp_now_serial_print($nowSerial, math_number(0))` | (dynamic code) |
| `esp_now_serial_println` | Statement | VAR(field_variable), DATA(input_value) | `esp_now_serial_println($nowSerial, math_number(0))` | (dynamic code) |
| `esp_now_serial_write` | Value | VAR(field_variable), DATA(input_value) | `esp_now_serial_write($nowSerial, math_number(0))` | (dynamic code) |
| `esp_now_quick_broadcast` | Statement | MESSAGE(input_value), CHANNEL(input_value) | `esp_now_quick_broadcast(text("hello"), math_number(0))` | `espNowQuickBroadcast(` |
| `esp_now_quick_send` | Statement | MAC(input_value), MESSAGE(input_value), CHANNEL(input_value) | `esp_now_quick_send(math_number(0), text("hello"), math_number(0))` | `espNowQuickSend(` |
| `esp_now_get_mac` | Value | (none) | `esp_now_get_mac()` | `(WiFi.getMode() == WIFI_AP ? WiFi.softAPmacAddress() : WiFi.macAddress())` |
| `esp_now_get_max_data_len` | Value | (none) | `esp_now_get_max_data_len()` | `ESP_NOW.getMaxDataLen()` |
| `esp_now_get_peer_count` | Value | (none) | `esp_now_get_peer_count()` | `ESP_NOW.getTotalPeerCount()` |
| `esp_now_get_version` | Value | (none) | `esp_now_get_version()` | `ESP_NOW.getVersion()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | WIFI_STA, WIFI_AP, WIFI_AP_STA | STA（站点模式） / AP（热点模式） / AP+STA（混合模式） |

## ABS Examples

### Basic Usage
```
arduino_setup()
    esp_now_master_init(math_number(0))
    esp_now_slave_init(math_number(0))
    esp_now_node_init(math_number(0))
    esp_now_begin()
    esp_now_begin_with_pmk(math_number(0))
    esp_now_wifi_init(WIFI_STA, math_number(0))
    esp_now_create_peer("peer1", math_number(0))
    esp_now_create_peer_advanced("peer1", math_number(0), math_number(0), math_number(0))
    esp_now_create_broadcast_peer("broadcastPeer")
    esp_now_serial_create("nowSerial", math_number(0), math_number(0), WIFI_STA)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, esp_now_received_message())
    time_delay(math_number(1000))
```

## Notes

1. **Variable Creation**: `esp_now_create_peer("varName", ...)` creates variable `$varName`; reference with `$varName`
2. **Initialization**: Place init blocks inside `arduino_setup()`
3. **Parameter Order**: Follows `block.json` args0 order
