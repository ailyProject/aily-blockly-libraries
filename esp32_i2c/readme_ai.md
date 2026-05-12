# ESP32 I2C Communication Library

ESP32 dedicated I2C communication support library provides master-slave mode communication, device scanning and other functions, and supports custom pin configuration

## Library Info
- **Name**: @aily-project/lib-esp32-i2c
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp32_i2c_begin` | Statement | SDA_PIN(input_value), SCL_PIN(input_value), FREQUENCY(dropdown) | `esp32_i2c_begin(math_number(2), math_number(2), "100000")` | Dynamic code |
| `esp32_i2c_begin_simple` | Statement | (none) | `esp32_i2c_begin_simple()` | Dynamic code |
| `esp32_i2c_scan_devices` | Value | (none) | `esp32_i2c_scan_devices()` | Dynamic code |
| `esp32_i2c_begin_transmission` | Statement | ADDRESS(input_value) | `esp32_i2c_begin_transmission(math_number(0))` | Wire.beginTransmission(...);\n |
| `esp32_i2c_write_byte` | Statement | DATA(input_value) | `esp32_i2c_write_byte(math_number(0))` | Wire.write(...);\n |
| `esp32_i2c_write_string` | Statement | DATA(input_value) | `esp32_i2c_write_string(text("value"))` | Wire.print(...);\n |
| `esp32_i2c_end_transmission` | Value | (none) | `esp32_i2c_end_transmission()` | Wire.endTransmission() |
| `esp32_i2c_request_from` | Value | ADDRESS(input_value), QUANTITY(input_value) | `esp32_i2c_request_from(math_number(0), math_number(0))` | Wire.requestFrom(..., ...) |
| `esp32_i2c_available` | Value | (none) | `esp32_i2c_available()` | Wire.available() |
| `esp32_i2c_read` | Value | (none) | `esp32_i2c_read()` | Wire.read() |
| `esp32_i2c_slave_begin` | Statement | ADDRESS(input_value), SDA_PIN(input_value), SCL_PIN(input_value) | `esp32_i2c_slave_begin(math_number(0), math_number(2), math_number(2))` | Dynamic code |
| `esp32_i2c_on_receive` | Statement | CALLBACK(input_statement) | `esp32_i2c_on_receive() @CALLBACK: child_block()` | Dynamic code |
| `esp32_i2c_on_request` | Statement | CALLBACK(input_statement) | `esp32_i2c_on_request() @CALLBACK: child_block()` | Dynamic code |
| `esp32_i2c_slave_print` | Statement | DATA(input_value) | `esp32_i2c_slave_print(text("value"))` | Wire.print(...);\n |
| `esp32_i2c_write_to_device` | Statement | ADDRESS(dropdown), DATA(input_value) | `esp32_i2c_write_to_device("0x3C", text("value"))` | Wire.beginTransmission(...); Wire.print(...); Wire.endTransmission(); |
| `esp32_i2c_read_from_device` | Value | ADDRESS(dropdown), QUANTITY(input_value) | `esp32_i2c_read_from_device("0x3C", math_number(0))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| FREQUENCY | 100000, 400000, 1000000 | esp32_i2c_begin |
| ADDRESS | 0x3C, 0x48, 0x68, 0x76, 0x77, CUSTOM | esp32_i2c_write_to_device, esp32_i2c_read_from_device |

## ABS Examples

### Basic Usage
```
arduino_setup()
    esp32_i2c_begin(math_number(2), math_number(2), "100000")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, esp32_i2c_scan_devices())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
