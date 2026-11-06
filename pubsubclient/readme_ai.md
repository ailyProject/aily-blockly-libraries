# MQTT communication

MQTT support library based on PubSubClient, suitable for Arduino UNO R4 WiFi, ESP32 and other development boards

## Library Info
- **Name**: @aily-project/lib-pubsubclient
- **Version**: 1.0.1

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `pubsub_create` | Statement | VAR(field_input), CLIENT(field_input), SSL(dropdown), SERVER(input_value), PORT(input_value) | `pubsub_create("mqttClient", "client", FALSE, text("value"), math_number(0))` | `mqttClient.setServer("value", 1);` |
| `pubsub_set_callback` | Hat | VAR(field_variable), HANDLER(input_statement) | `pubsub_set_callback($mqttClient)` | `void mqtt_callback_mqttClient(char* topic, byte* payload, unsigned int length) { ↵ String payload_str(payload, length); ↵ } ↵ mqttClient.setCallback(mqtt_callback_mqttClient);` |
| `pubsub_set_callback_with_topic` | Statement | TOPIC(input_value), HANDLER(input_statement) | `pubsub_set_callback_with_topic(text("value"))` | `if (strcmp(topic, "value") == 0) { ↵ mqtt_sub__value__callback(payload_str); ↵ }` |
| `pubsub_get_topic_callback_payload` | Value | (none) | `pubsub_get_topic_callback_payload()` | `payload_str` |
| `pubsub_connect` | Value | VAR(field_variable), CLIENT_ID(input_value) | `pubsub_connect($mqttClient, text("value"))` | `mqttClient.connect("value")` |
| `pubsub_connect_auth` | Value | VAR(field_variable), CLIENT_ID(input_value), USERNAME(input_value), PASSWORD(input_value) | `pubsub_connect_auth($mqttClient, text("value"), text("value"), text("value"))` | `mqttClient.connect("value", "value", "value")` |
| `pubsub_publish` | Statement | VAR(field_variable), TOPIC(input_value), PAYLOAD(input_value) | `pubsub_publish($mqttClient, text("value"), text("value"))` | `mqttClient.publish(aily_mqtt_cstr("value"), aily_mqtt_cstr("value"));` |
| `pubsub_subscribe` | Statement | VAR(field_variable), TOPIC(input_value) | `pubsub_subscribe($mqttClient, text("value"))` | `mqttClient.subscribe("value");` |
| `pubsub_unsubscribe` | Statement | VAR(field_variable), TOPIC(input_value) | `pubsub_unsubscribe($mqttClient, text("value"))` | `mqttClient.unsubscribe("value");` |
| `pubsub_loop` | Statement | VAR(field_variable) | `pubsub_loop($mqttClient)` | `mqttClient.loop();` |
| `pubsub_connected` | Value | VAR(field_variable) | `pubsub_connected($mqttClient)` | `mqttClient.connected()` |
| `pubsub_state` | Value | VAR(field_variable) | `pubsub_state($mqttClient)` | `mqttClient.state()` |
| `pubsub_state_code` | Value | STATE(dropdown) | `pubsub_state_code(MQTT_CONNECTED)` | `MQTT_CONNECTED` |
| `pubsub_disconnect` | Statement | VAR(field_variable) | `pubsub_disconnect($mqttClient)` | `mqttClient.disconnect();` |
| `pubsub_setBufferSize` | Statement | VAR(field_variable), SIZE(input_value) | `pubsub_setBufferSize($mqttClient, math_number(0))` | `mqttClient.setBufferSize(1);` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| SSL | FALSE, TRUE | pubsub_create |
| STATE | MQTT_CONNECTED, MQTT_CONNECT_FAILED, MQTT_DISCONNECTED, MQTT_CONNECTION_LOST, MQTT_CONNECTION_TIMEOUT, MQTT_CONNECT_BAD_PROTOCOL, MQTT_CONNECT_BAD_CLIENT_ID, MQTT_CONNECT_UNAVAILABLE, MQTT_CONNECT_BAD_CREDENTIALS, MQT... | pubsub_state_code |

## ABS Examples

### Basic Usage
```
arduino_setup()
    pubsub_create("mqttClient", "client", FALSE, text("value"), math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, pubsub_get_topic_callback_payload())
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `pubsub_create("varName", ...)` creates variable `$varName`; pass `$varName` directly to `field_variable` slots; use `variables_get($varName)` only for `input_value` slots.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
4. **Publish text**: TOPIC and PAYLOAD accept literals, Arduino `String` variables and temporary String expressions. The generator adds `aily_mqtt_cstr` overloads once, so each expression is evaluated once during publish; no manual `c_str()` conversion is needed. This conversion is specific to publish, which consumes the text immediately.
