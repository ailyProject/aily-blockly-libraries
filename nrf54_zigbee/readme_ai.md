# nRF54 Zigbee Home Automation

Zigbee Home Automation library for nRF54L15, supporting End Device and Router roles with On/Off Light, Dimmable Light, Color Light, Temperature Sensor, Humidity Sensor device types, featuring secure commissioning, att...

## Library Info
- **Name**: @aily-project/lib-nrf54-zigbee
- **Version**: 0.6.7

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `zigbee_init` | Statement | VAR(field_input), ROLE(dropdown), DEVICE_TYPE(dropdown), CHANNEL(input_value), PAN_ID(input_value) | `zigbee_init("zigbee", END_DEVICE, ON_OFF_LIGHT, math_number(0), math_number(0))` | + varName + |
| `zigbee_set_basic_info` | Statement | VAR(field_variable), MANUFACTURER(input_value), MODEL(input_value), VERSION(input_value) | `zigbee_set_basic_info(variables_get($zigbee), text("value"), text("value"), text("value"))` | Dynamic code |
| `zigbee_set_install_code` | Statement | VAR(field_variable), INSTALL_CODE(input_value) | `zigbee_set_install_code(variables_get($zigbee), text("value"))` | Dynamic code |
| `zigbee_start` | Statement | VAR(field_variable) | `zigbee_start(variables_get($zigbee))` | Dynamic code |
| `zigbee_loop` | Statement | VAR(field_variable) | `zigbee_loop(variables_get($zigbee))` | Dynamic code |
| `zigbee_is_joined` | Value | VAR(field_variable) | `zigbee_is_joined(variables_get($zigbee))` | Dynamic code |
| `zigbee_set_on_off` | Statement | VAR(field_variable), STATE(dropdown) | `zigbee_set_on_off(variables_get($zigbee), TRUE)` | Dynamic code |
| `zigbee_get_on_off` | Value | VAR(field_variable) | `zigbee_get_on_off(variables_get($zigbee))` | Dynamic code |
| `zigbee_set_level` | Statement | VAR(field_variable), LEVEL(input_value) | `zigbee_set_level(variables_get($zigbee), math_number(0))` | Dynamic code |
| `zigbee_get_level` | Value | VAR(field_variable) | `zigbee_get_level(variables_get($zigbee))` | Dynamic code |
| `zigbee_set_color_hs` | Statement | VAR(field_variable), HUE(input_value), SATURATION(input_value) | `zigbee_set_color_hs(variables_get($zigbee), math_number(0), math_number(0))` | Dynamic code |
| `zigbee_set_color_temp` | Statement | VAR(field_variable), COLOR_TEMP(input_value) | `zigbee_set_color_temp(variables_get($zigbee), math_number(0))` | Dynamic code |
| `zigbee_set_temperature` | Statement | VAR(field_variable), TEMPERATURE(input_value) | `zigbee_set_temperature(variables_get($zigbee), math_number(0))` | Dynamic code |
| `zigbee_set_humidity` | Statement | VAR(field_variable), HUMIDITY(input_value) | `zigbee_set_humidity(variables_get($zigbee), math_number(0))` | Dynamic code |
| `zigbee_set_battery` | Statement | VAR(field_variable), VOLTAGE(input_value), PERCENTAGE(input_value) | `zigbee_set_battery(variables_get($zigbee), math_number(0), math_number(0))` | Dynamic code |
| `zigbee_is_identifying` | Value | VAR(field_variable) | `zigbee_is_identifying(variables_get($zigbee))` | Dynamic code |
| `zigbee_configure_reporting` | Statement | VAR(field_variable), CLUSTER(dropdown), ATTR_ID(input_value), MIN_INTERVAL(input_value), MAX_INTERVAL(input_value) | `zigbee_configure_reporting(variables_get($zigbee), ON_OFF, math_number(0), math_number(1000), math_number(1000))` | Dynamic code |
| `zigbee_on_state_change` | Hat | VAR(field_variable), DO(input_statement) | `zigbee_on_state_change(variables_get($zigbee)) @DO: child_block()` | Dynamic code |
| `zigbee_on_level_change` | Hat | VAR(field_variable), DO(input_statement) | `zigbee_on_level_change(variables_get($zigbee)) @DO: child_block()` | Dynamic code |
| `zigbee_on_color_change` | Hat | VAR(field_variable), DO(input_statement) | `zigbee_on_color_change(variables_get($zigbee)) @DO: child_block()` | Dynamic code |
| `zigbee_on_join` | Hat | VAR(field_variable), DO(input_statement) | `zigbee_on_join(variables_get($zigbee)) @DO: child_block()` | Dynamic code |
| `zigbee_persist_save` | Statement | VAR(field_variable) | `zigbee_persist_save(variables_get($zigbee))` | + varName + |
| `zigbee_persist_clear` | Statement | VAR(field_variable) | `zigbee_persist_clear(variables_get($zigbee))` | Dynamic code |
| `zigbee_rejoin` | Statement | VAR(field_variable) | `zigbee_rejoin(variables_get($zigbee))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ROLE | END_DEVICE, ROUTER | zigbee_init |
| DEVICE_TYPE | ON_OFF_LIGHT, DIMMABLE_LIGHT, COLOR_LIGHT, EXTENDED_COLOR_LIGHT, ON_OFF_SWITCH, TEMPERATURE_SENSOR, TEMPERATURE_HUMIDITY_SENSOR | zigbee_init |
| STATE | TRUE, FALSE | zigbee_set_on_off |
| CLUSTER | ON_OFF, LEVEL_CONTROL, COLOR_CONTROL, TEMPERATURE, HUMIDITY, POWER_CONFIG | zigbee_configure_reporting |

## ABS Examples

### Basic Usage
```
arduino_setup()
    zigbee_init("zigbee", END_DEVICE, ON_OFF_LIGHT, math_number(0), math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, zigbee_is_joined(variables_get($zigbee)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `zigbee_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
