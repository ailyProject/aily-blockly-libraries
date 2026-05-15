# ESP32 HTTP OTA update

ESP32 HTTP OTA update service, upload firmware through the web page for OTA update

## Library Info
- **Name**: @aily-project/lib-esp32-httpupdateserver
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp32_httpupdateserver_setup` | Statement | VAR(field_variable) | `esp32_httpupdateserver_setup(variables_get($server))` | httpUpdater.setup(& |
| `esp32_httpupdateserver_setup_path` | Statement | VAR(field_variable), PATH(input_value) | `esp32_httpupdateserver_setup_path(variables_get($server), text("value"))` | httpUpdater.setup(& |
| `esp32_httpupdateserver_setup_auth` | Statement | VAR(field_variable), USERNAME(input_value), PASSWORD(input_value) | `esp32_httpupdateserver_setup_auth(variables_get($server), text("value"), text("value"))` | httpUpdater.setup(& |
| `esp32_httpupdateserver_setup_full` | Statement | VAR(field_variable), PATH(input_value), USERNAME(input_value), PASSWORD(input_value) | `esp32_httpupdateserver_setup_full(variables_get($server), text("value"), text("value"), text("value"))` | httpUpdater.setup(& |
| `esp32_httpupdateserver_update_credentials` | Statement | USERNAME(input_value), PASSWORD(input_value) | `esp32_httpupdateserver_update_credentials(text("value"), text("value"))` | httpUpdater.updateCredentials( |

## ABS Examples

### Basic Usage
```
arduino_setup()
    esp32_httpupdateserver_setup(variables_get($server))
    serial_begin(Serial, 9600)

arduino_loop()
    esp32_httpupdateserver_setup_path(variables_get($server), text("value"))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
