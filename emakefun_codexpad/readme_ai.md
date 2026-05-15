# CodexPad Bluetooth handle

Emakefun CodexPad Bluetooth game controller library supports connecting the controller via BLE and reading button and joystick input in real time

## Library Info
- **Name**: @aily-project/lib-codexpad
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `codexpad_init` | Statement | VAR(field_input), MAC(input_value) | `codexpad_init("pad", text("value"))` | Dynamic code |
| `codexpad_is_connected` | Value | VAR(field_variable) | `codexpad_is_connected(variables_get($pad))` | Dynamic code |
| `codexpad_set_tx_power` | Statement | VAR(field_variable), POWER(dropdown) | `codexpad_set_tx_power(variables_get($pad), kMinus16dBm)` | Dynamic code |
| `codexpad_button_pressed` | Value | VAR(field_variable), BUTTON(dropdown) | `codexpad_button_pressed(variables_get($pad), kUp)` | Dynamic code |
| `codexpad_button_released` | Value | VAR(field_variable), BUTTON(dropdown) | `codexpad_button_released(variables_get($pad), kUp)` | Dynamic code |
| `codexpad_button_holding` | Value | VAR(field_variable), BUTTON(dropdown) | `codexpad_button_holding(variables_get($pad), kUp)` | Dynamic code |
| `codexpad_button_state` | Value | VAR(field_variable), BUTTON(dropdown) | `codexpad_button_state(variables_get($pad), kUp)` | Dynamic code |
| `codexpad_axis_value` | Value | VAR(field_variable), AXIS(dropdown) | `codexpad_axis_value(variables_get($pad), kLeftStickX)` | Dynamic code |
| `codexpad_axis_changed` | Value | VAR(field_variable), AXIS(dropdown), THRESHOLD(input_value) | `codexpad_axis_changed(variables_get($pad), kLeftStickX, math_number(0))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| POWER | kMinus16dBm, kMinus12dBm, kMinus8dBm, kMinus5dBm, kMinus3dBm, kMinus1dBm, k0dBm, k1dBm, k2dBm, k3dBm, k4dBm, k5dBm, k6dBm | codexpad_set_tx_power |
| BUTTON | kUp, kDown, kLeft, kRight, kSquareX, kTriangleY, kCrossA, kCircleB, kL1, kL2, kL3, kR1, kR2, kR3, kSelect, kStart, kHome | codexpad_button_pressed, codexpad_button_released, codexpad_button_holding |
| AXIS | kLeftStickX, kLeftStickY, kRightStickX, kRightStickY | codexpad_axis_value, codexpad_axis_changed |

## ABS Examples

### Basic Usage
```
arduino_setup()
    codexpad_init("pad", text("value"))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, codexpad_is_connected(variables_get($pad)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `codexpad_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
