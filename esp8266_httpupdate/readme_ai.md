# ESP8266 HTTP Update

HTTP firmware and filesystem update blocks for ESP8266.

## Library Info
- **Name**: @aily-project/lib-esp8266-httpupdate
- **Version**: 1.0.0
- **Author**: ESP8266 Arduino Core Team
- **Source**: ESP8266 Arduino Core 3.1.2

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `esp8266_httpupdate_set_led_pin` | Statement | PIN(input_value), LED_ON(field_dropdown) | `esp8266_httpupdate_set_led_pin(PIN, LED_ON)` | Dynamic code |
| `esp8266_httpupdate_set_md5` | Statement | MD5(input_value) | `esp8266_httpupdate_set_md5(MD5)` | Dynamic code |
| `esp8266_httpupdate_set_auth` | Statement | USER(input_value), PASSWORD(input_value) | `esp8266_httpupdate_set_auth(USER, PASSWORD)` | Dynamic code |
| `esp8266_httpupdate_update` | Statement | URL(input_value) | `esp8266_httpupdate_update(URL)` | Dynamic code |
| `esp8266_httpupdate_update_spiffs` | Statement | URL(input_value) | `esp8266_httpupdate_update_spiffs(URL)` | Dynamic code |
| `esp8266_httpupdate_on_start` | Hat | None | `esp8266_httpupdate_on_start()` | Dynamic code |
| `esp8266_httpupdate_on_end` | Hat | None | `esp8266_httpupdate_on_end()` | Dynamic code |
| `esp8266_httpupdate_on_progress` | Hat | None | `esp8266_httpupdate_on_progress()` | Dynamic code |
| `esp8266_httpupdate_on_error` | Hat | None | `esp8266_httpupdate_on_error()` | Dynamic code |
| `esp8266_httpupdate_get_last_error` | Value | None | `esp8266_httpupdate_get_last_error()` | Dynamic code |
| `esp8266_httpupdate_get_last_error_string` | Value | None | `esp8266_httpupdate_get_last_error_string()` | Dynamic code |
| `esp8266_httpupdate_result` | Value | None | `esp8266_httpupdate_result()` | Dynamic code |
| `esp8266_httpupdate_result_list` | Value | CODE(field_dropdown) | `esp8266_httpupdate_result_list(CODE)` | Dynamic code |
| `esp8266_httpupdate_process_current` | Value | None | `esp8266_httpupdate_process_current()` | Dynamic code |
| `esp8266_httpupdate_process_total` | Value | None | `esp8266_httpupdate_process_total()` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|---|---|---|
| esp8266_httpupdate_set_led_pin.LED_ON | HIGH, LOW | Selects the generated API option. |
| esp8266_httpupdate_result_list.CODE | HTTP_UPDATE_FAILED, HTTP_UPDATE_NO_UPDATES, HTTP_UPDATE_OK | Selects the generated API option. |

## ABS Examples

Use the initialization block first when one is provided.

## Notes

All types use the `esp8266_` prefix. SDK sources are used directly; no `src.7z` is bundled.
