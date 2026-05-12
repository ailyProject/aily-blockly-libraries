# PS3 Controller

PS3 Bluetooth controller control library supports button detection, joystick reading, and vibration feedback

## Library Info
- **Name**: @aily-project/lib-ps3controller
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ps3_init` | Statement | MAC_ADDR(input_value) | `ps3_init(text("value"))` | Dynamic code |
| `ps3_button_pressed` | Value | BUTTON(dropdown) | `ps3_button_pressed(cross)` | Ps3.data.button.... |
| `ps3_stick_value` | Value | STICK(dropdown), AXIS(dropdown) | `ps3_stick_value(l, x)` | Ps3.data.analog.stick....... |
| `ps3_is_connected` | Value | (none) | `ps3_is_connected()` | Ps3.isConnected() |
| `ps3_set_rumble` | Statement | INTENSITY(input_value), DURATION(input_value) | `ps3_set_rumble(math_number(0), math_number(1000))` | Ps3.setRumble(..., ...);\n |
| `ps3_set_player` | Statement | PLAYER(dropdown) | `ps3_set_player("1")` | Ps3.setPlayer(...);\n |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| BUTTON | cross, square, triangle, circle, up, down, left, right, l1, l2, r1, r2, select, start | ps3_button_pressed |
| STICK | l, r | ps3_stick_value |
| AXIS | x, y | ps3_stick_value |
| PLAYER | 1, 2, 3, 4 | ps3_set_player |

## ABS Examples

### Basic Usage
```
arduino_setup()
    ps3_init(text("value"))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, ps3_button_pressed(cross))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
