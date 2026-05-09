# SparkFun LSM9DS1 九轴 IMU

读取三轴加速度、陀螺仪、磁力计数据。

## Library Info
- **Name**: @aily-project/lib-sparkfun-lsm9ds1
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `lsm9ds1_init` | Statement | VAR(field_input) | `lsm9ds1_init("imu")` | `LSM9DS1 imu; imu.begin();` |
| `lsm9ds1_read_gyro` | Statement | VAR(field_variable) | `lsm9ds1_read_gyro(variables_get($imu))` | `imu.readGyro();` |
| `lsm9ds1_read_accel` | Statement | VAR(field_variable) | `lsm9ds1_read_accel(variables_get($imu))` | `imu.readAccel();` |
| `lsm9ds1_read_mag` | Statement | VAR(field_variable) | `lsm9ds1_read_mag(variables_get($imu))` | `imu.readMag();` |
| `lsm9ds1_get_gyro_axis` | Value→Number | VAR(field_variable), AXIS(dropdown) | `lsm9ds1_get_gyro_axis(variables_get($imu), X)` | `imu.calcGyro(imu.gx)` |
| `lsm9ds1_get_accel_axis` | Value→Number | VAR(field_variable), AXIS(dropdown) | `lsm9ds1_get_accel_axis(variables_get($imu), X)` | `imu.calcAccel(imu.ax)` |
| `lsm9ds1_get_mag_axis` | Value→Number | VAR(field_variable), AXIS(dropdown) | `lsm9ds1_get_mag_axis(variables_get($imu), X)` | `imu.calcMag(imu.mx)` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| AXIS | X, Y, Z | 传感器轴向 |

## ABS Examples

```
arduino_setup()
    lsm9ds1_init("imu")
    serial_begin(Serial, 115200)

arduino_loop()
    lsm9ds1_read_accel(variables_get($imu))
    serial_println(Serial, lsm9ds1_get_accel_axis(variables_get($imu), X))
    time_delay(math_number(200))
```

## Notes

1. **两步读取**: 先调用 `read_gyro/accel/mag`（更新内部寄存器），再调用 `get_*_axis`（返回转换后的浮点值）
2. **单位**: 陀螺仪→dps，加速度计→g，磁力计→Gauss
