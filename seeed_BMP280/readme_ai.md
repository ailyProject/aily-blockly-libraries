# BMP280气压传感器

Grove BMP280气压和温度传感器库，支持温度、气压和海拔高度测量

## Library Info
- **Name**: @aily-project/lib-seeed-bmp280
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `bmp280_create` | Statement | VAR(field_input) | `bmp280_create("bmp280")` | `` |
| `bmp280_init` | Statement | VAR(field_variable) | `bmp280_init($bmp280)` | (dynamic code) |
| `bmp280_get_temperature` | Value | VAR(field_variable) | `bmp280_get_temperature($bmp280)` | (dynamic code) |
| `bmp280_get_pressure` | Value | VAR(field_variable) | `bmp280_get_pressure($bmp280)` | (dynamic code) |
| `bmp280_calc_altitude` | Value | VAR(field_variable), PRESSURE(input_value) | `bmp280_calc_altitude($bmp280, math_number(0))` | (dynamic code) |

## ABS Examples

### Basic Usage
```
arduino_setup()
    bmp280_create("bmp280")
    bmp280_init($bmp280)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, bmp280_get_temperature($bmp280))
    time_delay(math_number(1000))
```

## Notes

1. **Variable Creation**: `bmp280_create("varName", ...)` creates variable `$varName`; reference with `$varName`
2. **Initialization**: Place init blocks inside `arduino_setup()`
3. **Parameter Order**: Follows `block.json` args0 order
