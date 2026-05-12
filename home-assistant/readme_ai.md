# Home Assistant MQTT

Blockly reference for ArduinoHA Home Assistant MQTT discovery and control.

## Library Info
- **Name**: @aily-project/lib-home-assistant
- **Version**: 2.1.0
- **Variable Types**: `HADevice`, `HAMqtt`, `HASensor`, `HASensorNumber`, `HABinarySensor`, `HASwitch`, `HAButton`, `HALight`, `HANumber`, `HASelect`

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ha_device_create` | Statement | VAR(field_input), UNIQUE_ID(field_input) | `ha_device_create("device", "ailyDevice")` | `HADevice device("ailyDevice");` |
| `ha_device_set_info` | Statement | VAR(field_variable), NAME, MANUFACTURER, MODEL, SOFTWARE, CONFIG_URL | `ha_device_set_info($device, "Arduino", "ailyProject", "ESP32", "1.0.0", "")` | `device.setName(...);` |
| `ha_device_enable_availability` | Statement | VAR(field_variable), SHARED(dropdown), LAST_WILL(dropdown) | `ha_device_enable_availability($device, true, true)` | `device.enableSharedAvailability(); device.enableLastWill();` |
| `ha_mqtt_create` | Statement | VAR(field_input), CLIENT(field_input), NETWORK(dropdown), DEVICE(field_variable), MAX_DEVICES(field_number) | `ha_mqtt_create("mqtt", "client", WIFI, $device, 24)` | `WiFiClient client; HAMqtt mqtt(client, device, 24);` |
| `ha_mqtt_begin` | Statement | VAR(field_variable), HOST(input_value), PORT(input_value), USERNAME(input_value), PASSWORD(input_value) | `ha_mqtt_begin($mqtt, text("homeassistant.local"), math_number(1883), text(""), text(""))` | `mqtt.begin(host, port, user, pass);` |
| `ha_mqtt_set_prefixes` | Statement | VAR(field_variable), DISCOVERY(field_input), DATA(field_input) | `ha_mqtt_set_prefixes($mqtt, "homeassistant", "aha")` | `mqtt.setDiscoveryPrefix(...);` |
| `ha_mqtt_set_keep_alive` | Statement | VAR(field_variable), INTERVAL(input_value) | `ha_mqtt_set_keep_alive($mqtt, math_number(15))` | `mqtt.setKeepAlive(15);` |
| `ha_mqtt_set_buffer_size` | Statement | VAR(field_variable), SIZE(input_value) | `ha_mqtt_set_buffer_size($mqtt, math_number(512))` | `mqtt.setBufferSize(512);` |
| `ha_mqtt_loop` | Statement | VAR(field_variable) | `ha_mqtt_loop($mqtt)` | `mqtt.loop();` |
| `ha_mqtt_connected` | Value Boolean | VAR(field_variable) | `ha_mqtt_connected($mqtt)` | `mqtt.isConnected()` |
| `ha_mqtt_state` | Value Number | VAR(field_variable) | `ha_mqtt_state($mqtt)` | `mqtt.getState()` |
| `ha_mqtt_publish` | Statement | VAR(field_variable), TOPIC(input_value), PAYLOAD(input_value), RETAIN(dropdown) | `ha_mqtt_publish($mqtt, text("device/data"), text("hello"), false)` | `mqtt.publish(topic, payload, retain);` |
| `ha_mqtt_subscribe` | Statement | VAR(field_variable), TOPIC(input_value) | `ha_mqtt_subscribe($mqtt, text("device/cmd"))` | `mqtt.subscribe(topic);` |
| `ha_mqtt_disconnect` | Statement | VAR(field_variable) | `ha_mqtt_disconnect($mqtt)` | `mqtt.disconnect();` |
| `ha_mqtt_on_connected` | Hat | VAR(field_variable), HANDLER(input_statement) | `ha_mqtt_on_connected($mqtt) @HANDLER: ...` | `mqtt.onConnected(callback);` |
| `ha_mqtt_on_message` | Hat | VAR(field_variable), HANDLER(input_statement) | `ha_mqtt_on_message($mqtt) @HANDLER: ...` | `mqtt.onMessage(callback);` |
| `ha_mqtt_message_topic` | Value String | none | `ha_mqtt_message_topic()` | `String(topic)` |
| `ha_mqtt_message_payload` | Value String | none | `ha_mqtt_message_payload()` | `_ha_payload_to_string(payload, length)` |
| `ha_mqtt_message_length` | Value Number | none | `ha_mqtt_message_length()` | `length` |
| `ha_entity_set_info` | Statement | VAR(field_variable), NAME, OBJECT_ID, ICON | `ha_entity_set_info($sensor, "Temp", "temp", "mdi:thermometer")` | `entity.setName(...); entity.setIcon(...);` |
| `ha_entity_set_availability` | Statement | VAR(field_variable), ONLINE(input_value) | `ha_entity_set_availability($sensor, logic_boolean(TRUE))` | `entity.setAvailability(true);` |
| `ha_sensor_create_text` | Statement | VAR(field_input), UNIQUE_ID(field_input), FEATURES(dropdown) | `ha_sensor_create_text("sensor", "textSensor", HASensor::DefaultFeatures)` | `HASensor sensor(...);` |
| `ha_sensor_create_number` | Statement | VAR(field_input), UNIQUE_ID(field_input), PRECISION(dropdown), FEATURES(dropdown) | `ha_sensor_create_number("numSensor", "temperature", HASensorNumber::PrecisionP1, HASensor::DefaultFeatures)` | `HASensorNumber numSensor(...);` |
| `ha_sensor_settings` | Statement | VAR(field_variable), DEVICE_CLASS, STATE_CLASS, UNIT, EXPIRE_AFTER(input_value), FORCE_UPDATE(dropdown) | `ha_sensor_settings($numSensor, "temperature", "measurement", "°C", math_number(0), false)` | `sensor.setDeviceClass(...);` |
| `ha_sensor_set_value` | Statement | VAR(field_variable), VALUE(input_value) | `ha_sensor_set_value($sensor, text("open"))` | `sensor.setValue(...);` |
| `ha_sensor_set_json_attributes` | Statement | VAR(field_variable), JSON(input_value) | `ha_sensor_set_json_attributes($sensor, text("{}"))` | `sensor.setJsonAttributes(...);` |
| `ha_sensor_number_set_value` | Statement | VAR(field_variable), VALUE(input_value), FORCE(dropdown) | `ha_sensor_number_set_value($numSensor, math_number(23.5), false)` | `numSensor.setValue(23.5, false);` |
| `ha_binary_sensor_create` | Statement | VAR(field_input), UNIQUE_ID(field_input) | `ha_binary_sensor_create("door", "door")` | `HABinarySensor door(...);` |
| `ha_binary_sensor_settings` | Statement | VAR(field_variable), DEVICE_CLASS, EXPIRE_AFTER(input_value) | `ha_binary_sensor_settings($door, "door", math_number(0))` | `door.setDeviceClass(...);` |
| `ha_binary_sensor_set_state` | Statement | VAR(field_variable), STATE(input_value), FORCE(dropdown) | `ha_binary_sensor_set_state($door, logic_boolean(TRUE), false)` | `door.setState(true, false);` |
| `ha_binary_sensor_get_state` | Value Boolean | VAR(field_variable) | `ha_binary_sensor_get_state($door)` | `door.getCurrentState()` |
| `ha_switch_create` | Statement | VAR(field_input), UNIQUE_ID(field_input) | `ha_switch_create("haSwitch", "switch")` | `HASwitch haSwitch(...);` |
| `ha_switch_settings` | Statement | VAR(field_variable), DEVICE_CLASS, RETAIN(dropdown), OPTIMISTIC(dropdown) | `ha_switch_settings($haSwitch, "", false, false)` | `haSwitch.setRetain(...);` |
| `ha_switch_set_state` | Statement | VAR(field_variable), STATE(input_value), FORCE(dropdown) | `ha_switch_set_state($haSwitch, logic_boolean(TRUE), false)` | `haSwitch.setState(true, false);` |
| `ha_switch_get_state` | Value Boolean | VAR(field_variable) | `ha_switch_get_state($haSwitch)` | `haSwitch.getCurrentState()` |
| `ha_switch_on_command` | Hat | VAR(field_variable), HANDLER(input_statement) | `ha_switch_on_command($haSwitch) @HANDLER: ...` | `haSwitch.onCommand(callback);` |
| `ha_button_create` | Statement | VAR(field_input), UNIQUE_ID(field_input) | `ha_button_create("button", "button")` | `HAButton button(...);` |
| `ha_button_settings` | Statement | VAR(field_variable), DEVICE_CLASS, RETAIN(dropdown) | `ha_button_settings($button, "restart", false)` | `button.setDeviceClass(...);` |
| `ha_button_on_command` | Hat | VAR(field_variable), HANDLER(input_statement) | `ha_button_on_command($button) @HANDLER: ...` | `button.onCommand(callback);` |
| `ha_light_create` | Statement | VAR(field_input), UNIQUE_ID(field_input), FEATURES(dropdown) | `ha_light_create("light", "light", HALight::BrightnessFeature)` | `HALight light(...);` |
| `ha_light_settings` | Statement | VAR(field_variable), RETAIN, OPTIMISTIC, BRIGHTNESS_SCALE(input_value), MIN_MIREDS(input_value), MAX_MIREDS(input_value) | `ha_light_settings($light, false, false, math_number(255), math_number(153), math_number(500))` | `light.setBrightnessScale(...);` |
| `ha_light_set_state` | Statement | VAR(field_variable), STATE(input_value), FORCE(dropdown) | `ha_light_set_state($light, logic_boolean(TRUE), false)` | `light.setState(true, false);` |
| `ha_light_set_brightness` | Statement | VAR(field_variable), BRIGHTNESS(input_value), FORCE(dropdown) | `ha_light_set_brightness($light, math_number(128), false)` | `light.setBrightness(128, false);` |
| `ha_light_set_color_temperature` | Statement | VAR(field_variable), TEMPERATURE(input_value), FORCE(dropdown) | `ha_light_set_color_temperature($light, math_number(250), false)` | `light.setColorTemperature(250, false);` |
| `ha_light_set_rgb` | Statement | VAR(field_variable), RED(input_value), GREEN(input_value), BLUE(input_value), FORCE(dropdown) | `ha_light_set_rgb($light, math_number(255), math_number(0), math_number(0), false)` | `light.setRGBColor(...);` |
| `ha_light_get_state` | Value Boolean | VAR(field_variable) | `ha_light_get_state($light)` | `light.getCurrentState()` |
| `ha_light_get_brightness` | Value Number | VAR(field_variable) | `ha_light_get_brightness($light)` | `light.getCurrentBrightness()` |
| `ha_light_on_state_command` | Hat | VAR(field_variable), HANDLER(input_statement) | `ha_light_on_state_command($light) @HANDLER: ...` | `light.onStateCommand(callback);` |
| `ha_light_on_brightness_command` | Hat | VAR(field_variable), HANDLER(input_statement) | `ha_light_on_brightness_command($light) @HANDLER: ...` | `light.onBrightnessCommand(callback);` |
| `ha_light_on_color_temperature_command` | Hat | VAR(field_variable), HANDLER(input_statement) | `ha_light_on_color_temperature_command($light) @HANDLER: ...` | `light.onColorTemperatureCommand(callback);` |
| `ha_light_on_rgb_command` | Hat | VAR(field_variable), HANDLER(input_statement) | `ha_light_on_rgb_command($light) @HANDLER: ...` | `light.onRGBColorCommand(callback);` |
| `ha_number_create` | Statement | VAR(field_input), UNIQUE_ID(field_input), PRECISION(dropdown) | `ha_number_create("number", "number", HANumber::PrecisionP0)` | `HANumber number(...);` |
| `ha_number_settings` | Statement | VAR(field_variable), DEVICE_CLASS, UNIT, MODE, MIN(input_value), MAX(input_value), STEP(input_value), RETAIN, OPTIMISTIC | `ha_number_settings($number, "", "", HANumber::ModeSlider, math_number(0), math_number(100), math_number(1), false, false)` | `number.setMin(...);` |
| `ha_number_set_state` | Statement | VAR(field_variable), VALUE(input_value), FORCE(dropdown) | `ha_number_set_state($number, math_number(42), false)` | `number.setState(42, false);` |
| `ha_number_get_state` | Value Number | VAR(field_variable) | `ha_number_get_state($number)` | `number.getCurrentState().toFloat()` |
| `ha_number_on_command` | Hat | VAR(field_variable), HANDLER(input_statement) | `ha_number_on_command($number) @HANDLER: ...` | `number.onCommand(callback);` |
| `ha_select_create` | Statement | VAR(field_input), UNIQUE_ID(field_input) | `ha_select_create("select", "select")` | `HASelect select(...);` |
| `ha_select_settings` | Statement | VAR(field_variable), OPTIONS(field_input), RETAIN, OPTIMISTIC | `ha_select_settings($select, "Auto;Heat;Cool", false, false)` | `select.setOptions(...);` |
| `ha_select_set_state` | Statement | VAR(field_variable), INDEX(input_value), FORCE(dropdown) | `ha_select_set_state($select, math_number(0), false)` | `select.setState(0, false);` |
| `ha_select_get_state` | Value Number | VAR(field_variable) | `ha_select_get_state($select)` | `select.getCurrentState()` |
| `ha_select_get_option` | Value String | VAR(field_variable) | `ha_select_get_option($select)` | `String(select.getCurrentOption())` |
| `ha_select_on_command` | Hat | VAR(field_variable), HANDLER(input_statement) | `ha_select_on_command($select) @HANDLER: ...` | `select.onCommand(callback);` |
| `ha_command_bool_state` | Value Boolean | none | `ha_command_bool_state()` | `state` |
| `ha_command_brightness` | Value Number | none | `ha_command_brightness()` | `brightness` |
| `ha_command_color_temperature` | Value Number | none | `ha_command_color_temperature()` | `temperature` |
| `ha_command_rgb_red` | Value Number | none | `ha_command_rgb_red()` | `color.red` |
| `ha_command_rgb_green` | Value Number | none | `ha_command_rgb_green()` | `color.green` |
| `ha_command_rgb_blue` | Value Number | none | `ha_command_rgb_blue()` | `color.blue` |
| `ha_number_command_is_set` | Value Boolean | none | `ha_number_command_is_set()` | `number.isSet()` |
| `ha_number_command_value` | Value Number | none | `ha_number_command_value()` | `number.toFloat()` |
| `ha_select_command_index` | Value Number | none | `ha_select_command_index()` | `index` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| NETWORK | `WIFI`, `ETHERNET` | Chooses `WiFiClient` or `EthernetClient`; WiFi include adapts to ESP32, ESP8266, or UNO R4 WiFi. |
| FEATURES(sensor) | `HASensor::DefaultFeatures`, `HASensor::JsonAttributesFeature` | Enables optional JSON attributes topic. |
| FEATURES(light) | `HALight::DefaultFeatures`, `HALight::BrightnessFeature`, `HALight::ColorTemperatureFeature`, `HALight::RGBFeature`, combined values | Enables light command capabilities. |
| PRECISION | `PrecisionP0`, `PrecisionP1`, `PrecisionP2`, `PrecisionP3` | Decimal precision for `HASensorNumber` and `HANumber`. |
| MODE | `HANumber::ModeAuto`, `HANumber::ModeBox`, `HANumber::ModeSlider` | Number UI display mode. |
| Boolean dropdowns | `false`, `true` | Retain, optimistic, shared availability, Last Will, force update. |

## ABS Examples

### Temperature Sensor
```
arduino_setup()
    ha_device_create("device", "esp32Node")
    ha_mqtt_create("mqtt", "client", WIFI, $device, 24)
    ha_sensor_create_number("temp", "temperature", HASensorNumber::PrecisionP1, HASensor::DefaultFeatures)
    ha_device_set_info($device, "ESP32 Node", "ailyProject", "ESP32", "1.0.0", "")
    ha_entity_set_info($temp, "Temperature", "temperature", "mdi:thermometer")
    ha_sensor_settings($temp, "temperature", "measurement", "C", math_number(0), false)
    ha_mqtt_begin($mqtt, text("homeassistant.local"), math_number(1883), text(""), text(""))

arduino_loop()
    ha_sensor_number_set_value($temp, math_number(23.5), false)
    time_delay(math_number(5000))
```

### Switch Command
```
arduino_setup()
    ha_device_create("device", "esp32Switch")
    ha_mqtt_create("mqtt", "client", WIFI, $device, 24)
    ha_switch_create("led", "led")
    ha_entity_set_info($led, "LED", "led", "mdi:lightbulb")
    ha_mqtt_begin($mqtt, text("homeassistant.local"), math_number(1883), text(""), text(""))

ha_switch_on_command($led)
    @HANDLER:
        ha_switch_set_state($led, ha_command_bool_state(), false)
```

## Notes

1. **Order matters**: `ha_device_create` must be generated before `ha_mqtt_create`, and entity create blocks must be generated after `ha_mqtt_create`; ArduinoHA registers entities during global construction through `HAMqtt::instance()`.
2. **Network first**: connect WiFi or initialize Ethernet before `ha_mqtt_begin`; this library creates the MQTT client but does not join the network.
3. **Loop handling**: `ha_mqtt_create` automatically adds `mqtt.loop()` to `loop()`. Use `ha_mqtt_loop` only when explicit placement is needed.
4. **String configuration fields**: entity names, icons, classes, and options are field inputs so generated C++ uses stable string literals.
5. **Callback values**: command value blocks only make sense inside matching command callback blocks.