# ESP8266 LittleFS

Built-in LittleFS file and directory operations for ESP8266.

## Library Info
- **Name**: @aily-project/lib-esp8266-littlefs
- **Version**: 0.0.1
- **Author**: ESP8266 Arduino Core Team
- **Source**: ESP8266 Arduino Core 3.1.2

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `esp8266_littlefs_begin` | Statement | FORMAT(field_dropdown) | `esp8266_littlefs_begin(FORMAT)` | Dynamic code |
| `esp8266_littlefs_end` | Statement | None | `esp8266_littlefs_end()` | Dynamic code |
| `esp8266_littlefs_format` | Statement | None | `esp8266_littlefs_format()` | Dynamic code |
| `esp8266_littlefs_info` | Value | INFO(field_dropdown) | `esp8266_littlefs_info(INFO)` | Dynamic code |
| `esp8266_littlefs_write_file` | Statement | PATH(input_value), CONTENT(input_value) | `esp8266_littlefs_write_file(PATH, CONTENT)` | Dynamic code |
| `esp8266_littlefs_append_file` | Statement | PATH(input_value), CONTENT(input_value) | `esp8266_littlefs_append_file(PATH, CONTENT)` | Dynamic code |
| `esp8266_littlefs_read_file` | Value | PATH(input_value) | `esp8266_littlefs_read_file(PATH)` | Dynamic code |
| `esp8266_littlefs_delete_file` | Statement | PATH(input_value) | `esp8266_littlefs_delete_file(PATH)` | Dynamic code |
| `esp8266_littlefs_exists` | Value | PATH(input_value) | `esp8266_littlefs_exists(PATH)` | Dynamic code |
| `esp8266_littlefs_rename` | Statement | OLD_PATH(input_value), NEW_PATH(input_value) | `esp8266_littlefs_rename(OLD_PATH, NEW_PATH)` | Dynamic code |
| `esp8266_littlefs_mkdir` | Statement | PATH(input_value) | `esp8266_littlefs_mkdir(PATH)` | Dynamic code |
| `esp8266_littlefs_rmdir` | Statement | PATH(input_value) | `esp8266_littlefs_rmdir(PATH)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|---|---|---|
| esp8266_littlefs_begin.FORMAT | true, false | Selects the generated API option. |
| esp8266_littlefs_info.INFO | totalBytes, usedBytes | Selects the generated API option. |

## ABS Examples

Use the initialization block first when one is provided.

## Notes

All types use the `esp8266_` prefix. SDK sources are used directly; no `src.7z` is bundled.
