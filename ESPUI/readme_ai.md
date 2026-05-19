# ESPUI Web UI

Create local ESP32 web control panels with buttons, sliders, graphs, and live updates

## Library Info
- **Name**: @aily-project/lib-espui
- **Version**: 2.2.4

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `espui_wifi_ap` | Statement | SSID(input_value), PASSWORD(input_value) | `espui_wifi_ap(text("value"), text("value"))` | WiFi.mode(WIFI_AP);\n |
| `espui_wifi_sta` | Statement | SSID(input_value), PASSWORD(input_value), TIMEOUT(input_value) | `espui_wifi_sta(text("value"), text("value"), math_number(1000))` | WiFi.mode(WIFI_STA);\n |
| `espui_wifi_auto` | Statement | STA_SSID(input_value), STA_PASSWORD(input_value), AP_SSID(input_value), AP_PASSWORD(input_value), TIMEOUT(input_value) | `espui_wifi_auto(text("value"), text("value"), text("value"), text("value"), math_number(1000))` | WiFi.mode(WIFI_STA);\n |
| `espui_begin` | Statement | TITLE(input_value), MODE(dropdown), AUTH(dropdown), USERNAME(input_value), PASSWORD(input_value), PORT(input_value), SLIDER_CONTINUOUS(dropdown), CAPTIVE_POR... | `espui_begin(text("value"), MEMORY, FALSE, text("value"), text("value"), math_number(0), FALSE, TRUE)` | ESPUI.sliderContinuous = |
| `espui_prepare_filesystem` | Statement | FORMAT(dropdown) | `espui_prepare_filesystem(TRUE)` | ESPUI.prepareFileSystem( |
| `espui_no_parent` | Value | (none) | `espui_no_parent()` | Dynamic code |
| `espui_control_id` | Value | VAR(field_variable) | `espui_control_id(variables_get($statusLabel))` | Dynamic code |
| `espui_create_tab` | Statement | VAR(field_input), TITLE(input_value) | `espui_create_tab("mainTab", text("value"))` | Dynamic code |
| `espui_create_separator` | Statement | VAR(field_input), LABEL(input_value), PARENT(input_value) | `espui_create_separator("separator1", text("value"), math_number(0))` | Dynamic code |
| `espui_create_label` | Statement | VAR(field_input), LABEL(input_value), VALUE(input_value), COLOR(dropdown), PARENT(input_value) | `espui_create_label("statusLabel", text("value"), text("value"), Turquoise, math_number(0))` | Dynamic code |
| `espui_create_button` | Statement | VAR(field_input), LABEL(input_value), VALUE(input_value), COLOR(dropdown), PARENT(input_value), DOWN(input_statement), UP(input_statement) | `espui_create_button("button1", text("value"), text("value"), Turquoise, math_number(0)) @DOWN: child_block() @UP: child_block()` | Dynamic code |
| `espui_create_switcher` | Statement | VAR(field_input), LABEL(input_value), STATE(dropdown), COLOR(dropdown), PARENT(input_value), ON(input_statement), OFF(input_statement) | `espui_create_switcher("switch1", text("value"), FALSE, Turquoise, math_number(0)) @ON: child_block() @OFF: child_block()` | Dynamic code |
| `espui_create_slider` | Statement | VAR(field_input), LABEL(input_value), VALUE(input_value), MIN(input_value), MAX(input_value), COLOR(dropdown), PARENT(input_value), CHANGE(input_statement) | `espui_create_slider("slider1", text("value"), math_number(0), math_number(0), math_number(0), Turquoise, math_number(0)) @CHANGE: child_block()` | Dynamic code |
| `espui_create_number` | Statement | VAR(field_input), LABEL(input_value), VALUE(input_value), MIN(input_value), MAX(input_value), COLOR(dropdown), PARENT(input_value), CHANGE(input_statement) | `espui_create_number("number1", text("value"), math_number(0), math_number(0), math_number(0), Turquoise, math_number(0)) @CHANGE: child_block()` | Dynamic code |
| `espui_create_text` | Statement | VAR(field_input), LABEL(input_value), VALUE(input_value), INPUT_TYPE(dropdown), COLOR(dropdown), PARENT(input_value), CHANGE(input_statement) | `espui_create_text("text1", text("value"), text("value"), text, Turquoise, math_number(0)) @CHANGE: child_block()` | Dynamic code |
| `espui_create_select` | Statement | VAR(field_input), LABEL(input_value), VALUE(input_value), COLOR(dropdown), PARENT(input_value), CHANGE(input_statement) | `espui_create_select("select1", text("value"), text("value"), Turquoise, math_number(0)) @CHANGE: child_block()` | Dynamic code |
| `espui_add_option` | Statement | SELECT(field_variable), LABEL(input_value), VALUE(input_value) | `espui_add_option(variables_get($select1), text("value"), text("value"))` | ESPUI.addControl(ControlType::Option, |
| `espui_create_pad` | Statement | VAR(field_input), LABEL(input_value), CENTER(dropdown), COLOR(dropdown), PARENT(input_value), EVENT(input_statement) | `espui_create_pad("pad1", text("value"), TRUE, Turquoise, math_number(0)) @EVENT: child_block()` | Dynamic code |
| `espui_create_graph` | Statement | VAR(field_input), LABEL(input_value), COLOR(dropdown), PARENT(input_value) | `espui_create_graph("graph1", text("value"), Turquoise, math_number(0))` | Dynamic code |
| `espui_create_gauge` | Statement | VAR(field_input), LABEL(input_value), VALUE(input_value), MIN(input_value), MAX(input_value), COLOR(dropdown), PARENT(input_value) | `espui_create_gauge("gauge1", text("value"), math_number(0), math_number(0), math_number(0), Turquoise, math_number(0))` | Dynamic code |
| `espui_create_file_display` | Statement | VAR(field_input), LABEL(input_value), FILENAME(input_value), COLOR(dropdown), PARENT(input_value) | `espui_create_file_display("fileView1", text("value"), text("value"), Turquoise, math_number(0))` | Dynamic code |
| `espui_create_accelerometer` | Statement | VAR(field_input), LABEL(input_value), COLOR(dropdown), PARENT(input_value), CHANGE(input_statement) | `espui_create_accelerometer("accel1", text("value"), Turquoise, math_number(0)) @CHANGE: child_block()` | Dynamic code |
| `espui_update_value` | Statement | VAR(field_variable), VALUE(input_value) | `espui_update_value(variables_get($statusLabel), math_number(0))` | ESPUI.updateControlValue( |
| `espui_update_control_label` | Statement | VAR(field_variable), LABEL(input_value) | `espui_update_control_label(variables_get($statusLabel), text("value"))` | ESPUI.updateControlLabel( |
| `espui_update_switcher` | Statement | VAR(field_variable), STATE(input_value) | `espui_update_switcher(variables_get($switch1), logic_boolean(TRUE))` | ESPUI.updateSwitcher( |
| `espui_update_number` | Statement | VAR(field_variable), VALUE(input_value) | `espui_update_number(variables_get($slider1), math_number(0))` | ESPUI.updateControlValue( |
| `espui_add_graph_point` | Statement | VAR(field_variable), VALUE(input_value) | `espui_add_graph_point(variables_get($graph1), math_number(0))` | ESPUI.addGraphPoint( |
| `espui_clear_graph` | Statement | VAR(field_variable) | `espui_clear_graph(variables_get($graph1))` | ESPUI.clearGraph( |
| `espui_set_enabled` | Statement | VAR(field_variable), ENABLED(input_value) | `espui_set_enabled(variables_get($button1), logic_boolean(TRUE))` | ESPUI.setEnabled( |
| `espui_set_visible` | Statement | VAR(field_variable), VISIBLE(input_value) | `espui_set_visible(variables_get($statusLabel), logic_boolean(TRUE))` | ESPUI.updateVisibility( |
| `espui_set_layout` | Statement | VAR(field_variable), WIDE(input_value), VERTICAL(input_value) | `espui_set_layout(variables_get($slider1), logic_boolean(TRUE), logic_boolean(TRUE))` | ESPUI.setPanelWide( |
| `espui_set_style` | Statement | VAR(field_variable), TARGET(dropdown), CSS(input_value) | `espui_set_style(variables_get($statusLabel), PANEL, text("value"))` | ESPUI.setElementStyle( |
| `espui_set_input_type` | Statement | VAR(field_variable), INPUT_TYPE(dropdown) | `espui_set_input_type(variables_get($text1), text)` | ESPUI.setInputType( |
| `espui_get_value` | Value | VAR(field_variable) | `espui_get_value(variables_get($statusLabel))` | espui_get_control_value( |
| `espui_sender_value` | Value | (none) | `espui_sender_value()` | sender->value |
| `espui_sender_value_number` | Value | (none) | `espui_sender_value_number()` | sender->value.toInt() |
| `espui_sender_id` | Value | (none) | `espui_sender_id()` | sender->id |
| `espui_event_type` | Value | (none) | `espui_event_type()` | type |
| `espui_event_is` | Value | EVENT(dropdown) | `espui_event_is(B_DOWN)` | (type == |
| `espui_if_event` | Statement | EVENT(dropdown), DO(input_statement) | `espui_if_event(B_DOWN) @DO: child_block()` | if (type == |
| `espui_wifi_connected` | Value | (none) | `espui_wifi_connected()` | (WiFi.status() == WL_CONNECTED) |
| `espui_ip_address` | Value | MODE(dropdown) | `espui_ip_address(STA)` | WiFi.softAPIP().toString() |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | MEMORY, LITTLEFS | espui_begin |
| AUTH | FALSE, TRUE | espui_begin |
| SLIDER_CONTINUOUS | FALSE, TRUE | espui_begin |
| CAPTIVE_PORTAL | TRUE, FALSE | espui_begin |
| FORMAT | TRUE, FALSE | espui_prepare_filesystem |
| COLOR | Turquoise, Emerald, Peterriver, Wetasphalt, Sunflower, Carrot, Alizarin, Dark, None | espui_create_label, espui_create_button, espui_create_switcher |
| STATE | FALSE, TRUE | espui_create_switcher |
| INPUT_TYPE | text, password, number, date, time, color, email | espui_create_text, espui_set_input_type |
| CENTER | TRUE, FALSE | espui_create_pad |
| TARGET | PANEL, ELEMENT | espui_set_style |
| EVENT | B_DOWN, B_UP, S_ACTIVE, S_INACTIVE, SL_VALUE, N_VALUE, T_VALUE, S_VALUE, P_LEFT_DOWN, P_LEFT_UP, P_RIGHT_DOWN, P_RIGHT_UP, P_FOR_DOWN, P_FOR_UP, P_BACK_DOWN, P_BACK_UP, P_CENTER_DOWN, P_CENTER_UP | espui_event_is, espui_if_event |
| MODE | STA, AP | espui_ip_address |

## ABS Examples

### Basic Usage
```
arduino_setup()
    espui_begin(text("value"), MEMORY, FALSE, text("value"), text("value"), math_number(0), FALSE, TRUE)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, espui_no_parent())
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `espui_create_tab("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
