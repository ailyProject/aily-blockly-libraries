# SparkFun WiFly Shield

Blockly wrapper for the SparkFun WiFly WiFi Shield.

## Library Info
- **Name**: @aily-project/lib-sparkfun-wifly
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `wifly_init` | Statement | (none) | `wifly_init()` | _wiflySerial.begin(9600);\nWiFly.begin(_wiflySerial);\n |
| `wifly_join` | Value | SSID(input_value), PASS(input_value) | `wifly_join(text("value"), math_number(0))` | WiFly.join( |
| `wifly_connected` | Value | (none) | `wifly_connected()` | WiFly.isConnected() |
| `wifly_open` | Value | HOST(input_value), PORT(input_value) | `wifly_open(text("value"), math_number(0))` | WiFly.open( |
| `wifly_print` | Statement | DATA(input_value) | `wifly_print(math_number(0))` | WiFly.print( |
| `wifly_available` | Value | (none) | `wifly_available()` | WiFly.available() |

## ABS Examples

### Basic Usage
```
arduino_setup()
    wifly_init()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, wifly_join(text("value"), math_number(0)))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
