# Lighting Internet of Things

Blinker IoT control library supports mobile APP control and smart speaker control, uses Bluetooth BLE, MQTT and other communication methods, and is compatible with a variety of development boards

## Library Info
- **Name**: @aily-project/lib-blinker
- **Version**: 1.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `blinker_init_wifi` | Statement | MODE(dropdown) | `blinker_init_wifi("手动配网")` | Dynamic code |
| `blinker_init_ble` | Statement | (none) | `blinker_init_ble()` | Blinker.begin();\n |
| `blinker_debug_init` | Statement | SERIAL(dropdown), SPEED(dropdown), DEBUG_ALL(dropdown) | `blinker_debug_init(SERIAL, SPEED, true)` | BLINKER_DEBUG.stream( |
| `blinker_button` | Hat | KEY(field_input), NAME(input_statement) | `blinker_button("btn-") @NAME: child_block()` | Dynamic code |
| `blinker_button_state` | Value | STATE(dropdown) | `blinker_button_state(tap)` | state == |
| `blinker_slider` | Hat | KEY(field_input), NAME(input_statement) | `blinker_slider("ran-") @NAME: child_block()` | Dynamic code |
| `blinker_slider_value` | Value | (none) | `blinker_slider_value()` | value |
| `blinker_colorpicker` | Hat | KEY(field_input), NAME(input_statement) | `blinker_colorpicker("col-") @NAME: child_block()` | Dynamic code |
| `blinker_colorpicker_value` | Value | KEY(dropdown) | `blinker_colorpicker_value(r_value)` | Dynamic code |
| `blinker_joystick` | Hat | KEY(field_input), NAME(input_statement) | `blinker_joystick("joy-") @NAME: child_block()` | Dynamic code |
| `blinker_joystick_value` | Value | KEY(dropdown) | `blinker_joystick_value(X)` | Dynamic code |
| `blinker_data_handler` | Hat | NAME(input_statement) | `blinker_data_handler() @NAME: child_block()` | Dynamic code |
| `blinker_heartbeat` | Hat | NAME(input_statement) | `blinker_heartbeat() @NAME: child_block()` | Dynamic code |
| `blinker_chart` | Hat | KEY(field_input), NAME(input_statement) | `blinker_chart("chart-") @NAME: child_block()` | Dynamic code |
| `blinker_chart_data_upload` | Statement | CHART(field_input), KEY(field_input), VALUE(input_value) | `blinker_chart_data_upload("chart-", "data-", math_number(0))` | See generator |
| `blinker_log` | Statement | TEXT(input_value) | `blinker_log(text("value"))` | BLINKER_LOG( |
| `blinker_log_args` | Statement | TEXT(input_value), ARGS(input_value) | `blinker_log_args(text("value"), math_number(0))` | BLINKER_LOG( |
| `blinker_vibrate` | Statement | (none) | `blinker_vibrate()` | Blinker.vibrate();\n |
| `blinker_print` | Statement | TEXT(input_value) | `blinker_print(text("value"))` | Blinker.print( |
| `blinker_state` | Value | STATE(input_value) | `blinker_state(math_number(0))` | .state( |
| `blinker_icon` | Value | ICON(input_value) | `blinker_icon(math_number(0))` | .icon( |
| `blinker_color` | Value | COLOR(input_value) | `blinker_color(math_number(0))` | .color( |
| `blinker_text` | Value | TEXT(input_value) | `blinker_text(text("value"))` | .text( |
| `blinker_value` | Value | VALUE(input_value) | `blinker_value(math_number(0))` | .value( |
| `blinker_reset` | Statement | (none) | `blinker_reset()` | Blinker.reset();\n |
| `blinker_widget_print` | Statement | WIDGET(field_input), INPUT0(input_value) | `blinker_widget_print("WIDGET", math_number(0))` | Blinker.printObject( |
| `blinker_delay` | Statement | DELAY(input_value) | `blinker_delay(math_number(1000))` | Blinker.delay( |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | 手动配网, EspTouchV2 | blinker_init_wifi |
| DEBUG_ALL | true, false | blinker_debug_init |
| STATE | tap, on, off, press, pressup | blinker_button_state |
| KEY | r_value, g_value, b_value, bright_value | blinker_colorpicker_value |
| KEY | X, Y | blinker_joystick_value |

## ABS Examples

### Basic Usage
```
arduino_setup()
    blinker_init_wifi("手动配网")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, blinker_button_state(tap))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
3. **Dynamic fields**: `blinker_init_wifi` may add fields at runtime through Blockly extensions.
