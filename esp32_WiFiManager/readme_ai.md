# WiFi manager

ESP32 WiFiManager library, providing WiFi configuration portal and automatic connection function

## Library Info
- **Name**: @aily-project/lib-esp32-wifimanager
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `wifimanager_init` | Statement | (none) | `wifimanager_init()` | Dynamic code |
| `wifimanager_autoconnect` | Value | SSID(input_value), PASSWORD(input_value) | `wifimanager_autoconnect(text("value"), text("value"))` | wm.autoConnect( |
| `wifimanager_autoconnect_simple` | Value | (none) | `wifimanager_autoconnect_simple()` | wm.autoConnect() |
| `wifimanager_simple_setup` | Statement | SSID(input_value), PASSWORD(input_value) | `wifimanager_simple_setup(text("value"), text("value"))` | if (!wm.autoConnect( |
| `wifimanager_set_timeout` | Statement | TIMEOUT(input_value) | `wifimanager_set_timeout(math_number(1000))` | wm.setConfigPortalTimeout( |
| `wifimanager_reset_settings` | Statement | (none) | `wifimanager_reset_settings()` | wm.resetSettings();\n |
| `wifimanager_start_config_portal` | Value | SSID(input_value), PASSWORD(input_value) | `wifimanager_start_config_portal(text("value"), text("value"))` | wm.startConfigPortal( |
| `wifimanager_set_blocking` | Statement | MODE(dropdown) | `wifimanager_set_blocking(true)` | wm.setConfigPortalBlocking( |
| `wifimanager_process` | Statement | (none) | `wifimanager_process()` | wm.process();\n |
| `wifimanager_set_static_ip` | Statement | IP(input_value), GATEWAY(input_value), SUBNET(input_value) | `wifimanager_set_static_ip(text("value"), text("value"), text("value"))` | wm.setSTAStaticIPConfig(parseIP( |
| `wifimanager_add_parameter` | Statement | ID(input_value), LABEL(input_value), DEFAULT_VALUE(input_value), LENGTH(input_value) | `wifimanager_add_parameter(text("value"), text("value"), text("value"), math_number(0))` | wm.addParameter(& |
| `wifimanager_get_parameter` | Value | PARAM_ID(input_value) | `wifimanager_get_parameter(text("value"))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | true, false | wifimanager_set_blocking |

## ABS Examples

### Basic Usage
```
arduino_setup()
    wifimanager_init()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, wifimanager_autoconnect(text("value"), text("value")))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
