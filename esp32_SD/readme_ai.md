# ESP32 SD卡库

SD卡及文件系统操作库,通过SPI实现对SD卡的文件读写操作，简化大容量数据存储与管理，适配ESP32系列开发板。支持多种文件系统（如FAT32）、文件和目录操作、数据流读写、卡容量检测。

## Library Info
- **Name**: @aily-project/lib-esp32-sd
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp32_sd_begin` | Statement | (none) | `esp32_sd_begin()` | (dynamic code) |
| `esp32_sd_begin_custom` | Statement | CS(input_value), SCK(input_value), MISO(input_value), MOSI(input_value), FREQUENCY(input_value) | `esp32_sd_begin_custom(math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | (dynamic code) |
| `esp32_sd_init` | Statement | SPI(dropdown), SS(input_value), FREQUENCY(input_value) | `esp32_sd_init(SPI, math_number(0), math_number(0))` | `` |
| `esp32_sd_card_info` | Value | INFO(dropdown) | `esp32_sd_card_info(cardType)` | (dynamic code) |
| `esp32_sd_file_exists` | Value | PATH(input_value) | `esp32_sd_file_exists(math_number(0))` | `SD.exists(` |
| `esp32_sd_open_file` | Value | VAR(field_variable), PATH(input_value), MODE(dropdown) | `esp32_sd_open_file($file, math_number(0), FILE_READ)` | (dynamic code) |
| `esp32_sd_close_file` | Statement | VAR(field_variable) | `esp32_sd_close_file($file)` | (dynamic code) |
| `esp32_sd_write_file` | Statement | VAR(field_variable), CONTENT(input_value) | `esp32_sd_write_file($file, math_number(0))` | (dynamic code) |
| `esp32_sd_read_file` | Value | VAR(field_variable) | `esp32_sd_read_file($file)` | (dynamic code) |
| `esp32_sd_file_available` | Value | VAR(field_variable) | `esp32_sd_file_available($file)` | (dynamic code) |
| `esp32_sd_file_size` | Value | VAR(field_variable) | `esp32_sd_file_size($file)` | (dynamic code) |
| `esp32_sd_write_file_quick` | Statement | PATH(input_value), CONTENT(input_value) | `esp32_sd_write_file_quick(math_number(0), math_number(0))` | (dynamic code) |
| `esp32_sd_read_file_quick` | Value | PATH(input_value) | `esp32_sd_read_file_quick(math_number(0))` | (dynamic code) |
| `esp32_sd_append_file` | Statement | PATH(input_value), CONTENT(input_value) | `esp32_sd_append_file(math_number(0), math_number(0))` | (dynamic code) |
| `esp32_sd_delete_file` | Statement | PATH(input_value) | `esp32_sd_delete_file(math_number(0))` | (dynamic code) |
| `esp32_sd_rename_file` | Statement | OLD_PATH(input_value), NEW_PATH(input_value) | `esp32_sd_rename_file(math_number(0), math_number(0))` | (dynamic code) |
| `esp32_sd_create_dir` | Statement | PATH(input_value) | `esp32_sd_create_dir(math_number(0))` | (dynamic code) |
| `esp32_sd_remove_dir` | Statement | PATH(input_value) | `esp32_sd_remove_dir(math_number(0))` | (dynamic code) |
| `esp32_sd_list_dir` | Statement | PATH(input_value), LEVELS(input_value) | `esp32_sd_list_dir(math_number(0), math_number(0))` | `listDir(SD,` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| INFO | cardType, cardSize, totalBytes, usedBytes | 卡类型 / 卡大小(MB) / 总空间(MB) / 已用空间(MB) |
| MODE | FILE_READ, FILE_WRITE, FILE_APPEND | 读取 / 写入 / 追加 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    esp32_sd_begin()
    esp32_sd_begin_custom(math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))
    esp32_sd_init(SPI, math_number(0), math_number(0))
    esp32_sd_create_dir(math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, esp32_sd_card_info(cardType))
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order
