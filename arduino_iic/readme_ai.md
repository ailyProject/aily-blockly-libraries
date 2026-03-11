# ArduinoI2C

I2C总线库，用于检测并输出连接设备的地址，同时报告通信错误，支持Arduino UNO、MEGA、ESP8266、ESP32等开发板

## Library Info
- **Name**: @aily-project/lib-core-i2c
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `wire_begin` | Statement | (none) | `wire_begin()` | `` |
| `wire_begin_address` | Statement | ADDRESS(input_value) | `wire_begin_address(math_number(0))` | `` |
| `wire_set_clock` | Statement | CLOCK(input_value) | `wire_set_clock(math_number(0))` | `` |
| `wire_end` | Statement | (none) | `wire_end()` | `Wire.end();\n` |
| `wire_begin_transmission` | Statement | ADDRESS(input_value) | `wire_begin_transmission(math_number(0))` | `Wire.beginTransmission(...);\n` |
| `wire_end_transmission` | Statement | STOP(dropdown) | `wire_end_transmission(TRUE)` | `Wire.endTransmission(...);\n` |
| `wire_write` | Statement | DATA(input_value) | `wire_write(math_number(0))` | `Wire.write(...);\n` |
| `wire_write_bytes` | Statement | DATA(input_value), LENGTH(input_value) | `wire_write_bytes(math_number(0), math_number(0))` | `Wire.write(..., ...);\n` |
| `wire_request_from` | Statement | ADDRESS(input_value), QUANTITY(input_value), STOP(dropdown) | `wire_request_from(math_number(0), math_number(0), TRUE)` | `Wire.requestFrom(..., ..., ...);\n` |
| `wire_available` | Value | (none) | `wire_available()` | `Wire.available()` |
| `wire_read` | Value | (none) | `wire_read()` | `Wire.read()` |
| `wire_peek` | Value | (none) | `wire_peek()` | `Wire.peek()` |
| `wire_flush` | Statement | (none) | `wire_flush()` | `Wire.flush();\n` |
| `wire_on_receive` | Statement | FUNCTION_NAME(field_input), CALLBACK(input_statement) | `wire_on_receive("onReceive")` @CALLBACK: ... | `` |
| `wire_on_request` | Statement | FUNCTION_NAME(field_input), CALLBACK(input_statement) | `wire_on_request("onRequest")` @CALLBACK: ... | `` |
| `wire_scan_devices` | Statement | DELAY(input_value) | `wire_scan_devices(math_number(1000))` | (dynamic code) |
| `wire_set_timeout` | Statement | TIMEOUT(input_value), RESET(dropdown) | `wire_set_timeout(math_number(1000), TRUE)` | `Wire.setWireTimeout(..., ...);\n` |
| `wire_get_timeout_flag` | Value | (none) | `wire_get_timeout_flag()` | `Wire.getWireTimeoutFlag()` |
| `wire_clear_timeout_flag` | Statement | (none) | `wire_clear_timeout_flag()` | `Wire.clearWireTimeoutFlag();\n` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| STOP | TRUE, FALSE | true / false |
| RESET | TRUE, FALSE | true / false |

## ABS Examples

### Basic Usage
```
arduino_setup()
    wire_begin()
    wire_begin_address(math_number(0))
    wire_begin_transmission(math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, wire_available())
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order
