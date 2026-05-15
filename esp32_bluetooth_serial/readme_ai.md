# ESP32 Bluetooth serial port

ESP32 classic Bluetooth serial communication supports data sending and receiving, connection management, etc.

## Library Info
- **Name**: @aily-project/lib-esp32-bluetooth-serial
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp32_btserial_begin` | Statement | NAME(input_value) | `esp32_btserial_begin(text("value"))` | SerialBT.begin( |
| `esp32_btserial_end` | Statement | (none) | `esp32_btserial_end()` | SerialBT.end();\n |
| `esp32_btserial_available` | Value | (none) | `esp32_btserial_available()` | SerialBT.available() |
| `esp32_btserial_read_string` | Value | (none) | `esp32_btserial_read_string()` | SerialBT.readString() |
| `esp32_btserial_read_byte` | Value | (none) | `esp32_btserial_read_byte()` | SerialBT.read() |
| `esp32_btserial_println` | Statement | DATA(input_value) | `esp32_btserial_println(math_number(0))` | SerialBT.println( |
| `esp32_btserial_print` | Statement | DATA(input_value) | `esp32_btserial_print(math_number(0))` | SerialBT.print( |
| `esp32_btserial_write` | Statement | DATA(input_value) | `esp32_btserial_write(math_number(0))` | SerialBT.write( |
| `esp32_btserial_connected` | Value | (none) | `esp32_btserial_connected()` | SerialBT.connected() |
| `esp32_btserial_has_client` | Value | (none) | `esp32_btserial_has_client()` | SerialBT.hasClient() |
| `esp32_btserial_disconnect` | Statement | (none) | `esp32_btserial_disconnect()` | SerialBT.disconnect();\n |
| `esp32_btserial_set_pin` | Statement | PIN(input_value) | `esp32_btserial_set_pin(text("value"))` | SerialBT.setPin( |
| `esp32_btserial_get_address` | Value | (none) | `esp32_btserial_get_address()` | SerialBT.getBtAddressString() |

## ABS Examples

### Basic Usage
```
arduino_setup()
    esp32_btserial_begin(text("value"))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, esp32_btserial_available())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
