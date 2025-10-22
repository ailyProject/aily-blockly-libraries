# diandeng_blinker

点灯物联网控制库，支持手机APP控制与智能音箱交互

## 库信息
- **库名**: @aily-project/lib-blinker
- **版本**: 1.0.0
- **兼容**: ESP32, Arduino UNO R4 WiFi平台，3.3V/5V

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `blinker_init_wifi` | 语句块 | MODE(field_dropdown), AUTH(input_value), SSID(input_value), PSWD(input_value) | `"fields":{"MODE":"手动配网"},"inputs":{"AUTH":{"block":{...}},"SSID":{"block":{...}},"PSWD":{"block":{...}}}` | `Blinker.begin(auth,ssid,pswd);` + 自动添加loop`Blinker.run();` |
| `blinker_init_ble` | 语句块 | 无 | `{}` | `Blinker.begin();` + 自动添加loop`Blinker.run();` |
| `blinker_debug_init` | 语句块 | SERIAL(field_dropdown), SPEED(field_dropdown), DEBUG_ALL(field_dropdown) | `"fields":{"SERIAL":"Serial","SPEED":"115200","DEBUG_ALL":"true"}` | `BLINKER_DEBUG.begin(Serial,115200);` |
| `blinker_button` | Hat块 | KEY(field_input), NAME(input_statement) | `"fields":{"KEY":"btn-abc"},"inputs":{"NAME":{"block":{...}}}` | `BlinkerButton button(key);` |
| `blinker_button_state` | 值块 | STATE(field_dropdown) | `"fields":{"STATE":"tap"}` | `button.state()` |
| `blinker_slider` | Hat块 | KEY(field_input), NAME(input_statement) | `"fields":{"KEY":"ran-abc"},"inputs":{"NAME":{"block":{...}}}` | `BlinkerSlider slider(key);` |
| `blinker_slider_value` | 值块 | 无 | `{}` | `slider.getValue()` |
| `blinker_colorpicker` | Hat块 | KEY(field_input), NAME(input_statement) | `"fields":{"KEY":"col-abc"},"inputs":{"NAME":{"block":{...}}}` | `BlinkerColorPicker colorPicker(key);` |
| `blinker_colorpicker_value` | 值块 | KEY(field_dropdown) | `"fields":{"KEY":"r_value"}` | `colorPicker.r_value()` |
| `blinker_joystick` | Hat块 | KEY(field_input), NAME(input_statement) | `"fields":{"KEY":"joy-abc"},"inputs":{"NAME":{"block":{...}}}` | `BlinkerJoystick joystick(key);` |
| `blinker_joystick_value` | 值块 | KEY(field_dropdown) | `"fields":{"KEY":"x_value"}` | `joystick.x()` |
| `blinker_text` | 语句块 | KEY(field_input), VALUE(input_value) | `"fields":{"KEY":"tex-abc"},"inputs":{"VALUE":{"block":{...}}}` | `BlinkerText1.print(value);` |
| `blinker_value` | 语句块 | KEY(field_input), VALUE(input_value) | `"fields":{"KEY":"num-abc"},"inputs":{"VALUE":{"block":{...}}}` | `BlinkerNumber1.print(value);` |
| `blinker_icon` | 语句块 | KEY(field_input), ICON_NAME(field_input) | `"fields":{"KEY":"ico-abc","ICON_NAME":"icon_1"}` | `BlinkerIcon1.icon(icon_name);` |
| `blinker_color` | 语句块 | KEY(field_input), COLOR(field_input) | `"fields":{"KEY":"ico-abc","COLOR":"#FFFFFF"}` | `BlinkerIcon1.color(color);` |
| `blinker_chart` | Hat块 | KEY(field_input), NAME(input_statement) | `"fields":{"KEY":"chart-abc"},"inputs":{"NAME":{"block":{...}}}` | `BlinkerChart chart(key);` + callback |
| `blinker_chart_data_upload` | 语句块 | CHART(field_input), KEY(field_input), VALUE(input_value) | `"fields":{"CHART":"chart-abc","KEY":"data-"},"inputs":{"VALUE":{"block":{...}}}` | `Blinker_chart.upload(key,value);` |
| `blinker_print` | 语句块 | DATA(input_value) | `"inputs":{"DATA":{"block":{...}}}` | `Blinker.print(data);` |
| `blinker_delay` | 语句块 | TIME(input_value) | `"inputs":{"TIME":{"block":{...}}}` | `Blinker.delay(time);` |
| `blinker_vibrate` | 语句块 | TIME(input_value) | `"inputs":{"TIME":{"block":{...}}}` | `Blinker.vibrate(time);` |
| `blinker_log` | 语句块 | MESSAGE(input_value) | `"inputs":{"MESSAGE":{"block":{...}}}` | `BLINKER_LOG(message);` |
| `blinker_reset` | 语句块 | 无 | `{}` | `Blinker.reset();` |
| `blinker_widget_print` | 语句块 | WIDGET(field_input), INPUT0(input_value), INPUT1(input_value), extraState | `"fields":{"WIDGET":"num-abc"},"extraState":{"itemCount":2},"inputs":{"INPUT0":{"block":{...}},"INPUT1":{"block":{...}}}` | `Blinker_widget.method().print();` |
| `blinker_heartbeat` | Hat块 | NAME(input_statement) | `"inputs":{"NAME":{"block":{...}}}` | `heartbeat callback` |
| `blinker_data_handler` | Hat块 | NAME(input_statement) | `"inputs":{"NAME":{"block":{...}}}` | `dataRead callback` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"KEY": "btn-abc"` |
| field_dropdown | 字符串 | `"MODE": "手动配网"` |
| input_value | 块连接 | `"inputs": {"VALUE": {"block": {...}}}` |
| input_statement | 块连接 | `"inputs": {"NAME": {"block": {...}}}` |

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 有output，连接到`inputs`中，无`next`字段
- **Hat块**: 无连接属性，通过`inputs`连接内部语句，作为回调函数
- **特殊规则**: 
  - blinker_init_wifi根据MODE字段动态显示配置输入
  - 组件键名必须符合Blinker命名规范（如btn-、ran-、col-、chart-等前缀）
  - Hat块会自动生成对应的回调函数和组件对象
  - blinker_chart定义图表组件回调，在回调中使用blinker_chart_data_upload上传数据
  - 初始化块会自动添加`Blinker.run()`到loop中，无需手动调用
  - WiFi初始化在ESP32平台支持单参数模式（仅需密钥）
  - blinker_widget_print支持mutator动态添加输入，通过extraState.itemCount设置输入数量，自动创建未注册的组件

## 使用示例

### WiFi模式初始化
```json
{
  "type": "blinker_init_wifi",
  "id": "wifi_init",
  "fields": {"MODE": "手动配网"},
  "inputs": {
    "AUTH": {"block": {"type": "text", "fields": {"TEXT": "your_auth_key"}}},
    "SSID": {"block": {"type": "text", "fields": {"TEXT": "your_wifi_name"}}},
    "PSWD": {"block": {"type": "text", "fields": {"TEXT": "your_wifi_password"}}}
  }
}
```

### 按钮控制LED
```json
{
  "type": "blinker_button",
  "id": "button_control",
  "fields": {"KEY": "btn-led"},
  "inputs": {
    "NAME": {
      "block": {
        "type": "controls_if",
        "inputs": {
          "IF0": {"block": {"type": "blinker_button_state", "fields": {"STATE": "tap"}}},
          "DO0": {
            "block": {
              "type": "arduino_digitalWrite",
              "fields": {"PIN": "LED_BUILTIN", "STATE": "HIGH"}
            }
          }
        }
      }
    }
  }
}
```

### 图表数据上传
```json
{
  "type": "blinker_chart",
  "id": "chart_data",
  "fields": {"KEY": "chart-temp"},
  "inputs": {
    "NAME": {
      "block": {
        "type": "blinker_chart_data_upload",
        "fields": {"CHART": "chart-temp", "KEY": "data-temp"},
        "inputs": {
          "VALUE": {
            "block": {
              "type": "dht_read_temperature",
              "fields": {"VAR": {"id": "dht_var", "name": "dht", "type": "DHT"}}
            }
          }
        }
      }
    }
  }
}
```

## 重要规则

1. **必须遵守**: 组件键名必须唯一，遵循Blinker命名规范（btn-按钮、ran-滑块、col-调色板、chart-图表等）
2. **连接限制**: 初始化块必须在setup中调用，会自动添加Blinker.run()到loop
3. **图表使用**: blinker_chart定义图表回调，在回调内使用blinker_chart_data_upload上传数据，CHART字段需与图表KEY匹配
4. **动态输入**: blinker_widget_print使用extraState.itemCount控制输入数量，支持链式调用
5. **常见错误**: ❌ 重复使用相同键名，❌ 在WiFi未连接前调用数据上传，❌ 手动添加Blinker.run()造成重复，❌ blinker_chart_data_upload的CHART字段与图表KEY不匹配

## 支持的字段选项
- **MODE(配网模式)**: "手动配网", "EspTouchV2"
- **STATE(按钮状态)**: "tap", "press", "release"
- **KEY(颜色分量)**: "r_value", "g_value", "b_value", "bright_value"
- **KEY(摇杆坐标)**: "x_value", "y_value"
- **SERIAL(串口)**: 动态生成，常见值："Serial", "Serial1"
- **SPEED(波特率)**: 动态生成，常见值："9600", "115200"
- **DEBUG_ALL(完整调试)**: "true", "false"