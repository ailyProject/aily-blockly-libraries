# Adafruit MQTT通信库

基于 Adafruit MQTT Library 的 Blockly 封装，用于在 WiFi 开发板上连接 MQTT 服务器，发布文本、数字或原始字节数据，并订阅主题消息。

## 库信息

| 字段 | 值 |
|------|----|
| Package | @aily-project/lib-adafruit-mqtt |
| Version | 2.6.4 |
| Author | Adafruit |
| Source | https://github.com/adafruit/Adafruit_MQTT_Library |
| License | MIT |

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|-----------|----------|----------|
| `adafruit_mqtt_create` | 语句 | VAR, SERVER, PORT, USERNAME, PASSWORD, CLIENT_ID | `adafruit_mqtt_create("mqtt", "io.adafruit.com", 1883, "user", "key", "")` | `Adafruit_MQTT_Client mqtt(...)` |
| `adafruit_mqtt_connect` | 语句 | VAR, RETRIES, DELAY | `adafruit_mqtt_connect($mqtt, math_number(3), math_number(5000))` | `mqtt.connect()` |
| `adafruit_mqtt_create_publisher` | 语句 | VAR, MQTT, TOPIC, QOS | `adafruit_mqtt_create_publisher("pub", $mqtt, "topic", 0)` | `Adafruit_MQTT_Publish pub(...)` |
| `adafruit_mqtt_publish_text` | 语句 | VAR, PAYLOAD, RETAIN | `adafruit_mqtt_publish_text($pub, text("hello"), false)` | `pub.publish(...)` |
| `adafruit_mqtt_publish_bytes` | 语句 | VAR, BUFFER, LENGTH, RETAIN | `adafruit_mqtt_publish_bytes($pub, text("payload"), math_number(7), false)` | `pub.publish((uint8_t*)...)` |
| `adafruit_mqtt_create_subscriber` | 语句 | VAR, MQTT, TOPIC, QOS | `adafruit_mqtt_create_subscriber("sub", $mqtt, "topic", 0)` | `Adafruit_MQTT_Subscribe sub(...)` |
| `adafruit_mqtt_read_subscription` | 语句 | MQTT, VAR, TIMEOUT, HANDLER | `adafruit_mqtt_read_subscription($mqtt, $sub, math_number(1000))` | `mqtt.readSubscription(...)` |

## 字段类型映射

初始化块使用 `field_input` 创建变量；后续操作块使用 `field_variable` 选择 `Adafruit_MQTT_Client`、`Adafruit_MQTT_Publish` 或 `Adafruit_MQTT_Subscribe` 变量。文本、主题、超时和数值 payload 使用 `input_value`。

## 连接规则

先连接 WiFi，再创建 MQTT 客户端和订阅器；订阅器需在连接 MQTT 前注册。发布器绑定固定主题，直接发布块可临时指定主题。

## 使用示例

在 `setup` 中创建客户端、发布器和订阅器；在 `loop` 中调用连接块并发布数据，或用读取订阅/回调块处理收到的消息。

## 重要规则

使用前必须确保 WiFi 已连接。`adafruit_mqtt_publish_bytes` 适合 `uint8_t*` 缓冲区和结构体原始数据，长度需与缓冲区实际字节数一致。