# SparkFun Qwiic 超声波距离传感器

SparkFun Qwiic 超声波传感器的 Blockly 封装库。

## Library Info
- **Name**: @aily-project/lib-sparkfun-qwiic-ultrasonic
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `qwiic_ultrasonic_init` | Statement | VAR(field_input) | `qwiic_ultrasonic_init("sonar")` | `QwiicUltrasonic sonar; uint16_t _ultrasonic_dist_sonar = 0; sonar.begin();` |
| `qwiic_ultrasonic_read` | Value(Number) | VAR(field_variable) | `qwiic_ultrasonic_read(variables_get($sonar))` | `([&](){ sonar.triggerAndRead(_ultrasonic_dist_sonar); return _ultrasonic_dist_sonar; })()` |

## Notes

1. `triggerAndRead()` 通过引用参数传出距离值（uint16_t），使用 lambda 内联调用
2. 返回值单位为毫米（mm）

## ABS Examples

```
arduino_setup()
    qwiic_ultrasonic_init("sonar")

arduino_loop()
    serial_println(Serial, qwiic_ultrasonic_read(variables_get($sonar)))
    time_delay(math_number(100))
```
