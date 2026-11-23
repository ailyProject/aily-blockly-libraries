# OneButton

Single button event detection library, supporting multiple events such as single click, double click, long press, etc.

## Library Info
- **Name**: @aily-project/lib-onebutton
- **Version**: 0.0.3

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `onebutton_setup` | Statement | VAR(field_input), PIN(dropdown), PIN_MODE(dropdown), ACTIVE_LOW(dropdown) | `onebutton_setup("button", PIN, INPUT, TRUE)` | `button.setup(PIN, INPUT, true);` |
| `onebutton_attach_click` | Hat | VAR(field_variable), HANDLER(input_statement) | `onebutton_attach_click($button)` | `void onebutton_click_button() { ↵ } ↵ button.attachClick(onebutton_click_button); ↵ button.tick();` |
| `onebutton_attach_double_click` | Hat | VAR(field_variable), HANDLER(input_statement) | `onebutton_attach_double_click($button)` | `void onebutton_double_click_button() { ↵ } ↵ button.attachDoubleClick(onebutton_double_click_button); ↵ button.tick();` |
| `onebutton_attach_multi_click` | Hat | VAR(field_variable), HANDLER(input_statement) | `onebutton_attach_multi_click($button)` | `void onebutton_multi_click_button() { ↵ } ↵ button.attachMultiClick(onebutton_multi_click_button); ↵ button.tick();` |
| `onebutton_attach_press` | Hat | VAR(field_variable), HANDLER(input_statement) | `onebutton_attach_press($button)` | `void onebutton_press_button() { ↵ } ↵ button.attachPress(onebutton_press_button); ↵ button.tick();` |
| `onebutton_attach_long_press_start` | Hat | VAR(field_variable), HANDLER(input_statement) | `onebutton_attach_long_press_start($button)` | `void onebutton_long_press_start_button() { ↵ } ↵ button.attachLongPressStart(onebutton_long_press_start_button); ↵ button.tick();` |
| `onebutton_attach_during_long_press` | Hat | VAR(field_variable), HANDLER(input_statement) | `onebutton_attach_during_long_press($button)` | `void onebutton_during_long_press_button() { ↵ } ↵ button.attachDuringLongPress(onebutton_during_long_press_button); ↵ button.tick();` |
| `onebutton_attach_long_press_stop` | Hat | VAR(field_variable), HANDLER(input_statement) | `onebutton_attach_long_press_stop($button)` | `void onebutton_long_press_stop_button() { ↵ } ↵ button.attachLongPressStop(onebutton_long_press_stop_button); ↵ button.tick();` |
| `onebutton_set_debounce_ms` | Statement | VAR(field_variable), MS(input_value) | `onebutton_set_debounce_ms($button, math_number(1000))` | `button.setDebounceMs(1);` |
| `onebutton_set_click_ms` | Statement | VAR(field_variable), MS(input_value) | `onebutton_set_click_ms($button, math_number(1000))` | `button.setClickMs(1);` |
| `onebutton_set_press_ms` | Statement | VAR(field_variable), MS(input_value) | `onebutton_set_press_ms($button, math_number(1000))` | `button.setPressMs(1);` |
| `onebutton_set_long_press_interval_ms` | Statement | VAR(field_variable), MS(input_value) | `onebutton_set_long_press_interval_ms($button, math_number(1000))` | `button.setLongPressIntervalMs(1);` |
| `onebutton_is_long_pressed` | Value | VAR(field_variable) | `onebutton_is_long_pressed($button)` | `button.isLongPressed()` |
| `onebutton_get_pressed_ms` | Value | VAR(field_variable) | `onebutton_get_pressed_ms($button)` | `button.getPressedMs()` |
| `onebutton_get_number_clicks` | Value | VAR(field_variable) | `onebutton_get_number_clicks($button)` | `button.getNumberClicks()` |
| `onebutton_reset` | Statement | VAR(field_variable) | `onebutton_reset($button)` | `button.reset();` |

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
    serial_println(Serial, onebutton_is_long_pressed($button))
    time_delay(math_number(1000))
```

### linkbit: onboard keys A and B
```
arduino_setup()
    serial_begin(Serial, 115200)
    onebutton_setup("keyA", 10, INPUT_PULLUP, TRUE)
    onebutton_setup("keyB", 5, INPUT_PULLUP, TRUE)

onebutton_attach_click($keyA)
    @HANDLER:
        serial_println(Serial, text("A clicked"))

onebutton_attach_long_press_start($keyB)
    @HANDLER:
        serial_println(Serial, text("B long press"))
```

## Notes

1. **Variable**: `onebutton_setup("varName", ...)` creates variable `$varName`; pass `$varName` directly to `field_variable` slots; use `variables_get($varName)` only for `input_value` slots.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
4. **Board defaults**: on boards whose `board.json` has `buttonConfig` (`activeLevel` plus `pins` mapping a name to a pin, e.g. linkbit `{ "keyA": "10", "keyB": "5", "keyC": "8" }`, IBox S31 `{ "button": "61" }`), an `onebutton_setup` taken from the toolbox starts with the first onboard button not yet used in the workspace, named after it, with `INPUT_PULLUP` and active low when `activeLevel` is 0 (active high when 1). Other boards keep the defaults; saved programs keep their values. In ABS, write the name, pin and mode explicitly.
