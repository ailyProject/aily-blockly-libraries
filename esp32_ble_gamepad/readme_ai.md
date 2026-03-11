# ESP32蓝牙手柄

ESP32蓝牙游戏手柄库，支持按键、摇杆、特殊按键等功能

## Library Info
- **Name**: @aily-project/lib-esp32-ble-gamepad
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp32_ble_gamepad_init` | Statement | DEVICE_NAME(input_value) | `esp32_ble_gamepad_init(math_number(0))` | `` |
| `esp32_ble_gamepad_connected` | Value | (none) | `esp32_ble_gamepad_connected()` | `compositeHID.isConnected()` |
| `esp32_ble_gamepad_press_button` | Statement | BUTTON(dropdown) | `esp32_ble_gamepad_press_button(BUTTON_1)` | `gamepad->press(` |
| `esp32_ble_gamepad_release_button` | Statement | BUTTON(dropdown) | `esp32_ble_gamepad_release_button(BUTTON_1)` | `gamepad->release(` |
| `esp32_ble_gamepad_button_with_pin` | Statement | PIN(dropdown), PIN_MODE(dropdown), BUTTON(dropdown) | `esp32_ble_gamepad_button_with_pin(PIN, INPUT_PULLUP, BUTTON_1)` | `if (compositeHID.isConnected()) {\n` |
| `esp32_ble_gamepad_set_axes` | Statement | X_AXIS(input_value), Y_AXIS(input_value) | `esp32_ble_gamepad_set_axes(math_number(0), math_number(0))` | `gamepad->setLeftThumb(` |
| `esp32_ble_gamepad_set_hat` | Statement | HAT_DIRECTION(dropdown) | `esp32_ble_gamepad_set_hat(HAT_CENTERED)` | `gamepad->setHat1(` |
| `esp32_ble_gamepad_special_button` | Statement | SPECIAL_BUTTON(dropdown) | `esp32_ble_gamepad_special_button(Start)` | `gamepad->press` |
| `esp32_ble_gamepad_release_special_button` | Statement | SPECIAL_BUTTON(dropdown) | `esp32_ble_gamepad_release_special_button(Start)` | `gamepad->release` |
| `esp32_ble_gamepad_analog_read` | Statement | ANALOG_PIN(dropdown), AXIS(dropdown) | `esp32_ble_gamepad_analog_read(ANALOG_PIN, X)` | `{\n` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| BUTTON | BUTTON_1, BUTTON_2, BUTTON_3, BUTTON_4, BUTTON_5, BUTTON_6, BUTTON_7, BUTTON_8, BUTTON_9, BUTTON_10, BUTTON_11, BUTTON_12, BUTTON_13, BUTTON_14, BUTTON_15, BUTTON_16 | 按键1 / 按键2 / 按键3 / 按键4 / 按键5 / 按键6 / 按键7 / 按键8 / 按键9 / 按键10 / 按键11 / 按键12 / 按键13 / 按键14 / 按键15 / 按键16 |
| PIN_MODE | INPUT_PULLUP, INPUT | 上拉输入 / 普通输入 |
| HAT_DIRECTION | HAT_CENTERED, HAT_UP, HAT_UP_RIGHT, HAT_RIGHT, HAT_DOWN_RIGHT, HAT_DOWN, HAT_DOWN_LEFT, HAT_LEFT, HAT_UP_LEFT | 居中 / 上 / 右上 / 右 / 右下 / 下 / 左下 / 左 / 左上 |
| SPECIAL_BUTTON | Start, Select, Menu, Home, Back, VolumeInc, VolumeDec, VolumeMute | 开始键 / 选择键 / 菜单键 / 主页键 / 返回键 / 音量+ / 音量- / 静音 |
| AXIS | X, Y, Z, RX, RY, RZ | X轴 / Y轴 / Z轴 / RX轴 / RY轴 / RZ轴 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    esp32_ble_gamepad_init(math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, esp32_ble_gamepad_connected())
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order
