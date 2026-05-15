# OneButton

Single button event detection library, supporting multiple events such as single click, double click, long press, etc.

## Library Info
- **Name**: @aily-project/lib-onebutton
- **Version**: 0.0.2

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `onebutton_setup` | Statement | VAR(field_input), PIN(dropdown), PIN_MODE(dropdown), ACTIVE_LOW(dropdown) | `onebutton_setup("button", PIN, INPUT, TRUE)` | Dynamic code |
| `onebutton_attach_click` | Hat | VAR(field_variable), HANDLER(input_statement) | `onebutton_attach_click(variables_get($button)) @HANDLER: child_block()` | Dynamic code |
| `onebutton_attach_double_click` | Hat | VAR(field_variable), HANDLER(input_statement) | `onebutton_attach_double_click(variables_get($button)) @HANDLER: child_block()` | Dynamic code |
| `onebutton_attach_multi_click` | Hat | VAR(field_variable), HANDLER(input_statement) | `onebutton_attach_multi_click(variables_get($button)) @HANDLER: child_block()` | Dynamic code |
| `onebutton_attach_press` | Hat | VAR(field_variable), HANDLER(input_statement) | `onebutton_attach_press(variables_get($button)) @HANDLER: child_block()` | Dynamic code |
| `onebutton_attach_long_press_start` | Hat | VAR(field_variable), HANDLER(input_statement) | `onebutton_attach_long_press_start(variables_get($button)) @HANDLER: child_block()` | Dynamic code |
| `onebutton_attach_during_long_press` | Hat | VAR(field_variable), HANDLER(input_statement) | `onebutton_attach_during_long_press(variables_get($button)) @HANDLER: child_block()` | Dynamic code |
| `onebutton_attach_long_press_stop` | Hat | VAR(field_variable), HANDLER(input_statement) | `onebutton_attach_long_press_stop(variables_get($button)) @HANDLER: child_block()` | Dynamic code |
| `onebutton_set_debounce_ms` | Statement | VAR(field_variable), MS(input_value) | `onebutton_set_debounce_ms(variables_get($button), math_number(1000))` | Dynamic code |
| `onebutton_set_click_ms` | Statement | VAR(field_variable), MS(input_value) | `onebutton_set_click_ms(variables_get($button), math_number(1000))` | Dynamic code |
| `onebutton_set_press_ms` | Statement | VAR(field_variable), MS(input_value) | `onebutton_set_press_ms(variables_get($button), math_number(1000))` | Dynamic code |
| `onebutton_set_long_press_interval_ms` | Statement | VAR(field_variable), MS(input_value) | `onebutton_set_long_press_interval_ms(variables_get($button), math_number(1000))` | Dynamic code |
| `onebutton_is_long_pressed` | Value | VAR(field_variable) | `onebutton_is_long_pressed(variables_get($button))` | Dynamic code |
| `onebutton_get_pressed_ms` | Value | VAR(field_variable) | `onebutton_get_pressed_ms(variables_get($button))` | Dynamic code |
| `onebutton_get_number_clicks` | Value | VAR(field_variable) | `onebutton_get_number_clicks(variables_get($button))` | Dynamic code |
| `onebutton_reset` | Statement | VAR(field_variable) | `onebutton_reset(variables_get($button))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| PIN_MODE | INPUT, INPUT_PULLUP | onebutton_setup |
| ACTIVE_LOW | TRUE, FALSE | onebutton_setup |

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

1. **Variable**: `onebutton_setup("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
