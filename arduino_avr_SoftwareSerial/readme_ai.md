# Soft serial communication

A software simulation serial port library suitable for the AVR core, allowing serial port communication on any digital pin, supporting multiple soft serial port instances, baud rate configuration, data transceiver and...

## Library Info
- **Name**: @aily-project/lib-avr-softwareserial
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `softwareserial_init` | Statement | VAR(field_input), RX_PIN(dropdown), TX_PIN(dropdown), BAUD(dropdown) | `softwareserial_init("mySerial", RX_PIN, TX_PIN, "300")` | Dynamic code |
| `softwareserial_available` | Value | VAR(field_variable) | `softwareserial_available(variables_get($mySerial))` | Dynamic code |
| `softwareserial_read` | Value | VAR(field_variable), TYPE(dropdown) | `softwareserial_read(variables_get($mySerial), "read()")` | Dynamic code |
| `softwareserial_print` | Statement | VAR(field_variable), DATA(input_value) | `softwareserial_print(variables_get($mySerial), math_number(0))` | Dynamic code |
| `softwareserial_println` | Statement | VAR(field_variable), DATA(input_value) | `softwareserial_println(variables_get($mySerial), math_number(0))` | Dynamic code |
| `softwareserial_write` | Statement | VAR(field_variable), DATA(input_value) | `softwareserial_write(variables_get($mySerial), math_number(0))` | Dynamic code |
| `softwareserial_listen` | Statement | VAR(field_variable) | `softwareserial_listen(variables_get($mySerial))` | Dynamic code |
| `softwareserial_islistening` | Value | VAR(field_variable) | `softwareserial_islistening(variables_get($mySerial))` | Dynamic code |
| `softwareserial_overflow` | Value | VAR(field_variable) | `softwareserial_overflow(variables_get($mySerial))` | Dynamic code |
| `softwareserial_end` | Statement | VAR(field_variable) | `softwareserial_end(variables_get($mySerial))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| BAUD | 300, 1200, 2400, 4800, 9600, 14400, 19200, 28800, 38400, 57600, 115200 | softwareserial_init |
| TYPE | read(), peek(), parseInt(), parseFloat(), readString() | softwareserial_read |

## ABS Examples

### Basic Usage
```
arduino_setup()
    softwareserial_init("mySerial", RX_PIN, TX_PIN, "300")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, softwareserial_available(variables_get($mySerial)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `softwareserial_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
