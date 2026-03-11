# OneButton

单按钮事件检测库，支持单击、双击、长按等多种事件

## Library Info
- **Name**: @aily-project/lib-onebutton
- **Version**: 0.0.2

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `onebutton_setup` | Statement | VAR(field_input), PIN(dropdown), PIN_MODE(dropdown), ACTIVE_LOW(dropdown) | `onebutton_setup("button", PIN, INPUT, TRUE)` | (dynamic code) |
| `onebutton_attach_click` | Statement | VAR(field_variable) | `onebutton_attach_click(variables_get($button))` | `` |
| `onebutton_attach_double_click` | Statement | VAR(field_variable) | `onebutton_attach_double_click(variables_get($button))` | `` |
| `onebutton_attach_multi_click` | Statement | VAR(field_variable) | `onebutton_attach_multi_click(variables_get($button))` | `` |
| `onebutton_attach_press` | Statement | VAR(field_variable) | `onebutton_attach_press(variables_get($button))` | `` |
| `onebutton_attach_long_press_start` | Statement | VAR(field_variable) | `onebutton_attach_long_press_start(variables_get($button))` | `` |
| `onebutton_attach_during_long_press` | Statement | VAR(field_variable) | `onebutton_attach_during_long_press(variables_get($button))` | `` |
| `onebutton_attach_long_press_stop` | Statement | VAR(field_variable) | `onebutton_attach_long_press_stop(variables_get($button))` | `` |
| `onebutton_set_debounce_ms` | Statement | VAR(field_variable), MS(input_value) | `onebutton_set_debounce_ms(variables_get($button), math_number(1000))` | (dynamic code) |
| `onebutton_set_click_ms` | Statement | VAR(field_variable), MS(input_value) | `onebutton_set_click_ms(variables_get($button), math_number(1000))` | (dynamic code) |
| `onebutton_set_press_ms` | Statement | VAR(field_variable), MS(input_value) | `onebutton_set_press_ms(variables_get($button), math_number(1000))` | (dynamic code) |
| `onebutton_set_long_press_interval_ms` | Statement | VAR(field_variable), MS(input_value) | `onebutton_set_long_press_interval_ms(variables_get($button), math_number(1000))` | (dynamic code) |
| `onebutton_is_long_pressed` | Value | VAR(field_variable) | `onebutton_is_long_pressed(variables_get($button))` | (dynamic code) |
| `onebutton_get_pressed_ms` | Value | VAR(field_variable) | `onebutton_get_pressed_ms(variables_get($button))` | (dynamic code) |
| `onebutton_get_number_clicks` | Value | VAR(field_variable) | `onebutton_get_number_clicks(variables_get($button))` | (dynamic code) |
| `onebutton_reset` | Statement | VAR(field_variable) | `onebutton_reset(variables_get($button))` | (dynamic code) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| PIN_MODE | INPUT, INPUT_PULLUP | 普通输入 / 上拉输入 |
| ACTIVE_LOW | TRUE, FALSE | 是 / 否 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    onebutton_setup("button", PIN, INPUT, TRUE)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, onebutton_is_long_pressed(variables_get($button)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable Creation**: `onebutton_setup("varName", ...)` creates variable `$varName`; reference with `variables_get($varName)`
2. **Initialization**: Place init blocks inside `arduino_setup()`
3. **Parameter Order**: Follows `block.json` args0 order
