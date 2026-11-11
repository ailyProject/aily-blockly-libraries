# ESP32 SD_MMC

ESP32 SD_MMC (SDIO mode) reads and writes SD cards, supports 1-bit and 4-bit modes

## Library Info
- **Name**: @aily-project/lib-esp32-sd-mmc
- **Version**: 0.0.2

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp32_sd_mmc_begin` | Statement | MODE(dropdown) | `esp32_sd_mmc_begin(false)` | `if (!sdmmc_mount(false)) { ↵ Serial.println("SD_MMC Mount Failed"); ↵ return; ↵ }` |
| `esp32_sd_mmc_set_pins` | Statement | CLK(input_value), CMD(input_value), D0(input_value) | `esp32_sd_mmc_set_pins(math_number(0), math_number(0), math_number(0))` | `SD_MMC.setPins(1, 1, 1);` |
| `esp32_sd_mmc_end` | Statement | (none) | `esp32_sd_mmc_end()` | `SD_MMC.end();` |
| `esp32_sd_mmc_info` | Value | INFO(dropdown) | `esp32_sd_mmc_info(cardType)` | `SD_MMC.cardType()` |
| `esp32_sd_mmc_write_file` | Statement | PATH(input_value), CONTENT(input_value) | `esp32_sd_mmc_write_file(text("value"), text("value"))` | `sdmmc_writeFile("value", String("value").c_str());` |
| `esp32_sd_mmc_append_file` | Statement | PATH(input_value), CONTENT(input_value) | `esp32_sd_mmc_append_file(text("value"), text("value"))` | `sdmmc_appendFile("value", String("value").c_str());` |
| `esp32_sd_mmc_read_file` | Value | PATH(input_value) | `esp32_sd_mmc_read_file(text("value"))` | `sdmmc_readFile("value")` |
| `esp32_sd_mmc_delete_file` | Statement | PATH(input_value) | `esp32_sd_mmc_delete_file(text("value"))` | `SD_MMC.remove("value");` |
| `esp32_sd_mmc_exists` | Value | PATH(input_value) | `esp32_sd_mmc_exists(text("value"))` | `SD_MMC.exists("value")` |
| `esp32_sd_mmc_mkdir` | Statement | PATH(input_value) | `esp32_sd_mmc_mkdir(text("value"))` | `SD_MMC.mkdir("value");` |
| `esp32_sd_mmc_rmdir` | Statement | PATH(input_value) | `esp32_sd_mmc_rmdir(text("value"))` | `SD_MMC.rmdir("value");` |

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

### IBox S31: power the card, then mount it in 1-bit mode
```
arduino_setup()
    serial_begin(Serial, 115200)
    xl9555_init(0x27)
    xl9555_name_pin(8, "sd_power", OUTPUT)
    xl9555_write($sd_power, HIGH)
    time_delay(math_number(200))
    xl9555_write($sd_power, LOW)
    time_delay(math_number(250))
    esp32_sd_mmc_begin(true)
    esp32_sd_mmc_append_file(text("/log.txt"), text("boot;"))
    serial_println(Serial, esp32_sd_mmc_read_file(text("/log.txt")))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
3. **Pins**: `esp32_sd_mmc_begin` first sets the pins from the board’s `sdCardPins` (CLK, CMD, D0, plus D1–D3 in 4-bit mode) unless the workspace has an `esp32_sd_mmc_set_pins` block, which then wins. Boards without `sdCardPins` keep the SD_MMC default pins.
4. **Mount retry**: a failed mount calls `SD_MMC.end()` and releases the SDMMC host (`sdmmc_host_deinit`), then tries once more; on IDF 6 the host otherwise stays busy and every later mount fails (0x107).
5. **IBox S31**: CLK=IO24, CMD=IO25, D0=IO20 come from the board; the card power is switched by XL9555 P10 (SD_CTRL, low = on) and the library does not touch it. With the XL9555 library, name P10 as an output, drive it high for 200 ms, then low for 250 ms before `esp32_sd_mmc_begin`, as in the example.
