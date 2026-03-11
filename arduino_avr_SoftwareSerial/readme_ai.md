# 软串口通信

适用于AVR内核的软件模拟串口库，允许在任意数字引脚上进行串口通信，支持多个软串口实例、波特率配置、数据收发等功能。

## Library Info
- **Name**: @aily-project/lib-avr-softwareserial
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `softwareserial_init` | Statement | VAR(field_input), RX_PIN(dropdown), TX_PIN(dropdown), BAUD(dropdown) | `softwareserial_init("mySerial", RX_PIN, TX_PIN, 300)` | (dynamic code) |
| `softwareserial_available` | Value | VAR(field_variable) | `softwareserial_available(variables_get($mySerial))` | (dynamic code) |
| `softwareserial_read` | Value | VAR(field_variable), TYPE(dropdown) | `softwareserial_read(variables_get($mySerial), read())` | (dynamic code) |
| `softwareserial_print` | Statement | VAR(field_variable), DATA(input_value) | `softwareserial_print(variables_get($mySerial), math_number(0))` | (dynamic code) |
| `softwareserial_println` | Statement | VAR(field_variable), DATA(input_value) | `softwareserial_println(variables_get($mySerial), math_number(0))` | (dynamic code) |
| `softwareserial_write` | Statement | VAR(field_variable), DATA(input_value) | `softwareserial_write(variables_get($mySerial), math_number(0))` | (dynamic code) |
| `softwareserial_listen` | Statement | VAR(field_variable) | `softwareserial_listen(variables_get($mySerial))` | (dynamic code) |
| `softwareserial_islistening` | Value | VAR(field_variable) | `softwareserial_islistening(variables_get($mySerial))` | (dynamic code) |
| `softwareserial_overflow` | Value | VAR(field_variable) | `softwareserial_overflow(variables_get($mySerial))` | (dynamic code) |
| `softwareserial_end` | Statement | VAR(field_variable) | `softwareserial_end(variables_get($mySerial))` | (dynamic code) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| BAUD | 300, 1200, 2400, 4800, 9600, 14400, 19200, 28800, 38400, 57600, 115200 | 300 / 1200 / 2400 / 4800 / 9600 / 14400 / 19200 / 28800 / 38400 / 57600 / 115200 |
| TYPE | read(), peek(), parseInt(), parseFloat(), readString() | read / peek / parseInt / parseFloat / readString |

## ABS Examples

### Basic Usage
```
arduino_setup()
    softwareserial_init("mySerial", RX_PIN, TX_PIN, 300)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, softwareserial_available(variables_get($mySerial)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable Creation**: `softwareserial_init("varName", ...)` creates variable `$varName`; reference with `variables_get($varName)`
2. **Initialization**: Place init blocks inside `arduino_setup()`
3. **Parameter Order**: Follows `block.json` args0 order
