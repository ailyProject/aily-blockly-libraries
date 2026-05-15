# QuickESPNow communication

QuickESPNow ESP-NOW communication library for fast wireless send, receive and callback handling on ESP32

## Library Info
- **Name**: @aily-project/lib-quickespnow
- **Version**: 0.8.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `quickespnow_init_current` | Statement | INTERFACE(dropdown), SEND_MODE(dropdown) | `quickespnow_init_current("0", true)` | quickEspNow.begin(CURRENT_WIFI_CHANNEL, |
| `quickespnow_init_channel` | Statement | CHANNEL(input_value), INTERFACE(dropdown), SEND_MODE(dropdown) | `quickespnow_init_channel(math_number(0), "0", true)` | quickEspNow.begin( |
| `quickespnow_stop` | Statement | (none) | `quickespnow_stop()` | quickEspNow.stop();\n |
| `quickespnow_set_channel` | Statement | CHANNEL(input_value) | `quickespnow_set_channel(math_number(0))` | quickEspNow.setChannel( |
| `quickespnow_enable_transmit` | Statement | ENABLE(input_value) | `quickespnow_enable_transmit(logic_boolean(TRUE))` | quickEspNow.enableTransmit( |
| `quickespnow_send_text` | Statement | MAC(input_value), MESSAGE(input_value) | `quickespnow_send_text(text("value"), text("value"))` | _quickespnow_last_send_result = _quickespnow_send_text_to_mac(String( |
| `quickespnow_send_broadcast_text` | Statement | MESSAGE(input_value) | `quickespnow_send_broadcast_text(text("value"))` | _quickespnow_last_send_result = _quickespnow_send_broadcast_text(String( |
| `quickespnow_on_received` | Hat | HANDLER(input_statement) | `quickespnow_on_received() @HANDLER: child_block()` | Dynamic code |
| `quickespnow_on_sent` | Hat | HANDLER(input_statement) | `quickespnow_on_sent() @HANDLER: child_block()` | Dynamic code |
| `quickespnow_ready_to_send` | Value | (none) | `quickespnow_ready_to_send()` | quickEspNow.readyToSendData() |
| `quickespnow_last_send_result` | Value | (none) | `quickespnow_last_send_result()` | _quickespnow_last_send_result |
| `quickespnow_get_max_message_length` | Value | (none) | `quickespnow_get_max_message_length()` | quickEspNow.getMaxMessageLength() |
| `quickespnow_get_address_length` | Value | (none) | `quickespnow_get_address_length()` | quickEspNow.getAddressLength() |
| `quickespnow_received_message` | Value | (none) | `quickespnow_received_message()` | _quickespnow_rx_message |
| `quickespnow_received_length` | Value | (none) | `quickespnow_received_length()` | _quickespnow_rx_length |
| `quickespnow_received_rssi` | Value | (none) | `quickespnow_received_rssi()` | _quickespnow_rx_rssi |
| `quickespnow_received_is_broadcast` | Value | (none) | `quickespnow_received_is_broadcast()` | _quickespnow_rx_is_broadcast |
| `quickespnow_received_sender_mac` | Value | (none) | `quickespnow_received_sender_mac()` | _quickespnow_rx_sender_mac |
| `quickespnow_sent_target_mac` | Value | (none) | `quickespnow_sent_target_mac()` | _quickespnow_tx_target_mac |
| `quickespnow_sent_status` | Value | (none) | `quickespnow_sent_status()` | _quickespnow_tx_status |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| INTERFACE | 0, WIFI_IF_STA, WIFI_IF_AP | quickespnow_init_current, quickespnow_init_channel |
| SEND_MODE | true, false | quickespnow_init_current, quickespnow_init_channel |

## ABS Examples

### Basic Usage
```
arduino_setup()
    quickespnow_init_current("0", true)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, quickespnow_ready_to_send())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
