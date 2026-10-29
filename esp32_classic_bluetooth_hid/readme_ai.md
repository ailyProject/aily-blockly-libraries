# ESP32 Classic Bluetooth HID

Classic BR/EDR HID profiles for the original ESP32, with both independent native Arduino libraries bundled.

## Library Info

- **Name**: @aily-project/lib-esp32-classic-bluetooth-hid
- **Version**: 0.0.3
- **Author**: ailyProject
- **License**: MIT wrappers; bundled Host notices and third-party licenses remain applicable.

## Programming Guide

Target the original ESP32 WROOM-32/WROVER with Arduino-ESP32 3.3.10 or later. ESP32-S3/C3 and simultaneous BLE/BluetoothSerial use are unsupported. The package includes both native libraries and does not install or replace the SDK.

Choose exactly one row for each workspace. The keyboard/mouse combo is the only mode that combines device families.

| Task | Required initializer | Matching function families |
|---|---|---|
| Keyboard input | `esp32_classic_hid_begin_keyboard` | `keyboard_*` |
| Mouse input | `esp32_classic_hid_begin_mouse` | `mouse_*` |
| Keyboard and mouse together | `esp32_classic_hid_begin_combo` | `keyboard_*` and `mouse_*` |
| Media commands | `esp32_classic_hid_begin_media` | `media_*` |
| Generic HID gamepad | `esp32_classic_hid_begin_gamepad` | `gamepad_*` |
| Switch Pro emulation | `esp32_classic_hid_begin_switch` | `switch_*` |

The names above use the `esp32_classic_hid_` prefix. Common connection/status/management blocks apply to the selected mode. Media, gamepad and Switch functions cannot be mixed into the combo. Stop/restart permits the same mode; it does not permit a different initializer in one workspace.

1. Put the chosen begin block in `arduino_setup()`. Initialization is explicit and does not mean a peer is connected. Check `esp32_classic_hid_connected()` before input; inspect `last_init_ok`, `last_ok` and `last_error` when handling failures.
2. Fill every condition. Use `controls_if()` with `@IF0: expression` and `@DO0:` as shown below; an empty condition does not wait for Bluetooth and evaluates false. Do not place the same condition in both parentheses and a named slot.
3. `PRESS` holds a key/button until `RELEASE` or release-all. Repeating PRESS in loop does not create a click. Mouse `CLICK` and keyboard text/shortcut calls perform their own release; shortcuts also release keys held before the call. Gamepad reset also centers axes and hat.
4. Drive actions from a user event. A connection becoming true must not start endless typing, clicking or media commands. The serial action examples consume one command byte once; commands received while disconnected are discarded. GPIO Switch input continuously maps both pressed and released states.
5. Loop-start update is automatic. Keep loop responsive; call the update block before/after a short wait in a press/release sequence and inside long-running work. Media release is asynchronous (about 20ms), so keep updating while busy instead of sending another tap. The example 20ms waits demonstrate brief pulses, not a general long-delay pattern.
6. ABS uses stored enum values, not translated labels. Write `logic_boolean(true)` / `logic_boolean(false)` in lowercase. Number and text inputs use calls such as `math_number(20)` and `text("hello")`. Each fenced program is a separate workspace; do not concatenate examples with different modes.

The toolbox has two category levels: the library root and eight direct categories for initialization, connection status, connection management, keyboard, mouse, media keys, generic gamepad and Switch Pro controller. Each device category lists its blocks directly; there are no third-level subcategories. All 46 blocks and all category levels have built-in icons. Prefer named keys, state setters and normal movement blocks before numeric masks or raw bytes.

## Block Definitions

Each row shows the exact body/expression emitted for representative standalone inputs. The shared includes, objects and automatic loop hook are listed in Generated Context below; they are required with every row. In combo mode, keyboard and mouse calls target the corresponding `.keyboard` and `.mouse` members.

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `esp32_classic_hid_begin_keyboard` | Statement | NAME(input_value) | `esp32_classic_hid_begin_keyboard(text("value"))` | `{ ↵ const String ailyClassicName = String("value"); ↵ const bool ailyClassicAccepted = ailyClassicHIDDevice.begin(ailyClassicName.c_str()); ↵ ailyClassicHIDStatus.beginResult(ailyClassicAccepted, ailyClassicHIDDevice.lastError()); ↵ }` |
| `esp32_classic_hid_begin_mouse` | Statement | NAME(input_value) | `esp32_classic_hid_begin_mouse(text("value"))` | `{ ↵ const String ailyClassicName = String("value"); ↵ const bool ailyClassicAccepted = ailyClassicHIDDevice.begin(ailyClassicName.c_str()); ↵ ailyClassicHIDStatus.beginResult(ailyClassicAccepted, ailyClassicHIDDevice.lastError()); ↵ }` |
| `esp32_classic_hid_begin_combo` | Statement | NAME(input_value) | `esp32_classic_hid_begin_combo(text("value"))` | `{ ↵ const String ailyClassicName = String("value"); ↵ const bool ailyClassicAccepted = ailyClassicHIDDevice.begin(ailyClassicName.c_str()); ↵ ailyClassicHIDStatus.beginResult(ailyClassicAccepted, ailyClassicHIDDevice.lastError()); ↵ }` |
| `esp32_classic_hid_begin_media` | Statement | NAME(input_value) | `esp32_classic_hid_begin_media(text("value"))` | `{ ↵ const String ailyClassicName = String("value"); ↵ const bool ailyClassicAccepted = ailyClassicHIDDevice.begin(ailyClassicName.c_str()); ↵ ailyClassicHIDStatus.beginResult(ailyClassicAccepted, ailyClassicHIDDevice.lastError()); ↵ }` |
| `esp32_classic_hid_begin_gamepad` | Statement | NAME(input_value) | `esp32_classic_hid_begin_gamepad(text("value"))` | `{ ↵ const String ailyClassicName = String("value"); ↵ const bool ailyClassicAccepted = ailyClassicHIDDevice.begin(ailyClassicName.c_str()); ↵ ailyClassicHIDStatus.beginResult(ailyClassicAccepted, ailyClassicHIDDevice.lastError()); ↵ }` |
| `esp32_classic_hid_begin_switch` | Statement | NAME(input_value) | `esp32_classic_hid_begin_switch(text("value"))` | `{ ↵ const String ailyClassicName = String("value"); ↵ const bool ailyClassicAccepted = ailyClassicHIDDevice.begin(ailyClassicName.c_str()); ↵ ailyClassicHIDStatus.beginResult(ailyClassicAccepted, ailyClassicHIDDevice.lastError()); ↵ }` |
| `esp32_classic_hid_connected` | Value (Boolean) | (none) | `esp32_classic_hid_connected()` | `ailyClassicHIDDevice.isConnected()` |
| `esp32_classic_hid_last_init_ok` | Value (Boolean) | (none) | `esp32_classic_hid_last_init_ok()` | `ailyClassicHIDStatus.lastBeginOk` |
| `esp32_classic_hid_last_ok` | Value (Boolean) | (none) | `esp32_classic_hid_last_ok()` | `ailyClassicHIDStatus.lastOk` |
| `esp32_classic_hid_last_error` | Value (String) | (none) | `esp32_classic_hid_last_error()` | `ailyClassicHIDStatus.errorFor(ailyClassicHIDDevice)` |
| `esp32_classic_hid_update` | Statement | (none) | `esp32_classic_hid_update()` | `ailyClassicHIDDevice.update();` |
| `esp32_classic_hid_end` | Statement | (none) | `esp32_classic_hid_end()` | `{ ↵ const bool ailyClassicAccepted = ailyClassicHIDDevice.end(); ↵ ailyClassicHIDStatus.stopped(ailyClassicAccepted, ailyClassicHIDDevice.lastError()); ↵ }` |
| `esp32_classic_hid_disconnect` | Statement | (none) | `esp32_classic_hid_disconnect()` | `{ ↵ const bool ailyClassicAccepted = ailyClassicHIDDevice.disconnect(); ↵ ailyClassicHIDStatus.record(ailyClassicAccepted, ailyClassicHIDDevice.lastError()); ↵ }` |
| `esp32_classic_hid_unpair` | Statement | (none) | `esp32_classic_hid_unpair()` | `{ ↵ const bool ailyClassicAccepted = ailyClassicHIDDevice.unpair(); ↵ ailyClassicHIDStatus.record(ailyClassicAccepted, ailyClassicHIDDevice.lastError()); ↵ }` |
| `esp32_classic_hid_keyboard_text` | Statement | ENDING(dropdown), TEXT(input_value) | `esp32_classic_hid_keyboard_text(PRINT, text("value"))` | `aily_classic_hid::typeText(ailyClassicHIDDevice, ailyClassicHIDStatus, String("value"), false);` |
| `esp32_classic_hid_keyboard_key` | Statement | ACTION(dropdown), KEY(dropdown) | `esp32_classic_hid_keyboard_key(PRESS, ASCII_A)` | `{ ↵ const bool ailyClassicAccepted = ailyClassicHIDDevice.press(97); ↵ ailyClassicHIDStatus.record(ailyClassicAccepted, ailyClassicHIDDevice.lastError()); ↵ }` |
| `esp32_classic_hid_keyboard_ascii` | Statement | ACTION(dropdown), CHAR(input_value) | `esp32_classic_hid_keyboard_ascii(PRESS, text("a"))` | `aily_classic_hid::asciiKey(ailyClassicHIDDevice, ailyClassicHIDStatus, String("a"), true);` |
| `esp32_classic_hid_keyboard_raw` | Statement | ACTION(dropdown), USAGE(input_value) | `esp32_classic_hid_keyboard_raw(PRESS, math_number(4))` | `aily_classic_hid::rawKey(ailyClassicHIDDevice, ailyClassicHIDStatus, 4, true);` |
| `esp32_classic_hid_keyboard_shortcut` | Statement | MODIFIER(dropdown), KEY(dropdown) | `esp32_classic_hid_keyboard_shortcut(LEFT_CTRL, ASCII_A)` | `aily_classic_hid::shortcut(ailyClassicHIDDevice, ailyClassicHIDStatus, 1, 97);` |
| `esp32_classic_hid_keyboard_release_all` | Statement | (none) | `esp32_classic_hid_keyboard_release_all()` | `{ ↵ const bool ailyClassicAccepted = ailyClassicHIDDevice.releaseAll(); ↵ ailyClassicHIDStatus.record(ailyClassicAccepted, ailyClassicHIDDevice.lastError()); ↵ }` |
| `esp32_classic_hid_keyboard_led` | Value (Boolean) | LED(dropdown) | `esp32_classic_hid_keyboard_led(NUM)` | `ailyClassicHIDDevice.numLock()` |
| `esp32_classic_hid_mouse_move` | Statement | X(input_value), Y(input_value), WHEEL(input_value) | `esp32_classic_hid_mouse_move(math_number(0), math_number(0), math_number(0))` | `aily_classic_hid::mouseMove(ailyClassicHIDDevice, ailyClassicHIDStatus, 0, 0, 0);` |
| `esp32_classic_hid_mouse_button` | Statement | ACTION(dropdown), BUTTON(dropdown) | `esp32_classic_hid_mouse_button(CLICK, LEFT)` | `{ ↵ const bool ailyClassicAccepted = ailyClassicHIDDevice.click(ESP32ClassicBluetoothMouseButton::Left); ↵ ailyClassicHIDStatus.record(ailyClassicAccepted, ailyClassicHIDDevice.lastError()); ↵ }` |
| `esp32_classic_hid_mouse_release_all` | Statement | (none) | `esp32_classic_hid_mouse_release_all()` | `{ ↵ const bool ailyClassicAccepted = ailyClassicHIDDevice.releaseAll(); ↵ ailyClassicHIDStatus.record(ailyClassicAccepted, ailyClassicHIDDevice.lastError()); ↵ }` |
| `esp32_classic_hid_mouse_pressed` | Value (Boolean) | BUTTON(dropdown) | `esp32_classic_hid_mouse_pressed(LEFT)` | `ailyClassicHIDDevice.isPressed(ESP32ClassicBluetoothMouseButton::Left)` |
| `esp32_classic_hid_media_tap` | Statement | KEY(dropdown) | `esp32_classic_hid_media_tap(VOLUME_UP)` | `aily_classic_hid::mediaTap(ailyClassicHIDDevice, ailyClassicHIDStatus, 0x00E9);` |
| `esp32_classic_hid_media_release_all` | Statement | (none) | `esp32_classic_hid_media_release_all()` | `{ ↵ const bool ailyClassicAccepted = ailyClassicHIDDevice.releaseAll(); ↵ ailyClassicHIDStatus.record(ailyClassicAccepted, ailyClassicHIDDevice.lastError()); ↵ }` |
| `esp32_classic_hid_media_busy` | Value (Boolean) | (none) | `esp32_classic_hid_media_busy()` | `ailyClassicHIDDevice.busy()` |
| `esp32_classic_hid_gamepad_button` | Statement | ACTION(dropdown), BUTTON(dropdown) | `esp32_classic_hid_gamepad_button(PRESS, 1)` | `aily_classic_hid::gpButton(ailyClassicHIDDevice, ailyClassicHIDStatus, 1, true);` |
| `esp32_classic_hid_gamepad_buttons` | Statement | MASK(input_value) | `esp32_classic_hid_gamepad_buttons(math_number(0))` | `aily_classic_hid::gpButtons(ailyClassicHIDDevice, ailyClassicHIDStatus, 0);` |
| `esp32_classic_hid_gamepad_axes` | Statement | X(input_value), Y(input_value), RX(input_value), RY(input_value) | `esp32_classic_hid_gamepad_axes(math_number(0), math_number(0), math_number(0), math_number(0))` | `aily_classic_hid::gpAxes(ailyClassicHIDDevice, ailyClassicHIDStatus, 0, 0, 0, 0);` |
| `esp32_classic_hid_gamepad_hat` | Statement | DIRECTION(dropdown) | `esp32_classic_hid_gamepad_hat(8)` | `aily_classic_hid::gpHat(ailyClassicHIDDevice, ailyClassicHIDStatus, 8);` |
| `esp32_classic_hid_gamepad_reset` | Statement | (none) | `esp32_classic_hid_gamepad_reset()` | `{ ↵ const bool ailyClassicAccepted = ailyClassicHIDDevice.reset(); ↵ ailyClassicHIDStatus.record(ailyClassicAccepted, ailyClassicHIDDevice.lastError()); ↵ }` |
| `esp32_classic_hid_gamepad_pressed` | Value (Boolean) | BUTTON(dropdown) | `esp32_classic_hid_gamepad_pressed(1)` | `ailyClassicHIDDevice.buttonPressed(1)` |
| `esp32_classic_hid_switch_button` | Statement | ACTION(dropdown), BUTTON(dropdown) | `esp32_classic_hid_switch_button(PRESS, Y)` | `if (!ailyClassicHIDStatus.initialized &#124;&#124; !ailyClassicHIDDevice.isConnected()) { ↵ ailyClassicHIDStatus.reject("Bluetooth HID peer is not connected"); ↵ } else { ↵ ailyClassicHIDDevice.press(switchpro::Y); ↵ ailyClassicHIDStatus.record(true); ↵ }` |
| `esp32_classic_hid_switch_button_state` | Statement | BUTTON(dropdown), PRESSED(input_value) | `esp32_classic_hid_switch_button_state(Y, logic_boolean(false))` | `if (!ailyClassicHIDStatus.initialized &#124;&#124; !ailyClassicHIDDevice.isConnected()) { ↵ ailyClassicHIDStatus.reject("Bluetooth HID peer is not connected"); ↵ } else { ↵ ailyClassicHIDDevice.setButton(switchpro::Y, false); ↵ ailyClassicHIDStatus.record(true); ↵ }` |
| `esp32_classic_hid_switch_buttons` | Statement | MASK(input_value) | `esp32_classic_hid_switch_buttons(math_number(0))` | `aily_classic_hid::swButtons(ailyClassicHIDDevice, ailyClassicHIDStatus, 0);` |
| `esp32_classic_hid_switch_release_all` | Statement | (none) | `esp32_classic_hid_switch_release_all()` | `if (!ailyClassicHIDStatus.initialized &#124;&#124; !ailyClassicHIDDevice.isConnected()) { ↵ ailyClassicHIDStatus.reject("Bluetooth HID peer is not connected"); ↵ } else { ↵ ailyClassicHIDDevice.releaseAll(); ↵ ailyClassicHIDStatus.record(true); ↵ }` |
| `esp32_classic_hid_switch_dpad` | Statement | UP(input_value), DOWN(input_value), LEFT(input_value), RIGHT(input_value) | `esp32_classic_hid_switch_dpad(logic_boolean(false), logic_boolean(false), logic_boolean(false), logic_boolean(false))` | `if (!ailyClassicHIDStatus.initialized &#124;&#124; !ailyClassicHIDDevice.isConnected()) { ↵ ailyClassicHIDStatus.reject("Bluetooth HID peer is not connected"); ↵ } else { ↵ ailyClassicHIDDevice.setDpad(false, false, false, false); ↵ ailyClassicHIDStatus.record(true); ↵ }` |
| `esp32_classic_hid_switch_axes` | Statement | LX(input_value), LY(input_value), RX(input_value), RY(input_value) | `esp32_classic_hid_switch_axes(math_number(0), math_number(0), math_number(0), math_number(0))` | `aily_classic_hid::switchAxes(ailyClassicHIDDevice, ailyClassicHIDStatus, 0, 0, 0, 0);` |
| `esp32_classic_hid_switch_stick` | Statement | SIDE(dropdown), X(input_value), Y(input_value) | `esp32_classic_hid_switch_stick(LEFT, math_number(0), math_number(0))` | `aily_classic_hid::swStick(ailyClassicHIDDevice, ailyClassicHIDStatus, true, 0, 0);` |
| `esp32_classic_hid_switch_battery` | Statement | PERCENT(input_value), CHARGING(input_value) | `esp32_classic_hid_switch_battery(math_number(0), logic_boolean(false))` | `aily_classic_hid::swBattery(ailyClassicHIDDevice, ailyClassicHIDStatus, 0, false);` |
| `esp32_classic_hid_switch_status` | Value (Number) | STATUS(dropdown) | `esp32_classic_hid_switch_status(REPORT_MODE)` | `ailyClassicHIDDevice.inputReportMode()` |
| `esp32_classic_hid_switch_feature` | Value (Boolean) | FEATURE(dropdown) | `esp32_classic_hid_switch_feature(IMU)` | `ailyClassicHIDDevice.imuEnabled()` |
| `esp32_classic_hid_switch_rumble` | Value (Number) | INDEX(dropdown) | `esp32_classic_hid_switch_rumble(0)` | `ailyClassicHIDDevice.rumbleData()[0]` |
| `esp32_classic_hid_switch_connect` | Statement | ADDRESS(input_value) | `esp32_classic_hid_switch_connect(text("00:11:22:33:44:55"))` | `aily_classic_hid::swConnect(ailyClassicHIDDevice, ailyClassicHIDStatus, String("00:11:22:33:44:55"));` |

## Generated Context

All blocks add `#include <AilyClassicHIDProfiles.h>`, one mode-specific object tagged `aily_classic_hid_device`, one `aily_classic_hid::Status ailyClassicHIDStatus;` tagged `aily_classic_hid_status`, and `ailyClassicHIDDevice.update();` at the beginning of loop under tag `aily_classic_hid_update`. Multiple blocks deduplicate these entries. Switch additionally includes `ESP32BluetoothSwitchProController.h`. No initializer is silently inserted.

| Selected mode | Generated device declaration |
|---|---|
| keyboard | `ESP32ClassicBluetoothKeyboard ailyClassicHIDDevice;` |
| mouse | `ESP32ClassicBluetoothMouse ailyClassicHIDDevice;` |
| combo | `ESP32ClassicBluetoothKeyboardMouse ailyClassicHIDDevice;` |
| media | `aily_classic_hid::MediaKeys ailyClassicHIDDevice;` |
| gamepad | `aily_classic_hid::Gamepad ailyClassicHIDDevice;` |
| switch | `ESP32BluetoothSwitchProController& ailyClassicHIDDevice = BluetoothSwitchProController;` |

A complete generated keyboard program for a status-only example:

```cpp
#include <AilyClassicHIDProfiles.h>
ESP32ClassicBluetoothKeyboard ailyClassicHIDDevice;
aily_classic_hid::Status ailyClassicHIDStatus;
void setup() {
  Serial.begin(115200);
  const String ailyClassicName = String("ESP32 Keyboard");
  const bool ailyClassicAccepted = ailyClassicHIDDevice.begin(ailyClassicName.c_str());
  ailyClassicHIDStatus.beginResult(ailyClassicAccepted, ailyClassicHIDDevice.lastError());
}
void loop() {
  ailyClassicHIDDevice.update();
  Serial.println(ailyClassicHIDDevice.isConnected());
  delay(20);
}
```

## Parameter Options

Values below are serialized dropdown values, not translated labels. Digital masks and axes are value inputs, not enum fields.

| Applicable blocks (after esp32_classic_hid_) | Field | Serialized values |
|---|---|---|
| `keyboard_text` | `ENDING` | `PRINT`, `PRINTLN` |
| `keyboard_key`, `keyboard_ascii`, `keyboard_raw`, `gamepad_button`, `switch_button` | `ACTION` | `PRESS`, `RELEASE` |
| `keyboard_key`, `keyboard_shortcut` | `KEY` | `ASCII_A`, `ASCII_B`, `ASCII_C`, `ASCII_D`, `ASCII_E`, `ASCII_F`, `ASCII_G`, `ASCII_H`, `ASCII_I`, `ASCII_J`, `ASCII_K`, `ASCII_L`, `ASCII_M`, `ASCII_N`, `ASCII_O`, `ASCII_P`, `ASCII_Q`, `ASCII_R`, `ASCII_S`, `ASCII_T`, `ASCII_U`, `ASCII_V`, `ASCII_W`, `ASCII_X`, `ASCII_Y`, `ASCII_Z`, `DIGIT_0`, `DIGIT_1`, `DIGIT_2`, `DIGIT_3`, `DIGIT_4`, `DIGIT_5`, `DIGIT_6`, `DIGIT_7`, `DIGIT_8`, `DIGIT_9`, `SPACE`, `RETURN`, `TAB`, `ESCAPE`, `BACKSPACE`, `DELETE`, `LEFT`, `RIGHT`, `UP`, `DOWN`, `HOME`, `END`, `PAGE_UP`, `PAGE_DOWN`, `F1`, `F2`, `F3`, `F4`, `F5`, `F6`, `F7`, `F8`, `F9`, `F10`, `F11`, `F12`, `LEFT_CTRL`, `LEFT_SHIFT`, `LEFT_ALT`, `LEFT_GUI`, `RIGHT_CTRL`, `RIGHT_SHIFT`, `RIGHT_ALT`, `RIGHT_GUI` |
| `keyboard_shortcut` | `MODIFIER` | `LEFT_CTRL`, `LEFT_SHIFT`, `LEFT_ALT`, `LEFT_GUI`, `RIGHT_CTRL`, `RIGHT_SHIFT`, `RIGHT_ALT`, `RIGHT_GUI`, `CTRL_SHIFT`, `CTRL_ALT`, `CTRL_ALT_SHIFT`, `GUI_SHIFT` |
| `keyboard_led` | `LED` | `NUM`, `CAPS`, `SCROLL` |
| `mouse_button` | `ACTION` | `CLICK`, `PRESS`, `RELEASE` |
| `mouse_button`, `mouse_pressed` | `BUTTON` | `LEFT`, `RIGHT`, `MIDDLE`, `BACK`, `FORWARD` |
| `media_tap` | `KEY` | `VOLUME_UP`, `VOLUME_DOWN`, `MUTE`, `PLAY_PAUSE`, `NEXT`, `PREVIOUS`, `STOP` |
| `gamepad_button`, `gamepad_pressed` | `BUTTON` | `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `10`, `11`, `12`, `13`, `14`, `15`, `16` |
| `gamepad_hat` | `DIRECTION` | `8`, `0`, `1`, `2`, `3`, `4`, `5`, `6`, `7` |
| `switch_button`, `switch_button_state` | `BUTTON` | `Y`, `X`, `B`, `A`, `R`, `ZR`, `MINUS`, `PLUS`, `RIGHT_STICK`, `LEFT_STICK`, `HOME`, `CAPTURE`, `DOWN`, `UP`, `RIGHT`, `LEFT`, `L`, `ZL` |
| `switch_stick` | `SIDE` | `LEFT`, `RIGHT` |
| `switch_status` | `STATUS` | `REPORT_MODE`, `PLAYER_LIGHTS`, `MALFORMED`, `DROPPED`, `UNSUPPORTED` |
| `switch_feature` | `FEATURE` | `IMU`, `VIBRATION` |
| `switch_rumble` | `INDEX` | `0`, `1`, `2`, `3`, `4`, `5`, `6`, `7` |

Combined modifiers use left-side keys: CTRL_SHIFT=3, CTRL_ALT=5, CTRL_ALT_SHIFT=7 and GUI_SHIFT=10. The original eight single-modifier values remain valid. Numeric masks are value inputs, not names to invent as enum values.

## ABS Examples

Each fenced program is a separate workspace. The first six examples query status without generating input. The action examples that follow add a user trigger, a complete connection condition and release/neutral behavior.

### Keyboard

```abs
# ABS Schema: 2
arduino_setup()
    serial_begin(Serial, 115200)
    esp32_classic_hid_begin_keyboard(text("ESP32 Keyboard"))

arduino_loop()
    serial_println(Serial, esp32_classic_hid_connected())
    serial_println(Serial, esp32_classic_hid_keyboard_led(CAPS))
    time_delay(math_number(20))
```

### Mouse

```abs
# ABS Schema: 2
arduino_setup()
    serial_begin(Serial, 115200)
    esp32_classic_hid_begin_mouse(text("ESP32 Mouse"))

arduino_loop()
    serial_println(Serial, esp32_classic_hid_connected())
    serial_println(Serial, esp32_classic_hid_mouse_pressed(LEFT))
    time_delay(math_number(20))
```

### Keyboard and mouse together

```abs
# ABS Schema: 2
arduino_setup()
    serial_begin(Serial, 115200)
    esp32_classic_hid_begin_combo(text("ESP32 Keyboard Mouse"))

arduino_loop()
    serial_println(Serial, esp32_classic_hid_keyboard_led(NUM))
    serial_println(Serial, esp32_classic_hid_mouse_pressed(LEFT))
    time_delay(math_number(20))
```

### Media keys

```abs
# ABS Schema: 2
arduino_setup()
    serial_begin(Serial, 115200)
    esp32_classic_hid_begin_media(text("ESP32 Media Keys"))

arduino_loop()
    serial_println(Serial, esp32_classic_hid_connected())
    serial_println(Serial, esp32_classic_hid_media_busy())
    time_delay(math_number(20))
```

### Generic gamepad

```abs
# ABS Schema: 2
arduino_setup()
    serial_begin(Serial, 115200)
    esp32_classic_hid_begin_gamepad(text("ESP32 Gamepad"))

arduino_loop()
    serial_println(Serial, esp32_classic_hid_connected())
    serial_println(Serial, esp32_classic_hid_gamepad_pressed(1))
    time_delay(math_number(20))
```

### Switch Pro controller

```abs
# ABS Schema: 2
arduino_setup()
    serial_begin(Serial, 115200)
    esp32_classic_hid_begin_switch(text("Pro Controller"))

arduino_loop()
    serial_println(Serial, esp32_classic_hid_switch_status(REPORT_MODE))
    serial_println(Serial, esp32_classic_hid_switch_feature(IMU))
    time_delay(math_number(1))
```

### Action examples

These are separate complete workspaces. Serial examples use one available byte exactly once; no variable or unlisted helper API is required. Keep focus on the receiving host because intentional HID input will be sent there.

#### Keyboard: one A key pulse

Open Serial at 115200 baud with no line ending. After Bluetooth connects, send lowercase `a` once. The example presses A, updates, waits 20ms, releases A and updates again. Other bytes are ignored. File: `examples/keyboard_input.abs`.

```abs
# ABS Schema: 2
arduino_setup()
    serial_begin(Serial, 115200)
    esp32_classic_hid_begin_keyboard(text("ESP32 Keyboard"))

arduino_loop()
    controls_if()
        @IF0: logic_compare(serial_available(Serial), GT, math_number(0))
        @DO0:
            controls_if()
                @IF0: logic_operation(logic_compare(serial_read(Serial, "read()"), EQ, math_number(97)), AND, esp32_classic_hid_connected())
                @DO0:
                    esp32_classic_hid_keyboard_key(PRESS, ASCII_A)
                    esp32_classic_hid_update()
                    time_delay(math_number(20))
                    esp32_classic_hid_keyboard_key(RELEASE, ASCII_A)
                    esp32_classic_hid_update()
    time_delay(math_number(1))
```

#### Mouse: command-triggered movement and click

After Bluetooth connects, send lowercase `m` once over Serial at 115200 baud (no line ending). It moves 10 units right and clicks the left button; CLICK releases automatically. File: `examples/mouse_input.abs`.

```abs
# ABS Schema: 2
arduino_setup()
    serial_begin(Serial, 115200)
    esp32_classic_hid_begin_mouse(text("ESP32 Mouse"))

arduino_loop()
    controls_if()
        @IF0: logic_compare(serial_available(Serial), GT, math_number(0))
        @DO0:
            controls_if()
                @IF0: logic_operation(logic_compare(serial_read(Serial, "read()"), EQ, math_number(109)), AND, esp32_classic_hid_connected())
                @DO0:
                    esp32_classic_hid_mouse_move(math_number(10), math_number(0), math_number(0))
                    esp32_classic_hid_mouse_button(CLICK, LEFT)
    time_delay(math_number(1))
```

#### Combo: keyboard shortcut and mouse movement

After Bluetooth connects, send lowercase `c` once over Serial at 115200 baud (no line ending). The single combo device sends Ctrl+C and moves the mouse right. The shortcut releases all held keys, including any held before it. File: `examples/keyboard_mouse_input.abs`.

```abs
# ABS Schema: 2
arduino_setup()
    serial_begin(Serial, 115200)
    esp32_classic_hid_begin_combo(text("ESP32 Keyboard Mouse"))

arduino_loop()
    controls_if()
        @IF0: logic_compare(serial_available(Serial), GT, math_number(0))
        @DO0:
            controls_if()
                @IF0: logic_operation(logic_compare(serial_read(Serial, "read()"), EQ, math_number(99)), AND, esp32_classic_hid_connected())
                @DO0:
                    esp32_classic_hid_keyboard_shortcut(LEFT_CTRL, ASCII_C)
                    esp32_classic_hid_mouse_move(math_number(10), math_number(0), math_number(0))
    time_delay(math_number(1))
```

#### Media: one command per input byte

After Bluetooth connects, send lowercase `p` once over Serial at 115200 baud (no line ending). A tap is accepted only when not busy; the loop remains responsive while automatic update sends the release. Bytes received while busy are consumed, not queued for replay. File: `examples/media_keys_input.abs`.

```abs
# ABS Schema: 2
arduino_setup()
    serial_begin(Serial, 115200)
    esp32_classic_hid_begin_media(text("ESP32 Media Keys"))

arduino_loop()
    controls_if()
        @IF0: logic_compare(serial_available(Serial), GT, math_number(0))
        @DO0:
            controls_if()
                @IF0: logic_operation(logic_compare(serial_read(Serial, "read()"), EQ, math_number(112)), AND, esp32_classic_hid_connected())
                @DO0:
                    controls_if()
                        @IF0: logic_negate(esp32_classic_hid_media_busy())
                        @DO0:
                            esp32_classic_hid_media_tap(PLAY_PAUSE)
    time_delay(math_number(1))
```

#### Gamepad: button pulse and neutral reset

After Bluetooth connects, send lowercase `b` once over Serial at 115200 baud (no line ending). It presses button 1 for about 20ms, then resets every button, axis and hat to neutral. File: `examples/gamepad_input.abs`.

```abs
# ABS Schema: 2
arduino_setup()
    serial_begin(Serial, 115200)
    esp32_classic_hid_begin_gamepad(text("ESP32 Gamepad"))

arduino_loop()
    controls_if()
        @IF0: logic_compare(serial_available(Serial), GT, math_number(0))
        @DO0:
            controls_if()
                @IF0: logic_operation(logic_compare(serial_read(Serial, "read()"), EQ, math_number(98)), AND, esp32_classic_hid_connected())
                @DO0:
                    esp32_classic_hid_gamepad_button(PRESS, 1)
                    esp32_classic_hid_update()
                    time_delay(math_number(20))
                    esp32_classic_hid_gamepad_reset()
                    esp32_classic_hid_update()
    time_delay(math_number(1))
```

#### Switch Pro: GPIO hold and release

Connect a normally open button between GPIO25 and GND; INPUT_PULLUP makes LOW mean pressed. While Bluetooth is connected, A follows the button level and releases when the button is released. This is state mapping, not a debounced one-shot event. No physical IMU or rumble motor is implied. File: `examples/switch_pro_input.abs`.

```abs
# ABS Schema: 2
arduino_setup()
    io_pinmode(math_number(25), io_mode(INPUT_PULLUP))
    esp32_classic_hid_begin_switch(text("Pro Controller"))

arduino_loop()
    controls_if()
        @IF0: esp32_classic_hid_connected()
        @DO0:
            esp32_classic_hid_switch_button_state(A, logic_compare(io_digitalread(math_number(25)), EQ, io_state(LOW)))
    time_delay(math_number(1))
```

## Notes

1. **Platform and SDK**: original ESP32 WROOM-32/WROVER only, Arduino-ESP32 **3.3.10 or later**. S3, C3 and other BLE-only targets are unsupported. Select/configure a matching SDK explicitly. This package does not download, replace or silently upgrade the core.
2. **Bundled native sources**: `src/ESP32ClassicBluetoothHID/` and `src/ESP32BluetoothSwitchProController/` are two independent Arduino libraries. Both production trees, metadata, precompiled Host and licenses are bundled; there is no external Arduino-library installation step and no merge into one native library. `AilyClassicHIDProfiles.h` supplies Blockly utility profiles and validation on top of them.
3. **Exclusive modes**: choose keyboard, mouse, combo, media, gamepad or switch. Only combo accepts both keyboard and mouse blocks. Different initializer modes anywhere in one enabled workspace, or functions incompatible with the selected mode, reject generation even if an end block separates them. BLE/NimBLE and BluetoothSerial cannot share the controller.
4. **Explicit lifecycle**: place the corresponding begin block in setup before use. Begin executes exactly where that block is placed; it is not hoisted. Several begin blocks of the same mode are permitted for end/restart flows. Without begin, the generator may infer the object type from functions (keyboard plus mouse implies combo), but it never starts Bluetooth automatically.
5. **Maintenance**: one update is automatically inserted at loop beginning. A manual update block is available inside long loops. Keep update responsive, especially in Switch mode; long blocking delays postpone input, pending media release and callbacks. `unpair` synchronously waits for clearing pairing. Reconnect resets held-state data; do not replay queued offline presses.
6. **Results and errors**: `last_init_ok` is the most recent begin result. `last_ok` records local acceptance of the latest action, not over-the-air delivery or actual host input. Read `last_error` for wrapper/native failures. Queries and automatic update are not a new initialization result; asynchronous errors can be visible independently of a previously accepted action. Disconnect and unpair preserve the selected profile; end stops it and allows same-mode restart.
7. **Keyboard**: text supports US ASCII and a US host layout, not Unicode. CRLF emits one Enter. `keyboard_ascii` requires exactly one ASCII byte. Keyboard KEY tokens A..Z select unshifted letter keys; use Shift explicitly or uppercase text when required. Raw Usage is an integer HID Usage ID, not an ASCII character code. Accepted ranges are `0x04..0xA4` (4..164), `0xB0..0xDD` (176..221), and modifier usages `0xE0..0xE7` (224..231); other values are rejected. Prefer named keys for normal use. Up to six ordinary keys plus eight modifiers may be held. Shortcuts release all keys, including any keys already held before the shortcut. Host LED flags are outputs, not ESP32 GPIO controls.
8. **Mouse**: X/Y/wheel must be integers -127..127; X right and Y down are positive. Buttons are LEFT/RIGHT/MIDDLE/BACK/FORWARD. Boot mode supports only three buttons and X/Y: no wheel or side-button press. Recovery retries current buttons with zero relative movement, never the failed motion.
9. **Media**: report ID 3 contains a 16-bit Consumer Usage. Seven supported taps are volume up/down, mute, play/pause, next/previous and stop. Taps release nonblockingly after about 20ms; busy rejects further presses instead of queuing them. Release-all returns neutral. Asynchronous failure recovers only neutral state. This profile requires Report mode; Boot requests stop its input.
10. **Generic gamepad**: report ID 4 contains 16 buttons, a hat and four axes. Buttons are numbered 1..16; the button mask is an integer 0..65535. X/Y/RX/RY are integers -127..127, with positive Y down. Hat 0=up, 1=up-right, 2=right, 3=down-right, 4=down, 5=down-left, 6=left, 7=up-left, 8=neutral. Reset releases buttons and centers the hat/axes. This profile requires Report mode.
11. **Switch**: sticks are signed 16-bit integers -32768..32767, zero centered, with positive Y up (opposite the generic profile). The button mask must contain only defined Switch bits within 0..16777215. Battery percent is 0..100 and represents reported, quantized protocol state. IMU/vibration values are host request flags, not physical sensor or motor support; rumble indices 0..7 expose raw bytes. Player lights are a bitmask. Connect accepts a colon-separated host MAC such as `00:11:22:33:44:55`; it does not manufacture pairing keys or bypass host authorization.
12. **Hardware status**: no ESP32 radio pairing, PC media mapping, GPIO hardware, or Nintendo Switch interoperability has been verified for this Blockly package. Switch emulation remains experimental. Source compilation and simulated tests do not establish device interoperability.

2026-10-29 compilation validation: aily Builder 1.2.17 and the official Arduino-ESP32 3.3.12 SDK compiled and linked all 12 native examples, the Print compatibility fixture and all six Blockly profiles. Switch Pro Basic and HID Keyboard also compiled and linked with the official 3.3.10 SDK. The bundled Host archive is unchanged. No ESP32 hardware, PC pairing or Switch interoperability was tested.

## Version 0.0.3 validation

2026-10-29: all 46 block contracts and existing enum values are preserved; four combined modifier values were added. Generator, native ABS binding/readback and toolbox rendering checks passed. All six input examples above and a full keyboard contract fixture compiled and linked with the official Arduino-ESP32 3.3.12 SDK. Documentation passed the strict ABS checks. These checks do not establish ESP32 radio pairing or PC/Switch hardware interoperability.
