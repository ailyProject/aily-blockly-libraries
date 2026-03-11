# 9轴IMU传感器

9轴IMU传感器库，支持QMI8658A六轴传感器(加速度计+陀螺仪)和MMC5603NJ三轴磁力传感器，适用于掌控板3.0

## Library Info
- **Name**: @aily-project/lib-imu9dof
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `imu9dof_init` | Statement | VAR(field_input), WIRE(dropdown) | `imu9dof_init("imu", WIRE)` | (dynamic code) |
| `imu9dof_read_accel` | Value | VAR(field_variable), AXIS(dropdown) | `imu9dof_read_accel(variables_get($imu), X)` | (dynamic code) |
| `imu9dof_read_gyro` | Value | VAR(field_variable), AXIS(dropdown) | `imu9dof_read_gyro(variables_get($imu), X)` | (dynamic code) |
| `imu9dof_read_mag` | Value | VAR(field_variable), AXIS(dropdown) | `imu9dof_read_mag(variables_get($imu), X)` | (dynamic code) |
| `imu9dof_read_temperature` | Value | VAR(field_variable) | `imu9dof_read_temperature(variables_get($imu))` | (dynamic code) |
| `imu9dof_compute_angles` | Statement | VAR(field_variable) | `imu9dof_compute_angles(variables_get($imu))` | (dynamic code) |
| `imu9dof_read_angle` | Value | VAR(field_variable), ANGLE(dropdown) | `imu9dof_read_angle(variables_get($imu), ROLL)` | (dynamic code) |
| `imu9dof_calibrate_mag` | Statement | VAR(field_variable) | `imu9dof_calibrate_mag(variables_get($imu))` | (dynamic code) |
| `imu9dof_set_acc_range` | Statement | VAR(field_variable), RANGE(dropdown) | `imu9dof_set_acc_range(variables_get($imu), QMI8658A_ACC_RANGE_2G)` | (dynamic code) |
| `imu9dof_set_gyro_range` | Statement | VAR(field_variable), RANGE(dropdown) | `imu9dof_set_gyro_range(variables_get($imu), QMI8658A_GYRO_RANGE_16DPS)` | (dynamic code) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| AXIS | X, Y, Z | X轴 / Y轴 / Z轴 |
| ANGLE | ROLL, PITCH, YAW | 横滚(Roll) / 俯仰(Pitch) / 航向(Yaw) |
| RANGE | QMI8658A_ACC_RANGE_2G, QMI8658A_ACC_RANGE_4G, QMI8658A_ACC_RANGE_8G, QMI8658A_ACC_RANGE_16G | ±2g / ±4g / ±8g / ±16g |

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

1. **Variable Creation**: `imu9dof_init("varName", ...)` creates variable `$varName`; reference with `variables_get($varName)`
2. **Initialization**: Place init blocks inside `arduino_setup()`
3. **Parameter Order**: Follows `block.json` args0 order
