# ArduinoBLE

ArduinoBLE support library, supports Arduino and ESP series

## Library Info
- **Name**: @aily-project/lib-arduino-ble
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ble_begin` | Statement | (none) | `ble_begin()` | BLE.begin();\n |
| `ble_scan` | Statement | (none) | `ble_scan()` | BLE.scan();\n |
| `ble_connect` | Statement | DEVICE(input_value) | `ble_connect(math_number(0))` | BLEDevice.connect( |
| `ble_disconnect` | Statement | (none) | `ble_disconnect()` | BLEDevice.disconnect();\n |
| `ble_read_characteristic` | Value | CHARACTERISTIC(input_value) | `ble_read_characteristic(math_number(0))` | Dynamic code |
| `ble_write_characteristic` | Statement | CHARACTERISTIC(input_value), VALUE(input_value) | `ble_write_characteristic(math_number(0), math_number(0))` | Dynamic code |

## ABS Examples

### Basic Usage
```
arduino_setup()
    ble_begin()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, ble_read_characteristic(math_number(0)))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
