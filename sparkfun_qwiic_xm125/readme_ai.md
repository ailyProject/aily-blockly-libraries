# SparkFun Qwiic XM125 脉冲相干雷达传感器

SparkFun Qwiic XM125 的 Blockly 封装库（存在检测模式）。

## Library Info
- **Name**: @aily-project/lib-sparkfun-qwiic-xm125
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `xm125_presence_init` | Statement | VAR(field_input), START_MM(input_value), END_MM(input_value) | `xm125_presence_init("radar", math_number(500), math_number(3000))` | `SparkFunXM125Presence radar; radar.begin(); radar.detectorStart(500, 3000);` |
| `xm125_is_detected` | Value(Boolean) | VAR(field_variable) | `xm125_is_detected(variables_get($radar))` | `([&](){ radar.getDetectorPresenceDetected(_xm125_presence_radar); return _xm125_presence_radar != 0; })()` |
| `xm125_get_distance` | Value(Number) | VAR(field_variable) | `xm125_get_distance(variables_get($radar))` | `([&](){ radar.getDistance(_xm125_dist_radar); return (int)_xm125_dist_radar; })()` |

## Notes

1. 使用 `SparkFunXM125Presence` 类（存在检测模式），非距离测量类
2. `detectorStart(start_mm, end_mm)` 参数单位为毫米（默认范围 500~3000mm）
3. `getDetectorPresenceDetected()` 返回 uint32_t，非零表示检测到存在
4. 距离单位为毫米

## ABS Examples

```
arduino_setup()
    xm125_presence_init("radar", math_number(500), math_number(3000))

arduino_loop()
    if xm125_is_detected(variables_get($radar))
        serial_println(Serial, xm125_get_distance(variables_get($radar)))
    time_delay(math_number(200))
```
