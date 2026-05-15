# Serial communication

Serial communication library, supports serial port sending and receiving

## Library Info
- **Name**: @aily-project/lib-core-serial
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `serial_begin` | Statement | SERIAL(dropdown), SPEED(dropdown) | `serial_begin(SERIAL, SPEED)` | See generator |
| `serial_available` | Value | SERIAL(dropdown) | `serial_available(SERIAL)` | ....available() |
| `serial_read` | Value | SERIAL(dropdown), TYPE(dropdown) | `serial_read(SERIAL, "read()")` | Dynamic code |
| `serial_read_until` | Value | SERIAL(dropdown), TERMINATOR(input_value) | `serial_read_until(SERIAL, math_number(0))` | ....readStringUntil(...) |
| `serial_print` | Statement | SERIAL(dropdown), VAR(input_value) | `serial_print(SERIAL, math_number(0))` | ....print(...);\n |
| `serial_println` | Statement | SERIAL(dropdown), VAR(input_value) | `serial_println(SERIAL, math_number(0))` | ....println(...);\n |
| `serial_write` | Statement | SERIAL(dropdown), DATA(input_value) | `serial_write(SERIAL, math_number(0))` | ....write(...);\n |
| `serial_read_string` | Value | SERIAL(dropdown) | `serial_read_string(SERIAL)` | ....readString() |
| `serial_begin_esp32_custom` | Statement | VAR(field_input), UART(dropdown), SPEED(dropdown), RX(dropdown), TX(dropdown) | `serial_begin_esp32_custom("SerialCustom", UART0, SPEED, RX, TX)` | ....begin(..., SERIAL_8N1, ..., ...);\n |
| `serial_begin_software` | Statement | VAR(field_input), SPEED(dropdown), RX(dropdown), TX(dropdown) | `serial_begin_software("mySerial", SPEED, RX, TX)` | ....begin(...);\n |
| `serial_listen_software` | Statement | SERIAL_VAR(field_variable) | `serial_listen_software(variables_get($mySerial))` | ....listen();\n |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| TYPE | read(), peek(), parseInt(), parseFloat(), readString(), readStringUntil('\r'), readStringUntil('\n'), readStringUntil('\0') | serial_read |
| UART | UART0, UART1 | serial_begin_esp32_custom |

## ABS Examples

### Basic Usage
```
arduino_setup()
    serial_begin(SERIAL, SPEED)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, serial_available(SERIAL))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `serial_begin_esp32_custom("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
4. **Dynamic fields**: `serial_begin`, `serial_available`, `serial_read`, `serial_read_until`, `serial_print`, `serial_println`, `serial_write`, `serial_read_string`, `serial_begin_esp32_custom`, `serial_begin_software` may add fields at runtime through Blockly extensions.
