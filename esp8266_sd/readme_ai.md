# ESP8266 SD Storage

Built-in SD card file and directory operations for ESP8266.

## Library Info
- **Name**: @aily-project/lib-esp8266-sd
- **Version**: 1.0.1
- **Author**: ESP8266 Arduino Core Team
- **Source**: ESP8266 Arduino Core 3.1.2

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `esp8266_sd_begin` | Statement | CS_PIN(field_dropdown) | `esp8266_sd_begin(CS_PIN)` | Dynamic code |
| `esp8266_sd_end` | Statement | None | `esp8266_sd_end()` | Dynamic code |
| `esp8266_sd_file_exists` | Value | PATH(input_value) | `esp8266_sd_file_exists(PATH)` | Dynamic code |
| `esp8266_sd_open_file` | Value | VAR(field_variable), PATH(input_value), MODE(field_dropdown) | `esp8266_sd_open_file(VAR, PATH, MODE)` | Dynamic code |
| `esp8266_sd_open_file_to` | Statement | VAR(field_variable), PATH(input_value), MODE(field_dropdown) | `esp8266_sd_open_file_to(VAR, PATH, MODE)` | Dynamic code |
| `esp8266_sd_close_file` | Statement | VAR(field_variable) | `esp8266_sd_close_file(VAR)` | Dynamic code |
| `esp8266_sd_file_is_open` | Value | VAR(field_variable) | `esp8266_sd_file_is_open(VAR)` | Dynamic code |
| `esp8266_sd_write_file` | Statement | VAR(field_variable), CONTENT(input_value) | `esp8266_sd_write_file(VAR, CONTENT)` | Dynamic code |
| `esp8266_sd_read_file` | Value | VAR(field_variable) | `esp8266_sd_read_file(VAR)` | Dynamic code |
| `esp8266_sd_read_file_bytes` | Value | VAR(field_variable), LENGTH(input_value) | `esp8266_sd_read_file_bytes(VAR, LENGTH)` | Dynamic code |
| `esp8266_sd_read_byte` | Value | VAR(field_variable) | `esp8266_sd_read_byte(VAR)` | Dynamic code |
| `esp8266_sd_peek_byte` | Value | VAR(field_variable) | `esp8266_sd_peek_byte(VAR)` | Dynamic code |
| `esp8266_sd_file_available` | Value | VAR(field_variable) | `esp8266_sd_file_available(VAR)` | Dynamic code |
| `esp8266_sd_file_available_bytes` | Value | VAR(field_variable) | `esp8266_sd_file_available_bytes(VAR)` | Dynamic code |
| `esp8266_sd_file_size` | Value | VAR(field_variable) | `esp8266_sd_file_size(VAR)` | Dynamic code |
| `esp8266_sd_file_position` | Value | VAR(field_variable) | `esp8266_sd_file_position(VAR)` | Dynamic code |
| `esp8266_sd_seek_file` | Value | VAR(field_variable), POSITION(input_value), MODE(field_dropdown) | `esp8266_sd_seek_file(VAR, POSITION, MODE)` | Dynamic code |
| `esp8266_sd_flush_file` | Statement | VAR(field_variable) | `esp8266_sd_flush_file(VAR)` | Dynamic code |
| `esp8266_sd_write_file_quick` | Statement | PATH(input_value), CONTENT(input_value) | `esp8266_sd_write_file_quick(PATH, CONTENT)` | Dynamic code |
| `esp8266_sd_read_file_quick` | Value | PATH(input_value) | `esp8266_sd_read_file_quick(PATH)` | Dynamic code |
| `esp8266_sd_append_file` | Statement | PATH(input_value), CONTENT(input_value) | `esp8266_sd_append_file(PATH, CONTENT)` | Dynamic code |
| `esp8266_sd_delete_file` | Statement | PATH(input_value) | `esp8266_sd_delete_file(PATH)` | Dynamic code |
| `esp8266_sd_rename_file` | Statement | OLD_PATH(input_value), NEW_PATH(input_value) | `esp8266_sd_rename_file(OLD_PATH, NEW_PATH)` | Dynamic code |
| `esp8266_sd_create_dir` | Statement | PATH(input_value) | `esp8266_sd_create_dir(PATH)` | Dynamic code |
| `esp8266_sd_remove_dir` | Statement | PATH(input_value) | `esp8266_sd_remove_dir(PATH)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|---|---|---|
| esp8266_sd_begin.CS_PIN | board-provided options | Selects the generated API option. |
| esp8266_sd_open_file.MODE | FILE_READ, FILE_WRITE, FILE_APPEND | Selects the generated API option. |
| esp8266_sd_open_file_to.MODE | FILE_READ, FILE_WRITE, FILE_APPEND | Selects the generated API option. |
| esp8266_sd_seek_file.MODE | SeekSet, SeekCur, SeekEnd | Selects the generated API option. |

## ABS Examples

Use the initialization block first when one is provided.

## Notes

All types use the `esp8266_` prefix. SDK sources are used directly; no `src.7z` is bundled.
