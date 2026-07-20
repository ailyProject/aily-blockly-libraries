# Cubic PS3 Gamepad

Contest PS3 Bluetooth gamepad wrapper for Cubic ESP32.

## Library Info
- **Name**: @aily-project/lib-cubic-ps3
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0) | ABS Format | Generated Code |
|------------|------------|--------------------|------------|----------------|
| `cubic_ps3_init` | Statement | VAR(field_input) | `cubic_ps3_init("pad")` | `CubicPs3 pad; pad.begin();` + loop `pad.update();` |
| `cubic_ps3_init_mac` | Statement | VAR, MAC | `cubic_ps3_init_mac("pad", text("aa:bb:..."))` | `pad.begin("aa:bb:...");` |
| `cubic_ps3_set_deadzone` | Statement | VAR, DZ | `cubic_ps3_set_deadzone(variables_get($pad), math_number(30))` | `pad.deadzone = 30;` |
| `cubic_ps3_connected` | Value | VAR | `cubic_ps3_connected(variables_get($pad))` | `pad.isConnected()` |
| `cubic_ps3_just_connected` | Value | VAR | `cubic_ps3_just_connected(variables_get($pad))` | `pad.justConnected()` |
| `cubic_ps3_just_disconnected` | Value | VAR | `cubic_ps3_just_disconnected(variables_get($pad))` | `pad.justDisconnected()` |
| `cubic_ps3_button` | Value | VAR, BTN | `cubic_ps3_button(variables_get($pad), BTN_CROSS)` | `pad.button(CubicPs3::BTN_CROSS)` |
| `cubic_ps3_button_pressed` | Value | VAR, BTN | `cubic_ps3_button_pressed(variables_get($pad), BTN_L1)` | `pad.buttonPressed(...)` |
| `cubic_ps3_stick` | Value | VAR, STICK, AXIS | `cubic_ps3_stick(variables_get($pad), STICK_L, AXIS_Y)` | `pad.stick(...)` |
| `cubic_ps3_stick_raw` | Value | VAR, STICK, AXIS | `cubic_ps3_stick_raw(variables_get($pad), STICK_L, AXIS_Y)` | `pad.stickRaw(...)` |
| `cubic_ps3_stick_mapped` | Value | VAR, STICK, AXIS, MAX | `cubic_ps3_stick_mapped(variables_get($pad), STICK_L, AXIS_Y, math_number(255))` | `pad.stickMapped(..., 255)` |
| `cubic_ps3_set_player` | Statement | VAR, PLAYER | `cubic_ps3_set_player(variables_get($pad), 1)` | `pad.setPlayer(1);` |
| `cubic_ps3_rumble` | Statement | VAR, INTENSITY, DURATION | `cubic_ps3_rumble(variables_get($pad), math_number(50), math_number(300))` | `pad.setRumble(50, 300);` |
| `cubic_ps3_address` | Value | VAR | `cubic_ps3_address(variables_get($pad))` | `pad.address()` |

## Parameter Options

| Parameter | Values |
|-----------|--------|
| BTN | BTN_CROSS/CIRCLE/TRIANGLE/SQUARE/UP/DOWN/LEFT/RIGHT/L1/L2/R1/R2/SELECT/START/PS/L3/R3 |
| STICK | STICK_L, STICK_R |
| AXIS | AXIS_X, AXIS_Y |
| PLAYER | 1..4 |

## ABS Example
```
arduino_setup()
    cubic_ps3_init("pad")
    serial_begin(Serial, 115200)

arduino_loop()
    controls_if()
        @IF0: cubic_ps3_connected(variables_get($pad))
        @DO0:
            serial_println(Serial, cubic_ps3_stick(variables_get($pad), STICK_L, AXIS_Y))
    controls_if()
        @IF0: cubic_ps3_just_disconnected(variables_get($pad))
        @DO0:
            serial_println(Serial, text("disconnect stop"))
```

## Notes
1. Pair DualShock 3 to printed MAC via SixaxisPairTool.
2. Call pattern matches contest sample: auto MAC, deadzone=30, invert LY/RY.
3. `update()` is auto-injected into loop for edge detection.
4. ESP32 only; src.7z includes Ps3Controller + CubicPs3.
