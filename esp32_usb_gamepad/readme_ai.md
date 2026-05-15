# USB analog handle

Simulate ESP32 as a USB game controller, supporting button, joystick, trigger and direction key control

## Library Info
- **Name**: @aily-project/lib-esp32-usb-gamepad
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `gamepad_begin` | Statement | (none) | `gamepad_begin()` | Dynamic code |
| `gamepad_press_button` | Statement | BUTTON(input_value) | `gamepad_press_button(math_number(0))` | Gamepad.pressButton( |
| `gamepad_release_button` | Statement | BUTTON(input_value) | `gamepad_release_button(math_number(0))` | Gamepad.releaseButton( |
| `gamepad_left_stick` | Statement | X(input_value), Y(input_value) | `gamepad_left_stick(math_number(0), math_number(0))` | Gamepad.leftStick( |
| `gamepad_right_stick` | Statement | X(input_value), Y(input_value) | `gamepad_right_stick(math_number(0), math_number(0))` | Gamepad.rightStick( |
| `gamepad_left_trigger` | Statement | VALUE(input_value) | `gamepad_left_trigger(math_number(0))` | Gamepad.leftTrigger( |
| `gamepad_right_trigger` | Statement | VALUE(input_value) | `gamepad_right_trigger(math_number(0))` | Gamepad.rightTrigger( |
| `gamepad_hat` | Statement | DIRECTION(dropdown) | `gamepad_hat(HAT_CENTER)` | Gamepad.hat( |
| `gamepad_reset` | Statement | (none) | `gamepad_reset()` | Gamepad.releaseButton(0);\nGamepad.leftStick(0, 0);\nGamepad.rightStick(0, 0);\nGamepad.le |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| DIRECTION | HAT_CENTER, HAT_UP, HAT_UP_RIGHT, HAT_RIGHT, HAT_DOWN_RIGHT, HAT_DOWN, HAT_DOWN_LEFT, HAT_LEFT, HAT_UP_LEFT | gamepad_hat |

## ABS Examples

### Basic Usage
```
arduino_setup()
    gamepad_begin()
    serial_begin(Serial, 9600)

arduino_loop()
    gamepad_press_button(math_number(0))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
