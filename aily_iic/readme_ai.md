# Aily I2C communication library

I2C communication support library based on Wire library package, suitable for Arduino UNO, MEGA, ESP8266, ESP32 and other development boards

## Library Info
- **Name**: @aily-project/lib-aily-iic
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `wire_begin` | Statement | WIRE(dropdown), MODE(dropdown) | `wire_begin(WIRE, MASTER)` | Dynamic code |
| `wire_begin_with_settings` | Statement | WIRE(dropdown), MODE(dropdown), SDA(input_value), SCL(input_value) | `wire_begin_with_settings(WIRE, MASTER, math_number(0), math_number(0))` | Dynamic code |
| `wire_set_clock` | Statement | WIRE(dropdown), FREQUENCY(input_value) | `wire_set_clock(WIRE, math_number(0))` | Dynamic code |
| `wire_begin_transmission` | Statement | WIRE(dropdown), ADDRESS(input_value) | `wire_begin_transmission(WIRE, math_number(0))` | Dynamic code |
| `wire_write` | Statement | WIRE(dropdown), DATA(input_value) | `wire_write(WIRE, math_number(0))` | Dynamic code |
| `wire_end_transmission` | Statement | WIRE(dropdown) | `wire_end_transmission(WIRE)` | Dynamic code |
| `wire_request_from` | Statement | WIRE(dropdown), ADDRESS(input_value), QUANTITY(input_value) | `wire_request_from(WIRE, math_number(0), math_number(0))` | Dynamic code |
| `wire_available` | Value | WIRE(dropdown) | `wire_available(WIRE)` | Dynamic code |
| `wire_read` | Value | WIRE(dropdown) | `wire_read(WIRE)` | Dynamic code |
| `wire_variables` | Value | WIRE(dropdown) | `wire_variables(WIRE)` | Dynamic code |
| `wire_on_receive` | Hat | WIRE(dropdown), CALLBACK(input_statement) | `wire_on_receive(WIRE) @CALLBACK: child_block()` | Dynamic code |
| `wire_on_request` | Hat | WIRE(dropdown), CALLBACK(input_statement) | `wire_on_request(WIRE) @CALLBACK: child_block()` | Dynamic code |
| `wire_scan` | Statement | WIRE(dropdown) | `wire_scan(WIRE)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | MASTER, SLAVE | wire_begin, wire_begin_with_settings |

## ABS Examples

### Basic Usage
```
arduino_setup()
    wire_begin(WIRE, MASTER)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, wire_available(WIRE))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
3. **Dynamic fields**: `wire_begin`, `wire_begin_with_settings`, `wire_set_clock`, `wire_begin_transmission`, `wire_write`, `wire_end_transmission`, `wire_request_from`, `wire_available`, `wire_read`, `wire_variables`, `wire_on_receive`, `wire_on_request`, `wire_scan` may add fields at runtime through Blockly extensions.
