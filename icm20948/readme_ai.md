# ICM20948 nine-axis sensor

ICM20948 nine-axis sensor support library supports accelerometer, gyroscope, magnetometer and AHRS attitude calculation

## Library Info
- **Name**: @aily-project/lib-icm20948
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `icm20948_init` | Statement | ADDRESS(dropdown) | `icm20948_init("1")` | Dynamic code |
| `icm20948_read_accel` | Value | AXIS(dropdown) | `icm20948_read_accel(X)` | myICM.acc...() |
| `icm20948_read_gyro` | Value | AXIS(dropdown) | `icm20948_read_gyro(X)` | myICM.gyr...() |
| `icm20948_read_mag` | Value | AXIS(dropdown) | `icm20948_read_mag(X)` | myICM.mag...() |
| `icm20948_read_temp` | Value | (none) | `icm20948_read_temp()` | myICM.temp() |
| `icm20948_data_ready` | Value | (none) | `icm20948_data_ready()` | (icm_initialized && myICM.dataReady()) |
| `icm20948_ahrs_init` | Statement | FREQ(field_number) | `icm20948_ahrs_init(100)` | Dynamic code |
| `icm20948_ahrs_update` | Statement | (none) | `icm20948_ahrs_update()` | if (icm_initialized && myICM.dataReady()) { myICM.getAGMT(); madgwick_update( myICM.gyrX() |
| `icm20948_get_roll` | Value | (none) | `icm20948_get_roll()` | ahrs_roll |
| `icm20948_get_pitch` | Value | (none) | `icm20948_get_pitch()` | ahrs_pitch |
| `icm20948_get_yaw` | Value | (none) | `icm20948_get_yaw()` | ahrs_yaw |
| `icm20948_calibrate_gyro` | Statement | SAMPLES(field_number) | `icm20948_calibrate_gyro(500)` | Serial.println("开始陀螺仪校准，请保持传感器静止..."); delay(2000); float sum_x = 0, sum_y = 0, sum_z = 0; |
| `icm20948_set_gyro_offset` | Statement | OFFSET_X(input_value), OFFSET_Y(input_value), OFFSET_Z(input_value) | `icm20948_set_gyro_offset(math_number(0), math_number(0), math_number(0))` | gyro_offset_x = ...; gyro_offset_y = ...; gyro_offset_z = ...; |
| `icm20948_set_accel_range` | Statement | RANGE(dropdown) | `icm20948_set_accel_range(gpm2)` | if (icm_initialized) { ICM_20948_fss_t myFSS; myFSS.a = ...; myICM.setFullScale(ICM_20948_ |
| `icm20948_set_gyro_range` | Statement | RANGE(dropdown) | `icm20948_set_gyro_range(dps250)` | if (icm_initialized) { ICM_20948_fss_t myFSS; myFSS.g = ...; myICM.setFullScale(ICM_20948_ |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | 1, 0 | icm20948_init |
| AXIS | X, Y, Z | icm20948_read_accel, icm20948_read_gyro, icm20948_read_mag |
| RANGE | gpm2, gpm4, gpm8, gpm16 | icm20948_set_accel_range |
| RANGE | dps250, dps500, dps1000, dps2000 | icm20948_set_gyro_range |

## ABS Examples

### Basic Usage
```
arduino_setup()
    icm20948_init("1")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, icm20948_read_accel(X))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
