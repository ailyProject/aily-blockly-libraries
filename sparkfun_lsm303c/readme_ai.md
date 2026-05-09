# SparkFun LSM303C 六轴 IMU

读取三轴加速度和三轴磁力数据。

## Library Info
- **Name**: @aily-project/lib-sparkfun-lsm303c
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `lsm303c_init` | Statement | VAR(field_input) | `lsm303c_init("imu6")` | `LSM303C imu6; imu6.begin();` |
| `lsm303c_read_accel` | Value→Number | VAR(field_variable), AXIS(dropdown) | `lsm303c_read_accel(variables_get($imu6), X)` | `imu6.readAccelX()` |
| `lsm303c_read_mag` | Value→Number | VAR(field_variable), AXIS(dropdown) | `lsm303c_read_mag(variables_get($imu6), X)` | `imu6.readMagX()` |
| `lsm303c_read_temp_c` | Value→Number | VAR(field_variable) | `lsm303c_read_temp_c(variables_get($imu6))` | `imu6.readTempC()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| AXIS | X, Y, Z | 传感器轴向 |

## Notes

1. 加速度计单位为 mg（毫g），磁力计单位为 Gauss
2. 每次调用读取块即自动触发新的测量并返回最新值（无需单独调用 read）
