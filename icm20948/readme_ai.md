# ICM20948九轴传感器

ICM20948九轴传感器支持库，支持加速度计、陀螺仪、磁力计和AHRS姿态解算

## Library Info
- **Name**: @aily-project/lib-icm20948
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `icm20948_init` | Statement | ADDRESS(dropdown) | `icm20948_init(1)` | `` |
| `icm20948_read_accel` | Value | AXIS(dropdown) | `icm20948_read_accel(X)` | `` |
| `icm20948_read_gyro` | Value | AXIS(dropdown) | `icm20948_read_gyro(X)` | `` |
| `icm20948_read_mag` | Value | AXIS(dropdown) | `icm20948_read_mag(X)` | `` |
| `icm20948_read_temp` | Value | (none) | `icm20948_read_temp()` | `` |
| `icm20948_data_ready` | Value | (none) | `icm20948_data_ready()` | `` |
| `icm20948_ahrs_init` | Statement | FREQ(field_number) | `icm20948_ahrs_init(100)` | `` |
| `icm20948_ahrs_update` | Statement | (none) | `icm20948_ahrs_update()` | `ahrs_roll` |
| `icm20948_get_roll` | Value | (none) | `icm20948_get_roll()` | `ahrs_roll` |
| `icm20948_get_pitch` | Value | (none) | `icm20948_get_pitch()` | `ahrs_pitch` |
| `icm20948_get_yaw` | Value | (none) | `icm20948_get_yaw()` | `ahrs_yaw` |
| `icm20948_calibrate_gyro` | Statement | SAMPLES(field_number) | `icm20948_calibrate_gyro(500)` | (dynamic code) |
| `icm20948_set_gyro_offset` | Statement | OFFSET_X(input_value), OFFSET_Y(input_value), OFFSET_Z(input_value) | `icm20948_set_gyro_offset(math_number(0), math_number(0), math_number(0))` | (dynamic code) |
| `icm20948_set_accel_range` | Statement | RANGE(dropdown) | `icm20948_set_accel_range(gpm2)` | (dynamic code) |
| `icm20948_set_gyro_range` | Statement | RANGE(dropdown) | `icm20948_set_gyro_range(dps250)` | (dynamic code) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | 1, 0 | 0x69 (默认) / 0x68 (ADR接地) |
| AXIS | X, Y, Z | X / Y / Z |
| RANGE | gpm2, gpm4, gpm8, gpm16 | ±2g / ±4g / ±8g / ±16g |

## ABS Examples

### Basic Usage
```
arduino_setup()
    icm20948_init(1)
    icm20948_ahrs_init(100)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, icm20948_read_accel(X))
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order
