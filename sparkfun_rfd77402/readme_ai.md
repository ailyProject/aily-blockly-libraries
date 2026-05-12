# SparkFun RFD77402 I2C Laser Distance Sensor

Blockly wrapper for the SparkFun RFD77402 I2C laser distance sensor.

## Library Info
- **Name**: @aily-project/lib-sparkfun-rfd77402
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `rfd77402_init` | Statement | VAR(field_input) | `rfd77402_init("tof")` | Wire.begin();\n |
| `rfd77402_take_measurement` | Statement | VAR(field_variable) | `rfd77402_take_measurement(variables_get($tof))` | Dynamic code |
| `rfd77402_get_distance` | Value | VAR(field_variable) | `rfd77402_get_distance(variables_get($tof))` | Dynamic code |
| `rfd77402_get_valid_pixels` | Value | VAR(field_variable) | `rfd77402_get_valid_pixels(variables_get($tof))` | Dynamic code |
| `rfd77402_get_confidence` | Value | VAR(field_variable) | `rfd77402_get_confidence(variables_get($tof))` | Dynamic code |

## ABS Examples

### Basic Usage
```
arduino_setup()
    rfd77402_init("tof")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, rfd77402_get_distance(variables_get($tof)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `rfd77402_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
