# USB模拟鼠标

将Arduino模拟成USB鼠标，可以实现鼠标点击、移动等功能

## Library Info
- **Name**: @aily-project/lib-mouse
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `mouse_begin` | Statement | (none) | `mouse_begin()` | `` |
| `mouse_click` | Statement | BUTTON(dropdown) | `mouse_click(MOUSE_LEFT)` | `Mouse.click(` |
| `mouse_move` | Statement | X(input_value), Y(input_value), WHEEL(input_value) | `mouse_move(math_number(0), math_number(0), math_number(0))` | `Mouse.move(` |
| `mouse_press` | Statement | BUTTON(dropdown) | `mouse_press(MOUSE_LEFT)` | `Mouse.press(` |
| `mouse_release` | Statement | BUTTON(dropdown) | `mouse_release(MOUSE_LEFT)` | `Mouse.release(` |
| `mouse_is_pressed` | Value | BUTTON(dropdown) | `mouse_is_pressed(MOUSE_LEFT)` | `Mouse.isPressed(` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| BUTTON | MOUSE_LEFT, MOUSE_RIGHT, MOUSE_MIDDLE, MOUSE_ALL | 左键 / 右键 / 中键 / 所有按键 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    mouse_begin()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, mouse_is_pressed(MOUSE_LEFT))
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order
