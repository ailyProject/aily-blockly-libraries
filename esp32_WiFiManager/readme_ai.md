# WiFi管理器

ESP32 WiFiManager库，提供WiFi配置门户和自动连接功能

## Library Info
- **Name**: @aily-project/lib-esp32-wifimanager
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `wifimanager_init` | Statement | (none) | `wifimanager_init()` | `` |
| `wifimanager_autoconnect` | Value | SSID(input_value), PASSWORD(input_value) | `wifimanager_autoconnect(math_number(0), math_number(0))` | `wm.autoConnect(` |
| `wifimanager_autoconnect_simple` | Value | (none) | `wifimanager_autoconnect_simple()` | `wm.autoConnect()` |
| `wifimanager_simple_setup` | Statement | SSID(input_value), PASSWORD(input_value) | `wifimanager_simple_setup(math_number(0), math_number(0))` | `if (!wm.autoConnect(` |
| `wifimanager_set_timeout` | Statement | TIMEOUT(input_value) | `wifimanager_set_timeout(math_number(1000))` | `wm.setConfigPortalTimeout(` |
| `wifimanager_reset_settings` | Statement | (none) | `wifimanager_reset_settings()` | `wm.resetSettings();\n` |
| `wifimanager_start_config_portal` | Value | SSID(input_value), PASSWORD(input_value) | `wifimanager_start_config_portal(math_number(0), math_number(0))` | `wm.startConfigPortal(` |
| `wifimanager_set_blocking` | Statement | MODE(dropdown) | `wifimanager_set_blocking(true)` | `wm.setConfigPortalBlocking(` |
| `wifimanager_process` | Statement | (none) | `wifimanager_process()` | `wm.process();\n` |
| `wifimanager_set_static_ip` | Statement | IP(input_value), GATEWAY(input_value), SUBNET(input_value) | `wifimanager_set_static_ip(math_number(0), math_number(0), math_number(0))` | `wm.setSTAStaticIPConfig(parseIP(` |
| `wifimanager_add_parameter` | Statement | ID(input_value), LABEL(input_value), DEFAULT_VALUE(input_value), LENGTH(input_value) | `wifimanager_add_parameter(math_number(0), math_number(0), math_number(0), math_number(0))` | `wm.addParameter(&` |
| `wifimanager_get_parameter` | Value | PARAM_ID(input_value) | `wifimanager_get_parameter(math_number(0))` | (dynamic code) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | true, false | 阻塞 / 非阻塞 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    wifimanager_init()
    wifimanager_simple_setup(math_number(0), math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, wifimanager_autoconnect(math_number(0), math_number(0)))
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order
