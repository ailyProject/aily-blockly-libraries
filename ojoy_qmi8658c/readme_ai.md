# OJoy 6-axis IMU

OJoy QMI8658C 6-axis IMU (accel+gyro): 3-axis accel/gyro/temperature/pitch-roll, I2C 0x6B, OJoy pins fixed

## Library Info
- **Name**: @aily-project/lib-ojoy_qmi8658c
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ojqmi_init` | Statement | VAR(field_input), AR(dropdown), GR(dropdown) | `ojqmi_init("imu", "0", "0")` | `imu.begin(); ↵ imu.setAccelRange(0); ↵ imu.setGyroRange(0);` |
| `ojqmi_update` | Statement | VAR(field_variable) | `ojqmi_update($imu)` | `imu.read();` |
| `ojqmi_accel` | Value | VAR(field_variable), AXIS(dropdown) | `ojqmi_accel($imu, x)` | `imu.ax()` |
| `ojqmi_gyro` | Value | VAR(field_variable), AXIS(dropdown) | `ojqmi_gyro($imu, x)` | `imu.gx()` |
| `ojqmi_angle` | Value | VAR(field_variable), WHICH(dropdown) | `ojqmi_angle($imu, pitch)` | `imu.pitch()` |
| `ojqmi_temp` | Value | VAR(field_variable) | `ojqmi_temp($imu)` | `imu.temperature()` |
| `ojqmi_present` | Value | VAR(field_variable) | `ojqmi_present($imu)` | `imu.present()` |

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
    serial_println(Serial, ojqmi_accel($imu, x))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `ojqmi_init("varName", ...)` creates variable `$varName`; pass `$varName` directly to `field_variable` slots; use `variables_get($varName)` only for `input_value` slots.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

## 0.0.2

初始化和量程设置会检查总线应答。三轴加速度、三轴角速度和温度都读取完整后才提交新样本，短读或掉线时 read() 返回 false，保留上一帧。
