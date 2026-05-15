# ESP32 FFat file system

ESP32 FFat (FAT) flash file system supports file and directory read and write operations

## Library Info
- **Name**: @aily-project/lib-esp32-ffat
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp32_ffat_begin` | Statement | FORMAT(dropdown) | `esp32_ffat_begin(true)` | if (!FFat.begin( |
| `esp32_ffat_end` | Statement | (none) | `esp32_ffat_end()` | FFat.end();\n |
| `esp32_ffat_format` | Statement | (none) | `esp32_ffat_format()` | FFat.format();\n |
| `esp32_ffat_info` | Value | INFO(dropdown) | `esp32_ffat_info(totalBytes)` | FFat. |
| `esp32_ffat_write_file` | Statement | PATH(input_value), CONTENT(input_value) | `esp32_ffat_write_file(text("value"), text("value"))` | ffat_writeFile( |
| `esp32_ffat_append_file` | Statement | PATH(input_value), CONTENT(input_value) | `esp32_ffat_append_file(text("value"), text("value"))` | ffat_appendFile( |
| `esp32_ffat_read_file` | Value | PATH(input_value) | `esp32_ffat_read_file(text("value"))` | ffat_readFile( |
| `esp32_ffat_delete_file` | Statement | PATH(input_value) | `esp32_ffat_delete_file(text("value"))` | FFat.remove( |
| `esp32_ffat_exists` | Value | PATH(input_value) | `esp32_ffat_exists(text("value"))` | FFat.exists( |
| `esp32_ffat_mkdir` | Statement | PATH(input_value) | `esp32_ffat_mkdir(text("value"))` | FFat.mkdir( |
| `esp32_ffat_rmdir` | Statement | PATH(input_value) | `esp32_ffat_rmdir(text("value"))` | FFat.rmdir( |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| FORMAT | true, false | esp32_ffat_begin |
| INFO | totalBytes, usedBytes, freeBytes | esp32_ffat_info |

## ABS Examples

### Basic Usage
```
arduino_setup()
    esp32_ffat_begin(true)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, esp32_ffat_info(totalBytes))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
