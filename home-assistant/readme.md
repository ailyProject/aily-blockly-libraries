# Home Assistant MQTT

基于 ArduinoHA 的 Home Assistant MQTT 发现与控制 Blockly 封装。

## 库信息

| 字段 | 值 |
|------|----|
| Package | @aily-project/lib-home-assistant |
| Version | 2.1.0 |
| Author | Dawid Chyrzynski |
| Source | https://github.com/dawidchyrzynski/arduino-home-assistant |
| License | MIT |

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|-----------|----------|----------|
| `ha_device_create` | 语句 | VAR, UNIQUE_ID | `ha_device_create("device", "esp32Node")` | `HADevice device(...)` |
| `ha_mqtt_create` | 语句 | VAR, CLIENT, NETWORK, DEVICE, MAX_DEVICES | `ha_mqtt_create("mqtt", "client", WIFI, $device, 24)` | `HAMqtt mqtt(...)` |
| `ha_mqtt_begin` | 语句 | VAR, HOST, PORT, USERNAME, PASSWORD | `ha_mqtt_begin($mqtt, text("host"), math_number(1883), text(""), text(""))` | `mqtt.begin(...)` |
| `ha_sensor_create_number` | 语句 | VAR, UNIQUE_ID, PRECISION, FEATURES | `ha_sensor_create_number("temp", "temperature", HASensorNumber::PrecisionP1, HASensor::DefaultFeatures)` | `HASensorNumber temp(...)` |
| `ha_switch_create` | 语句 | VAR, UNIQUE_ID | `ha_switch_create("led", "led")` | `HASwitch led(...)` |
| `ha_switch_on_command` | Hat | VAR, HANDLER | `ha_switch_on_command($led)` | `led.onCommand(...)` |
| `ha_light_create` | 语句 | VAR, UNIQUE_ID, FEATURES | `ha_light_create("light", "light", HALight::BrightnessFeature)` | `HALight light(...)` |
| `ha_number_create` | 语句 | VAR, UNIQUE_ID, PRECISION | `ha_number_create("number", "number", HANumber::PrecisionP0)` | `HANumber number(...)` |
| `ha_select_create` | 语句 | VAR, UNIQUE_ID | `ha_select_create("select", "select")` | `HASelect select(...)` |

## 字段类型映射

创建块使用 `field_input` 创建 Blockly 变量；后续操作块使用 `field_variable` 选择对应类型。动态文本、数值和布尔值使用 `input_value`，实体名称、图标、类别和选项使用稳定的文本字段生成 C++ 字符串字面量。

## 连接规则

先创建 `HADevice`，再创建 `HAMqtt`，最后创建传感器、开关、灯、数字、选择等实体。创建 `HAMqtt` 后会自动把 `mqtt.loop()` 加入主循环；联网操作需由 WiFi 或 Ethernet 库先完成。

## 使用示例

在 `setup` 中创建设备、MQTT 和实体，设置实体名称后调用 `ha_mqtt_begin`。开关、灯、按钮、数字和选择命令通过对应 Hat 块处理，并用命令值块读取目标状态或数值。

## 重要规则

ArduinoHA 实体会在全局构造时注册到当前 `HAMqtt::instance()`，因此实体创建块必须排在 `ha_mqtt_create` 之后。若使用自定义 MQTT 主题，建议在连接成功回调中重新订阅。