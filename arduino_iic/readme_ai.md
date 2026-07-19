# ArduinoI2C

I2C bus library, used to detect and output the address of the connected device, and report communication errors at the same time, supports Arduino UNO, MEGA, ESP8266, ESP32 and other development boards

## Library Info
- **Name**: @aily-project/lib-core-i2c
- **Version**: 0.0.3

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `wire_begin` | Statement | (none) | `wire_begin()` | Dynamic code |
| `wire_begin_address` | Statement | ADDRESS(input_value) | `wire_begin_address(math_number(0))` | Dynamic code |
| `wire_set_clock` | Statement | CLOCK(input_value) | `wire_set_clock(math_number(0))` | Dynamic code |
| `wire_end` | Statement | (none) | `wire_end()` | Wire.end();\n |
| `wire_begin_transmission` | Statement | ADDRESS(input_value) | `wire_begin_transmission(math_number(0))` | Wire.beginTransmission(...);\n |
| `wire_end_transmission` | Statement | STOP(dropdown) | `wire_end_transmission(TRUE)` | Wire.endTransmission(...);\n |
| `wire_end_transmission_result` | Value | STOP(dropdown) | `wire_end_transmission_result(TRUE)` | Wire.endTransmission(...) |
| `wire_write` | Statement | DATA(input_value) | `wire_write(math_number(0))` | Wire.write(...);\n |
| `wire_write_bytes` | Statement | DATA(input_value), LENGTH(input_value) | `wire_write_bytes(math_number(0), math_number(0))` | Wire.write(..., ...);\n |
| `wire_request_from` | Statement | ADDRESS(input_value), QUANTITY(input_value), STOP(dropdown) | `wire_request_from(math_number(0), math_number(0), TRUE)` | Wire.requestFrom(..., ..., ...);\n |
| `wire_available` | Value | (none) | `wire_available()` | Wire.available() |
| `wire_read` | Value | (none) | `wire_read()` | Wire.read() |
| `wire_peek` | Value | (none) | `wire_peek()` | Wire.peek() |
| `wire_flush` | Statement | (none) | `wire_flush()` | Wire.flush();\n |
| `wire_on_receive` | Statement | FUNCTION_NAME(field_input), CALLBACK(input_statement) | `wire_on_receive("onReceive") @CALLBACK: child_block()` | Dynamic code |
| `wire_on_request` | Statement | FUNCTION_NAME(field_input), CALLBACK(input_statement) | `wire_on_request("onRequest") @CALLBACK: child_block()` | Dynamic code |
| `wire_set_timeout` | Statement | TIMEOUT(input_value), RESET(dropdown) | `wire_set_timeout(math_number(1000), TRUE)` | Wire.setWireTimeout(..., ...);\n |
| `wire_get_timeout_flag` | Value | (none) | `wire_get_timeout_flag()` | Wire.getWireTimeoutFlag() |
| `wire_clear_timeout_flag` | Statement | (none) | `wire_clear_timeout_flag()` | Wire.clearWireTimeoutFlag();\n |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| STOP | TRUE, FALSE | wire_end_transmission, wire_request_from |
| RESET | TRUE, FALSE | wire_set_timeout |

## ABS Examples

### Basic Usage
```
arduino_setup()
    wire_begin()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, wire_available())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
