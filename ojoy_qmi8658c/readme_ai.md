# OJoy 6-axis IMU

OJoy QMI8658C 6-axis IMU (accel+gyro): 3-axis accel/gyro/temperature/pitch-roll, I2C 0x6B, OJoy pins fixed

## Library Info
- **Name**: @aily-project/lib-ojoy_qmi8658c
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ojqmi_init` | Statement | VAR(field_input), AR(dropdown), GR(dropdown) | `ojqmi_init("imu", "0", "0")` | See generator |
| `ojqmi_update` | Statement | VAR(field_variable) | `ojqmi_update(variables_get($imu))` | See generator |
| `ojqmi_accel` | Value | VAR(field_variable), AXIS(dropdown) | `ojqmi_accel(variables_get($imu), x)` | See generator |
| `ojqmi_gyro` | Value | VAR(field_variable), AXIS(dropdown) | `ojqmi_gyro(variables_get($imu), x)` | See generator |
| `ojqmi_angle` | Value | VAR(field_variable), WHICH(dropdown) | `ojqmi_angle(variables_get($imu), pitch)` | See generator |
| `ojqmi_temp` | Value | VAR(field_variable) | `ojqmi_temp(variables_get($imu))` | See generator |
| `ojqmi_present` | Value | VAR(field_variable) | `ojqmi_present(variables_get($imu))` | See generator |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| AR | 0, 1, 2, 3 | ojqmi_init |
| GR | 0, 1, 2, 3, 4, 5, 6, 7 | ojqmi_init |
| AXIS | x, y, z | ojqmi_accel, ojqmi_gyro |
| WHICH | pitch, roll | ojqmi_angle |

## ABS Examples

### Basic Usage
```
arduino_setup()
    ojqmi_init("imu", "0", "0")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, ojqmi_accel(variables_get($imu), x))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `ojqmi_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
