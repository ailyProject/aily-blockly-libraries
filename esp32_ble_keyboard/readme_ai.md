# BLE蓝牙键盘

将ESP32模拟成蓝牙键盘，支持键盘输入、按键模拟、媒体控制等功能

## Library Info
- **Name**: @aily-project/lib-esp32-ble-keyboard
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ble_keyboard_begin` | Statement | DEVICE_NAME(field_input) | `ble_keyboard_begin("ESP32 Keyboard")` | `` |
| `ble_keyboard_end` | Statement | (none) | `ble_keyboard_end()` | `compositeHID.end();\n` |
| `ble_keyboard_is_connected` | Value | (none) | `ble_keyboard_is_connected()` | `compositeHID.isConnected()` |
| `ble_keyboard_print` | Statement | TEXT(input_value) | `ble_keyboard_print(text("hello"))` | `if (compositeHID.isConnected()) {\n` |
| `ble_keyboard_press` | Statement | KEY(input_value) | `ble_keyboard_press(math_number(0))` | `if (compositeHID.isConnected()) {\n  keyboard->modifierKeyPress(` |
| `ble_keyboard_release` | Statement | KEY(input_value) | `ble_keyboard_release(math_number(0))` | `if (compositeHID.isConnected()) {\n  keyboard->modifierKeyRelease(` |
| `ble_keyboard_release_all` | Statement | (none) | `ble_keyboard_release_all()` | `if (compositeHID.isConnected()) {\n  keyboard->resetKeys();\n}\n` |
| `ble_keyboard_special_key` | Value | KEY(dropdown) | `ble_keyboard_special_key(KEY_ENTER)` | (dynamic code) |
| `ble_keyboard_write` | Statement | KEY(input_value) | `ble_keyboard_write(math_number(0))` | `if (compositeHID.isConnected()) {\n  keyboard->modifierKeyPress(` |
| `ble_keyboard_media_key` | Statement | MEDIA_KEY(dropdown) | `ble_keyboard_media_key(KEY_MEDIA_PLAYPAUSE)` | `if (compositeHID.isConnected()) {\n  keyboard->mediaKeyPress(` |
| `ble_keyboard_consumer_key` | Statement | CONSUMER_KEY(dropdown) | `ble_keyboard_consumer_key(KEY_MEDIA_CALCULATOR)` | `if (compositeHID.isConnected()) {\n  keyboard->mediaKeyPress(` |
| `ble_keyboard_set_battery_level` | Statement | LEVEL(field_number) | `ble_keyboard_set_battery_level(100)` | `compositeHID.setBatteryLevel(` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| KEY | KEY_ENTER, KEY_ESC, KEY_BACKSPACE, KEY_TAB, KEY_SPACE, KEY_LEFTCTRL, KEY_LEFTSHIFT, KEY_LEFTALT, KEY_LEFTMETA, KEY_RIGHTCTRL, KEY_RIGHTSHIFT, KEY_RIGHTALT, KEY_RIGHTMETA, KEY_UP, KEY_DOWN, KEY_LEFT, KEY_RIGHT, KEY_INSERT, KEY_DELETE, KEY_HOME, KEY_END, KEY_PAGEUP, KEY_PAGEDOWN, KEY_F1, KEY_F2, KEY_F3, KEY_F4, KEY_F5, KEY_F6, KEY_F7, KEY_F8, KEY_F9, KEY_F10, KEY_F11, KEY_F12 | Enter / Esc / Backspace / Tab / 空格 / 左Ctrl / 左Shift / 左Alt / 左GUI/Windows / 右Ctrl / 右Shift / 右Alt / 右GUI/Windows / 向上箭头 / 向下箭头 / 向左箭头 / 向右箭头 / Insert / Delete / Home / End / Page Up / Page Down / F1 / F2 / F3 / F4 / F5 / F6 / F7 / F8 / F9 / F10 / F11 / F12 |
| MEDIA_KEY | KEY_MEDIA_PLAYPAUSE, KEY_MEDIA_STOP, KEY_MEDIA_NEXTTRACK, KEY_MEDIA_PREVIOUSTRACK, KEY_MEDIA_MUTE, KEY_MEDIA_VOLUMEUP, KEY_MEDIA_VOLUMEDOWN, KEY_MEDIA_FASTFORWARD, KEY_MEDIA_REWIND, KEY_MEDIA_EJECT | 播放/暂停 / 停止 / 下一曲 / 上一曲 / 静音 / 音量加 / 音量减 / 快进 / 快退 / 弹出 |
| CONSUMER_KEY | KEY_MEDIA_CALCULATOR, KEY_MEDIA_WWWHOME, KEY_MEDIA_MAIL, KEY_MEDIA_MYCOMPUTER, KEY_MEDIA_WWWSEARCH, KEY_MEDIA_WWWBACK, KEY_MEDIA_WWWSTOP, KEY_MEDIA_WWWFAVORITES, KEY_MEDIA_MEDIASELECT | 计算器 / 主页 / 邮件 / 我的电脑 / 搜索 / 返回 / 停止 / 收藏夹 / 媒体选择 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    ble_keyboard_begin("ESP32 Keyboard")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, ble_keyboard_is_connected())
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order
