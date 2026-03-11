# Aily I2C通信库

基于Wire库封装的I2C通信支持库，适用于Arduino UNO、MEGA、ESP8266、ESP32等开发板

## Library Info
- **Name**: @aily-project/lib-aily_iic
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `wire_begin` | Statement | WIRE(dropdown), MODE(dropdown) | `wire_begin(WIRE, MASTER)` | `` |
| `wire_begin_with_settings` | Statement | WIRE(dropdown), MODE(dropdown), SDA(input_value), SCL(input_value) | `wire_begin_with_settings(WIRE, MASTER, math_number(0), math_number(0))` | `` |
| `wire_set_clock` | Statement | WIRE(dropdown), FREQUENCY(input_value) | `wire_set_clock(WIRE, math_number(0))` | (dynamic code) |
| `wire_begin_transmission` | Statement | WIRE(dropdown), ADDRESS(input_value) | `wire_begin_transmission(WIRE, math_number(0))` | (dynamic code) |
| `wire_write` | Statement | WIRE(dropdown), DATA(input_value) | `wire_write(WIRE, math_number(0))` | (dynamic code) |
| `wire_end_transmission` | Statement | WIRE(dropdown) | `wire_end_transmission(WIRE)` | (dynamic code) |
| `wire_request_from` | Statement | WIRE(dropdown), ADDRESS(input_value), QUANTITY(input_value) | `wire_request_from(WIRE, math_number(0), math_number(0))` | (dynamic code) |
| `wire_available` | Value | WIRE(dropdown) | `wire_available(WIRE)` | (dynamic code) |
| `wire_read` | Value | WIRE(dropdown) | `wire_read(WIRE)` | (dynamic code) |
| `wire_variables` | Value | WIRE(dropdown) | `wire_variables(WIRE)` | (dynamic code) |
| `wire_on_receive` | Statement | WIRE(dropdown), CALLBACK(input_statement) | `wire_on_receive(WIRE)` @CALLBACK: ... | `` |
| `wire_on_request` | Statement | WIRE(dropdown), CALLBACK(input_statement) | `wire_on_request(WIRE)` @CALLBACK: ... | `` |
| `wire_scan` | Statement | WIRE(dropdown) | `wire_scan(WIRE)` | (dynamic code) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | MASTER, SLAVE | 主设备 / 从设备 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    wire_begin(WIRE, MASTER)
    wire_begin_with_settings(WIRE, MASTER, math_number(0), math_number(0))
    wire_begin_transmission(WIRE, math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, wire_available(WIRE))
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order
