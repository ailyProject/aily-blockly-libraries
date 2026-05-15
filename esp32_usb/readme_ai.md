# ESP32 USB functionality

ESP32 native USB HID function supports keyboard, mouse, game controller, media control, system control and MIDI

## Library Info
- **Name**: @aily-project/lib-esp32-usb
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp32_usb_keyboard_begin` | Statement | (none) | `esp32_usb_keyboard_begin()` | Dynamic code |
| `esp32_usb_keyboard_print` | Statement | TEXT(input_value) | `esp32_usb_keyboard_print(text("value"))` | Keyboard.print( |
| `esp32_usb_keyboard_println` | Statement | TEXT(input_value) | `esp32_usb_keyboard_println(text("value"))` | Keyboard.println( |
| `esp32_usb_keyboard_write` | Statement | KEY(input_value) | `esp32_usb_keyboard_write(text("value"))` | Keyboard.write( |
| `esp32_usb_keyboard_press` | Statement | KEY(input_value) | `esp32_usb_keyboard_press(text("value"))` | Keyboard.press( |
| `esp32_usb_keyboard_release` | Statement | KEY(input_value) | `esp32_usb_keyboard_release(text("value"))` | Keyboard.release( |
| `esp32_usb_keyboard_release_all` | Statement | (none) | `esp32_usb_keyboard_release_all()` | Keyboard.releaseAll();\n |
| `esp32_usb_keyboard_special_key` | Value | KEY(dropdown) | `esp32_usb_keyboard_special_key(KEY_RETURN)` | Dynamic code |
| `esp32_usb_mouse_begin` | Statement | (none) | `esp32_usb_mouse_begin()` | Dynamic code |
| `esp32_usb_mouse_move` | Statement | X(input_value), Y(input_value), WHEEL(input_value) | `esp32_usb_mouse_move(math_number(0), math_number(0), math_number(0))` | Mouse.move( |
| `esp32_usb_mouse_click` | Statement | BUTTON(dropdown), ACTION(dropdown) | `esp32_usb_mouse_click(MOUSE_LEFT, click)` | Mouse. |
| `esp32_usb_mouse_is_pressed` | Value | BUTTON(dropdown) | `esp32_usb_mouse_is_pressed(MOUSE_LEFT)` | Mouse.isPressed( |
| `esp32_usb_gamepad_begin` | Statement | (none) | `esp32_usb_gamepad_begin()` | Dynamic code |
| `esp32_usb_gamepad_press_button` | Statement | BUTTON(dropdown) | `esp32_usb_gamepad_press_button(BUTTON_A)` | Gamepad.pressButton( |
| `esp32_usb_gamepad_release_button` | Statement | BUTTON(dropdown) | `esp32_usb_gamepad_release_button(BUTTON_A)` | Gamepad.releaseButton( |
| `esp32_usb_gamepad_left_stick` | Statement | X(input_value), Y(input_value) | `esp32_usb_gamepad_left_stick(math_number(0), math_number(0))` | Gamepad.leftStick( |
| `esp32_usb_gamepad_right_stick` | Statement | X(input_value), Y(input_value) | `esp32_usb_gamepad_right_stick(math_number(0), math_number(0))` | Gamepad.rightStick( |
| `esp32_usb_gamepad_trigger` | Statement | SIDE(dropdown), VALUE(input_value) | `esp32_usb_gamepad_trigger(left, math_number(0))` | Gamepad.leftTrigger( |
| `esp32_usb_gamepad_hat` | Statement | DIRECTION(dropdown) | `esp32_usb_gamepad_hat(HAT_CENTER)` | Gamepad.hat( |
| `esp32_usb_consumer_press` | Statement | KEY(dropdown) | `esp32_usb_consumer_press(CONSUMER_CONTROL_PLAY_PAUSE)` | ConsumerControl.press( |
| `esp32_usb_consumer_release` | Statement | (none) | `esp32_usb_consumer_release()` | ConsumerControl.release();\n |
| `esp32_usb_system_press` | Statement | ACTION(dropdown) | `esp32_usb_system_press(SYSTEM_CONTROL_POWER_OFF)` | SystemControl.press( |
| `esp32_usb_system_release` | Statement | (none) | `esp32_usb_system_release()` | SystemControl.release();\n |
| `esp32_usb_midi_begin` | Statement | (none) | `esp32_usb_midi_begin()` | Dynamic code |
| `esp32_usb_midi_note_on` | Statement | NOTE(input_value), VELOCITY(input_value), CHANNEL(input_value) | `esp32_usb_midi_note_on(math_number(0), math_number(0), math_number(0))` | MIDI.noteOn( |
| `esp32_usb_midi_note_off` | Statement | NOTE(input_value), VELOCITY(input_value), CHANNEL(input_value) | `esp32_usb_midi_note_off(math_number(0), math_number(0), math_number(0))` | MIDI.noteOff( |
| `esp32_usb_midi_control_change` | Statement | CONTROL(input_value), VALUE(input_value), CHANNEL(input_value) | `esp32_usb_midi_control_change(math_number(0), math_number(0), math_number(0))` | MIDI.controlChange( |
| `esp32_usb_midi_program_change` | Statement | PROGRAM(input_value), CHANNEL(input_value) | `esp32_usb_midi_program_change(math_number(0), math_number(0))` | MIDI.programChange( |
| `esp32_usb_midi_pitch_bend` | Statement | VALUE(input_value), CHANNEL(input_value) | `esp32_usb_midi_pitch_bend(math_number(0), math_number(0))` | MIDI.pitchBend((int16_t) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| KEY | KEY_RETURN, KEY_ESC, KEY_BACKSPACE, KEY_TAB, KEY_SPACE, KEY_LEFT_CTRL, KEY_LEFT_SHIFT, KEY_LEFT_ALT, KEY_LEFT_GUI, KEY_RIGHT_CTRL, KEY_RIGHT_SHIFT, KEY_RIGHT_ALT, KEY_RIGHT_GUI, KEY_UP_ARROW, KEY_DOWN_ARROW, KEY_LEFT_... | esp32_usb_keyboard_special_key |
| BUTTON | MOUSE_LEFT, MOUSE_RIGHT, MOUSE_MIDDLE | esp32_usb_mouse_click, esp32_usb_mouse_is_pressed |
| ACTION | click, press, release | esp32_usb_mouse_click |
| BUTTON | BUTTON_A, BUTTON_B, BUTTON_C, BUTTON_X, BUTTON_Y, BUTTON_Z, BUTTON_TL, BUTTON_TR, BUTTON_TL2, BUTTON_TR2, BUTTON_SELECT, BUTTON_START, BUTTON_MODE, BUTTON_THUMBL, BUTTON_THUMBR | esp32_usb_gamepad_press_button, esp32_usb_gamepad_release_button |
| SIDE | left, right | esp32_usb_gamepad_trigger |
| DIRECTION | HAT_CENTER, HAT_UP, HAT_UP_RIGHT, HAT_RIGHT, HAT_DOWN_RIGHT, HAT_DOWN, HAT_DOWN_LEFT, HAT_LEFT, HAT_UP_LEFT | esp32_usb_gamepad_hat |
| KEY | CONSUMER_CONTROL_PLAY_PAUSE, CONSUMER_CONTROL_STOP, CONSUMER_CONTROL_SCAN_NEXT, CONSUMER_CONTROL_SCAN_PREVIOUS, CONSUMER_CONTROL_RECORD, CONSUMER_CONTROL_FAST_FORWARD, CONSUMER_CONTROL_REWIND, CONSUMER_CONTROL_VOLUME_... | esp32_usb_consumer_press |
| ACTION | SYSTEM_CONTROL_POWER_OFF, SYSTEM_CONTROL_STANDBY, SYSTEM_CONTROL_WAKE_HOST | esp32_usb_system_press |

## ABS Examples

### Basic Usage
```
arduino_setup()
    esp32_usb_keyboard_begin()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, esp32_usb_keyboard_special_key(KEY_RETURN))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
