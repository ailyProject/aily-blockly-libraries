# WiFi OTA

Based on arduinoOTA

## Library Info
- **Name**: @aily-project/lib-arduinoota
- **Version**: 1.1.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `arduinoota_config_auto` | Statement | (none) | `arduinoota_config_auto()` | Dynamic code |
| `arduinoota_begin` | Statement | NAME(input_value), PASSWORD(input_value) | `arduinoota_begin(text("value"), text("value"))` | Dynamic code |
| `arduinoota_begin_advanced` | Statement | NETWORK(dropdown), STORAGE(dropdown), DISCOVERY(dropdown), NAME(input_value), PASSWORD(input_value) | `arduinoota_begin_advanced(WIFI_AUTO, InternalStorage, MDNS, text("value"), text("value"))` | Dynamic code |
| `arduinoota_poll` | Statement | (none) | `arduinoota_poll()` | ArduinoOTA.poll();\n |
| `arduinoota_handle` | Statement | (none) | `arduinoota_handle()` | ArduinoOTA.handle();\n |
| `arduinoota_end` | Statement | (none) | `arduinoota_end()` | ArduinoOTA.end();\n |
| `arduinoota_on_start` | Hat | HANDLER(input_statement) | `arduinoota_on_start() @HANDLER: child_block()` | Dynamic code |
| `arduinoota_before_apply` | Hat | HANDLER(input_statement) | `arduinoota_before_apply() @HANDLER: child_block()` | Dynamic code |
| `arduinoota_on_error` | Hat | CODE_VAR(field_input), MESSAGE_VAR(field_input), HANDLER(input_statement) | `arduinoota_on_error("code", "message") @HANDLER: child_block()` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| NETWORK | WIFI_AUTO, WIFI_NINA, WIFI101, WIFI_S3, WIFI_ESP_AT, ETHERNET, ETHERNET_ENC | arduinoota_begin_advanced |
| STORAGE | InternalStorage, SDStorage | arduinoota_begin_advanced |
| DISCOVERY | MDNS, NO_PORT | arduinoota_begin_advanced |

## ABS Examples

### Basic Usage
```
arduino_setup()
    arduinoota_config_auto()

arduino_loop()
    arduinoota_begin(text("value"), text("value"))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
