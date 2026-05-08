# SparkFun Qwiic 摇杆

SparkFun Qwiic Joystick（SEN-15168）的 Blockly 封装库。

## Library Info
- **Name**: @aily-project/lib-sparkfun-qwiic-joystick
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `qwiic_joystick_init` | Statement | VAR(field_input) | `qwiic_joystick_init("joystick")` | `JOYSTICK joystick; joystick.begin();` |
| `qwiic_joystick_get_horizontal` | Value→Number | VAR(field_variable) | `qwiic_joystick_get_horizontal(variables_get($joystick))` | `joystick.getHorizontal()` |
| `qwiic_joystick_get_vertical` | Value→Number | VAR(field_variable) | `qwiic_joystick_get_vertical(variables_get($joystick))` | `joystick.getVertical()` |
| `qwiic_joystick_get_button` | Value→Boolean | VAR(field_variable) | `qwiic_joystick_get_button(variables_get($joystick))` | `joystick.checkButton()` |

## Notes

1. X/Y 轴范围 0-1023，中心约 512
2. `checkButton()` 返回当前按钮状态（按下=1）；`getButton()` 返回是否有点击事件
3. 默认 I2C 地址 0x20

## ABS Examples

```
arduino_setup()
    qwiic_joystick_init("joystick")
    serial_begin(Serial, 115200)

arduino_loop()
    serial_print(Serial, text("X:"))
    serial_println(Serial, qwiic_joystick_get_horizontal(variables_get($joystick)))
    serial_print(Serial, text("Y:"))
    serial_println(Serial, qwiic_joystick_get_vertical(variables_get($joystick)))
    time_delay(math_number(200))
```
