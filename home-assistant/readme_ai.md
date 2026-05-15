# Home Assistant MQTT

Home Assistant MQTT integration library for discovering, reporting, and controlling Arduino or ESP device entities over MQTT.

## Library Info
- **Name**: @aily-project/lib-home-assistant
- **Version**: 2.1.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ha_device_create` | Statement | VAR(field_input), UNIQUE_ID(field_input) | `ha_device_create("device", "ailyDevice")` | Dynamic code |
| `ha_device_set_info` | Statement | VAR(field_variable), NAME(field_input), MANUFACTURER(field_input), MODEL(field_input), SOFTWARE(field_input), CONFIG_URL(field_input) | `ha_device_set_info(variables_get($device), "Arduino", "ailyProject", "ESP32", "1.0.0", "CONFIG_URL")` | Dynamic code |
| `ha_device_enable_availability` | Statement | VAR(field_variable), SHARED(dropdown), LAST_WILL(dropdown) | `ha_device_enable_availability(variables_get($device), true, true)` | Dynamic code |
| `ha_mqtt_create` | Statement | VAR(field_input), CLIENT(field_input), NETWORK(dropdown), DEVICE(field_variable), MAX_DEVICES(field_number) | `ha_mqtt_create("mqtt", "client", WIFI, variables_get($device), 24)` | Dynamic code |
| `ha_mqtt_begin` | Statement | VAR(field_variable), HOST(input_value), PORT(input_value), USERNAME(input_value), PASSWORD(input_value) | `ha_mqtt_begin(variables_get($mqtt), text("value"), math_number(0), text("value"), text("value"))` | Dynamic code |
| `ha_mqtt_set_prefixes` | Statement | VAR(field_variable), DISCOVERY(field_input), DATA(field_input) | `ha_mqtt_set_prefixes(variables_get($mqtt), "homeassistant", "aha")` | Dynamic code |
| `ha_mqtt_set_keep_alive` | Statement | VAR(field_variable), INTERVAL(input_value) | `ha_mqtt_set_keep_alive(variables_get($mqtt), math_number(1000))` | Dynamic code |
| `ha_mqtt_set_buffer_size` | Statement | VAR(field_variable), SIZE(input_value) | `ha_mqtt_set_buffer_size(variables_get($mqtt), math_number(0))` | Dynamic code |
| `ha_mqtt_loop` | Statement | VAR(field_variable) | `ha_mqtt_loop(variables_get($mqtt))` | Dynamic code |
| `ha_mqtt_connected` | Value | VAR(field_variable) | `ha_mqtt_connected(variables_get($mqtt))` | Dynamic code |
| `ha_mqtt_state` | Value | VAR(field_variable) | `ha_mqtt_state(variables_get($mqtt))` | Dynamic code |
| `ha_mqtt_publish` | Statement | VAR(field_variable), TOPIC(input_value), PAYLOAD(input_value), RETAIN(dropdown) | `ha_mqtt_publish(variables_get($mqtt), text("value"), text("value"), false)` | Dynamic code |
| `ha_mqtt_subscribe` | Statement | VAR(field_variable), TOPIC(input_value) | `ha_mqtt_subscribe(variables_get($mqtt), text("value"))` | Dynamic code |
| `ha_mqtt_disconnect` | Statement | VAR(field_variable) | `ha_mqtt_disconnect(variables_get($mqtt))` | Dynamic code |
| `ha_mqtt_on_connected` | Hat | VAR(field_variable), HANDLER(input_statement) | `ha_mqtt_on_connected(variables_get($mqtt)) @HANDLER: child_block()` | Dynamic code |
| `ha_mqtt_on_message` | Hat | VAR(field_variable), HANDLER(input_statement) | `ha_mqtt_on_message(variables_get($mqtt)) @HANDLER: child_block()` | Dynamic code |
| `ha_mqtt_message_topic` | Value | (none) | `ha_mqtt_message_topic()` | String(topic) |
| `ha_mqtt_message_payload` | Value | (none) | `ha_mqtt_message_payload()` | _ha_payload_to_string(payload, length) |
| `ha_mqtt_message_length` | Value | (none) | `ha_mqtt_message_length()` | length |
| `ha_entity_set_info` | Statement | VAR(field_variable), NAME(field_input), OBJECT_ID(field_input), ICON(field_input) | `ha_entity_set_info(variables_get($entity), "My Entity", "OBJECT_ID", "ICON")` | Dynamic code |
| `ha_entity_set_availability` | Statement | VAR(field_variable), ONLINE(input_value) | `ha_entity_set_availability(variables_get($entity), logic_boolean(TRUE))` | Dynamic code |
| `ha_sensor_create_text` | Statement | VAR(field_input), UNIQUE_ID(field_input), FEATURES(dropdown) | `ha_sensor_create_text("sensor", "textSensor", HASensor::DefaultFeatures)` | Dynamic code |
| `ha_sensor_create_number` | Statement | VAR(field_input), UNIQUE_ID(field_input), PRECISION(dropdown), FEATURES(dropdown) | `ha_sensor_create_number("numSensor", "numSensor", HASensorNumber::PrecisionP0, HASensor::DefaultFeatures)` | Dynamic code |
| `ha_sensor_settings` | Statement | VAR(field_variable), DEVICE_CLASS(field_input), STATE_CLASS(field_input), UNIT(field_input), EXPIRE_AFTER(input_value), FORCE_UPDATE(dropdown) | `ha_sensor_settings(variables_get($sensor), "DEVICE_CLASS", "STATE_CLASS", "UNIT", math_number(0), false)` | Dynamic code |
| `ha_sensor_set_value` | Statement | VAR(field_variable), VALUE(input_value) | `ha_sensor_set_value(variables_get($sensor), text("value"))` | Dynamic code |
| `ha_sensor_set_json_attributes` | Statement | VAR(field_variable), JSON(input_value) | `ha_sensor_set_json_attributes(variables_get($sensor), text("value"))` | Dynamic code |
| `ha_sensor_number_set_value` | Statement | VAR(field_variable), VALUE(input_value), FORCE(dropdown) | `ha_sensor_number_set_value(variables_get($numSensor), math_number(0), false)` | Dynamic code |
| `ha_binary_sensor_create` | Statement | VAR(field_input), UNIQUE_ID(field_input) | `ha_binary_sensor_create("binarySensor", "binarySensor")` | Dynamic code |
| `ha_binary_sensor_settings` | Statement | VAR(field_variable), DEVICE_CLASS(field_input), EXPIRE_AFTER(input_value) | `ha_binary_sensor_settings(variables_get($binarySensor), "DEVICE_CLASS", math_number(0))` | Dynamic code |
| `ha_binary_sensor_set_state` | Statement | VAR(field_variable), STATE(input_value), FORCE(dropdown) | `ha_binary_sensor_set_state(variables_get($binarySensor), logic_boolean(TRUE), false)` | Dynamic code |
| `ha_binary_sensor_get_state` | Value | VAR(field_variable) | `ha_binary_sensor_get_state(variables_get($binarySensor))` | Dynamic code |
| `ha_switch_create` | Statement | VAR(field_input), UNIQUE_ID(field_input) | `ha_switch_create("haSwitch", "switch")` | Dynamic code |
| `ha_switch_settings` | Statement | VAR(field_variable), DEVICE_CLASS(field_input), RETAIN(dropdown), OPTIMISTIC(dropdown) | `ha_switch_settings(variables_get($haSwitch), "DEVICE_CLASS", false, false)` | Dynamic code |
| `ha_switch_set_state` | Statement | VAR(field_variable), STATE(input_value), FORCE(dropdown) | `ha_switch_set_state(variables_get($haSwitch), logic_boolean(TRUE), false)` | Dynamic code |
| `ha_switch_get_state` | Value | VAR(field_variable) | `ha_switch_get_state(variables_get($haSwitch))` | Dynamic code |
| `ha_switch_on_command` | Hat | VAR(field_variable), HANDLER(input_statement) | `ha_switch_on_command(variables_get($haSwitch)) @HANDLER: child_block()` | Dynamic code |
| `ha_button_create` | Statement | VAR(field_input), UNIQUE_ID(field_input) | `ha_button_create("button", "button")` | Dynamic code |
| `ha_button_settings` | Statement | VAR(field_variable), DEVICE_CLASS(field_input), RETAIN(dropdown) | `ha_button_settings(variables_get($button), "DEVICE_CLASS", false)` | Dynamic code |
| `ha_button_on_command` | Hat | VAR(field_variable), HANDLER(input_statement) | `ha_button_on_command(variables_get($button)) @HANDLER: child_block()` | Dynamic code |
| `ha_light_create` | Statement | VAR(field_input), UNIQUE_ID(field_input), FEATURES(dropdown) | `ha_light_create("light", "light", HALight::DefaultFeatures)` | Dynamic code |
| `ha_light_settings` | Statement | VAR(field_variable), RETAIN(dropdown), OPTIMISTIC(dropdown), BRIGHTNESS_SCALE(input_value), MIN_MIREDS(input_value), MAX_MIREDS(input_value) | `ha_light_settings(variables_get($light), false, false, math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `ha_light_set_state` | Statement | VAR(field_variable), STATE(input_value), FORCE(dropdown) | `ha_light_set_state(variables_get($light), logic_boolean(TRUE), false)` | Dynamic code |
| `ha_light_set_brightness` | Statement | VAR(field_variable), BRIGHTNESS(input_value), FORCE(dropdown) | `ha_light_set_brightness(variables_get($light), math_number(0), false)` | Dynamic code |
| `ha_light_set_color_temperature` | Statement | VAR(field_variable), TEMPERATURE(input_value), FORCE(dropdown) | `ha_light_set_color_temperature(variables_get($light), math_number(0), false)` | Dynamic code |
| `ha_light_set_rgb` | Statement | VAR(field_variable), RED(input_value), GREEN(input_value), BLUE(input_value), FORCE(dropdown) | `ha_light_set_rgb(variables_get($light), math_number(0), math_number(0), math_number(0), false)` | Dynamic code |
| `ha_light_get_state` | Value | VAR(field_variable) | `ha_light_get_state(variables_get($light))` | Dynamic code |
| `ha_light_get_brightness` | Value | VAR(field_variable) | `ha_light_get_brightness(variables_get($light))` | Dynamic code |
| `ha_light_on_state_command` | Hat | VAR(field_variable), HANDLER(input_statement) | `ha_light_on_state_command(variables_get($light)) @HANDLER: child_block()` | Dynamic code |
| `ha_light_on_brightness_command` | Hat | VAR(field_variable), HANDLER(input_statement) | `ha_light_on_brightness_command(variables_get($light)) @HANDLER: child_block()` | Dynamic code |
| `ha_light_on_color_temperature_command` | Hat | VAR(field_variable), HANDLER(input_statement) | `ha_light_on_color_temperature_command(variables_get($light)) @HANDLER: child_block()` | Dynamic code |
| `ha_light_on_rgb_command` | Hat | VAR(field_variable), HANDLER(input_statement) | `ha_light_on_rgb_command(variables_get($light)) @HANDLER: child_block()` | Dynamic code |
| `ha_number_create` | Statement | VAR(field_input), UNIQUE_ID(field_input), PRECISION(dropdown) | `ha_number_create("number", "number", HANumber::PrecisionP0)` | Dynamic code |
| `ha_number_settings` | Statement | VAR(field_variable), DEVICE_CLASS(field_input), UNIT(field_input), MODE(dropdown), MIN(input_value), MAX(input_value), STEP(input_value), RETAIN(dropdown), O... | `ha_number_settings(variables_get($number), "DEVICE_CLASS", "UNIT", HANumber::ModeAuto, math_number(0), math_number(0), math_number(0), false, false)` | Dynamic code |
| `ha_number_set_state` | Statement | VAR(field_variable), VALUE(input_value), FORCE(dropdown) | `ha_number_set_state(variables_get($number), math_number(0), false)` | Dynamic code |
| `ha_number_get_state` | Value | VAR(field_variable) | `ha_number_get_state(variables_get($number))` | Dynamic code |
| `ha_number_on_command` | Hat | VAR(field_variable), HANDLER(input_statement) | `ha_number_on_command(variables_get($number)) @HANDLER: child_block()` | Dynamic code |
| `ha_select_create` | Statement | VAR(field_input), UNIQUE_ID(field_input) | `ha_select_create("select", "select")` | Dynamic code |
| `ha_select_settings` | Statement | VAR(field_variable), OPTIONS(field_input), RETAIN(dropdown), OPTIMISTIC(dropdown) | `ha_select_settings(variables_get($select), "Auto;Heat;Cool", false, false)` | Dynamic code |
| `ha_select_set_state` | Statement | VAR(field_variable), INDEX(input_value), FORCE(dropdown) | `ha_select_set_state(variables_get($select), math_number(0), false)` | Dynamic code |
| `ha_select_get_state` | Value | VAR(field_variable) | `ha_select_get_state(variables_get($select))` | Dynamic code |
| `ha_select_get_option` | Value | VAR(field_variable) | `ha_select_get_option(variables_get($select))` | String( |
| `ha_select_on_command` | Hat | VAR(field_variable), HANDLER(input_statement) | `ha_select_on_command(variables_get($select)) @HANDLER: child_block()` | Dynamic code |
| `ha_command_bool_state` | Value | (none) | `ha_command_bool_state()` | state |
| `ha_command_brightness` | Value | (none) | `ha_command_brightness()` | brightness |
| `ha_command_color_temperature` | Value | (none) | `ha_command_color_temperature()` | temperature |
| `ha_command_rgb_red` | Value | (none) | `ha_command_rgb_red()` | color.red |
| `ha_command_rgb_green` | Value | (none) | `ha_command_rgb_green()` | color.green |
| `ha_command_rgb_blue` | Value | (none) | `ha_command_rgb_blue()` | color.blue |
| `ha_number_command_is_set` | Value | (none) | `ha_number_command_is_set()` | number.isSet() |
| `ha_number_command_value` | Value | (none) | `ha_number_command_value()` | number.toFloat() |
| `ha_select_command_index` | Value | (none) | `ha_select_command_index()` | index |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| SHARED | true, false | ha_device_enable_availability |
| LAST_WILL | true, false | ha_device_enable_availability |
| NETWORK | WIFI, ETHERNET | ha_mqtt_create |
| RETAIN | false, true | ha_mqtt_publish, ha_switch_settings, ha_button_settings |
| FEATURES | HASensor::DefaultFeatures, HASensor::JsonAttributesFeature | ha_sensor_create_text, ha_sensor_create_number |
| PRECISION | HASensorNumber::PrecisionP0, HASensorNumber::PrecisionP1, HASensorNumber::PrecisionP2, HASensorNumber::PrecisionP3 | ha_sensor_create_number |
| FORCE_UPDATE | false, true | ha_sensor_settings |
| FORCE | false, true | ha_sensor_number_set_value, ha_binary_sensor_set_state, ha_switch_set_state |
| OPTIMISTIC | false, true | ha_switch_settings, ha_light_settings, ha_number_settings |
| FEATURES | HALight::DefaultFeatures, HALight::BrightnessFeature, HALight::ColorTemperatureFeature, HALight::RGBFeature, HALight::BrightnessFeature &#124; HALight::RGBFeature, HALight::BrightnessFeature &#124; HALight::ColorTemperatureFeat... | ha_light_create |
| PRECISION | HANumber::PrecisionP0, HANumber::PrecisionP1, HANumber::PrecisionP2, HANumber::PrecisionP3 | ha_number_create |
| MODE | HANumber::ModeAuto, HANumber::ModeBox, HANumber::ModeSlider | ha_number_settings |

## ABS Examples

### Basic Usage
```
arduino_setup()
    ha_device_create("device", "ailyDevice")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, ha_mqtt_connected(variables_get($mqtt)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `ha_device_create("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
