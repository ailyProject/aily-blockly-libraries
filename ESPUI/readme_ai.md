# ESPUI web interface library

ESP32/ESP8266 web interface library based on ESPUI, supports the creation of buttons, sliders, switches and other Web UI controls

## Library Info
- **Name**: @aily-project/lib-espui
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `espui_begin` | Statement | TITLE(input_value), USERNAME(input_value), PASSWORD(input_value), PORT(input_value) | `espui_begin(text("value"), text("value"), text("value"), math_number(0))` | ESPUI.setVerbosity(Verbosity::Quiet); ESPUI.begin(..., ..., ..., ...); |
| `espui_separator` | Value | TEXT(input_value) | `espui_separator(text("value"))` | See generator |
| `espui_tab` | Value | TEXT(input_value) | `espui_tab(text("value"))` | Dynamic code |
| `espui_panel` | Value | TEXT(input_value), COLOR(dropdown), PARENT(input_value) | `espui_panel(text("value"), Turquoise, math_number(0))` | Dynamic code |
| `espui_select` | Value | TEXT(input_value), COLOR(dropdown), OPTIONS_JSON(input_value), VALUE(input_value), PARENT(input_value) | `espui_select(text("value"), Turquoise, text("value"), text("value"), math_number(0))` | Dynamic code |
| `espui_update_select` | Statement | CONTROL_ID(input_value), VALUE(input_value) | `espui_update_select(math_number(0), text("value"))` | ESPUI.updateSelect(..., String(...));\n |
| `espui_file_display` | Value | TEXT(input_value), COLOR(dropdown), FILENAME(input_value), PARENT(input_value) | `espui_file_display(text("value"), Turquoise, text("value"), math_number(0))` | Dynamic code |
| `espui_label` | Value | TEXT(input_value), COLOR(dropdown), PARENT(input_value) | `espui_label(text("value"), Turquoise, math_number(0))` | Dynamic code |
| `espui_button` | Value | TEXT(input_value), COLOR(dropdown), VALUE(input_value) | `espui_button(text("value"), Turquoise, text("value"))` | Dynamic code |
| `espui_switcher` | Value | TEXT(input_value), COLOR(dropdown), STATE(dropdown) | `espui_switcher(text("value"), Turquoise, false)` | Dynamic code |
| `espui_slider` | Value | TEXT(input_value), COLOR(dropdown), MIN(input_value), MAX(input_value), VALUE(input_value) | `espui_slider(text("value"), Turquoise, math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `espui_text` | Value | TEXT(input_value), COLOR(dropdown), VALUE(input_value) | `espui_text(text("value"), Turquoise, text("value"))` | Dynamic code |
| `espui_number` | Value | TEXT(input_value), COLOR(dropdown), MIN(input_value), MAX(input_value), VALUE(input_value) | `espui_number(text("value"), Turquoise, math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `espui_graph` | Value | TEXT(input_value), COLOR(dropdown) | `espui_graph(text("value"), Turquoise)` | Dynamic code |
| `espui_gauge` | Value | TEXT(input_value), COLOR(dropdown), MIN(input_value), MAX(input_value), VALUE(input_value) | `espui_gauge(text("value"), Turquoise, math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `espui_update_control` | Statement | CONTROL_ID(input_value), VALUE(input_value) | `espui_update_control(math_number(0), math_number(0))` | ESPUI.updateControlValue(..., String(...));\n |
| `espui_update_label` | Statement | CONTROL_ID(input_value), LABEL(input_value) | `espui_update_label(math_number(0), text("value"))` | ESPUI.updateControlLabel(..., ...);\n |
| `espui_on_event` | Statement | CONTROL_ID(input_value), EVENT_TYPE(dropdown), DO(input_statement) | `espui_on_event(math_number(0), B_DOWN) @DO: child_block()` | Dynamic code |
| `espui_get_control_value` | Value | CONTROL_ID(input_value) | `espui_get_control_value(math_number(0))` | ESPUI.getControl(...)->value |
| `espui_add_graph_point` | Statement | CONTROL_ID(input_value), VALUE(input_value) | `espui_add_graph_point(math_number(0), math_number(0))` | ESPUI.addGraphPoint(..., ...);\n |
| `espui_clear_graph` | Statement | CONTROL_ID(input_value) | `espui_clear_graph(math_number(0))` | ESPUI.clearGraph(...);\n |
| `espui_wifi_setup` | Statement | SSID(input_value), PASSWORD(input_value), MODE(dropdown) | `espui_wifi_setup(text("value"), text("value"), STA)` | Dynamic code |
| `espui_wifi_status` | Value | (none) | `espui_wifi_status()` | (WiFi.status() == WL_CONNECTED) |
| `espui_get_ip` | Value | (none) | `espui_get_ip()` | WiFi.localIP().toString() |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| COLOR | Turquoise, Emerald, PeterRiver, Amethyst, WetAsphalt, GreenSea, Nephritis, BelizeHole, Wisteria, MidnightBlue, Sunflower, Carrot, Alizarin, Clouds, Concrete, Orange, Pumpkin, Pomegranate, Silver, Asbestos, ... | espui_panel, espui_select, espui_file_display |
| STATE | false, true | espui_switcher |
| EVENT_TYPE | B_DOWN, B_UP, S_ACTIVE, S_INACTIVE, SL_VALUE, N_VALUE, T_VALUE | espui_on_event |
| MODE | STA, AP | espui_wifi_setup |

## ABS Examples

### Basic Usage
```
arduino_setup()
    espui_begin(text("value"), text("value"), text("value"), math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, espui_separator(text("value")))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
