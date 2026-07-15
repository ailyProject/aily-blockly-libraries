# Wio Terminal SD Card Storage Library

SD card storage library dedicated to the Wio Terminal onboard SD slot. Supports file read/write, append, delete, rename, and directory management operations.

## Library Info
- **Name**: @aily-project/lib-seeed-wio-sd
- **Version**: 1.0.5

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `seeed_fs_sd_begin` | Statement | None | `seeed_fs_sd_begin()` | `SD.begin(SDCARD_SS_PIN, SDCARD_SPI, 24000000UL)` |
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

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| INFO | cardType, cardSize, totalBytes, usedBytes | seeed_fs_sd_card_info |

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
3. **Onboard SD initialization**: `seeed_fs_sd_begin()` is dedicated to the Wio Terminal onboard SD slot. It has no user frequency input and always generates `SD.begin(SDCARD_SS_PIN, SDCARD_SPI, 24000000UL)`. The HAL also clamps requests to at most 24 MHz.
4. **Legacy projects**: versions that saved a `FREQUENCY` value can still be restored through an invisible compatibility connection. That saved value is ignored and does not change the fixed 24 MHz clock.
