# SparkFun LSM6DSO 6DoF IMU

Blockly wrapper for SparkFun LSM6DSO 6DoF IMU (accel, gyro, temperature) via I2C.

## Library Info
- **Name**: @aily-project/lib-sparkfun-lsm6dso
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `lsm6dso_init` | Statement | VAR(field_input) | `lsm6dso_init("imu")` | Dynamic code |
| `lsm6dso_get_accel` | Value | VAR(field_variable), AXIS(dropdown) | `lsm6dso_get_accel(variables_get($imu), X)` | Dynamic code |
| `lsm6dso_get_gyro` | Value | VAR(field_variable), AXIS(dropdown) | `lsm6dso_get_gyro(variables_get($imu), X)` | Dynamic code |
| `lsm6dso_get_temp_c` | Value | VAR(field_variable) | `lsm6dso_get_temp_c(variables_get($imu))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| AXIS | X, Y, Z | lsm6dso_get_accel, lsm6dso_get_gyro |

## ABS Examples

### Basic Usage
```
arduino_setup()
    lsm6dso_init("imu")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, lsm6dso_get_accel(variables_get($imu), X))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `lsm6dso_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
