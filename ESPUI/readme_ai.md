# ESPUI网页界面库

基于ESPUI的ESP32/ESP8266网页界面库，支持创建按钮、滑条、开关等Web UI控件

## Library Info
- **Name**: @aily-project/lib-espui
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `espui_begin` | Statement | TITLE(input_value), USERNAME(input_value), PASSWORD(input_value), PORT(input_value) | `espui_begin(math_number(0), math_number(0), math_number(0), math_number(0))` | `` |
| `espui_separator` | Value | TEXT(input_value) | `espui_separator(text("hello"))` | — |
| `espui_tab` | Value | TEXT(input_value) | `espui_tab(text("hello"))` | (dynamic code) |
| `espui_panel` | Value | TEXT(input_value), COLOR(dropdown), PARENT(input_value) | `espui_panel(text("hello"), Turquoise, math_number(0))` | (dynamic code) |
| `espui_select` | Value | TEXT(input_value), COLOR(dropdown), OPTIONS_JSON(input_value), VALUE(input_value), PARENT(input_value) | `espui_select(text("hello"), Turquoise, math_number(0), math_number(0), math_number(0))` | (dynamic code) |
| `espui_update_select` | Statement | CONTROL_ID(input_value), VALUE(input_value) | `espui_update_select(math_number(0), math_number(0))` | `ESPUI.updateSelect(..., String(...));\n` |
| `espui_file_display` | Value | TEXT(input_value), COLOR(dropdown), FILENAME(input_value), PARENT(input_value) | `espui_file_display(text("hello"), Turquoise, math_number(0), math_number(0))` | (dynamic code) |
| `espui_label` | Value | TEXT(input_value), COLOR(dropdown), PARENT(input_value) | `espui_label(text("hello"), Turquoise, math_number(0))` | (dynamic code) |
| `espui_button` | Value | TEXT(input_value), COLOR(dropdown), VALUE(input_value) | `espui_button(text("hello"), Turquoise, math_number(0))` | (dynamic code) |
| `espui_switcher` | Value | TEXT(input_value), COLOR(dropdown), STATE(dropdown) | `espui_switcher(text("hello"), Turquoise, false)` | (dynamic code) |
| `espui_slider` | Value | TEXT(input_value), COLOR(dropdown), MIN(input_value), MAX(input_value), VALUE(input_value) | `espui_slider(text("hello"), Turquoise, math_number(0), math_number(0), math_number(0))` | (dynamic code) |
| `espui_text` | Value | TEXT(input_value), COLOR(dropdown), VALUE(input_value) | `espui_text(text("hello"), Turquoise, math_number(0))` | (dynamic code) |
| `espui_number` | Value | TEXT(input_value), COLOR(dropdown), MIN(input_value), MAX(input_value), VALUE(input_value) | `espui_number(text("hello"), Turquoise, math_number(0), math_number(0), math_number(0))` | (dynamic code) |
| `espui_graph` | Value | TEXT(input_value), COLOR(dropdown) | `espui_graph(text("hello"), Turquoise)` | (dynamic code) |
| `espui_gauge` | Value | TEXT(input_value), COLOR(dropdown), MIN(input_value), MAX(input_value), VALUE(input_value) | `espui_gauge(text("hello"), Turquoise, math_number(0), math_number(0), math_number(0))` | (dynamic code) |
| `espui_update_control` | Statement | CONTROL_ID(input_value), VALUE(input_value) | `espui_update_control(math_number(0), math_number(0))` | `ESPUI.updateControlValue(..., String(...));\n` |
| `espui_update_label` | Statement | CONTROL_ID(input_value), LABEL(input_value) | `espui_update_label(math_number(0), math_number(0))` | `ESPUI.updateControlLabel(..., ...);\n` |
| `espui_on_event` | Statement | CONTROL_ID(input_value), EVENT_TYPE(dropdown), DO(input_statement) | `espui_on_event(math_number(0), B_DOWN)` @DO: ... | `` |
| `espui_get_control_value` | Value | CONTROL_ID(input_value) | `espui_get_control_value(math_number(0))` | `ESPUI.getControl(...)->value` |
| `espui_add_graph_point` | Statement | CONTROL_ID(input_value), VALUE(input_value) | `espui_add_graph_point(math_number(0), math_number(0))` | `ESPUI.addGraphPoint(..., ...);\n` |
| `espui_clear_graph` | Statement | CONTROL_ID(input_value) | `espui_clear_graph(math_number(0))` | `ESPUI.clearGraph(...);\n` |
| `espui_wifi_setup` | Statement | SSID(input_value), PASSWORD(input_value), MODE(dropdown) | `espui_wifi_setup(math_number(0), math_number(0), STA)` | `` |
| `espui_wifi_status` | Value | (none) | `espui_wifi_status()` | `(WiFi.status() == WL_CONNECTED)` |
| `espui_get_ip` | Value | (none) | `espui_get_ip()` | `WiFi.localIP().toString()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| COLOR | Turquoise, Emerald, PeterRiver, Amethyst, WetAsphalt, GreenSea, Nephritis, BelizeHole, Wisteria, MidnightBlue, Sunflower, Carrot, Alizarin, Clouds, Concrete, Orange, Pumpkin, Pomegranate, Silver, Asbestos, Dark, None | 蓝绿色 / 翠绿色 / 彼得河蓝 / 紫水晶 / 湿沥青 / 绿海 / 海蓝宝石 / 贝尔法斯特蓝 / 紫藤 / 午夜蓝 / 阳橙 / 胡萝卜 / 茜红 / 云朵 / 混凝土 / 橙色 / 南瓜 / 石榴红 / 银色 / 石墨 / 暗色 / 无 |
| STATE | false, true | 关闭 / 开启 |
| EVENT_TYPE | B_DOWN, B_UP, S_ACTIVE, S_INACTIVE, SL_VALUE, N_VALUE, T_VALUE | 按下 / 松开 / 改变/激活 / 未激活 / 滑条值 / 数字值 / 文本值 |
| MODE | STA, AP | 连接模式 / 热点模式 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    espui_begin(math_number(0), math_number(0), math_number(0), math_number(0))
    espui_wifi_setup(math_number(0), math_number(0), STA)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, espui_separator(text("hello")))
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order
