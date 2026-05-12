# MQTT communication library

Allows Arduino UNO R3 to communicate with the MQTT server through the WiFi module to realize IoT data sending and receiving

## Library Info
- **Name**: @aily-project/lib-arduino-mqtt
- **Version**: 0.1.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `mqtt_begin` | Statement | BROKER(input_value), PORT(input_value), USERNAME(input_value), PASSWORD(input_value) | `mqtt_begin(text("value"), math_number(0), text("value"), text("value"))` | Dynamic code |
| `mqtt_connected` | Value | (none) | `mqtt_connected()` | mqttClient.connected() |
| `mqtt_poll` | Statement | (none) | `mqtt_poll()` | mqttClient.poll();\n |
| `mqtt_subscribe` | Statement | TOPIC(input_value) | `mqtt_subscribe(text("value"))` | mqttClient.subscribe( |
| `mqtt_publish` | Statement | MESSAGE(input_value), TOPIC(input_value) | `mqtt_publish(text("value"), text("value"))` | mqttClient.beginMessage( |
| `mqtt_message_available` | Value | (none) | `mqtt_message_available()` | mqttClient.parseMessage() |
| `mqtt_read_topic` | Value | (none) | `mqtt_read_topic()` | mqttClient.messageTopic() |
| `mqtt_read_message` | Value | (none) | `mqtt_read_message()` | readMqttMessage() |

## ABS Examples

### Basic Usage
```
arduino_setup()
    mqtt_begin(text("value"), math_number(0), text("value"), text("value"))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, mqtt_connected())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
