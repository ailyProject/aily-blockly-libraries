# ESP32 SD card library

The SD card and file system operation library realizes file reading and writing operations on the SD card through SPI, simplifies large-capacity data storage and management, and is adapted to the ESP32 series developm...

## Library Info
- **Name**: @aily-project/lib-esp32-sd
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp32_sd_begin` | Statement | (none) | `esp32_sd_begin()` | Dynamic code |
| `esp32_sd_begin_custom` | Statement | CS(input_value), SCK(input_value), MISO(input_value), MOSI(input_value), FREQUENCY(input_value) | `esp32_sd_begin_custom(math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `esp32_sd_init` | Statement | SPI(dropdown), SS(input_value), FREQUENCY(input_value) | `esp32_sd_init(SPI, math_number(0), math_number(0))` | Dynamic code |
| `esp32_sd_card_info` | Value | INFO(dropdown) | `esp32_sd_card_info(cardType)` | Dynamic code |
| `esp32_sd_file_exists` | Value | PATH(input_value) | `esp32_sd_file_exists(text("value"))` | SD.exists( |
| `esp32_sd_open_file` | Value | VAR(field_variable), PATH(input_value), MODE(dropdown) | `esp32_sd_open_file(variables_get($file), text("value"), FILE_READ)` | Dynamic code |
| `esp32_sd_close_file` | Statement | VAR(field_variable) | `esp32_sd_close_file(variables_get($file))` | Dynamic code |
| `esp32_sd_write_file` | Statement | VAR(field_variable), CONTENT(input_value) | `esp32_sd_write_file(variables_get($file), text("value"))` | Dynamic code |
| `esp32_sd_read_file` | Value | VAR(field_variable) | `esp32_sd_read_file(variables_get($file))` | Dynamic code |
| `esp32_sd_file_available` | Value | VAR(field_variable) | `esp32_sd_file_available(variables_get($file))` | Dynamic code |
| `esp32_sd_file_size` | Value | VAR(field_variable) | `esp32_sd_file_size(variables_get($file))` | Dynamic code |
| `esp32_sd_write_file_quick` | Statement | PATH(input_value), CONTENT(input_value) | `esp32_sd_write_file_quick(text("value"), text("value"))` | Dynamic code |
| `esp32_sd_read_file_quick` | Value | PATH(input_value) | `esp32_sd_read_file_quick(text("value"))` | Dynamic code |
| `esp32_sd_append_file` | Statement | PATH(input_value), CONTENT(input_value) | `esp32_sd_append_file(text("value"), text("value"))` | Dynamic code |
| `esp32_sd_delete_file` | Statement | PATH(input_value) | `esp32_sd_delete_file(text("value"))` | Dynamic code |
| `esp32_sd_rename_file` | Statement | OLD_PATH(input_value), NEW_PATH(input_value) | `esp32_sd_rename_file(text("value"), text("value"))` | Dynamic code |
| `esp32_sd_create_dir` | Statement | PATH(input_value) | `esp32_sd_create_dir(text("value"))` | Dynamic code |
| `esp32_sd_remove_dir` | Statement | PATH(input_value) | `esp32_sd_remove_dir(text("value"))` | Dynamic code |
| `esp32_sd_list_dir` | Statement | PATH(input_value), LEVELS(input_value) | `esp32_sd_list_dir(text("value"), math_number(0))` | listDir(SD, |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| INFO | cardType, cardSize, totalBytes, usedBytes | esp32_sd_card_info |
| MODE | FILE_READ, FILE_WRITE, FILE_APPEND | esp32_sd_open_file |

## ABS Examples

### Basic Usage
```
arduino_setup()
    esp32_sd_begin()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, esp32_sd_card_info(cardType))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
