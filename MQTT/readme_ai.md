# MQTT通信

基于PubSubClient的MQTT支持库，适用于Arduino UNO R4 WiFi、ESP32等开发板

## Library Info
- **Name**: @aily-project/lib-mqtt
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `pubsub_create` | Statement | VAR(field_input), CLIENT(field_input), SSL(dropdown), SERVER(input_value), PORT(input_value) | `pubsub_create("mqttClient", "client", FALSE, math_number(0), math_number(0))` | (dynamic code) |
| `pubsub_set_callback` | Statement | VAR(field_variable) | `pubsub_set_callback(variables_get($mqttClient))` | `` |
| `pubsub_set_callback_with_topic` | Statement | TOPIC(input_value) | `pubsub_set_callback_with_topic(math_number(0))` | (dynamic code) |
| `pubsub_get_topic_callback_payload` | Value | (none) | `pubsub_get_topic_callback_payload()` | `payload_str` |
| `pubsub_connect` | Value | VAR(field_variable), CLIENT_ID(input_value) | `pubsub_connect(variables_get($mqttClient), math_number(0))` | (dynamic code) |
| `pubsub_connect_auth` | Value | VAR(field_variable), CLIENT_ID(input_value), USERNAME(input_value), PASSWORD(input_value) | `pubsub_connect_auth(variables_get($mqttClient), math_number(0), math_number(0), math_number(0))` | (dynamic code) |
| `pubsub_publish` | Statement | VAR(field_variable), TOPIC(input_value), PAYLOAD(input_value) | `pubsub_publish(variables_get($mqttClient), math_number(0), math_number(0))` | (dynamic code) |
| `pubsub_subscribe` | Statement | VAR(field_variable), TOPIC(input_value) | `pubsub_subscribe(variables_get($mqttClient), math_number(0))` | (dynamic code) |
| `pubsub_unsubscribe` | Statement | VAR(field_variable), TOPIC(input_value) | `pubsub_unsubscribe(variables_get($mqttClient), math_number(0))` | (dynamic code) |
| `pubsub_loop` | Statement | VAR(field_variable) | `pubsub_loop(variables_get($mqttClient))` | (dynamic code) |
| `pubsub_connected` | Value | VAR(field_variable) | `pubsub_connected(variables_get($mqttClient))` | (dynamic code) |
| `pubsub_state` | Value | VAR(field_variable) | `pubsub_state(variables_get($mqttClient))` | (dynamic code) |
| `pubsub_state_code` | Value | STATE(dropdown) | `pubsub_state_code(MQTT_CONNECTED)` | (dynamic code) |
| `pubsub_disconnect` | Statement | VAR(field_variable) | `pubsub_disconnect(variables_get($mqttClient))` | (dynamic code) |
| `pubsub_setBufferSize` | Statement | VAR(field_variable), SIZE(input_value) | `pubsub_setBufferSize(variables_get($mqttClient), math_number(0))` | (dynamic code) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| SSL | FALSE, TRUE | 否 / 是 |
| STATE | MQTT_CONNECTED, MQTT_CONNECT_FAILED, MQTT_DISCONNECTED, MQTT_CONNECTION_LOST, MQTT_CONNECTION_TIMEOUT, MQTT_CONNECT_BAD_PROTOCOL, MQTT_CONNECT_BAD_CLIENT_ID, MQTT_CONNECT_UNAVAILABLE, MQTT_CONNECT_BAD_CREDENTIALS, MQTT_CONNECT_UNAUTHORIZED | 成功连接 / 连接失败 / 断开连接 / 连接丢失 / 连接超时 / 协议错误 / 客户端ID错误 / 服务不可用 / 凭证错误 / 未授权 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    pubsub_create("mqttClient", "client", FALSE, math_number(0), math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, pubsub_get_topic_callback_payload())
    time_delay(math_number(1000))
```

## Notes

1. **Variable Creation**: `pubsub_create("varName", ...)` creates variable `$varName`; reference with `variables_get($varName)`
2. **Initialization**: Place init blocks inside `arduino_setup()`
3. **Parameter Order**: Follows `block.json` args0 order
