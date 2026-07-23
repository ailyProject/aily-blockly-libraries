# M5Stack Onboard SD Card

Onboard M5Stack SD card blocks that use the official M5Unified pin table and automatically select SPI or SDMMC. Tough uses its official SCK 18/MISO 38/MOSI 23/CS 4 wiring.

## Library Info
- **Name**: @aily-project/lib-m5stack-sd
- **Version**: 0.1.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `m5stack_sd_init` | Statement | (none) | `m5stack_sd_init()` | Dynamic code |
| `m5stack_sd_available` | Value | (none) | `m5stack_sd_available()` | ailyM5SDMount() |
| `m5stack_sd_exists` | Value | PATH(input_value) | `m5stack_sd_exists(text("value"))` | (ailyM5SDMount() && ailyM5SD->exists(ailyM5SDPath(String( |
| `m5stack_sd_read_text` | Value | PATH(input_value) | `m5stack_sd_read_text(text("value"))` | ailyM5SDReadText(String( |
| `m5stack_sd_write_text` | Statement | MODE(dropdown), PATH(input_value), TEXT(input_value) | `m5stack_sd_write_text(WRITE, text("value"), text("value"))` | ailyM5SDWriteText(String( |
| `m5stack_sd_write_ok` | Value | MODE(dropdown), PATH(input_value), TEXT(input_value) | `m5stack_sd_write_ok(WRITE, text("value"), text("value"))` | ailyM5SDWriteText(String( |
| `m5stack_sd_remove` | Statement | PATH(input_value) | `m5stack_sd_remove(text("value"))` | if (ailyM5SDMount()) ailyM5SD->remove(ailyM5SDPath(String( |
| `m5stack_sd_remove_ok` | Value | PATH(input_value) | `m5stack_sd_remove_ok(text("value"))` | ailyM5SDRemove(String( |
| `m5stack_sd_file_size` | Value | PATH(input_value) | `m5stack_sd_file_size(text("value"))` | ailyM5SDFileSize(String( |
| `m5stack_sd_mkdir` | Value | PATH(input_value) | `m5stack_sd_mkdir(text("value"))` | Dynamic code |
| `m5stack_sd_rmdir` | Value | PATH(input_value) | `m5stack_sd_rmdir(text("value"))` | Dynamic code |
| `m5stack_sd_rename` | Value | FROM(input_value), TO(input_value) | `m5stack_sd_rename(text("from"), text("to"))` | Dynamic code |
| `m5stack_sd_list` | Value | PATH(input_value) | `m5stack_sd_list(text("/"))` | ailyM5SDList(String( |
| `m5stack_sd_space` | Value | KIND(dropdown) | `m5stack_sd_space(CAPACITY)` | ailyM5SDSpace( |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | WRITE, APPEND | m5stack_sd_write_text, m5stack_sd_write_ok |
| KIND | CAPACITY, TOTAL, USED | m5stack_sd_space |

## ABS Examples

### Basic Usage
```
arduino_setup()
    m5stack_sd_init()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, m5stack_sd_available())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
3. Mounting verifies `cardType()` and clears a stale filesystem pointer so a removed/reinserted card can be mounted again.
