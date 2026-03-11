# ESP32 I2C通信库

ESP32专用I2C通信支持库，提供主从模式通信、设备扫描等功能，支持自定义引脚配置

## Library Info
- **Name**: @aily-project/lib-esp32-i2c
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp32_i2c_begin` | Statement | SDA_PIN(input_value), SCL_PIN(input_value), FREQUENCY(dropdown) | `esp32_i2c_begin(math_number(2), math_number(2), 100000)` | `` |
| `esp32_i2c_begin_simple` | Statement | (none) | `esp32_i2c_begin_simple()` | `` |
| `esp32_i2c_scan_devices` | Value | (none) | `esp32_i2c_scan_devices()` | `...()` |
| `esp32_i2c_begin_transmission` | Statement | ADDRESS(input_value) | `esp32_i2c_begin_transmission(math_number(0))` | `Wire.beginTransmission(...);\n` |
| `esp32_i2c_write_byte` | Statement | DATA(input_value) | `esp32_i2c_write_byte(math_number(0))` | `Wire.write(...);\n` |
| `esp32_i2c_write_string` | Statement | DATA(input_value) | `esp32_i2c_write_string(math_number(0))` | `Wire.print(...);\n` |
| `esp32_i2c_end_transmission` | Value | (none) | `esp32_i2c_end_transmission()` | `Wire.endTransmission()` |
| `esp32_i2c_request_from` | Value | ADDRESS(input_value), QUANTITY(input_value) | `esp32_i2c_request_from(math_number(0), math_number(0))` | `Wire.requestFrom(..., ...)` |
| `esp32_i2c_available` | Value | (none) | `esp32_i2c_available()` | `Wire.available()` |
| `esp32_i2c_read` | Value | (none) | `esp32_i2c_read()` | `Wire.read()` |
| `esp32_i2c_slave_begin` | Statement | ADDRESS(input_value), SDA_PIN(input_value), SCL_PIN(input_value) | `esp32_i2c_slave_begin(math_number(0), math_number(2), math_number(2))` | `` |
| `esp32_i2c_on_receive` | Statement | CALLBACK(input_statement) | `esp32_i2c_on_receive()` @CALLBACK: ... | `` |
| `esp32_i2c_on_request` | Statement | CALLBACK(input_statement) | `esp32_i2c_on_request()` @CALLBACK: ... | `` |
| `esp32_i2c_slave_print` | Statement | DATA(input_value) | `esp32_i2c_slave_print(math_number(0))` | `Wire.print(...);\n` |
| `esp32_i2c_write_to_device` | Statement | ADDRESS(dropdown), DATA(input_value) | `esp32_i2c_write_to_device(0x3C, math_number(0))` | (dynamic code) |
| `esp32_i2c_read_from_device` | Value | ADDRESS(dropdown), QUANTITY(input_value) | `esp32_i2c_read_from_device(0x3C, math_number(0))` | `...(..., ...)` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| FREQUENCY | 100000, 400000, 1000000 | 100000 (标准模式) / 400000 (快速模式) / 1000000 (快速模式+) |
| ADDRESS | 0x3C, 0x48, 0x68, 0x76, 0x77, CUSTOM | 0x3C (OLED显示屏) / 0x48 (ADS1115) / 0x68 (MPU6050) / 0x76 (BMP280) / 0x77 (BMP280备用) / 自定义地址 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    esp32_i2c_begin(math_number(2), math_number(2), 100000)
    esp32_i2c_begin_simple()
    esp32_i2c_begin_transmission(math_number(0))
    esp32_i2c_slave_begin(math_number(0), math_number(2), math_number(2))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, esp32_i2c_scan_devices())
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order
