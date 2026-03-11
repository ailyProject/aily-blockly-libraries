# BMI270六轴IMU传感器

基于BMI270六轴IMU传感器，通过I2C接口实现加速度与角速度数据采集，适用于ESP32开发板。

## Library Info
- **Name**: @aily-project/lib-sparkfun_bmi270
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `bmi270_init_i2c` | Statement | WIRE_OPTION(dropdown), ADDRESS(field_input) | `bmi270_init_i2c(WIRE1, "BMI2_I2C_PRIM_ADDR")` | `imu.beginSPI(` |
| `bmi270_get_sensor_data` | Statement | (none) | `bmi270_get_sensor_data()` | — |
| `bmi270_get_accel_data` | Value | AXIS(dropdown) | `bmi270_get_accel_data(X)` | — |
| `bmi270_get_gyro_data` | Value | AXIS(dropdown) | `bmi270_get_gyro_data(X)` | — |
| `bmi270_perform_accel_offset_calibration` | Statement | AXIS(dropdown) | `bmi270_perform_accel_offset_calibration(X)` | `imu.performAccelOffsetCalibration(` |
| `bmi270_perform_gyro_offset_calibration` | Statement | (none) | `bmi270_perform_gyro_offset_calibration()` | — |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| WIRE_OPTION | WIRE1, WIRE2 | Wire1 (SDA:8, SCL:9) / Wire2 (SDA:4, SCL:5) |
| AXIS | X, Y, Z | X / Y / Z |

## ABS Examples

### Basic Usage
```
arduino_setup()
    bmi270_init_i2c(WIRE1, "BMI2_I2C_PRIM_ADDR")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, bmi270_get_accel_data(X))
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order
