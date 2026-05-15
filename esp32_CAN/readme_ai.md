# ESP32 CAN bus

ESP32 CAN (TWAI) communication library supports sending and receiving CAN messages, suitable for ESP32 series development boards

## Library Info
- **Name**: @aily-project/lib-esp32-twai
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp32_can_init` | Statement | RX_PIN(field_number), TX_PIN(field_number), MODE(dropdown), SPEED(dropdown) | `esp32_can_init(21, 22, TWAI_MODE_NORMAL, "TWAI_TIMING_CONFIG_500KBITS()")` | // Initialize configuration structures using macro initializers twai_general_config_t g_co |
| `esp32_can_configure_alerts` | Statement | RX_DATA(field_checkbox), TX_IDLE(field_checkbox), TX_SUCCESS(field_checkbox), TX_FAILED(field_checkbox), ERR_PASS(field_checkbox), BUS_ERROR(field_checkbox),... | `esp32_can_configure_alerts(FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE)` | // Reconfigure alerts uint32_t alerts_to_enable = ...; twai_reconfigure_alerts(alerts_to_e |
| `esp32_can_send_message` | Statement | ID(field_number), LENGTH(field_number), DATA(field_input) | `esp32_can_send_message(0, 4, "0,0,0,0")` | { // Parse data string into array String dataStr = "..."; uint8_t dataArray[8] = {0}; int |
| `esp32_can_receive_message` | Statement | (none) | `esp32_can_receive_message()` | { // Check if message is received twai_message_t message; if (twai_receive(&message, 0) == |
| `esp32_can_check_alerts` | Statement | (none) | `esp32_can_check_alerts()` | { // Check if alert happened twai_read_alerts(&alerts_triggered, pdMS_TO_TICKS(POLLING_RAT |
| `esp32_can_message_available` | Value | (none) | `esp32_can_message_available()` | new_message_available |
| `esp32_can_get_message_id` | Value | (none) | `esp32_can_get_message_id()` | last_received_message.identifier |
| `esp32_can_get_message_length` | Value | (none) | `esp32_can_get_message_length()` | last_received_message.data_length_code |
| `esp32_can_get_message_data` | Value | INDEX(field_number) | `esp32_can_get_message_data(0)` | last_received_message.data[...] |
| `esp32_can_transmit_interval` | Statement | INTERVAL(field_number) | `esp32_can_transmit_interval(1000)` | { // Setup timer for periodic transmission unsigned long currentMillis = millis(); if (cur |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | TWAI_MODE_NORMAL, TWAI_MODE_LISTEN_ONLY | esp32_can_init |
| SPEED | TWAI_TIMING_CONFIG_500KBITS(), TWAI_TIMING_CONFIG_100KBITS(), TWAI_TIMING_CONFIG_125KBITS(), TWAI_TIMING_CONFIG_250KBITS(), TWAI_TIMING_CONFIG_1MBITS() | esp32_can_init |

## ABS Examples

### Basic Usage
```
arduino_setup()
    esp32_can_init(21, 22, TWAI_MODE_NORMAL, "TWAI_TIMING_CONFIG_500KBITS()")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, esp32_can_message_available())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
