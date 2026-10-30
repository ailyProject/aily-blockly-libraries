# IBox S31 SD Card

IBox S31 microSD card: power-up and mount, read/write self-test, capacity and text file access

## Library Info
- **Name**: @aily-project/lib-iboxs31_sdcard
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `iboxs31_sdcard_init` | Statement | TEST(dropdown) | `iboxs31_sdcard_init(true)` | `iboxs31_sdcard.begin(true);` |
| `iboxs31_sdcard_state` | Value | WHAT(dropdown) | `iboxs31_sdcard_state(MOUNTED)` | `iboxs31_sdcard.mounted()` |
| `iboxs31_sdcard_size` | Value | (none) | `iboxs31_sdcard_size()` | `iboxs31_sdcard.sizeGB()` |
| `iboxs31_sdcard_status` | Value | (none) | `iboxs31_sdcard_status()` | `String(IBoxS31_SDCard::statusName(iboxs31_sdcard.status()))` |
| `iboxs31_sdcard_write` | Statement | MODE(dropdown), PATH(input_value), TEXT(input_value) | `iboxs31_sdcard_write(WRITE, text("value"), text("value"))` | `iboxs31_sdcard_write(String("value"), String("value"), false);` |
| `iboxs31_sdcard_read` | Value | PATH(input_value) | `iboxs31_sdcard_read(text("value"))` | `iboxs31_sdcard_read(String("value"))` |
| `iboxs31_sdcard_exists` | Value | PATH(input_value) | `iboxs31_sdcard_exists(text("value"))` | `(iboxs31_sdcard.mounted() && SD_MMC.exists(iboxs31_sdcard_path(String("value"))))` |
| `iboxs31_sdcard_remove` | Statement | PATH(input_value) | `iboxs31_sdcard_remove(text("value"))` | `if (iboxs31_sdcard.mounted()) SD_MMC.remove(iboxs31_sdcard_path(String("value")));` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| TEST | true, false | iboxs31_sdcard_init |
| WHAT | MOUNTED, RW_OK | iboxs31_sdcard_state |
| MODE | WRITE, APPEND | iboxs31_sdcard_write |

## ABS Examples

### Append a timestamp to the card every second
```abs
arduino_setup()
    serial_begin(Serial, 115200)
    iboxs31_sdcard_init(true)
    serial_println(Serial, text_join(ADD0=text("SD "), ADD1=iboxs31_sdcard_status(), ADD2=text(" "), ADD3=iboxs31_sdcard_size()))

arduino_loop()
    controls_if()
        @IF0: iboxs31_sdcard_state(MOUNTED)
        @DO0:
            iboxs31_sdcard_write(APPEND, text("/log.txt"), text_join(ADD0=time_millis(), ADD1=text(";")))
    time_delay(math_number(1000))
```

### Read a file back
```abs
arduino_setup()
    serial_begin(Serial, 115200)
    iboxs31_sdcard_init(false)
    controls_ifelse(iboxs31_sdcard_exists(text("/log.txt")))
        @DO0:
            serial_println(Serial, iboxs31_sdcard_read(text("/log.txt")))
        @ELSE:
            serial_println(Serial, text("no log yet"))
```

## Notes

1. **Board**: IBox S31 only (Aily board IBOX S31, ESP32-S31, Arduino-ESP32 4.0.0). The card uses 1-bit SDMMC (D0=IO20, CLK=IO24, CMD=IO25) with internal pull-ups, and its power switch is IO39, driven low by `iboxs31_sdcard_init`.
2. **Format**: FAT/FAT32 only; the card is never formatted automatically. Restart after swapping cards.
3. **Status**: `OK` = mounted and the self-test write/read-back matched; `R/W?` = mounted but the self-test failed (bad block or poor contact); `FAIL` = not mounted (no card, not FAT, or slot fault).
4. **Files**: paths start with `/` (one is added if missing) and are relative to the mount point `/sdcard`. `iboxs31_sdcard_read` loads the whole file into a String, so keep files small. The library also exposes `SD_MMC`, so other FS code can use the same card.
