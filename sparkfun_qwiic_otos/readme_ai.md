# SparkFun Qwiic OTOS 光学追踪传感器

SparkFun Qwiic OTOS 的 Blockly 封装库，提供机器人光学里程计功能（I2C）。

## Library Info
- **Name**: @aily-project/lib-sparkfun-qwiic-otos
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `qwiic_otos_init` | Statement | VAR(field_input) | `qwiic_otos_init("otos")` | `QwiicOTOS otos; sfe_otos_pose2d_t _otos_pos_otos; otos.begin();` |
| `qwiic_otos_calibrate_imu` | Statement | VAR(field_variable) | `qwiic_otos_calibrate_imu(variables_get($otos))` | `otos.calibrateImu();` |
| `qwiic_otos_reset_tracking` | Statement | VAR(field_variable) | `qwiic_otos_reset_tracking(variables_get($otos))` | `otos.resetTracking();` |
| `qwiic_otos_get_pos_x` | Value(Number) | VAR(field_variable) | `qwiic_otos_get_pos_x(variables_get($otos))` | `([&](){ otos.getPosition(_otos_pos_otos); return _otos_pos_otos.x; })()` |
| `qwiic_otos_get_pos_y` | Value(Number) | VAR(field_variable) | `qwiic_otos_get_pos_y(variables_get($otos))` | `([&](){ otos.getPosition(_otos_pos_otos); return _otos_pos_otos.y; })()` |
| `qwiic_otos_get_heading` | Value(Number) | VAR(field_variable) | `qwiic_otos_get_heading(variables_get($otos))` | `([&](){ otos.getPosition(_otos_pos_otos); return _otos_pos_otos.h; })()` |

## Notes

1. `calibrateImu()` 调用时传感器必须静止（255 次采样约需 2 秒）
2. 位置单位默认为英寸，角度默认为度
3. 使用 lambda 表达式每次独立读取传感器数据

## ABS Examples

```
arduino_setup()
    qwiic_otos_init("otos")
    qwiic_otos_calibrate_imu(variables_get($otos))
    qwiic_otos_reset_tracking(variables_get($otos))

arduino_loop()
    serial_println(Serial, qwiic_otos_get_pos_x(variables_get($otos)))
    serial_println(Serial, qwiic_otos_get_heading(variables_get($otos)))
    time_delay(math_number(100))
```
