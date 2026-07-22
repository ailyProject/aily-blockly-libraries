# Ojoy SD

Blockly library for Ojoy SD.

## Library Info
- **Name**: @aily-project/lib-ojoy_sd
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp32_sd_mmc_begin` | Statement | MODE(dropdown) | `esp32_sd_mmc_begin(false)` | Dynamic code |
| `esp32_sd_mmc_end` | Statement | (none) | `esp32_sd_mmc_end()` | SD_MMC.end();\n |
| `esp32_sd_mmc_info` | Value | INFO(dropdown) | `esp32_sd_mmc_info(cardType)` | Dynamic code |
| `esp32_sd_mmc_write_file` | Statement | PATH(input_value), CONTENT(input_value) | `esp32_sd_mmc_write_file(text("value"), text("value"))` | sdmmc_writeFile( |
| `esp32_sd_mmc_append_file` | Statement | PATH(input_value), CONTENT(input_value) | `esp32_sd_mmc_append_file(text("value"), text("value"))` | sdmmc_appendFile( |
| `esp32_sd_mmc_read_file` | Value | PATH(input_value) | `esp32_sd_mmc_read_file(text("value"))` | sdmmc_readFile( |
| `esp32_sd_mmc_delete_file` | Statement | PATH(input_value) | `esp32_sd_mmc_delete_file(text("value"))` | SD_MMC.remove( |
| `esp32_sd_mmc_exists` | Value | PATH(input_value) | `esp32_sd_mmc_exists(text("value"))` | SD_MMC.exists( |
| `esp32_sd_mmc_mkdir` | Statement | PATH(input_value) | `esp32_sd_mmc_mkdir(text("value"))` | SD_MMC.mkdir( |
| `esp32_sd_mmc_rmdir` | Statement | PATH(input_value) | `esp32_sd_mmc_rmdir(text("value"))` | SD_MMC.rmdir( |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | false, true | esp32_sd_mmc_begin |
| INFO | cardType, cardSize, totalBytes, usedBytes | esp32_sd_mmc_info |

## ABS Examples

### Basic Usage
```
arduino_setup()
    esp32_sd_mmc_begin(false)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, esp32_sd_mmc_info(cardType))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
