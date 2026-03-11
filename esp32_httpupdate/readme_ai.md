# ESP32 HTTPUpdate

ESP32 HTTP固件在线更新库，支持固件和SPIFFS文件系统更新

## Library Info
- **Name**: @aily-project/lib-esp32-httpupdate
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp32_httpupdate_set_led_pin` | Statement | PIN(input_value), LED_ON(dropdown) | `esp32_httpupdate_set_led_pin(math_number(2), HIGH)` | `httpUpdate.setLedPin(` |
| `esp32_httpupdate_set_md5` | Statement | MD5(input_value) | `esp32_httpupdate_set_md5(math_number(0))` | `httpUpdate.setMD5sum(` |
| `esp32_httpupdate_set_auth` | Statement | USER(input_value), PASSWORD(input_value) | `esp32_httpupdate_set_auth(math_number(0), math_number(0))` | `httpUpdate.setAuthorization(` |
| `esp32_httpupdate_update` | Statement | URL(input_value) | `esp32_httpupdate_update(math_number(0))` | (dynamic code) |
| `esp32_httpupdate_update_spiffs` | Statement | URL(input_value) | `esp32_httpupdate_update_spiffs(math_number(0))` | (dynamic code) |
| `esp32_httpupdate_update_secure` | Statement | URL(input_value), CA_CERT(input_value), USER(input_value), PASSWORD(input_value) | `esp32_httpupdate_update_secure(math_number(0), math_number(0), math_number(0), math_number(0))` | (dynamic code) |
| `esp32_httpupdate_update_spiffs_secure` | Statement | URL(input_value), CA_CERT(input_value), USER(input_value), PASSWORD(input_value) | `esp32_httpupdate_update_spiffs_secure(math_number(0), math_number(0), math_number(0), math_number(0))` | (dynamic code) |
| `esp32_httpupdate_on_start` | Statement | (none) | `esp32_httpupdate_on_start()` | `` |
| `esp32_httpupdate_on_end` | Statement | (none) | `esp32_httpupdate_on_end()` | `` |
| `esp32_httpupdate_on_progress` | Statement | (none) | `esp32_httpupdate_on_progress()` | `` |
| `esp32_httpupdate_on_error` | Statement | (none) | `esp32_httpupdate_on_error()` | `` |
| `esp32_httpupdate_get_last_error` | Value | (none) | `esp32_httpupdate_get_last_error()` | `httpUpdate.getLastError()` |
| `esp32_httpupdate_get_last_error_string` | Value | (none) | `esp32_httpupdate_get_last_error_string()` | `httpUpdate.getLastErrorString()` |
| `esp32_httpupdate_result` | Value | (none) | `esp32_httpupdate_result()` | `ret` |
| `esp32_httpupdate_result_list` | Value | CODE(dropdown) | `esp32_httpupdate_result_list(HTTP_UPDATE_FAILED)` | (dynamic code) |
| `esp32_httpupdate_process_current` | Value | (none) | `esp32_httpupdate_process_current()` | `cur` |
| `esp32_httpupdate_process_total` | Value | (none) | `esp32_httpupdate_process_total()` | `total` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| LED_ON | HIGH, LOW | 高电平 / 低电平 |
| CODE | HTTP_UPDATE_FAILED, HTTP_UPDATE_NO_UPDATES, HTTP_UPDATE_OK | 更新失败 / 无更新 / 更新成功 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, esp32_httpupdate_get_last_error())
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order
