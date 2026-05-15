# BMP280 air pressure sensor

Grove BMP280 Barometric Pressure and Temperature Sensor Library, supporting temperature, barometric pressure and altitude measurements

## Library Info
- **Name**: @aily-project/lib-seeed-bmp280
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `bmp280_create` | Statement | VAR(field_input) | `bmp280_create("bmp280")` | Dynamic code |
| `bmp280_init` | Statement | VAR(field_variable) | `bmp280_init(variables_get($bmp280))` | Dynamic code |
| `bmp280_get_temperature` | Value | VAR(field_variable) | `bmp280_get_temperature(variables_get($bmp280))` | Dynamic code |
| `bmp280_get_pressure` | Value | VAR(field_variable) | `bmp280_get_pressure(variables_get($bmp280))` | Dynamic code |
| `bmp280_calc_altitude` | Value | VAR(field_variable), PRESSURE(input_value) | `bmp280_calc_altitude(variables_get($bmp280), math_number(0))` | Dynamic code |

## ABS Examples

### Basic Usage
```
arduino_setup()
    bmp280_create("bmp280")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, bmp280_get_temperature(variables_get($bmp280)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `bmp280_create("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
