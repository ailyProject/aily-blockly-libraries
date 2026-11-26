# SparkFun LSM9DS1 9DOF IMU

Blockly wrapper for SparkFun LSM9DS1 9DOF IMU (accel, gyro, mag).

## Library Info
- **Name**: @aily-project/lib-sparkfun-lsm9ds1
- **Version**: 0.0.2

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `lsm9ds1_init` | Statement | VAR(field_input) | `lsm9ds1_init("imu")` | `Wire.begin(); ↵ imu.begin();` |
| `lsm9ds1_read_gyro` | Statement | VAR(field_variable) | `lsm9ds1_read_gyro($imu)` | `imu.readGyro();` |
| `lsm9ds1_read_accel` | Statement | VAR(field_variable) | `lsm9ds1_read_accel($imu)` | `imu.readAccel();` |
| `lsm9ds1_read_mag` | Statement | VAR(field_variable) | `lsm9ds1_read_mag($imu)` | `imu.readMag();` |
| `lsm9ds1_get_gyro_axis` | Value | VAR(field_variable), AXIS(dropdown) | `lsm9ds1_get_gyro_axis($imu, X)` | `imu.angularRateDps(X_AXIS)` |
| `lsm9ds1_get_accel_axis` | Value | VAR(field_variable), AXIS(dropdown) | `lsm9ds1_get_accel_axis($imu, X)` | `imu.accelerationG(X_AXIS)` |
| `lsm9ds1_get_mag_axis` | Value | VAR(field_variable), AXIS(dropdown) | `lsm9ds1_get_mag_axis($imu, X)` | `imu.magneticFieldGauss(X_AXIS)` |

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
    serial_println(Serial, lsm9ds1_get_gyro_axis($imu, X))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `lsm9ds1_init("varName", ...)` creates variable `$varName`; pass `$varName` directly to `field_variable` slots; use `variables_get($varName)` only for `input_value` slots.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
