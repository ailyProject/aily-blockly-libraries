# Seeed 9DOF IMU

Blockly wrapper for Grove IMU 9DOF (ICM20600 + AK09918).

## Library Info
- **Name**: @aily-project/lib-seeed-9dof
- **Version**: 0.0.2

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `seeed_9dof_init` | Statement | VAR(field_input), AD0(dropdown), MAG_MODE(dropdown) | `seeed_9dof_init("imu", true, AK09918_CONTINUOUS_100HZ)` | `_seeed9dof_err_imu = imu.begin(AK09918_CONTINUOUS_100HZ); ↵ if (_seeed9dof_err_imu != AK09918_ERR_OK) { ↵ Serial.println(imu.mag.strError(_seeed9dof_err_imu)); ↵ }` |
| `seeed_9dof_read_motion` | Value | VAR(field_variable), TYPE(dropdown), AXIS(dropdown) | `seeed_9dof_read_motion($imu, ACCEL, X)` | `imu.icm.getAccelerationX()` |
| `seeed_9dof_read_magnetic` | Value | VAR(field_variable), TYPE(dropdown), AXIS(dropdown) | `seeed_9dof_read_magnetic($imu, UT, 0)` | `seeed9dof_read_mag_axis(imu.mag, 0, false)` |
| `seeed_9dof_read_temperature` | Value | VAR(field_variable) | `seeed_9dof_read_temperature($imu)` | `imu.icm.getTemperature()` |
| `seeed_9dof_magnetic_ready` | Value | VAR(field_variable) | `seeed_9dof_magnetic_ready($imu)` | `imu.mag.isDataReady() == AK09918_ERR_OK` |
| `seeed_9dof_magnet_status` | Value | VAR(field_variable), STATUS(dropdown) | `seeed_9dof_magnet_status($imu, DATA_READY)` | `imu.mag.isDataReady()` |
| `seeed_9dof_error_text` | Value | VAR(field_variable), ERROR(input_value) | `seeed_9dof_error_text($imu, math_number(0))` | `imu.mag.strError((AK09918_err_type_t)(1))` |
| `seeed_9dof_set_power_mode` | Statement | VAR(field_variable), MODE(dropdown) | `seeed_9dof_set_power_mode($imu, ICM_6AXIS_LOW_POWER)` | `imu.icm.setPowerMode(ICM_6AXIS_LOW_POWER);` |
| `seeed_9dof_set_motion_range` | Statement | VAR(field_variable), ACC_RANGE(dropdown), GYRO_RANGE(dropdown) | `seeed_9dof_set_motion_range($imu, RANGE_16G, RANGE_2K_DPS)` | `imu.icm.setAccScaleRange(RANGE_2G); ↵ imu.icm.setGyroScaleRange(RANGE_250_DPS);` |
| `seeed_9dof_set_sample_divider` | Statement | VAR(field_variable), DIV(input_value) | `seeed_9dof_set_sample_divider($imu, math_number(0))` | `imu.icm.setSampleRateDivier((uint8_t)(1));` |
| `seeed_9dof_set_magnet_mode` | Statement | VAR(field_variable), MODE(dropdown) | `seeed_9dof_set_magnet_mode($imu, AK09918_CONTINUOUS_100HZ)` | `_seeed9dof_err_imu = imu.mag.switchMode(AK09918_NORMAL);` |
| `seeed_9dof_calibrate_magnet` | Statement | VAR(field_variable), TIMEOUT(input_value) | `seeed_9dof_calibrate_magnet($imu, math_number(10000))` | `seeed9dof_calibrate_magnet(imu.mag, (uint32_t)(1), &_seeed9dof_offset_x_imu, &_seeed9dof_offset_y_imu, &_seeed9dof_offset_z_imu);` |
| `seeed_9dof_heading` | Value | VAR(field_variable), DECLINATION(input_value) | `seeed_9dof_heading($imu, math_number(0))` | `seeed9dof_heading(imu.icm, imu.mag, 1, _seeed9dof_offset_x_imu, _seeed9dof_offset_y_imu, _seeed9dof_offset_z_imu)` |
| `seeed_9dof_print_all` | Statement | VAR(field_variable), SERIAL(dropdown) | `seeed_9dof_print_all($imu, Serial)` | `SERIAL.print("A: "); ↵ SERIAL.print(imu.icm.getAccelerationX()); ↵ SERIAL.print(", "); ↵ SERIAL.print(imu.icm.getAccelerationY()); ↵ SERIAL.print(", "); ↵ SERIAL.println(imu.icm.getAccelerationZ()); ↵ SERIAL.print("G: "); ↵ SERIAL.print(imu.icm.getGyroscopeX()); ↵ SERIAL.print(", "); ↵ SERIAL.print(imu.icm.getGyroscopeY()); ↵ SERIAL.print(", "); ↵ SERIAL.println(imu.icm.getGyroscopeZ()); ↵ SERIAL.print("M: "); ↵ SERIAL.print(seeed9dof_read_mag_axis(imu.mag, 0, false)); ↵ SERIAL.print(", "); ↵ SERIAL.print(seeed9dof_read_mag_axis(imu.mag, 1, false)); ↵ SERIAL.print(", "); ↵ SERIAL.println(seeed9dof_read_mag_axis(imu.mag, 2, false)); ↵ SERIAL.print("Temp: "); ↵ SERIAL.println(imu.icm.getTemperature()); ↵ SERIAL.print("Heading: "); ↵ SERIAL.println(seeed9dof_heading(imu.icm, imu.mag, 0, _seeed9dof_offset_x_imu, _seeed9dof_offset_y_imu, _seeed9dof_offset_z_imu));` |
| `seeed_9dof_device_id` | Value | VAR(field_variable), PART(dropdown) | `seeed_9dof_device_id($imu, ICM)` | `imu.icm.getDeviceID()` |

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
    serial_println(Serial, seeed_9dof_read_motion($imu, ACCEL, X))
    serial_println(Serial, seeed_9dof_read_magnetic($imu, UT, 0))
    time_delay(math_number(500))
```

## Notes

1. **Variable**: `seeed_9dof_init("imu", ...)` creates `$imu` of type `Seeed9DOF`.
2. **Calibration**: run `seeed_9dof_calibrate_magnet` before `seeed_9dof_heading` for better compass output.
3. **Input values**: use `math_number(n)` for `DIV`, `TIMEOUT`, `DECLINATION`, and error-code inputs.
Version 0.0.2 supports the STM32 and ESP32 Wire receive buffers. On the Grove board the default ICM20600 address is 0x69 and the AK09918 address is 0x0C. Single measurement is selected explicitly. The integer temperature API handles signed samples below 25 °C, and the compass self-test interprets its negative Z value as signed 16-bit.
