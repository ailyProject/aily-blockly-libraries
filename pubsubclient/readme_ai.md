# MQTT通信

基于 PubSubClient 的 MQTT 发布/订阅支持库，适用于 ESP32 系列与 Arduino UNO R4 WiFi。

## Library Info
- **Name**: @aily-project/lib-pubsubclient
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `pubsub_create` | Statement | VAR(field_input), CLIENT(field_input), SSL(dropdown), SERVER(input_value), PORT(input_value) | `pubsub_create("mqttClient", "client", FALSE, text("mqtt.example.com"), math_number(1883))` | Declares network client and `PubSubClient`, calls `setServer`, auto-adds `.loop()` |
| `pubsub_set_callback` | Hat | VAR(field_variable), HANDLER(input_statement) | `pubsub_set_callback($mqttClient) @HANDLER: ...` | Generates MQTT callback, creates `String payload_str`, calls `setCallback` in setup |
| `pubsub_set_callback_with_topic` | Statement | TOPIC(input_value), HANDLER(input_statement) | `pubsub_set_callback_with_topic(text("inTopic")) @HANDLER: ...` | `if (strcmp(topic, ...) == 0) { callback(payload_str); }` |
| `pubsub_get_topic_callback_payload` | Value | (none) | `pubsub_get_topic_callback_payload()` | `payload_str` |
| `pubsub_connect` | Value | VAR(field_variable), CLIENT_ID(input_value) | `pubsub_connect($mqttClient, text("arduinoClient"))` | `mqttClient.connect(clientId)` |
| `pubsub_connect_auth` | Value | VAR(field_variable), CLIENT_ID(input_value), USERNAME(input_value), PASSWORD(input_value) | `pubsub_connect_auth($mqttClient, text("arduinoClient"), text("user"), text("pass"))` | `mqttClient.connect(clientId, username, password)` |
| `pubsub_publish` | Statement | VAR(field_variable), TOPIC(input_value), PAYLOAD(input_value) | `pubsub_publish($mqttClient, text("outTopic"), text("hello world"))` | `mqttClient.publish(topic, payload);` |
| `pubsub_subscribe` | Statement | VAR(field_variable), TOPIC(input_value) | `pubsub_subscribe($mqttClient, text("inTopic"))` | `mqttClient.subscribe(topic);` |
| `pubsub_unsubscribe` | Statement | VAR(field_variable), TOPIC(input_value) | `pubsub_unsubscribe($mqttClient, text("inTopic"))` | `mqttClient.unsubscribe(topic);` |
| `pubsub_loop` | Statement | VAR(field_variable) | `pubsub_loop($mqttClient)` | `mqttClient.loop();` |
| `pubsub_connected` | Value | VAR(field_variable) | `pubsub_connected($mqttClient)` | `mqttClient.connected()` |
| `pubsub_state` | Value | VAR(field_variable) | `pubsub_state($mqttClient)` | `mqttClient.state()` |
| `pubsub_state_code` | Value | STATE(dropdown) | `pubsub_state_code(MQTT_CONNECTED)` | MQTT state constant |
| `pubsub_disconnect` | Statement | VAR(field_variable) | `pubsub_disconnect($mqttClient)` | `mqttClient.disconnect();` |
| `pubsub_setBufferSize` | Statement | VAR(field_variable), SIZE(input_value) | `pubsub_setBufferSize($mqttClient, math_number(512))` | `mqttClient.setBufferSize(size);` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| SSL | FALSE, TRUE | FALSE uses `WiFiClient`; TRUE uses ESP32 `WiFiClientSecure` or UNO R4 `WiFiSSLClient` |
| STATE | MQTT_CONNECTED, MQTT_CONNECT_FAILED, MQTT_DISCONNECTED, MQTT_CONNECTION_LOST, MQTT_CONNECTION_TIMEOUT, MQTT_CONNECT_BAD_PROTOCOL, MQTT_CONNECT_BAD_CLIENT_ID, MQTT_CONNECT_UNAVAILABLE, MQTT_CONNECT_BAD_CREDENTIALS, MQTT_CONNECT_UNAUTHORIZED | 0 已连接；-1~-4 为断开/失败/丢失/超时；1~5 为协议、ID、服务、凭证、授权错误 |

## ABS Examples

### Basic Publish And Subscribe
```
arduino_setup()
    pubsub_create("mqttClient", "client", FALSE, text("broker.emqx.io"), math_number(1883))
    pubsub_set_callback($mqttClient)
        @HANDLER:
            pubsub_set_callback_with_topic(text("inTopic"))
                @HANDLER:
                    pubsub_publish($mqttClient, text("outTopic"), pubsub_get_topic_callback_payload())
    controls_if()
        @IF0: pubsub_connect($mqttClient, text("arduinoClient"))
        @DO0:
            pubsub_subscribe($mqttClient, text("inTopic"))
            pubsub_publish($mqttClient, text("outTopic"), text("hello world"))
```

## Notes

1. **Variable Creation**: `pubsub_create("mqttClient", ...)` creates `$mqttClient` of type `PubSubClient`.
2. **Network First**: Connect WiFi before MQTT connect; this library only creates the MQTT client.
3. **Loop Handling**: `pubsub_create` auto-adds `mqttClient.loop()`; `pubsub_loop` is only for explicit calls.
4. **Callback Scope**: Payload and topic-handler blocks rely on callback variables `topic` and `payload_str`.
5. **Buffer Size**: PubSubClient defaults to 256 bytes per MQTT packet; set a positive larger size when needed.
6. **MQTT Limits**: Upstream publish is QoS 0; these blocks expose the default subscribe call.
7. **Parameter Order**: ABS arguments follow `block.json` order exactly.