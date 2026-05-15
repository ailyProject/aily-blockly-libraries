# SparkFun BMP180 pressure sensor

Blockly wrapper for SparkFun BMP180 pressure and temperature sensor.

## Library Info
- **Name**: @aily-project/lib-sparkfun-bmp180
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `bmp180_init` | Statement | VAR(field_input) | `bmp180_init("bmp180")` | Dynamic code |
| `bmp180_is_ready` | Value | VAR(field_variable) | `bmp180_is_ready(variables_get($bmp180))` | Dynamic code |
| `bmp180_read_temperature` | Value | VAR(field_variable) | `bmp180_read_temperature(variables_get($bmp180))` | bmp180ReadTemperature( |
| `bmp180_read_pressure` | Value | VAR(field_variable), OVERSAMPLING(dropdown) | `bmp180_read_pressure(variables_get($bmp180), "0")` | bmp180ReadPressure( |
| `bmp180_sea_level` | Value | VAR(field_variable), PRESSURE(input_value), ALTITUDE(input_value) | `bmp180_sea_level(variables_get($bmp180), math_number(0), math_number(0))` | Dynamic code |
| `bmp180_altitude` | Value | VAR(field_variable), PRESSURE(input_value), BASELINE(input_value) | `bmp180_altitude(variables_get($bmp180), math_number(0), math_number(0))` | Dynamic code |
| `bmp180_get_error` | Value | VAR(field_variable) | `bmp180_get_error(variables_get($bmp180))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| OVERSAMPLING | 0, 1, 2, 3 | bmp180_read_pressure |

## ABS Examples

### Basic Usage
```
arduino_setup()
    bmp180_init("bmp180")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, bmp180_is_ready(variables_get($bmp180)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `bmp180_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
