# ESP32 HTTPUpdate

ESP32 HTTP firmware online update library, supports firmware and SPIFFS file system updates

## Library Info
- **Name**: @aily-project/lib-esp32-httpupdate
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp32_httpupdate_set_led_pin` | Statement | PIN(input_value), LED_ON(dropdown) | `esp32_httpupdate_set_led_pin(math_number(2), HIGH)` | httpUpdate.setLedPin( |
| `esp32_httpupdate_set_md5` | Statement | MD5(input_value) | `esp32_httpupdate_set_md5(text("value"))` | httpUpdate.setMD5sum( |
| `esp32_httpupdate_set_auth` | Statement | USER(input_value), PASSWORD(input_value) | `esp32_httpupdate_set_auth(text("value"), text("value"))` | httpUpdate.setAuthorization( |
| `esp32_httpupdate_update` | Statement | URL(input_value) | `esp32_httpupdate_update(text("value"))` | Dynamic code |
| `esp32_httpupdate_update_spiffs` | Statement | URL(input_value) | `esp32_httpupdate_update_spiffs(text("value"))` | Dynamic code |
| `esp32_httpupdate_update_secure` | Statement | URL(input_value), CA_CERT(input_value), USER(input_value), PASSWORD(input_value) | `esp32_httpupdate_update_secure(text("value"), text("value"), text("value"), text("value"))` | Dynamic code |
| `esp32_httpupdate_update_spiffs_secure` | Statement | URL(input_value), CA_CERT(input_value), USER(input_value), PASSWORD(input_value) | `esp32_httpupdate_update_spiffs_secure(text("value"), text("value"), text("value"), text("value"))` | Dynamic code |
| `esp32_httpupdate_on_start` | Hat | HANDLER(input_statement) | `esp32_httpupdate_on_start() @HANDLER: child_block()` | httpUpdate.onStart( |
| `esp32_httpupdate_on_end` | Hat | HANDLER(input_statement) | `esp32_httpupdate_on_end() @HANDLER: child_block()` | httpUpdate.onEnd( |
| `esp32_httpupdate_on_progress` | Hat | HANDLER(input_statement) | `esp32_httpupdate_on_progress() @HANDLER: child_block()` | httpUpdate.onProgress( |
| `esp32_httpupdate_on_error` | Hat | HANDLER(input_statement) | `esp32_httpupdate_on_error() @HANDLER: child_block()` | httpUpdate.onError( |
| `esp32_httpupdate_get_last_error` | Value | (none) | `esp32_httpupdate_get_last_error()` | httpUpdate.getLastError() |
| `esp32_httpupdate_get_last_error_string` | Value | (none) | `esp32_httpupdate_get_last_error_string()` | httpUpdate.getLastErrorString() |
| `esp32_httpupdate_result` | Value | (none) | `esp32_httpupdate_result()` | Dynamic code |
| `esp32_httpupdate_result_list` | Value | CODE(dropdown) | `esp32_httpupdate_result_list(HTTP_UPDATE_FAILED)` | Dynamic code |
| `esp32_httpupdate_process_current` | Value | (none) | `esp32_httpupdate_process_current()` | Dynamic code |
| `esp32_httpupdate_process_total` | Value | (none) | `esp32_httpupdate_process_total()` | total |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| LED_ON | HIGH, LOW | esp32_httpupdate_set_led_pin |
| CODE | HTTP_UPDATE_FAILED, HTTP_UPDATE_NO_UPDATES, HTTP_UPDATE_OK | esp32_httpupdate_result_list |

## ABS Examples

### Basic Usage
```
arduino_setup()
    esp32_httpupdate_set_led_pin(math_number(2), HIGH)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, esp32_httpupdate_get_last_error())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
