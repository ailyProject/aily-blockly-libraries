# ArduinoOTA

ArduinoOTA network firmware update library for WiFi and Ethernet uploads

## Library Info
- **Name**: @aily-project/lib-arduinoota
- **Version**: 1.1.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `arduinoota_config_begin` | Statement | (none) | `arduinoota_config_begin()` | ArduinoOTA.onStart(arduinoota_pc_on_start_callback);\n |
| `arduinoota_poll` | Statement | (none) | `arduinoota_poll()` | ArduinoOTA.poll();\n |
| `arduinoota_end` | Statement | (none) | `arduinoota_end()` | ArduinoOTA.end();\n |
| `arduinoota_on_start` | Hat | HANDLER(input_statement) | `arduinoota_on_start() @HANDLER: child_block()` | Dynamic code |
| `arduinoota_before_apply` | Hat | HANDLER(input_statement) | `arduinoota_before_apply() @HANDLER: child_block()` | Dynamic code |
| `arduinoota_on_error` | Hat | CODE_VAR(field_input), MESSAGE_VAR(field_input), HANDLER(input_statement) | `arduinoota_on_error("code", "message") @HANDLER: child_block()` | Dynamic code |

## ABS Examples

### Basic Usage
```
arduino_setup()
    arduinoota_config_begin()
    serial_begin(Serial, 9600)

arduino_loop()
    arduinoota_poll()
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
