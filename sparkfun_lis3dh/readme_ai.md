# SparkFun LIS3DH 加速度计

读取 LIS3DH 三轴加速度计 X/Y/Z 轴数据。

## Library Info
- **Name**: @aily-project/lib-sparkfun-lis3dh
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `lis3dh_init` | Statement | VAR(field_input), ADDR(dropdown) | `lis3dh_init("accel", 0x19)` | `LIS3DH accel(I2C_MODE,0x19); accel.begin();` |
| `lis3dh_set_range` | Statement | VAR(field_variable), RANGE(dropdown) | `lis3dh_set_range(variables_get($accel), 2)` | `accel.settings.accelRange=2; accel.applySettings();` |
| `lis3dh_set_sample_rate` | Statement | VAR(field_variable), RATE(dropdown) | `lis3dh_set_sample_rate(variables_get($accel), 25)` | `accel.settings.accelSampleRate=25; accel.applySettings();` |
| `lis3dh_read_accel_x` | Value→Number | VAR(field_variable) | `lis3dh_read_accel_x(variables_get($accel))` | `accel.readFloatAccelX()` |
| `lis3dh_read_accel_y` | Value→Number | VAR(field_variable) | `lis3dh_read_accel_y(variables_get($accel))` | `accel.readFloatAccelY()` |
| `lis3dh_read_accel_z` | Value→Number | VAR(field_variable) | `lis3dh_read_accel_z(variables_get($accel))` | `accel.readFloatAccelZ()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDR | 0x19, 0x18 | I2C 地址（SDO 脚高/低） |
| RANGE | 2,4,8,16 | ±g 量程 |
| RATE | 1,10,25,50,100,200,400 | 输出数据速率（Hz） |

## ABS Examples

```
arduino_setup()
    lis3dh_init("accel", 0x19)
    serial_begin(Serial, 115200)

arduino_loop()
    serial_print(Serial, text("X:"))
    serial_println(Serial, lis3dh_read_accel_x(variables_get($accel)))
    time_delay(math_number(200))
```
