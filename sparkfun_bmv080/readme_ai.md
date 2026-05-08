# SparkFun BMV080

PM1/PM2.5/PM10 particulate matter blocks for BMV080.

## Library Info
- **Name**: @aily-project/lib-sparkfun-bmv080
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `bmv080_init_i2c` | Statement | VAR(field_input), ADDRESS(dropdown), MODE(dropdown) | `bmv080_init_i2c("bmv080", SF_BMV080_DEFAULT_ADDRESS, SF_BMV080_MODE_CONTINUOUS)` | `SparkFunBMV080 bmv080; bmv080.begin(addr, Wire); bmv080.init(); bmv080.setMode(mode);` |
| `bmv080_is_ready` | Value | VAR(field_variable) | `bmv080_is_ready(variables_get($bmv080))` | `bmv080_ready` |
| `bmv080_read_sensor` | Value | VAR(field_variable) | `bmv080_read_sensor(variables_get($bmv080))` | `bmv080.readSensor()` |
| `bmv080_pm1` | Value | VAR(field_variable) | `bmv080_pm1(variables_get($bmv080))` | `bmv080.PM1()` |
| `bmv080_pm25` | Value | VAR(field_variable) | `bmv080_pm25(variables_get($bmv080))` | `bmv080.PM25()` |
| `bmv080_pm10` | Value | VAR(field_variable) | `bmv080_pm10(variables_get($bmv080))` | `bmv080.PM10()` |
| `bmv080_is_obstructed` | Value | VAR(field_variable) | `bmv080_is_obstructed(variables_get($bmv080))` | `bmv080.isObstructed()` |
| `bmv080_set_mode` | Statement | VAR(field_variable), MODE(dropdown) | `bmv080_set_mode(variables_get($bmv080), SF_BMV080_MODE_DUTY_CYCLE)` | `bmv080.setMode(mode);` |
| `bmv080_set_duty_cycle` | Statement | VAR(field_variable), SECONDS(input_value) | `bmv080_set_duty_cycle(variables_get($bmv080), math_number(30))` | `bmv080.setDutyCyclingPeriod(30);` |
| `bmv080_set_obstruction_detection` | Statement | VAR(field_variable), STATE(dropdown) | `bmv080_set_obstruction_detection(variables_get($bmv080), TRUE)` | `bmv080.setDoObstructionDetection(true);` |
| `bmv080_set_vibration_filtering` | Statement | VAR(field_variable), STATE(dropdown) | `bmv080_set_vibration_filtering(variables_get($bmv080), TRUE)` | `bmv080.setDoVibrationFiltering(true);` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | SF_BMV080_DEFAULT_ADDRESS, 0x57 | I2C address |
| MODE | SF_BMV080_MODE_CONTINUOUS, SF_BMV080_MODE_DUTY_CYCLE | Measurement mode |
| STATE | TRUE, FALSE | Boolean setting |

## ABS Examples

```text
arduino_setup()
    bmv080_init_i2c("bmv080", SF_BMV080_DEFAULT_ADDRESS, SF_BMV080_MODE_CONTINUOUS)

arduino_loop()
    controls_if()
        @IF0: bmv080_read_sensor(variables_get($bmv080))
        @DO0:
            serial_println(Serial, bmv080_pm25(variables_get($bmv080)))
```

## Notes

`bmv080_init_i2c("name", ...)` creates variable `$name`. The upstream Arduino library requires the Bosch BMV080 SDK and SparkFun Toolkit.