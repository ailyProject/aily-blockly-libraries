# SparkFun MPU-9250 DMP IMU

Blockly wrapper for the SparkFun MPU-9250 9-DoF IMU with DMP support.

## Library Info
- **Name**: @aily-project/lib-sparkfun-mpu9250-dmp
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `mpu9250_init` | Statement | VAR(field_input) | `mpu9250_init("imu")` | Dynamic code |
| `mpu9250_set_sensors` | Statement | VAR(field_variable), ACCEL(dropdown), GYRO(dropdown), COMPASS(dropdown) | `mpu9250_set_sensors(variables_get($imu), "1", "1", "1")` | Dynamic code |
| `mpu9250_set_gyro_fsr` | Statement | VAR(field_variable), FSR(dropdown) | `mpu9250_set_gyro_fsr(variables_get($imu), "250")` | Dynamic code |
| `mpu9250_set_accel_fsr` | Statement | VAR(field_variable), FSR(dropdown) | `mpu9250_set_accel_fsr(variables_get($imu), "2")` | Dynamic code |
| `mpu9250_set_lpf` | Statement | VAR(field_variable), LPF(dropdown) | `mpu9250_set_lpf(variables_get($imu), "5")` | Dynamic code |
| `mpu9250_set_sample_rate` | Statement | VAR(field_variable), RATE(input_value) | `mpu9250_set_sample_rate(variables_get($imu), math_number(0))` | Dynamic code |
| `mpu9250_data_ready` | Value | VAR(field_variable) | `mpu9250_data_ready(variables_get($imu))` | Dynamic code |
| `mpu9250_update` | Statement | VAR(field_variable) | `mpu9250_update(variables_get($imu))` | Dynamic code |
| `mpu9250_get_accel` | Value | VAR(field_variable), AXIS(dropdown) | `mpu9250_get_accel(variables_get($imu), ax)` | Dynamic code |
| `mpu9250_get_gyro` | Value | VAR(field_variable), AXIS(dropdown) | `mpu9250_get_gyro(variables_get($imu), gx)` | Dynamic code |
| `mpu9250_get_compass` | Value | VAR(field_variable), AXIS(dropdown) | `mpu9250_get_compass(variables_get($imu), mx)` | Dynamic code |
| `mpu9250_get_temperature` | Value | VAR(field_variable) | `mpu9250_get_temperature(variables_get($imu))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ACCEL | 1, 0 | mpu9250_set_sensors |
| GYRO | 1, 0 | mpu9250_set_sensors |
| COMPASS | 1, 0 | mpu9250_set_sensors |
| FSR | 250, 500, 1000, 2000 | mpu9250_set_gyro_fsr |
| FSR | 2, 4, 8, 16 | mpu9250_set_accel_fsr |
| LPF | 5, 10, 20, 42, 98, 188 | mpu9250_set_lpf |
| AXIS | ax, ay, az | mpu9250_get_accel |
| AXIS | gx, gy, gz | mpu9250_get_gyro |
| AXIS | mx, my, mz | mpu9250_get_compass |

## ABS Examples

### Basic Usage
```
arduino_setup()
    mpu9250_init("imu")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, mpu9250_data_ready(variables_get($imu)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `mpu9250_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
