# ESP32 ArduinoOTA

ESP32 Arduino OTA wireless update supports WiFi network OTA firmware update

## Library Info
- **Name**: @aily-project/lib-esp32-arduinoota
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp32_ota_begin` | Statement | (none) | `esp32_ota_begin()` | ArduinoOTA.begin();\n |
| `esp32_ota_handle` | Statement | (none) | `esp32_ota_handle()` | ArduinoOTA.handle();\n |
| `esp32_ota_set_hostname` | Statement | HOSTNAME(input_value) | `esp32_ota_set_hostname(text("value"))` | ArduinoOTA.setHostname( |
| `esp32_ota_set_password` | Statement | PASSWORD(input_value) | `esp32_ota_set_password(text("value"))` | ArduinoOTA.setPassword( |
| `esp32_ota_set_port` | Statement | PORT(input_value) | `esp32_ota_set_port(math_number(0))` | ArduinoOTA.setPort( |
| `esp32_ota_on_start` | Hat | HANDLER(input_statement) | `esp32_ota_on_start() @HANDLER: child_block()` | Dynamic code |
| `esp32_ota_on_end` | Hat | HANDLER(input_statement) | `esp32_ota_on_end() @HANDLER: child_block()` | Dynamic code |
| `esp32_ota_on_progress` | Hat | CUR_VAR(field_input), TOTAL_VAR(field_input), HANDLER(input_statement) | `esp32_ota_on_progress("progress", "total") @HANDLER: child_block()` | Dynamic code |
| `esp32_ota_on_error` | Hat | ERR_VAR(field_input), HANDLER(input_statement) | `esp32_ota_on_error("error") @HANDLER: child_block()` | Dynamic code |

## ABS Examples

### Basic Usage
```
arduino_setup()
    esp32_ota_begin()
    serial_begin(Serial, 9600)

arduino_loop()
    esp32_ota_handle()
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
