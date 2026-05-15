# SparkFun LSM303C 6DOF IMU

Blockly wrapper for SparkFun LSM303C 6DOF IMU (accel + mag).

## Library Info
- **Name**: @aily-project/lib-sparkfun-lsm303c
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `lsm303c_init` | Statement | VAR(field_input) | `lsm303c_init("imu6")` | Dynamic code |
| `lsm303c_read_accel` | Value | VAR(field_variable), AXIS(dropdown) | `lsm303c_read_accel(variables_get($imu6), X)` | Dynamic code |
| `lsm303c_read_mag` | Value | VAR(field_variable), AXIS(dropdown) | `lsm303c_read_mag(variables_get($imu6), X)` | Dynamic code |
| `lsm303c_read_temp_c` | Value | VAR(field_variable) | `lsm303c_read_temp_c(variables_get($imu6))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| AXIS | X, Y, Z | lsm303c_read_accel, lsm303c_read_mag |

## ABS Examples

### Basic Usage
```
arduino_setup()
    lsm303c_init("imu6")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, lsm303c_read_accel(variables_get($imu6), X))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `lsm303c_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
