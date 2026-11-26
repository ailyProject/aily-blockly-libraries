# SparkFun RFD77402 I2C Laser Distance Sensor

Blockly wrapper for the SparkFun RFD77402 I2C laser distance sensor.

## Library Info
- **Name**: @aily-project/lib-sparkfun-rfd77402
- **Version**: 0.0.2

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `rfd77402_init` | Statement | VAR(field_input) | `rfd77402_init("tof")` | `Wire.begin(); ↵ tof.begin();` |
| `rfd77402_take_measurement` | Statement | VAR(field_variable) | `rfd77402_take_measurement($tof)` | `tof.takeMeasurement();` |
| `rfd77402_get_distance` | Value | VAR(field_variable) | `rfd77402_get_distance($tof)` | `tof.getDistanceOrError()` |
| `rfd77402_get_valid_pixels` | Value | VAR(field_variable) | `rfd77402_get_valid_pixels($tof)` | `tof.getValidPixelsOrError()` |
| `rfd77402_get_confidence` | Value | VAR(field_variable) | `rfd77402_get_confidence($tof)` | `tof.getConfidenceOrError()` |
| `rfd77402_get_status` | Value | VAR(field_variable) | `rfd77402_get_status($tof)` | `tof.getMeasurementStatus()` |

## ABS Examples

### Basic Usage
```
arduino_setup()
    rfd77402_init("tof")
    serial_begin(Serial, 9600)

arduino_loop()
    rfd77402_take_measurement($tof)
    serial_println(Serial, rfd77402_get_distance($tof))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `rfd77402_init("varName", ...)` creates variable `$varName`; pass `$varName` directly to `field_variable` slots; use `variables_get($varName)` only for `input_value` slots.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

Use the measurement block before reading distance, pixels or confidence. The three Blockly values return −1 if the latest attempt has no valid sample. The status block distinguishes success (0), near, far and saturation (1–3), no new result (4), timeout (5), and an I²C or initialization failure (6). A successful sample may contain zero. Native unsigned getters retain the last complete sample.
