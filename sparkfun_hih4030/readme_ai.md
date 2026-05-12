# SparkFun HIH4030 Humidity Sensor

Blockly wrapper for the SparkFun HIH4030 analog humidity sensor.

## Library Info
- **Name**: @aily-project/lib-sparkfun-hih4030
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `hih4030_init` | Statement | VAR(field_input), PIN(field_number), VOLTAGE(dropdown) | `hih4030_init("hih4030", 0, "5.0")` | Dynamic code |
| `hih4030_get_rh` | Value | VAR(field_variable) | `hih4030_get_rh(variables_get($hih4030))` | Dynamic code |
| `hih4030_get_true_rh` | Value | VAR(field_variable), TEMP(input_value) | `hih4030_get_true_rh(variables_get($hih4030), math_number(0))` | Dynamic code |
| `hih4030_vout` | Value | VAR(field_variable) | `hih4030_vout(variables_get($hih4030))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| VOLTAGE | 5.0, 3.3 | hih4030_init |

## ABS Examples

### Basic Usage
```
arduino_setup()
    hih4030_init("hih4030", 0, "5.0")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, hih4030_get_rh(variables_get($hih4030)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `hih4030_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
