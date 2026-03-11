# 点灯物联网

Blinker物联网控制库，支持手机APP控制、智能音箱控制，使用蓝牙BLE、MQTT等通信方式，兼容多种开发板

## Library Info
- **Name**: @aily-project/lib-blinker
- **Version**: 1.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `blinker_init_wifi` | Statement | MODE(dropdown) | `blinker_init_wifi(手动配网)` | (dynamic code) |
| `blinker_init_ble` | Statement | (none) | `blinker_init_ble()` | `Blinker.begin();\n` |
| `blinker_debug_init` | Statement | SERIAL(dropdown), SPEED(dropdown), DEBUG_ALL(dropdown) | `blinker_debug_init(SERIAL, SPEED, true)` | `BLINKER_DEBUG.stream(` |
| `blinker_button` | Statement | KEY(field_input) | `blinker_button("btn-")` | `` |
| `blinker_button_state` | Value | STATE(dropdown) | `blinker_button_state(tap)` | `state ==` |
| `blinker_slider` | Statement | KEY(field_input) | `blinker_slider("ran-")` | `` |
| `blinker_slider_value` | Value | (none) | `blinker_slider_value()` | `value` |
| `blinker_colorpicker` | Statement | KEY(field_input) | `blinker_colorpicker("col-")` | `` |
| `blinker_colorpicker_value` | Value | KEY(dropdown) | `blinker_colorpicker_value(r_value)` | (dynamic code) |
| `blinker_joystick` | Statement | KEY(field_input) | `blinker_joystick("joy-")` | `` |
| `blinker_joystick_value` | Value | KEY(dropdown) | `blinker_joystick_value(X)` | (dynamic code) |
| `blinker_data_handler` | Statement | NAME(input_statement) | `blinker_data_handler()` @NAME: ... | `` |
| `blinker_heartbeat` | Statement | NAME(input_statement) | `blinker_heartbeat()` @NAME: ... | `` |
| `blinker_chart` | Statement | KEY(field_input) | `blinker_chart("chart-")` | `` |
| `blinker_chart_data_upload` | Statement | CHART(field_input), KEY(field_input), VALUE(input_value) | `blinker_chart_data_upload("chart-", "data-", math_number(0))` | — |
| `blinker_log` | Statement | TEXT(input_value) | `blinker_log(text("hello"))` | `BLINKER_LOG(` |
| `blinker_log_args` | Statement | TEXT(input_value), ARGS(input_value) | `blinker_log_args(text("hello"), math_number(0))` | `BLINKER_LOG(` |
| `blinker_vibrate` | Statement | (none) | `blinker_vibrate()` | `Blinker.vibrate();\n` |
| `blinker_print` | Statement | TEXT(input_value) | `blinker_print(text("hello"))` | `Blinker.print(` |
| `blinker_state` | Value | STATE(input_value) | `blinker_state(math_number(0))` | `.state(` |
| `blinker_icon` | Value | ICON(input_value) | `blinker_icon(math_number(0))` | `.icon(` |
| `blinker_color` | Value | COLOR(input_value) | `blinker_color(math_number(0))` | `.color(` |
| `blinker_text` | Value | TEXT(input_value) | `blinker_text(text("hello"))` | `.text(` |
| `blinker_value` | Value | VALUE(input_value) | `blinker_value(math_number(0))` | `.value(` |
| `blinker_reset` | Statement | (none) | `blinker_reset()` | `Blinker.reset();\n` |
| `blinker_widget_print` | Statement | WIDGET(field_input), INPUT0(input_value) | `blinker_widget_print("widget", math_number(0))` | (dynamic code) |
| `blinker_delay` | Statement | DELAY(input_value) | `blinker_delay(math_number(1000))` | `Blinker.delay(` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | 手动配网, EspTouchV2 | 手动配网 / EspTouch V2 |
| DEBUG_ALL | true, false | 开启 / 关闭 |
| STATE | tap, on, off, press, pressup | tap / on / off / press / pressup |
| KEY | r_value, g_value, b_value, bright_value | R / G / B / 亮度 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    blinker_init_wifi(手动配网)
    blinker_init_ble()
    blinker_debug_init(SERIAL, SPEED, true)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, blinker_slider_value())
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order
