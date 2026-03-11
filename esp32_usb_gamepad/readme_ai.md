# USB模拟手柄

将ESP32模拟成USB游戏手柄，支持按键、摇杆、扳机和方向键控制

## Library Info
- **Name**: @aily-project/lib-esp32-usb-gamepad
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `gamepad_begin` | Statement | (none) | `gamepad_begin()` | `` |
| `gamepad_press_button` | Statement | BUTTON(input_value) | `gamepad_press_button(math_number(0))` | `Gamepad.pressButton(` |
| `gamepad_release_button` | Statement | BUTTON(input_value) | `gamepad_release_button(math_number(0))` | `Gamepad.releaseButton(` |
| `gamepad_left_stick` | Statement | X(input_value), Y(input_value) | `gamepad_left_stick(math_number(0), math_number(0))` | `Gamepad.leftStick(` |
| `gamepad_right_stick` | Statement | X(input_value), Y(input_value) | `gamepad_right_stick(math_number(0), math_number(0))` | `Gamepad.rightStick(` |
| `gamepad_left_trigger` | Statement | VALUE(input_value) | `gamepad_left_trigger(math_number(0))` | `Gamepad.leftTrigger(` |
| `gamepad_right_trigger` | Statement | VALUE(input_value) | `gamepad_right_trigger(math_number(0))` | `Gamepad.rightTrigger(` |
| `gamepad_hat` | Statement | DIRECTION(dropdown) | `gamepad_hat(HAT_CENTER)` | `Gamepad.hat(` |
| `gamepad_reset` | Statement | (none) | `gamepad_reset()` | `Gamepad.releaseButton(0);\nGamepad.leftStick(0, 0);\nGamepad.rightStick(0, 0)...` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| DIRECTION | HAT_CENTER, HAT_UP, HAT_UP_RIGHT, HAT_RIGHT, HAT_DOWN_RIGHT, HAT_DOWN, HAT_DOWN_LEFT, HAT_LEFT, HAT_UP_LEFT | 中心 / 上 / 右上 / 右 / 右下 / 下 / 左下 / 左 / 左上 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    gamepad_begin()
    serial_begin(Serial, 9600)

arduino_loop()
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order
