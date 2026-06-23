# Seeed 9DOF IMU

Blockly wrapper for Grove IMU 9DOF (ICM20600 + AK09918).

## Library Info
- **Name**: @aily-project/lib-seeed-9dof
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `seeed_9dof_init` | Statement | VAR(field_input), AD0(dropdown), MAG_MODE(dropdown) | `seeed_9dof_init("imu", true, AK09918_CONTINUOUS_100HZ)` | creates `Seeed9DOF imu` and calls `imu.begin(...)` |
| `seeed_9dof_read_motion` | Value | VAR(field_variable), TYPE(dropdown), AXIS(dropdown) | `seeed_9dof_read_motion(variables_get($imu), ACCEL, X)` | `imu.icm.getAccelerationX()` |
| `seeed_9dof_read_magnetic` | Value | VAR(field_variable), TYPE(dropdown), AXIS(dropdown) | `seeed_9dof_read_magnetic(variables_get($imu), UT, X)` | helper reads AK09918 axis |
| `seeed_9dof_read_temperature` | Value | VAR(field_variable) | `seeed_9dof_read_temperature(variables_get($imu))` | `imu.icm.getTemperature()` |
| `seeed_9dof_magnetic_ready` | Value | VAR(field_variable) | `seeed_9dof_magnetic_ready(variables_get($imu))` | `imu.mag.isDataReady() == AK09918_ERR_OK` |
| `seeed_9dof_magnet_status` | Value | VAR(field_variable), STATUS(dropdown) | `seeed_9dof_magnet_status(variables_get($imu), DATA_READY)` | AK09918 status call |
| `seeed_9dof_error_text` | Value | VAR(field_variable), ERROR(input_value) | `seeed_9dof_error_text(variables_get($imu), math_number(0))` | `imu.mag.strError(...)` |
| `seeed_9dof_set_power_mode` | Statement | VAR(field_variable), MODE(dropdown) | `seeed_9dof_set_power_mode(variables_get($imu), ICM_6AXIS_LOW_POWER)` | `imu.icm.setPowerMode(...)` |
| `seeed_9dof_set_motion_range` | Statement | VAR(field_variable), ACC_RANGE(dropdown), GYRO_RANGE(dropdown) | `seeed_9dof_set_motion_range(variables_get($imu), RANGE_16G, RANGE_2K_DPS)` | sets accelerometer and gyro ranges |
| `seeed_9dof_set_sample_divider` | Statement | VAR(field_variable), DIV(input_value) | `seeed_9dof_set_sample_divider(variables_get($imu), math_number(0))` | `imu.icm.setSampleRateDivier(...)` |
| `seeed_9dof_set_magnet_mode` | Statement | VAR(field_variable), MODE(dropdown) | `seeed_9dof_set_magnet_mode(variables_get($imu), AK09918_CONTINUOUS_100HZ)` | `imu.mag.switchMode(...)` |
| `seeed_9dof_calibrate_magnet` | Statement | VAR(field_variable), TIMEOUT(input_value) | `seeed_9dof_calibrate_magnet(variables_get($imu), math_number(10000))` | helper stores magnet offsets |
| `seeed_9dof_heading` | Value | VAR(field_variable), DECLINATION(input_value) | `seeed_9dof_heading(variables_get($imu), math_number(0))` | helper returns heading degrees |
| `seeed_9dof_print_all` | Statement | VAR(field_variable), SERIAL(dropdown) | `seeed_9dof_print_all(variables_get($imu), Serial)` | prints all sensor values |
| `seeed_9dof_device_id` | Value | VAR(field_variable), PART(dropdown) | `seeed_9dof_device_id(variables_get($imu), ICM)` | reads chip ID |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| AD0 | true, false | ICM20600 I2C address: true=0x69, false=0x68 |
| MAG_MODE/MODE | AK09918_NORMAL, AK09918_CONTINUOUS_10HZ, AK09918_CONTINUOUS_20HZ, AK09918_CONTINUOUS_50HZ, AK09918_CONTINUOUS_100HZ, AK09918_POWER_DOWN | Magnetometer mode |
| TYPE | ACCEL, GYRO, RAW_ACCEL, RAW_GYRO, UT, RAW | Motion or magnetic read type |
| AXIS | X, Y, Z | Axis selection |
| STATUS | DATA_READY, DATA_SKIP, SELF_TEST | AK09918 status operation |
| MODE | ICM_SLEEP_MODE, ICM_STANDYBY_MODE, ICM_ACC_LOW_POWER, ICM_ACC_LOW_NOISE, ICM_GYRO_LOW_POWER, ICM_GYRO_LOW_NOISE, ICM_6AXIS_LOW_POWER, ICM_6AXIS_LOW_NOISE | ICM20600 power mode |
| ACC_RANGE | RANGE_2G, RANGE_4G, RANGE_8G, RANGE_16G | Accelerometer range |
| GYRO_RANGE | RANGE_250_DPS, RANGE_500_DPS, RANGE_1K_DPS, RANGE_2K_DPS | Gyroscope range |
| PART | ICM, AK | Device ID target |

## ABS Examples

### Basic Read
```
arduino_setup()
    seeed_9dof_init("imu", true, AK09918_CONTINUOUS_100HZ)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, seeed_9dof_read_motion(variables_get($imu), ACCEL, X))
    serial_println(Serial, seeed_9dof_read_magnetic(variables_get($imu), UT, X))
    time_delay(math_number(500))
```

## Notes

1. **Variable**: `seeed_9dof_init("imu", ...)` creates `$imu` of type `Seeed9DOF`.
2. **Calibration**: run `seeed_9dof_calibrate_magnet` before `seeed_9dof_heading` for better compass output.
3. **Input values**: use `math_number(n)` for `DIV`, `TIMEOUT`, `DECLINATION`, and error-code inputs.