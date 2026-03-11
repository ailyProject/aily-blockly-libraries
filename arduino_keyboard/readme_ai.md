# USB模拟键盘

将Arduino模拟成USB键盘，可以实现键盘输入、按键模拟等功能

## Library Info
- **Name**: @aily-project/lib-keyboard
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `keyboard_begin` | Statement | (none) | `keyboard_begin()` | `` |
| `keyboard_end` | Statement | (none) | `keyboard_end()` | `Keyboard.end();\n` |
| `keyboard_print` | Statement | TEXT(input_value) | `keyboard_print(text("hello"))` | `Keyboard.print(` |
| `keyboard_press` | Statement | KEY(input_value) | `keyboard_press(math_number(0))` | `Keyboard.press(` |
| `keyboard_special_key` | Value | KEY(dropdown) | `keyboard_special_key(KEY_RETURN)` | (dynamic code) |
| `keyboard_release` | Statement | KEY(input_value) | `keyboard_release(math_number(0))` | `Keyboard.release(` |
| `keyboard_release_all` | Statement | (none) | `keyboard_release_all()` | `Keyboard.releaseAll();\n` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| KEY | KEY_RETURN, KEY_ESC, KEY_BACKSPACE, KEY_TAB, ' ', KEY_LEFT_CTRL, KEY_LEFT_SHIFT, KEY_LEFT_ALT, KEY_LEFT_GUI, KEY_RIGHT_CTRL, KEY_RIGHT_SHIFT, KEY_RIGHT_ALT, KEY_RIGHT_GUI, KEY_UP_ARROW, KEY_DOWN_ARROW, KEY_LEFT_ARROW, KEY_RIGHT_ARROW, KEY_INSERT, KEY_DELETE, KEY_HOME, KEY_END, KEY_PAGE_UP, KEY_PAGE_DOWN | Enter / Esc / Backspace / Tab / 空格 / 左Ctrl / 左Shift / 左Alt / 左Windows/Command / 右Ctrl / 右Shift / 右Alt / 右Windows/Command / 向上箭头 / 向下箭头 / 向左箭头 / 向右箭头 / Insert / Delete / Home / End / Page Up / Page Down |

## ABS Examples

### Basic Usage
```
arduino_setup()
    keyboard_begin()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, keyboard_special_key(KEY_RETURN))
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order
