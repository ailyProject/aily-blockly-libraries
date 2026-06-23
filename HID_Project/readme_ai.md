# HID-Project

Extended HID functions for Arduino keyboards, mice, consumer keys, system keys, and gamepads.

## Library Info

- **Name**: @aily-project/lib-hid-project
- **Version**: 1.0.0
- **Upstream Version**: 2.8.4
- **Source**: https://github.com/NicoHood/HID

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `hid_project_begin` | Statement | DEVICE(dropdown) | `hid_project_begin(Keyboard)` | Device.begin(); |
| `hid_project_end` | Statement | DEVICE(dropdown) | `hid_project_end(Keyboard)` | See generator.js |
| `hid_keyboard_print` | Statement | TEXT(value) | `hid_keyboard_print(text("value"))` | See generator.js |
| `hid_keyboard_key` | Statement | ACTION(dropdown), KEY(dropdown) | `hid_keyboard_key(write, KEY_ENTER)` | See generator.js |
| `hid_keyboard_release_all` | Statement | (none) | `hid_keyboard_release_all()` | See generator.js |
| `hid_consumer_write` | Statement | KEY(dropdown) | `hid_consumer_write(MEDIA_PLAY_PAUSE)` | See generator.js |
| `hid_mouse_move` | Statement | X(value), Y(value), WHEEL(value) | `hid_mouse_move(math_number(1), math_number(1), math_number(1))` | See generator.js |
| `hid_mouse_button` | Statement | ACTION(dropdown), BUTTON(dropdown) | `hid_mouse_button(click, MOUSE_LEFT)` | See generator.js |
| `hid_gamepad_button` | Statement | ACTION(dropdown), BUTTON(value) | `hid_gamepad_button(press, math_number(1))` | See generator.js |
| `hid_gamepad_axis` | Statement | AXIS(dropdown), VALUE(value) | `hid_gamepad_axis(xAxis, math_number(1))` | See generator.js |
| `hid_gamepad_write` | Statement | (none) | `hid_gamepad_write()` | See generator.js |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| DEVICE | Keyboard, Mouse, Consumer, System, Gamepad | Global HID object. |
| ACTION | write, press, release, click | HID operation. |

## Notes

1. Call begin for each HID object before using it.
2. Some AVR boards require HoodLoader2 or native USB support for HID output.
