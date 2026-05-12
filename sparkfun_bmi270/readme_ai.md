# SparkFun BMI270 6-DoF IMU

Blockly wrapper for the SparkFun BMI270 6-DoF IMU (accelerometer + gyroscope) library.

## Library Info
- **Name**: @aily-project/lib-sparkfun-bmi270
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `bmi270_init_i2c` | Statement | VAR(field_input), ADDR(dropdown) | `bmi270_init_i2c("imu", "0x68")` | Wire.begin();\n |
| `bmi270_get_data` | Statement | VAR(field_variable) | `bmi270_get_data(variables_get($imu))` | Dynamic code |
| `bmi270_get_accel` | Value | VAR(field_variable), AXIS(dropdown) | `bmi270_get_accel(variables_get($imu), accelX)` | Dynamic code |
| `bmi270_get_gyro` | Value | VAR(field_variable), AXIS(dropdown) | `bmi270_get_gyro(variables_get($imu), gyroX)` | Dynamic code |
| `bmi270_get_temperature` | Value | VAR(field_variable) | `bmi270_get_temperature(variables_get($imu))` | Dynamic code |
| `bmi270_enable_step_counter` | Statement | VAR(field_variable) | `bmi270_enable_step_counter(variables_get($imu))` | Dynamic code |
| `bmi270_get_step_count` | Value | VAR(field_variable) | `bmi270_get_step_count(variables_get($imu))` | Dynamic code |
| `bmi270_reset_step_count` | Statement | VAR(field_variable) | `bmi270_reset_step_count(variables_get($imu))` | Dynamic code |
| `bmi270_get_step_activity` | Value | VAR(field_variable) | `bmi270_get_step_activity(variables_get($imu))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDR | 0x68, 0x69 | bmi270_init_i2c |
| AXIS | accelX, accelY, accelZ | bmi270_get_accel |
| AXIS | gyroX, gyroY, gyroZ | bmi270_get_gyro |

## ABS Examples

### Basic Usage
```
arduino_setup()
    bmi270_init_i2c("imu", "0x68")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, bmi270_get_accel(variables_get($imu), accelX))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `bmi270_init_i2c("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
