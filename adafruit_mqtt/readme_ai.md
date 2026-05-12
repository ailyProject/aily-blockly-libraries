# Adafruit MQTT communication library

Connect to MQTT brokers and publish or subscribe with the Adafruit MQTT library

## Library Info
- **Name**: @aily-project/lib-adafruit-mqtt
- **Version**: 2.6.4

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `adafruit_mqtt_create` | Statement | VAR(field_input), SERVER(field_input), PORT(field_number), USERNAME(field_input), PASSWORD(field_input), CLIENT_ID(field_input) | `adafruit_mqtt_create("mqtt", "io.adafruit.com", 1883, "username", "aio_key", "CLIENT_ID")` | Dynamic code |
| `adafruit_mqtt_set_keep_alive` | Statement | VAR(field_variable), INTERVAL(input_value) | `adafruit_mqtt_set_keep_alive(variables_get($mqtt), math_number(1000))` | Dynamic code |
| `adafruit_mqtt_set_will` | Statement | VAR(field_variable), TOPIC(input_value), PAYLOAD(input_value), QOS(dropdown), RETAIN(dropdown) | `adafruit_mqtt_set_will(variables_get($mqtt), text("value"), text("value"), "0", false)` | Dynamic code |
| `adafruit_mqtt_connect` | Statement | VAR(field_variable), RETRIES(input_value), DELAY(input_value) | `adafruit_mqtt_connect(variables_get($mqtt), math_number(0), math_number(1000))` | Dynamic code |
| `adafruit_mqtt_disconnect` | Statement | VAR(field_variable) | `adafruit_mqtt_disconnect(variables_get($mqtt))` | Dynamic code |
| `adafruit_mqtt_connected` | Value | VAR(field_variable) | `adafruit_mqtt_connected(variables_get($mqtt))` | Dynamic code |
| `adafruit_mqtt_last_error_code` | Value | VAR(field_variable) | `adafruit_mqtt_last_error_code(variables_get($mqtt))` | Dynamic code |
| `adafruit_mqtt_last_error_text` | Value | VAR(field_variable) | `adafruit_mqtt_last_error_text(variables_get($mqtt))` | String( |
| `adafruit_mqtt_ping` | Value | VAR(field_variable), COUNT(input_value) | `adafruit_mqtt_ping(variables_get($mqtt), math_number(0))` | Dynamic code |
| `adafruit_mqtt_create_publisher` | Statement | VAR(field_input), MQTT(field_variable), TOPIC(field_input), QOS(dropdown) | `adafruit_mqtt_create_publisher("publisher", variables_get($mqtt), "username/feeds/data", "0")` | Dynamic code |
| `adafruit_mqtt_publish_text` | Statement | VAR(field_variable), PAYLOAD(input_value), RETAIN(dropdown) | `adafruit_mqtt_publish_text(variables_get($publisher), text("value"), false)` | Dynamic code |
| `adafruit_mqtt_publish_number` | Statement | VAR(field_variable), VALUE(input_value), PRECISION(input_value), RETAIN(dropdown) | `adafruit_mqtt_publish_number(variables_get($publisher), math_number(0), math_number(0), false)` | Dynamic code |
| `adafruit_mqtt_publish_bytes` | Statement | VAR(field_variable), BUFFER(input_value), LENGTH(input_value), RETAIN(dropdown) | `adafruit_mqtt_publish_bytes(variables_get($publisher), math_number(0), math_number(0), false)` | Dynamic code |
| `adafruit_mqtt_publish_topic` | Statement | VAR(field_variable), TOPIC(input_value), PAYLOAD(input_value), QOS(dropdown), RETAIN(dropdown) | `adafruit_mqtt_publish_topic(variables_get($mqtt), text("value"), text("value"), "0", false)` | Dynamic code |
| `adafruit_mqtt_create_subscriber` | Statement | VAR(field_input), MQTT(field_variable), TOPIC(field_input), QOS(dropdown) | `adafruit_mqtt_create_subscriber("subscriber", variables_get($mqtt), "username/feeds/control", "0")` | Dynamic code |
| `adafruit_mqtt_subscribe` | Statement | MQTT(field_variable), VAR(field_variable) | `adafruit_mqtt_subscribe(variables_get($mqtt), variables_get($subscriber))` | Dynamic code |
| `adafruit_mqtt_unsubscribe` | Statement | MQTT(field_variable), VAR(field_variable) | `adafruit_mqtt_unsubscribe(variables_get($mqtt), variables_get($subscriber))` | Dynamic code |
| `adafruit_mqtt_read_subscription` | Statement | MQTT(field_variable), VAR(field_variable), TIMEOUT(input_value), HANDLER(input_statement) | `adafruit_mqtt_read_subscription(variables_get($mqtt), variables_get($subscriber), math_number(1000)) @HANDLER: child_block()` | Dynamic code |
| `adafruit_mqtt_on_message` | Hat | MQTT(field_variable), VAR(field_variable), TIMEOUT(input_value), HANDLER(input_statement) | `adafruit_mqtt_on_message(variables_get($mqtt), variables_get($subscriber), math_number(1000)) @HANDLER: child_block()` | Dynamic code |
| `adafruit_mqtt_process_packets` | Statement | VAR(field_variable), TIMEOUT(input_value) | `adafruit_mqtt_process_packets(variables_get($mqtt), math_number(1000))` | Dynamic code |
| `adafruit_mqtt_subscriber_payload` | Value | VAR(field_variable) | `adafruit_mqtt_subscriber_payload(variables_get($subscriber))` | String((char *) |
| `adafruit_mqtt_subscriber_payload_length` | Value | VAR(field_variable) | `adafruit_mqtt_subscriber_payload_length(variables_get($subscriber))` | Dynamic code |
| `adafruit_mqtt_subscriber_has_message` | Value | VAR(field_variable) | `adafruit_mqtt_subscriber_has_message(variables_get($subscriber))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| QOS | 0, 1 | adafruit_mqtt_set_will, adafruit_mqtt_create_publisher, adafruit_mqtt_publish_topic |
| RETAIN | false, true | adafruit_mqtt_set_will, adafruit_mqtt_publish_text, adafruit_mqtt_publish_number |

## ABS Examples

### Basic Usage
```
arduino_setup()
    adafruit_mqtt_create("mqtt", "io.adafruit.com", 1883, "username", "aio_key", "CLIENT_ID")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, adafruit_mqtt_connected(variables_get($mqtt)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `adafruit_mqtt_create("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
