# Serial communication

Serial communication library, supports serial port sending and receiving

## Library Info
- **Name**: @aily-project/lib-core-serial
- **Version**: 0.0.2

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `serial_begin` | Statement | SERIAL(dropdown), SPEED(dropdown) | `serial_begin(SERIAL, SPEED)` | `SERIAL.begin(SPEED);` |
| `serial_wait_for_connection` | Statement | SERIAL(dropdown) | `serial_wait_for_connection(SERIAL)` | `while (!SERIAL) { ↵ delay(10); ↵ }` |
| `serial_available` | Value | SERIAL(dropdown) | `serial_available(SERIAL)` | `SERIAL.available()` |
| `serial_read` | Value | SERIAL(dropdown), TYPE(dropdown) | `serial_read(SERIAL, "read()")` | `SERIAL.read()` |
| `serial_read_until` | Value | SERIAL(dropdown), TERMINATOR(input_value) | `serial_read_until(SERIAL, math_number(0))` | `SERIAL.readStringUntil('\n')` |
| `serial_print` | Statement | SERIAL(dropdown), VAR(input_value) | `serial_print(SERIAL, math_number(0))` | `SERIAL.print(1);` |
| `serial_println` | Statement | SERIAL(dropdown), VAR(input_value) | `serial_println(SERIAL, math_number(0))` | `SERIAL.println(1);` |
| `serial_write` | Statement | SERIAL(dropdown), DATA(input_value) | `serial_write(SERIAL, math_number(0))` | `SERIAL.write(1);` |
| `serial_read_string` | Value | SERIAL(dropdown) | `serial_read_string(SERIAL)` | `SERIAL.readString()` |
| `serial_begin_esp32_custom` | Statement | VAR(field_input), UART(dropdown), SPEED(dropdown), RX(dropdown), TX(dropdown) | `serial_begin_esp32_custom("SerialCustom", UART0, SPEED, RX, TX)` | `HardwareSerial SerialCustom(0); ↵ SerialCustom.begin(SPEED, SERIAL_8N1, RX, TX);` |
| `serial_begin_software` | Statement | VAR(field_input), SPEED(dropdown), RX(dropdown), TX(dropdown) | `serial_begin_software("mySerial", SPEED, RX, TX)` | `SoftwareSerial mySerial(RX, TX); ↵ mySerial.begin(SPEED);` |
| `serial_listen_software` | Statement | SERIAL_VAR(field_variable) | `serial_listen_software($mySerial)` | `mySerial.listen();` |

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
    serial_wait_for_connection(Serial)

arduino_loop()
    serial_println(Serial, serial_available(SERIAL))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `serial_begin_esp32_custom("varName", ...)` creates variable `$varName`; pass `$varName` directly to `field_variable` slots; use `variables_get($varName)` only for `input_value` slots.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
4. **UI-only extensions**: serial extensions refresh existing serial-port dropdowns and variable metadata; they do not add ABS arguments.
