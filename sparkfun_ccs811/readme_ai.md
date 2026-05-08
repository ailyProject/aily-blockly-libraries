# SparkFun CCS811

eCO2 and TVOC air quality blocks for CCS811.

## Library Info
- **Name**: @aily-project/lib-sparkfun-ccs811
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ccs811_init` | Statement | VAR(field_input), ADDRESS(dropdown) | `ccs811_init("ccs811", 0x5B)` | `CCS811 ccs811; ccs811.setI2CAddress(0x5B); ccs811.begin();` |
| `ccs811_is_ready` | Value | VAR(field_variable) | `ccs811_is_ready(variables_get($ccs811))` | `ccs811_ready` |
| `ccs811_data_available` | Value | VAR(field_variable) | `ccs811_data_available(variables_get($ccs811))` | `ccs811.dataAvailable()` |
| `ccs811_read_results` | Statement | VAR(field_variable) | `ccs811_read_results(variables_get($ccs811))` | `ccs811.readAlgorithmResults();` |
| `ccs811_get_co2` | Value | VAR(field_variable) | `ccs811_get_co2(variables_get($ccs811))` | `ccs811.getCO2()` |
| `ccs811_get_tvoc` | Value | VAR(field_variable) | `ccs811_get_tvoc(variables_get($ccs811))` | `ccs811.getTVOC()` |
| `ccs811_set_drive_mode` | Statement | VAR(field_variable), MODE(dropdown) | `ccs811_set_drive_mode(variables_get($ccs811), 1)` | `ccs811.setDriveMode(1);` |
| `ccs811_set_environmental_data` | Statement | VAR(field_variable), HUMIDITY(input_value), TEMPERATURE(input_value) | `ccs811_set_environmental_data(variables_get($ccs811), math_number(50), math_number(25))` | `ccs811.setEnvironmentalData(50, 25);` |
| `ccs811_get_baseline` | Value | VAR(field_variable) | `ccs811_get_baseline(variables_get($ccs811))` | `ccs811.getBaseline()` |
| `ccs811_set_baseline` | Statement | VAR(field_variable), BASELINE(input_value) | `ccs811_set_baseline(variables_get($ccs811), math_number(12345))` | `ccs811.setBaseline(12345);` |
| `ccs811_has_error` | Value | VAR(field_variable) | `ccs811_has_error(variables_get($ccs811))` | `ccs811.checkForStatusError()` |
| `ccs811_error_register` | Value | VAR(field_variable) | `ccs811_error_register(variables_get($ccs811))` | `ccs811.getErrorRegister()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | 0x5B, 0x5A | I2C address |
| MODE | 0, 1, 2, 3, 4 | Idle, 1s, 10s, 60s, RAW modes |

## ABS Examples

```text
arduino_setup()
    ccs811_init("ccs811", 0x5B)

arduino_loop()
    controls_if()
        @IF0: ccs811_data_available(variables_get($ccs811))
        @DO0:
            ccs811_read_results(variables_get($ccs811))
            serial_println(Serial, ccs811_get_co2(variables_get($ccs811)))
```

## Notes

`ccs811_init("name", ...)` creates variable `$name`. New sensors require burn-in before readings stabilize.