# SparkFun BMV080 Particulate Matter Sensor

Blockly wrapper for the SparkFun BMV080 PM1/PM2.5/PM10 particulate matter sensor.

## Library Info
- **Name**: @aily-project/lib-sparkfun-bmv080
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `bmv080_init_i2c` | Statement | VAR(field_input), ADDRESS(dropdown), MODE(dropdown) | `bmv080_init_i2c("bmv080", SF_BMV080_DEFAULT_ADDRESS, SF_BMV080_MODE_CONTINUOUS)` | Wire.begin();\n |
| `bmv080_is_ready` | Value | VAR(field_variable) | `bmv080_is_ready(variables_get($bmv080))` | Dynamic code |
| `bmv080_read_sensor` | Value | VAR(field_variable) | `bmv080_read_sensor(variables_get($bmv080))` | Dynamic code |
| `bmv080_pm1` | Value | VAR(field_variable) | `bmv080_pm1(variables_get($bmv080))` | Dynamic code |
| `bmv080_pm25` | Value | VAR(field_variable) | `bmv080_pm25(variables_get($bmv080))` | Dynamic code |
| `bmv080_pm10` | Value | VAR(field_variable) | `bmv080_pm10(variables_get($bmv080))` | Dynamic code |
| `bmv080_is_obstructed` | Value | VAR(field_variable) | `bmv080_is_obstructed(variables_get($bmv080))` | Dynamic code |
| `bmv080_set_mode` | Statement | VAR(field_variable), MODE(dropdown) | `bmv080_set_mode(variables_get($bmv080), SF_BMV080_MODE_CONTINUOUS)` | Dynamic code |
| `bmv080_set_duty_cycle` | Statement | VAR(field_variable), SECONDS(input_value) | `bmv080_set_duty_cycle(variables_get($bmv080), math_number(0))` | Dynamic code |
| `bmv080_set_obstruction_detection` | Statement | VAR(field_variable), STATE(dropdown) | `bmv080_set_obstruction_detection(variables_get($bmv080), TRUE)` | Dynamic code |
| `bmv080_set_vibration_filtering` | Statement | VAR(field_variable), STATE(dropdown) | `bmv080_set_vibration_filtering(variables_get($bmv080), TRUE)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | SF_BMV080_DEFAULT_ADDRESS, 0x57 | bmv080_init_i2c |
| MODE | SF_BMV080_MODE_CONTINUOUS, SF_BMV080_MODE_DUTY_CYCLE | bmv080_init_i2c, bmv080_set_mode |
| STATE | TRUE, FALSE | bmv080_set_obstruction_detection, bmv080_set_vibration_filtering |

## ABS Examples

### Basic Usage
```
arduino_setup()
    bmv080_init_i2c("bmv080", SF_BMV080_DEFAULT_ADDRESS, SF_BMV080_MODE_CONTINUOUS)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, bmv080_is_ready(variables_get($bmv080)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `bmv080_init_i2c("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
