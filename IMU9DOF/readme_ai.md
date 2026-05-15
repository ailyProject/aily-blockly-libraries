# 9-axis IMU sensor

9-axis IMU sensor library, supports QMI8658A six-axis sensor (accelerometer + gyroscope) and MMC5603NJ three-axis magnetic sensor, suitable for control board 3.0

## Library Info
- **Name**: @aily-project/lib-imu9dof
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `imu9dof_init` | Statement | VAR(field_input), WIRE(dropdown) | `imu9dof_init("imu", WIRE)` | Dynamic code |
| `imu9dof_read_accel` | Value | VAR(field_variable), AXIS(dropdown) | `imu9dof_read_accel(variables_get($imu), X)` | Dynamic code |
| `imu9dof_read_gyro` | Value | VAR(field_variable), AXIS(dropdown) | `imu9dof_read_gyro(variables_get($imu), X)` | Dynamic code |
| `imu9dof_read_mag` | Value | VAR(field_variable), AXIS(dropdown) | `imu9dof_read_mag(variables_get($imu), X)` | Dynamic code |
| `imu9dof_read_temperature` | Value | VAR(field_variable) | `imu9dof_read_temperature(variables_get($imu))` | Dynamic code |
| `imu9dof_compute_angles` | Statement | VAR(field_variable) | `imu9dof_compute_angles(variables_get($imu))` | Dynamic code |
| `imu9dof_read_angle` | Value | VAR(field_variable), ANGLE(dropdown) | `imu9dof_read_angle(variables_get($imu), ROLL)` | Dynamic code |
| `imu9dof_calibrate_mag` | Statement | VAR(field_variable) | `imu9dof_calibrate_mag(variables_get($imu))` | Dynamic code |
| `imu9dof_set_acc_range` | Statement | VAR(field_variable), RANGE(dropdown) | `imu9dof_set_acc_range(variables_get($imu), QMI8658A_ACC_RANGE_2G)` | Dynamic code |
| `imu9dof_set_gyro_range` | Statement | VAR(field_variable), RANGE(dropdown) | `imu9dof_set_gyro_range(variables_get($imu), QMI8658A_GYRO_RANGE_16DPS)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| AXIS | X, Y, Z | imu9dof_read_accel, imu9dof_read_gyro, imu9dof_read_mag |
| ANGLE | ROLL, PITCH, YAW | imu9dof_read_angle |
| RANGE | QMI8658A_ACC_RANGE_2G, QMI8658A_ACC_RANGE_4G, QMI8658A_ACC_RANGE_8G, QMI8658A_ACC_RANGE_16G | imu9dof_set_acc_range |
| RANGE | QMI8658A_GYRO_RANGE_16DPS, QMI8658A_GYRO_RANGE_32DPS, QMI8658A_GYRO_RANGE_64DPS, QMI8658A_GYRO_RANGE_128DPS, QMI8658A_GYRO_RANGE_256DPS, QMI8658A_GYRO_RANGE_512DPS, QMI8658A_GYRO_RANGE_1024DPS, QMI8658A_GYRO_RANGE_204... | imu9dof_set_gyro_range |

## ABS Examples

### Basic Usage
```
arduino_setup()
    imu9dof_init("imu", WIRE)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, imu9dof_read_accel(variables_get($imu), X))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `imu9dof_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
4. **Dynamic fields**: `imu9dof_init` may add fields at runtime through Blockly extensions.
