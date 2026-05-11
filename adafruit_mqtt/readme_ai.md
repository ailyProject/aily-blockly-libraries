# Adafruit MQTT

Blockly reference for connecting to MQTT brokers with the Adafruit MQTT Library.

## Library Info
- **Name**: @aily-project/lib-adafruit-mqtt
- **Version**: 2.6.4
- **Variable Types**: `Adafruit_MQTT_Client`, `Adafruit_MQTT_Publish`, `Adafruit_MQTT_Subscribe`

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `adafruit_mqtt_create` | Statement | VAR(field_input), SERVER(field_input), PORT(field_number), USERNAME(field_input), PASSWORD(field_input), CLIENT_ID(field_input) | `adafruit_mqtt_create("mqtt", "io.adafruit.com", 1883, "user", "key", "")` | `WiFiClient mqtt_wifiClient; Adafruit_MQTT_Client mqtt(...)` |
| `adafruit_mqtt_set_keep_alive` | Statement | VAR(field_variable), INTERVAL(input_value) | `adafruit_mqtt_set_keep_alive($mqtt, math_number(300))` | `mqtt.setKeepAliveInterval(300);` |
| `adafruit_mqtt_set_will` | Statement | VAR(field_variable), TOPIC(input_value), PAYLOAD(input_value), QOS(dropdown), RETAIN(dropdown) | `adafruit_mqtt_set_will($mqtt, text("device/status"), text("offline"), 0, false)` | `mqtt.will(topic, payload, qos, retain);` |
| `adafruit_mqtt_connect` | Statement | VAR(field_variable), RETRIES(input_value), DELAY(input_value) | `adafruit_mqtt_connect($mqtt, math_number(3), math_number(5000))` | `mqtt.connect();` |
| `adafruit_mqtt_disconnect` | Statement | VAR(field_variable) | `adafruit_mqtt_disconnect($mqtt)` | `mqtt.disconnect();` |
| `adafruit_mqtt_connected` | Value Boolean | VAR(field_variable) | `adafruit_mqtt_connected($mqtt)` | `mqtt.connected()` |
| `adafruit_mqtt_last_error_code` | Value Number | VAR(field_variable) | `adafruit_mqtt_last_error_code($mqtt)` | `_adafruit_mqtt_mqtt_last_error` |
| `adafruit_mqtt_last_error_text` | Value String | VAR(field_variable) | `adafruit_mqtt_last_error_text($mqtt)` | `String(mqtt.connectErrorString(code))` |
| `adafruit_mqtt_ping` | Value Boolean | VAR(field_variable), COUNT(input_value) | `adafruit_mqtt_ping($mqtt, math_number(1))` | `mqtt.ping(1)` |
| `adafruit_mqtt_create_publisher` | Statement | VAR(field_input), MQTT(field_variable), TOPIC(field_input), QOS(dropdown) | `adafruit_mqtt_create_publisher("pub", $mqtt, "device/data", 0)` | `Adafruit_MQTT_Publish pub(&mqtt, "device/data", 0);` |
| `adafruit_mqtt_publish_text` | Statement | VAR(field_variable), PAYLOAD(input_value), RETAIN(dropdown) | `adafruit_mqtt_publish_text($pub, text("hello"), false)` | `pub.publish(String(payload).c_str(), retain);` |
| `adafruit_mqtt_publish_number` | Statement | VAR(field_variable), VALUE(input_value), PRECISION(input_value), RETAIN(dropdown) | `adafruit_mqtt_publish_number($pub, math_number(23.5), math_number(2), false)` | `pub.publish((double)value, precision, retain);` |
| `adafruit_mqtt_publish_bytes` | Statement | VAR(field_variable), BUFFER(input_value), LENGTH(input_value), RETAIN(dropdown) | `adafruit_mqtt_publish_bytes($pub, variables_get($buffer), math_number(18), false)` | `pub.publish((uint8_t *)buffer, length, retain);` |
| `adafruit_mqtt_publish_topic` | Statement | VAR(field_variable), TOPIC(input_value), PAYLOAD(input_value), QOS(dropdown), RETAIN(dropdown) | `adafruit_mqtt_publish_topic($mqtt, text("device/data"), text("hello"), 0, false)` | `mqtt.publish(topic, payload, qos, retain);` |
| `adafruit_mqtt_create_subscriber` | Statement | VAR(field_input), MQTT(field_variable), TOPIC(field_input), QOS(dropdown) | `adafruit_mqtt_create_subscriber("sub", $mqtt, "device/cmd", 0)` | `Adafruit_MQTT_Subscribe sub(...); mqtt.subscribe(&sub);` |
| `adafruit_mqtt_subscribe` | Statement | MQTT(field_variable), VAR(field_variable) | `adafruit_mqtt_subscribe($mqtt, $sub)` | `mqtt.subscribe(&sub);` |
| `adafruit_mqtt_unsubscribe` | Statement | MQTT(field_variable), VAR(field_variable) | `adafruit_mqtt_unsubscribe($mqtt, $sub)` | `mqtt.unsubscribe(&sub);` |
| `adafruit_mqtt_read_subscription` | Statement | MQTT(field_variable), VAR(field_variable), TIMEOUT(input_value), HANDLER(input_statement) | `adafruit_mqtt_read_subscription($mqtt, $sub, math_number(1000)) @HANDLER: ...` | `while (mqtt.readSubscription(timeout)) { ... }` |
| `adafruit_mqtt_on_message` | Hat | MQTT(field_variable), VAR(field_variable), TIMEOUT(input_value), HANDLER(input_statement) | `adafruit_mqtt_on_message($mqtt, $sub, math_number(1000)) @HANDLER: ...` | `sub.setCallback(callback); mqtt.processPackets(timeout);` |
| `adafruit_mqtt_process_packets` | Statement | VAR(field_variable), TIMEOUT(input_value) | `adafruit_mqtt_process_packets($mqtt, math_number(1000))` | `mqtt.processPackets(timeout);` |
| `adafruit_mqtt_subscriber_payload` | Value String | VAR(field_variable) | `adafruit_mqtt_subscriber_payload($sub)` | `String((char *)sub.lastread)` |
| `adafruit_mqtt_subscriber_payload_length` | Value Number | VAR(field_variable) | `adafruit_mqtt_subscriber_payload_length($sub)` | `sub.datalen` |
| `adafruit_mqtt_subscriber_has_message` | Value Boolean | VAR(field_variable) | `adafruit_mqtt_subscriber_has_message($sub)` | `sub.new_message` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| QOS | `0`, `1` | MQTT quality of service level |
| RETAIN | `false`, `true` | Whether the broker retains the published message |

## ABS Examples

### Publish Sensor Value
```
arduino_setup()
    adafruit_mqtt_create("mqtt", "io.adafruit.com", 1883, "user", "aio_key", "")
    adafruit_mqtt_create_publisher("pub", $mqtt, "user/feeds/temp", 0)

arduino_loop()
    adafruit_mqtt_connect($mqtt, math_number(3), math_number(5000))
    adafruit_mqtt_publish_number($pub, math_number(23.5), math_number(2), false)
    time_delay(math_number(5000))
```

### Subscribe and Read Payload
```
arduino_setup()
    adafruit_mqtt_create("mqtt", "broker.local", 1883, "", "", "")
    adafruit_mqtt_create_subscriber("sub", $mqtt, "device/cmd", 0)

arduino_loop()
    adafruit_mqtt_connect($mqtt, math_number(3), math_number(5000))
    adafruit_mqtt_read_subscription($mqtt, $sub, math_number(1000))
        @HANDLER:
            serial_println(Serial, adafruit_mqtt_subscriber_payload($sub))
```

## Notes

1. Connect WiFi before using these blocks.
2. Create subscriber blocks should run before the MQTT connect block because Adafruit MQTT registers subscriptions during connect.
3. `adafruit_mqtt_create("mqtt", ...)` creates `$mqtt`; publisher and subscriber create blocks create their own typed variables.
4. Use `adafruit_mqtt_publish_bytes` for arbitrary packets such as packed structs or `uint8_t` buffers.