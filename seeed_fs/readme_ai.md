# Seeed SD Card File System Library

Seeed SD card file system operation library. Supports file read/write, append, delete, rename, and directory management on SD cards. Compatible with Seeed development boards (e.g. Wio Terminal, SAMD21) via SPI.

## Library Info
- **Name**: @aily-project/lib-seeed-fs
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `seeed_fs_sd_begin` | Statement | (none) | `seeed_fs_sd_begin()` | Dynamic code |
| `seeed_fs_sd_begin_spi` | Statement | SS(input_value), FREQUENCY(input_value) | `seeed_fs_sd_begin_spi(math_number(0), math_number(0))` | Dynamic code |
| `seeed_fs_sd_card_info` | Value | INFO(dropdown) | `seeed_fs_sd_card_info(cardType)` | Dynamic code |
| `seeed_fs_file_exists` | Value | PATH(input_value) | `seeed_fs_file_exists(text("value"))` | SD.exists( |
| `seeed_fs_open_file` | Value | VAR(field_variable), PATH(input_value), MODE(dropdown) | `seeed_fs_open_file(variables_get($file), text("value"), FILE_READ)` | Dynamic code |
| `seeed_fs_close_file` | Statement | VAR(field_variable) | `seeed_fs_close_file(variables_get($file))` | Dynamic code |
| `seeed_fs_write_file` | Statement | VAR(field_variable), CONTENT(input_value) | `seeed_fs_write_file(variables_get($file), text("value"))` | Dynamic code |
| `seeed_fs_read_file` | Value | VAR(field_variable) | `seeed_fs_read_file(variables_get($file))` | seeedReadFileContent( |
| `seeed_fs_file_available` | Value | VAR(field_variable) | `seeed_fs_file_available(variables_get($file))` | Dynamic code |
| `seeed_fs_file_size` | Value | VAR(field_variable) | `seeed_fs_file_size(variables_get($file))` | Dynamic code |
| `seeed_fs_write_quick` | Statement | PATH(input_value), CONTENT(input_value) | `seeed_fs_write_quick(text("value"), text("value"))` | seeedWriteFile( |
| `seeed_fs_read_quick` | Value | PATH(input_value) | `seeed_fs_read_quick(text("value"))` | seeedReadFile( |
| `seeed_fs_append_file` | Statement | PATH(input_value), CONTENT(input_value) | `seeed_fs_append_file(text("value"), text("value"))` | seeedAppendFile( |
| `seeed_fs_delete_file` | Statement | PATH(input_value) | `seeed_fs_delete_file(text("value"))` | Dynamic code |
| `seeed_fs_rename_file` | Statement | OLD_PATH(input_value), NEW_PATH(input_value) | `seeed_fs_rename_file(text("value"), text("value"))` | Dynamic code |
| `seeed_fs_create_dir` | Statement | PATH(input_value) | `seeed_fs_create_dir(text("value"))` | Dynamic code |
| `seeed_fs_remove_dir` | Statement | PATH(input_value) | `seeed_fs_remove_dir(text("value"))` | Dynamic code |
| `seeed_fs_list_dir` | Statement | PATH(input_value), LEVELS(input_value) | `seeed_fs_list_dir(text("value"), math_number(0))` | seeedListDir(SD, |
| `seeed_sfud_fs_begin_qspi` | Statement | (none) | `seeed_sfud_fs_begin_qspi()` | Dynamic code |
| `seeed_sfud_fs_begin_spi` | Statement | SS(input_value), FREQUENCY(input_value) | `seeed_sfud_fs_begin_spi(math_number(0), math_number(0))` | Dynamic code |
| `seeed_sfud_fs_flash_info` | Value | INFO(dropdown) | `seeed_sfud_fs_flash_info(flashSize)` | Dynamic code |
| `seeed_sfud_fs_file_exists` | Value | PATH(input_value) | `seeed_sfud_fs_file_exists(text("value"))` | SFUD.exists( |
| `seeed_sfud_fs_open_file` | Value | VAR(field_variable), PATH(input_value), MODE(dropdown) | `seeed_sfud_fs_open_file(variables_get($flashFile), text("value"), FILE_READ)` | Dynamic code |
| `seeed_sfud_fs_write_quick` | Statement | PATH(input_value), CONTENT(input_value) | `seeed_sfud_fs_write_quick(text("value"), text("value"))` | sfudWriteFile( |
| `seeed_sfud_fs_read_quick` | Value | PATH(input_value) | `seeed_sfud_fs_read_quick(text("value"))` | sfudReadFile( |
| `seeed_sfud_fs_append_file` | Statement | PATH(input_value), CONTENT(input_value) | `seeed_sfud_fs_append_file(text("value"), text("value"))` | sfudAppendFile( |
| `seeed_sfud_fs_delete_file` | Statement | PATH(input_value) | `seeed_sfud_fs_delete_file(text("value"))` | Dynamic code |
| `seeed_sfud_fs_rename_file` | Statement | OLD_PATH(input_value), NEW_PATH(input_value) | `seeed_sfud_fs_rename_file(text("value"), text("value"))` | Dynamic code |
| `seeed_sfud_fs_create_dir` | Statement | PATH(input_value) | `seeed_sfud_fs_create_dir(text("value"))` | Dynamic code |
| `seeed_sfud_fs_remove_dir` | Statement | PATH(input_value) | `seeed_sfud_fs_remove_dir(text("value"))` | Dynamic code |
| `seeed_sfud_fs_list_dir` | Statement | PATH(input_value), LEVELS(input_value) | `seeed_sfud_fs_list_dir(text("value"), math_number(0))` | seeedListDir(SFUD, |
| `seeed_sfud_init` | Statement | (none) | `seeed_sfud_init()` | Dynamic code |
| `seeed_sfud_erase` | Statement | ADDR(input_value), SIZE(input_value) | `seeed_sfud_erase(math_number(0), math_number(0))` | Dynamic code |
| `seeed_sfud_write_str` | Statement | ADDR(input_value), CONTENT(input_value) | `seeed_sfud_write_str(math_number(0), text("value"))` | sfudWriteStr( |
| `seeed_sfud_read_str` | Value | ADDR(input_value), LENGTH(input_value) | `seeed_sfud_read_str(math_number(0), math_number(0))` | sfudReadStr( |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| INFO | cardType, cardSize, totalBytes, usedBytes | seeed_fs_sd_card_info |
| MODE | FILE_READ, FILE_WRITE, FILE_APPEND | seeed_fs_open_file, seeed_sfud_fs_open_file |
| INFO | flashSize, totalBytes, usedBytes | seeed_sfud_fs_flash_info |

## ABS Examples

### Basic Usage
```
arduino_setup()
    seeed_fs_sd_begin()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, seeed_fs_sd_card_info(cardType))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
