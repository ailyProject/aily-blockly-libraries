# ESP32 SPIFFS file system

ESP32 SPIFFS flash file system supports file reading, writing, deletion, renaming and other operations

## Library Info
- **Name**: @aily-project/lib-esp32-spiffs
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp32_spiffs_begin` | Statement | FORMAT(dropdown) | `esp32_spiffs_begin(true)` | Dynamic code |
| `esp32_spiffs_end` | Statement | (none) | `esp32_spiffs_end()` | SPIFFS.end();\n |
| `esp32_spiffs_format` | Statement | (none) | `esp32_spiffs_format()` | SPIFFS.format();\n |
| `esp32_spiffs_info` | Value | INFO(dropdown) | `esp32_spiffs_info(totalBytes)` | SPIFFS. |
| `esp32_spiffs_write_file` | Statement | PATH(input_value), CONTENT(input_value) | `esp32_spiffs_write_file(text("value"), text("value"))` | spiffs_writeFile( |
| `esp32_spiffs_append_file` | Statement | PATH(input_value), CONTENT(input_value) | `esp32_spiffs_append_file(text("value"), text("value"))` | spiffs_appendFile( |
| `esp32_spiffs_read_file` | Value | PATH(input_value) | `esp32_spiffs_read_file(text("value"))` | spiffs_readFile( |
| `esp32_spiffs_delete_file` | Statement | PATH(input_value) | `esp32_spiffs_delete_file(text("value"))` | SPIFFS.remove( |
| `esp32_spiffs_exists` | Value | PATH(input_value) | `esp32_spiffs_exists(text("value"))` | SPIFFS.exists( |
| `esp32_spiffs_rename` | Statement | OLD_PATH(input_value), NEW_PATH(input_value) | `esp32_spiffs_rename(text("value"), text("value"))` | SPIFFS.rename( |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| FORMAT | true, false | esp32_spiffs_begin |
| INFO | totalBytes, usedBytes | esp32_spiffs_info |

## ABS Examples

### Basic Usage
```
arduino_setup()
    esp32_spiffs_begin(true)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, esp32_spiffs_info(totalBytes))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
