# SparkFun LSM6DSO 六轴 IMU

SparkFun Qwiic LSM6DSO 六轴惯性测量单元（加速度计 + 陀螺仪）的 Blockly 封装库。

## Library Info
- **Name**: @aily-project/lib-sparkfun-lsm6dso
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `lsm6dso_init` | Statement | VAR(field_input) | `lsm6dso_init("imu")` | `LSM6DSO imu; imu.begin(); imu.initialize(BASIC_SETTINGS);` |
| `lsm6dso_get_accel` | Value→Number | VAR(field_variable), AXIS(dropdown) | `lsm6dso_get_accel(variables_get($imu), X)` | `imu.readFloatAccelX()` |
| `lsm6dso_get_gyro` | Value→Number | VAR(field_variable), AXIS(dropdown) | `lsm6dso_get_gyro(variables_get($imu), X)` | `imu.readFloatGyroX()` |
| `lsm6dso_get_temp_c` | Value→Number | VAR(field_variable) | `lsm6dso_get_temp_c(variables_get($imu))` | `imu.readTempC()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| AXIS | X, Y, Z | 传感器轴向 |

## Notes

1. `lsm6dso_init("varName")` 在全局声明 `LSM6DSO varName;`，并在 setup 中调用 `begin()` 和 `initialize(BASIC_SETTINGS)`
2. 读取块每次调用都直接从传感器获取实时值，无需额外调用读取函数
3. 默认 I2C 地址为 0x6B；使用备用地址 0x6A 需修改代码

## ABS Examples

### 基本读取
```
arduino_setup()
    lsm6dso_init("imu")
    serial_begin(Serial, 115200)

arduino_loop()
    serial_println(Serial, lsm6dso_get_accel(variables_get($imu), X))
    serial_println(Serial, lsm6dso_get_gyro(variables_get($imu), Z))
    serial_println(Serial, lsm6dso_get_temp_c(variables_get($imu)))
    time_delay(math_number(500))
```
