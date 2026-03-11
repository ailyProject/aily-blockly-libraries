# RS485通信库

优化的RS485串行通信库，支持一键配置、自动初始化、主从通信等简化功能

## Library Info
- **Name**: @aily-project/lib-arduino-rs485
- **Version**: 0.1.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `rs485_end` | Statement | (none) | `rs485_end()` | `RS485.end();\n` |
| `rs485_available` | Value | (none) | `rs485_available()` | `RS485.available()` |
| `rs485_read` | Value | (none) | `rs485_read()` | `RS485.read()` |
| `rs485_peek` | Value | (none) | `rs485_peek()` | `RS485.peek()` |
| `rs485_write` | Statement | DATA(input_value) | `rs485_write(math_number(0))` | `RS485.write(...);\n` |
| `rs485_print` | Statement | DATA(input_value) | `rs485_print(math_number(0))` | `RS485.print(...);\n` |
| `rs485_println` | Statement | DATA(input_value) | `rs485_println(math_number(0))` | `RS485.println(...);\n` |
| `rs485_flush` | Statement | (none) | `rs485_flush()` | `RS485.flush();\n` |
| `rs485_begin_transmission` | Statement | (none) | `rs485_begin_transmission()` | `RS485.beginTransmission();\n` |
| `rs485_end_transmission` | Statement | (none) | `rs485_end_transmission()` | `RS485.endTransmission();\n` |
| `rs485_receive` | Statement | (none) | `rs485_receive()` | `RS485.receive();\n` |
| `rs485_no_receive` | Statement | (none) | `rs485_no_receive()` | `RS485.noReceive();\n` |
| `rs485_send_break` | Statement | DURATION(field_number) | `rs485_send_break(100)` | `RS485.sendBreak(...);\n` |
| `rs485_send_break_microseconds` | Statement | DURATION(field_number) | `rs485_send_break_microseconds(1000)` | `RS485.sendBreakMicroseconds(...);\n` |
| `rs485_set_pins` | Statement | TX_PIN(dropdown), DE_PIN(dropdown), RE_PIN(dropdown) | `rs485_set_pins(TX_PIN, DE_PIN, RE_PIN)` | `RS485.setPins(..., ..., ...);\n` |
| `rs485_simple_send` | Statement | DATA(input_value) | `rs485_simple_send(math_number(0))` | `RS485.beginTransmission();\nRS485.print(...);\nRS485.endTransmission();\n` |
| `rs485_simple_receive` | Statement | (none) | `rs485_simple_receive()` | (dynamic code) |
| `rs485_received_data` | Value | (none) | `rs485_received_data()` | `rs485_receivedData` |
| `rs485_begin` | Statement | SERIAL(dropdown), BAUDRATE(dropdown), TX_PIN(dropdown), DE_PIN(dropdown), RE_PIN(dropdown) | `rs485_begin(SERIAL, BAUDRATE, TX_PIN, DE_PIN, RE_PIN)` | `` |
| `rs485_master_send` | Statement | DATA(input_value), SLAVE_ADDR(field_number) | `rs485_master_send(math_number(0), 1)` | `RS485.beginTransmission();\nRS485.print(` |
| `rs485_slave_receive` | Statement | SLAVE_ADDR(field_number) | `rs485_slave_receive(1)` | (dynamic code) |

## ABS Examples

### Basic Usage
```
arduino_setup()
    rs485_begin_transmission()
    rs485_begin(SERIAL, BAUDRATE, TX_PIN, DE_PIN, RE_PIN)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, rs485_available())
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order
