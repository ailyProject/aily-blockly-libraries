
# PubSubClient

轻量的 MQTT 客户端封装，支持发布/订阅与回调处理，兼容 Arduino、ESP32、ESP8266 等平台。

## 库信息
- **库名**: @aily-project/lib-pubsubclient
- **版本**: 1.0.0
- **兼容**: Arduino / ESP32 / ESP8266（常见网络适配：WiFiClient / EthernetClient）

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `pubsub_create` | 语句块 | VAR(field_input), CLIENT(field_input), SSL(field_dropdown), SERVER(input_value), PORT(input_value) | `"fields":{"VAR":"mqttClient","CLIENT":"client","SSL":"FALSE"}, "inputs":{"SERVER":{"block":...},"PORT":{"block":...}}` | 声明底层 client（如 `WiFiClient` / `WiFiClientSecure`），声明 `PubSubClient mqttClient(client);` 并调用 `setServer` |
| `pubsub_set_callback` | 事件/回调 | VAR(field_variable), HANDLER(input_statement) | `"fields":{"VAR":{...}}, "inputs":{"HANDLER":{...}}` | 在生成器中创建 `void mqtt_callback_xxx(...)` 并在 setup 中调用 `mqttClient.setCallback(...)` |
| `pubsub_set_callback_with_topic` | 语句块 | TOPIC(input_value), HANDLER(input_statement) | `"inputs":{"TOPIC":{...},"HANDLER":{...}}` | 生成按主题分发的回调检查代码（在全局回调内判断 topic） |
| `pubsub_connect` | 值块 | VAR(field_variable), CLIENT_ID(input_value) | `"inputs":{"CLIENT_ID":{...}}` | `mqttClient.connect(clientId)` (返回 Boolean) |
| `pubsub_connect_auth` | 值块 | VAR(field_variable), CLIENT_ID(input_value), USERNAME(input_value), PASSWORD(input_value) | `"inputs":{...}` | `mqttClient.connect(id, user, pass)` (返回 Boolean) |
| `pubsub_publish` | 语句块 | VAR(field_variable), TOPIC(input_value), PAYLOAD(input_value) | `"inputs":{...}` | `mqttClient.publish(topic, payload);` |
| `pubsub_subscribe` | 语句块 | VAR(field_variable), TOPIC(input_value) | `"inputs":{"TOPIC":{...}}` | `mqttClient.subscribe(topic);` |
| `pubsub_unsubscribe` | 语句块 | VAR(field_variable), TOPIC(input_value) | `"inputs":{"TOPIC":{...}}` | `mqttClient.unsubscribe(topic);` |
| `pubsub_loop` | 语句块 | VAR(field_variable) | 无 | `mqttClient.loop();` (通常在 loop 中调用，生成器会自动把 `.loop()` 加到 loop 尾部)
| `pubsub_connected` | 值块 | VAR(field_variable) | 无 | `mqttClient.connected()` (返回 Boolean) |
| `pubsub_state` | 值块 | VAR(field_variable) | 无 | `mqttClient.state()` (返回 Number) |
| `pubsub_state_code` | 值块 | STATE(field_dropdown) | `"fields":{"STATE":"MQTT_CONNECTED"}` | 常量映射（如 `MQTT_CONNECTED` / `MQTT_CONNECT_FAILED` 等） |
| `pubsub_disconnect` | 语句块 | VAR(field_variable) | 无 | `mqttClient.disconnect();` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_variable | 对象（变量引用） | `"VAR": {"id":"mqtt_id","name":"mqttClient","type":"MQTTClient"}`
| field_input | 字符串 | `"VAR": "mqttClient"` 或 `"CLIENT": "client"`
| field_dropdown | 字符串 | `"SSL": "FALSE"` 或 `"STATE": "MQTT_CONNECTED"`
| input_value | 块连接（单值） | `"inputs": {"SERVER": {"block": {...}}}`
| input_statement | 块连接（语句序列） | `"inputs": {"HANDLER": {"block": {...}}}`

## 连接规则

- **语句块**: 拥有 `previousStatement`/`nextStatement`，通过 `next` 字段连接（例如 `pubsub_create`、`pubsub_publish`、`pubsub_subscribe` 等）。
- **值块**: 有 `output`，作为表达式插入 `inputs`（例如 `pubsub_connect` / `pubsub_state` 返回值）。
- **事件/回调块**: 如 `pubsub_set_callback` / `pubsub_set_callback_with_topic`，通过 `HANDLER` 接受语句块作为回调体，不参与主流程的 `next` 串联。
- **变量管理**: 创建客户端后，后续块应引用创建的客户端变量（若使用文本名，请与生成器生成的变量名一致）。

## 使用示例

### 创建客户端（含服务器与端口）
```json
{
  "type": "pubsub_create",
  "id": "create1",
  "fields": {"VAR": "mqttClient", "CLIENT": "client", "SSL": "FALSE"},
  "inputs": {
    "SERVER": {"block": {"type": "text", "fields": {"TEXT": "mqtt.example.com"}}},
    "PORT": {"block": {"type": "math_number", "fields": {"NUM": "1883"}}}
  }
}
```

### 连接并订阅
```json
{
  "type": "pubsub_connect",
  "id": "connect1",
  "fields": {"VAR": {"id":"mqtt_var"}},
  "inputs": {
    "CLIENT_ID": {"block": {"type": "text", "fields": {"TEXT": "arduinoClient"}}}
  }
}
```

### 设置回调（按客户端）
```json
{
  "type": "pubsub_set_callback",
  "id": "cb1",
  "fields": {"VAR": {"id":"mqtt_var"}},
  "inputs": {
    "HANDLER": {"block": {"type": "controls_if", "inputs": { /* callback body */ }}}
  }
}
```

### 按主题设置回调
```json
{
  "type": "pubsub_set_callback_with_topic",
  "id": "cb_topic",
  "inputs": {
    "TOPIC": {"block": {"type": "text", "fields": {"TEXT": "sensor/+/temp"}}},
    "HANDLER": {"block": {"type": "controls_if", "inputs": { /* callback body */ }}}
  }
}
```

## 重要规则

1. **创建顺序**: 先创建客户端实例（`pubsub_create`），再进行连接/订阅/发布等操作。
2. **回调注意**: 回调体内避免执行阻塞或耗时操作，生成器会为回调做 payload -> C 字符串 的转换并释放内存。
3. **loop 调用**: 生成器会把 `mqttClient.loop()` 加入 loop 末尾，但在自定义场景中也可显式使用 `pubsub_loop`。
4. **错误与状态处理**: 使用 `pubsub_connected` / `pubsub_state` 检查并实现重连逻辑。

## 支持的连接状态码

- -4: 连接超时
- -3: 连接丢失
- -2: 连接失败
- -1: 已断开连接
- 0: 已连接
- 1-5: 各种连接错误（库底层返回值，参考 PubSubClient 文档）

## 支持的字段选项（摘要）

- **VAR (pubsub_create)**: 文本输入（当前实现）或变量（建议改为变量选择）
- **CLIENT**: 文本（客户端变量名），生成器会声明相应的 `WiFiClient` / `WiFiClientSecure` 等实例
- **SSL**: 下拉 (`FALSE` / `TRUE`)
- **SERVER**: 文本输入或字符串块
- **PORT**: 数值块
