# SparkFun Qwiic Twist RGB 旋转编码器

SparkFun Qwiic Twist 的 Blockly 封装库。

## Library Info
- **Name**: @aily-project/lib-sparkfun-qwiic-twist
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `qwiic_twist_init` | Statement | VAR(field_input) | `qwiic_twist_init("twist")` | `TWIST twist; twist.begin();` |
| `qwiic_twist_get_count` | Value(Number) | VAR(field_variable) | `qwiic_twist_get_count(variables_get($twist))` | `twist.getCount()` |
| `qwiic_twist_set_count` | Statement | VAR(field_variable), COUNT(input_value) | `qwiic_twist_set_count(variables_get($twist), math_number(0))` | `twist.setCount(0);` |
| `qwiic_twist_is_moved` | Value(Boolean) | VAR(field_variable) | `qwiic_twist_is_moved(variables_get($twist))` | `twist.isMoved()` |
| `qwiic_twist_is_clicked` | Value(Boolean) | VAR(field_variable) | `qwiic_twist_is_clicked(variables_get($twist))` | `twist.isClicked()` |
| `qwiic_twist_is_pressed` | Value(Boolean) | VAR(field_variable) | `qwiic_twist_is_pressed(variables_get($twist))` | `twist.isPressed()` |
| `qwiic_twist_set_color` | Statement | VAR(field_variable), RED/GREEN/BLUE(input_value×3) | `qwiic_twist_set_color(variables_get($twist), math_number(255), math_number(0), math_number(0))` | `twist.setColor(255, 0, 0);` |

## Notes

1. `isMoved()` 和 `isClicked()` 在读取后会清除状态（one-shot）
2. RGB 每通道范围 0-255

## ABS Examples

```
arduino_setup()
    qwiic_twist_init("twist")
    qwiic_twist_set_color(variables_get($twist), math_number(0), math_number(0), math_number(255))

arduino_loop()
    if qwiic_twist_is_clicked(variables_get($twist))
        qwiic_twist_set_count(variables_get($twist), math_number(0))
    serial_println(Serial, qwiic_twist_get_count(variables_get($twist)))
    time_delay(math_number(100))
```
