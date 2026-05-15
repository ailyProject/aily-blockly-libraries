# SparkFun NAU7802 Qwiic Scale

Blockly wrapper for SparkFun Qwiic Scale NAU7802 (24-bit ADC load cell interface).

## Library Info
- **Name**: @aily-project/lib-sparkfun-nau7802
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `nau7802_init` | Statement | VAR(field_input) | `nau7802_init("scale")` | Dynamic code |
| `nau7802_is_available` | Value | VAR(field_variable) | `nau7802_is_available(variables_get($scale))` | Dynamic code |
| `nau7802_get_reading` | Value | VAR(field_variable) | `nau7802_get_reading(variables_get($scale))` | Dynamic code |
| `nau7802_get_average` | Value | VAR(field_variable), SAMPLES(input_value) | `nau7802_get_average(variables_get($scale), math_number(0))` | Dynamic code |
| `nau7802_get_weight` | Value | VAR(field_variable) | `nau7802_get_weight(variables_get($scale))` | Dynamic code |
| `nau7802_tare` | Statement | VAR(field_variable) | `nau7802_tare(variables_get($scale))` | Dynamic code |
| `nau7802_calibrate` | Statement | VAR(field_variable), WEIGHT(input_value) | `nau7802_calibrate(variables_get($scale), math_number(0))` | Dynamic code |
| `nau7802_set_cal_factor` | Statement | VAR(field_variable), FACTOR(input_value) | `nau7802_set_cal_factor(variables_get($scale), math_number(0))` | Dynamic code |
| `nau7802_get_cal_factor` | Value | VAR(field_variable) | `nau7802_get_cal_factor(variables_get($scale))` | Dynamic code |

## ABS Examples

### Basic Usage
```
arduino_setup()
    nau7802_init("scale")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, nau7802_is_available(variables_get($scale)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `nau7802_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
