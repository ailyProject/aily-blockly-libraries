# MQTT communication

MQTT support library based on PubSubClient, suitable for Arduino UNO R4 WiFi, ESP32 and other development boards

## Library Info
- **Name**: @aily-project/lib-pubsubclient
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `pubsub_create` | Statement | VAR(field_input), CLIENT(field_input), SSL(dropdown), SERVER(input_value), PORT(input_value) | `pubsub_create("mqttClient", "client", FALSE, text("value"), math_number(0))` | Dynamic code |
| `pubsub_set_callback` | Hat | VAR(field_variable), HANDLER(input_statement) | `pubsub_set_callback(variables_get($mqttClient)) @HANDLER: child_block()` | Dynamic code |
| `pubsub_set_callback_with_topic` | Statement | TOPIC(input_value), HANDLER(input_statement) | `pubsub_set_callback_with_topic(text("value")) @HANDLER: child_block()` | Dynamic code |
| `pubsub_get_topic_callback_payload` | Value | (none) | `pubsub_get_topic_callback_payload()` | payload_str |
| `pubsub_connect` | Value | VAR(field_variable), CLIENT_ID(input_value) | `pubsub_connect(variables_get($mqttClient), text("value"))` | Dynamic code |
| `pubsub_connect_auth` | Value | VAR(field_variable), CLIENT_ID(input_value), USERNAME(input_value), PASSWORD(input_value) | `pubsub_connect_auth(variables_get($mqttClient), text("value"), text("value"), text("value"))` | Dynamic code |
| `pubsub_publish` | Statement | VAR(field_variable), TOPIC(input_value), PAYLOAD(input_value) | `pubsub_publish(variables_get($mqttClient), text("value"), text("value"))` | Dynamic code |
| `pubsub_subscribe` | Statement | VAR(field_variable), TOPIC(input_value) | `pubsub_subscribe(variables_get($mqttClient), text("value"))` | Dynamic code |
| `pubsub_unsubscribe` | Statement | VAR(field_variable), TOPIC(input_value) | `pubsub_unsubscribe(variables_get($mqttClient), text("value"))` | Dynamic code |
| `pubsub_loop` | Statement | VAR(field_variable) | `pubsub_loop(variables_get($mqttClient))` | Dynamic code |
| `pubsub_connected` | Value | VAR(field_variable) | `pubsub_connected(variables_get($mqttClient))` | Dynamic code |
| `pubsub_state` | Value | VAR(field_variable) | `pubsub_state(variables_get($mqttClient))` | Dynamic code |
| `pubsub_state_code` | Value | STATE(dropdown) | `pubsub_state_code(MQTT_CONNECTED)` | Dynamic code |
| `pubsub_disconnect` | Statement | VAR(field_variable) | `pubsub_disconnect(variables_get($mqttClient))` | Dynamic code |
| `pubsub_setBufferSize` | Statement | VAR(field_variable), SIZE(input_value) | `pubsub_setBufferSize(variables_get($mqttClient), math_number(0))` | Dynamic code |

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

1. **Variable**: `pubsub_create("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
