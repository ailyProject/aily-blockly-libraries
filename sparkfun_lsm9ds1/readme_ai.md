# SparkFun LSM9DS1 9DOF IMU

Blockly wrapper for SparkFun LSM9DS1 9DOF IMU (accel, gyro, mag).

## Library Info
- **Name**: @aily-project/lib-sparkfun-lsm9ds1
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `lsm9ds1_init` | Statement | VAR(field_input) | `lsm9ds1_init("imu")` | Dynamic code |
| `lsm9ds1_read_gyro` | Statement | VAR(field_variable) | `lsm9ds1_read_gyro(variables_get($imu))` | Dynamic code |
| `lsm9ds1_read_accel` | Statement | VAR(field_variable) | `lsm9ds1_read_accel(variables_get($imu))` | Dynamic code |
| `lsm9ds1_read_mag` | Statement | VAR(field_variable) | `lsm9ds1_read_mag(variables_get($imu))` | Dynamic code |
| `lsm9ds1_get_gyro_axis` | Value | VAR(field_variable), AXIS(dropdown) | `lsm9ds1_get_gyro_axis(variables_get($imu), X)` | Dynamic code |
| `lsm9ds1_get_accel_axis` | Value | VAR(field_variable), AXIS(dropdown) | `lsm9ds1_get_accel_axis(variables_get($imu), X)` | Dynamic code |
| `lsm9ds1_get_mag_axis` | Value | VAR(field_variable), AXIS(dropdown) | `lsm9ds1_get_mag_axis(variables_get($imu), X)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| AXIS | X, Y, Z | lsm9ds1_get_gyro_axis, lsm9ds1_get_accel_axis, lsm9ds1_get_mag_axis |

## ABS Examples

### Basic Usage
```
arduino_setup()
    lsm9ds1_init("imu")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, lsm9ds1_get_gyro_axis(variables_get($imu), X))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `lsm9ds1_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
