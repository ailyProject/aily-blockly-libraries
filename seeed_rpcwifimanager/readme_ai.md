# Seeed RPC WiFiManager

Seeed Wio Terminal WiFi configuration portal library

## Library Info
- **Name**: @aily-project/lib-seeed-rpcwifimanager
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `seeed_rpcwifimanager_create` | Statement | VAR(field_input) | `seeed_rpcwifimanager_create("wifiManager")` | Dynamic code |
| `seeed_rpcwifimanager_auto_connect` | Value | VAR(field_variable), AP_NAME(input_value), AP_PASSWORD(input_value) | `seeed_rpcwifimanager_auto_connect(variables_get($wifiManager), text("value"), text("value"))` | Dynamic code |
| `seeed_rpcwifimanager_auto_connect_default` | Value | VAR(field_variable) | `seeed_rpcwifimanager_auto_connect_default(variables_get($wifiManager))` | Dynamic code |
| `seeed_rpcwifimanager_start_portal` | Value | VAR(field_variable), AP_NAME(input_value), AP_PASSWORD(input_value) | `seeed_rpcwifimanager_start_portal(variables_get($wifiManager), text("value"), text("value"))` | Dynamic code |
| `seeed_rpcwifimanager_start_portal_default` | Value | VAR(field_variable) | `seeed_rpcwifimanager_start_portal_default(variables_get($wifiManager))` | Dynamic code |
| `seeed_rpcwifimanager_reset_settings` | Statement | VAR(field_variable) | `seeed_rpcwifimanager_reset_settings(variables_get($wifiManager))` | Dynamic code |
| `seeed_rpcwifimanager_set_portal_timeout` | Statement | VAR(field_variable), SECONDS(input_value) | `seeed_rpcwifimanager_set_portal_timeout(variables_get($wifiManager), math_number(0))` | Dynamic code |
| `seeed_rpcwifimanager_set_connect_timeout` | Statement | VAR(field_variable), SECONDS(input_value) | `seeed_rpcwifimanager_set_connect_timeout(variables_get($wifiManager), math_number(0))` | Dynamic code |
| `seeed_rpcwifimanager_set_debug_output` | Statement | VAR(field_variable), ENABLE(dropdown) | `seeed_rpcwifimanager_set_debug_output(variables_get($wifiManager), TRUE)` | Dynamic code |
| `seeed_rpcwifimanager_set_min_quality` | Statement | VAR(field_variable), QUALITY(input_value) | `seeed_rpcwifimanager_set_min_quality(variables_get($wifiManager), math_number(0))` | Dynamic code |
| `seeed_rpcwifimanager_set_remove_duplicate_aps` | Statement | VAR(field_variable), REMOVE(dropdown) | `seeed_rpcwifimanager_set_remove_duplicate_aps(variables_get($wifiManager), TRUE)` | Dynamic code |
| `seeed_rpcwifimanager_set_break_after_save` | Statement | VAR(field_variable), ENABLE(dropdown) | `seeed_rpcwifimanager_set_break_after_save(variables_get($wifiManager), TRUE)` | Dynamic code |
| `seeed_rpcwifimanager_set_ap_static_ip` | Statement | VAR(field_variable), IP(input_value), GATEWAY(input_value), SUBNET(input_value) | `seeed_rpcwifimanager_set_ap_static_ip(variables_get($wifiManager), text("value"), text("value"), text("value"))` | Dynamic code |
| `seeed_rpcwifimanager_set_sta_static_ip` | Statement | VAR(field_variable), IP(input_value), GATEWAY(input_value), SUBNET(input_value) | `seeed_rpcwifimanager_set_sta_static_ip(variables_get($wifiManager), text("value"), text("value"), text("value"))` | Dynamic code |
| `seeed_rpcwifimanager_set_custom_head` | Statement | VAR(field_variable), HTML(field_input) | `seeed_rpcwifimanager_set_custom_head(variables_get($wifiManager), "<style>body{font-family:sans-serif;}</style>")` | Dynamic code |
| `seeed_rpcwifimanager_get_portal_ssid` | Value | VAR(field_variable) | `seeed_rpcwifimanager_get_portal_ssid(variables_get($wifiManager))` | Dynamic code |
| `seeed_rpcwifimanager_get_ssid` | Value | VAR(field_variable) | `seeed_rpcwifimanager_get_ssid(variables_get($wifiManager))` | Dynamic code |
| `seeed_rpcwifimanager_get_password` | Value | VAR(field_variable) | `seeed_rpcwifimanager_get_password(variables_get($wifiManager))` | Dynamic code |
| `seeed_rpcwifimanager_parameter_create` | Statement | VAR(field_input), ID(field_input), LABEL(field_input), DEFAULT_VALUE(field_input), LENGTH(field_number) | `seeed_rpcwifimanager_parameter_create("mqttServerParam", "server", "MQTT server", "iot.eclipse.org", 40)` | Dynamic code |
| `seeed_rpcwifimanager_parameter_create_html` | Statement | VAR(field_input), HTML(field_input) | `seeed_rpcwifimanager_parameter_create_html("noticeParam", "<p>Device settings</p>")` | Dynamic code |
| `seeed_rpcwifimanager_add_parameter` | Statement | MANAGER(field_variable), PARAM(field_variable) | `seeed_rpcwifimanager_add_parameter(variables_get($wifiManager), variables_get($mqttServerParam))` | Dynamic code |
| `seeed_rpcwifimanager_parameter_value` | Value | PARAM(field_variable) | `seeed_rpcwifimanager_parameter_value(variables_get($mqttServerParam))` | String( |
| `seeed_rpcwifimanager_parameter_id` | Value | PARAM(field_variable) | `seeed_rpcwifimanager_parameter_id(variables_get($mqttServerParam))` | String( |
| `seeed_rpcwifimanager_parameter_placeholder` | Value | PARAM(field_variable) | `seeed_rpcwifimanager_parameter_placeholder(variables_get($mqttServerParam))` | String( |
| `seeed_rpcwifimanager_parameter_length` | Value | PARAM(field_variable) | `seeed_rpcwifimanager_parameter_length(variables_get($mqttServerParam))` | Dynamic code |
| `seeed_rpcwifimanager_on_portal_start` | Hat | VAR(field_variable), HANDLER(input_statement) | `seeed_rpcwifimanager_on_portal_start(variables_get($wifiManager)) @HANDLER: child_block()` | Dynamic code |
| `seeed_rpcwifimanager_on_save_success` | Hat | VAR(field_variable), HANDLER(input_statement) | `seeed_rpcwifimanager_on_save_success(variables_get($wifiManager)) @HANDLER: child_block()` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ENABLE | TRUE, FALSE | seeed_rpcwifimanager_set_debug_output, seeed_rpcwifimanager_set_break_after_save |
| REMOVE | TRUE, FALSE | seeed_rpcwifimanager_set_remove_duplicate_aps |

## ABS Examples

### Basic Usage
```
arduino_setup()
    seeed_rpcwifimanager_create("wifiManager")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, seeed_rpcwifimanager_auto_connect(variables_get($wifiManager), text("value"), text("value")))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `seeed_rpcwifimanager_create("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
