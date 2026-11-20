# @aily-project/lib-rlcd42-sd

## Library Info

- **Name**: @aily-project/lib-rlcd42-sd
- **Version**: 0.0.1
- **Purpose**: SD card driver for the Waveshare ESP32-S3-RLCD-4.2 in 1-bit SDMMC mode. Mounts the card, reports capacity, reads, writes and appends text files, checks existence and lists directories.
- **Wiring**: on-board SDMMC 1-bit bus, CLK=38, CMD=21, D0=39 by default.
- **License**: UNLICENSED (see package.json). Author: Bryan.

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
| --- | --- | --- | --- | --- |
| `rlcd42_sd_init` | Statement | CLK(input_value), CMD(input_value), D0(input_value) | `rlcd42_sd_init(math_number(38), math_number(21), math_number(39))` | `#include "Sd42.h"`↵`sd42Begin(38, 21, 39);` |
| `rlcd42_sd_ok` | Value | (none) | `rlcd42_sd_ok()` | `#include "Sd42.h"`↵`sd42Ok()` |
| `rlcd42_sd_size_mb` | Value | (none) | `rlcd42_sd_size_mb()` | `#include "Sd42.h"`↵`sd42SizeMb()` |
| `rlcd42_sd_free_mb` | Value | (none) | `rlcd42_sd_free_mb()` | `#include "Sd42.h"`↵`sd42FreeMb()` |
| `rlcd42_sd_read` | Value | PATH(input_value) | `rlcd42_sd_read(text("/sdcard/a.txt"))` | `#include "Sd42.h"`↵`sd42ReadFile("/sdcard/a.txt")` |
| `rlcd42_sd_write` | Statement | PATH(input_value), TEXT(input_value) | `rlcd42_sd_write(text("/sdcard/a.txt"), text("hello"))` | `#include "Sd42.h"`↵`sd42WriteFile("/sdcard/a.txt", "hello");` |
| `rlcd42_sd_append` | Statement | PATH(input_value), TEXT(input_value) | `rlcd42_sd_append(text("/sdcard/a.txt"), text("more"))` | `#include "Sd42.h"`↵`sd42AppendFile("/sdcard/a.txt", "more");` |
| `rlcd42_sd_exists` | Value | PATH(input_value) | `rlcd42_sd_exists(text("/sdcard/a.txt"))` | `#include "Sd42.h"`↵`sd42Exists("/sdcard/a.txt")` |
| `rlcd42_sd_list` | Value | PATH(input_value) | `rlcd42_sd_list(text("/sdcard"))` | `#include "Sd42.h"`↵`sd42List("/sdcard")` |

## Parameter Options

This library has no dropdown parameters. All three pin inputs and both path and text inputs are value inputs:

| Parameter | Values | Description |
| --- | --- | --- |
| CLK, CMD, D0 | numeric value input | SDMMC 1-bit pins. The board defaults are 38, 21 and 39 and are used when an input is left empty. |
| PATH | text value input | Absolute path on the mounted filesystem, for example `/sdcard/a.txt`. The default when empty is `/sdcard/a.txt`, or `/sdcard` for `rlcd42_sd_list`. |
| TEXT | text value input | Content to write or append. The default when empty is an empty string. |

## ABS Examples

### Write, read back and list

```abs
arduino_setup()
    serial_begin(Serial, 9600)
    rlcd42_sd_init(math_number(38), math_number(21), math_number(39))

arduino_loop()
    serial_println(Serial, rlcd42_sd_ok())
    rlcd42_sd_write(text("/sdcard/a.txt"), text("hello"))
    serial_println(Serial, rlcd42_sd_read(text("/sdcard/a.txt")))
    serial_println(Serial, rlcd42_sd_list(text("/sdcard")))
    time_delay(math_number(5000))
```

### Report capacity and append a log line

```abs
arduino_setup()
    serial_begin(Serial, 9600)
    rlcd42_sd_init(math_number(38), math_number(21), math_number(39))

arduino_loop()
    serial_println(Serial, rlcd42_sd_size_mb())
    serial_println(Serial, rlcd42_sd_free_mb())
    rlcd42_sd_append(text("/sdcard/log.txt"), text("tick"))
    serial_println(Serial, rlcd42_sd_exists(text("/sdcard/log.txt")))
    time_delay(math_number(10000))
```

## Notes

- Call `rlcd42_sd_init` once before any other block of this library. Every block emits `#include "Sd42.h"`, but only the init block calls `sd42Begin`, which performs the mount.
- `rlcd42_sd_ok` reports whether the card is currently mounted. Check it before reading or writing; operations on an unmounted card fail silently and return empty results.
- The bus is SDMMC 1-bit. The three pin inputs must stay on the board wiring (CLK=38, CMD=21, D0=39); changing them to other pins requires matching hardware.
- `rlcd42_sd_read`, `rlcd42_sd_list` and the size blocks return values, so they must be used inside a value input or a `serial_println` style call, not as standalone statements.
- `rlcd42_sd_list` returns the directory listing as one `String`, not an array; split it yourself if individual entries are needed.
- `rlcd42_sd_write` truncates the target file, while `rlcd42_sd_append` adds to the end. Use append for logs to avoid rewriting the whole file.
- Paths are absolute on the mounted filesystem and use `/` as separator. The default `/sdcard/a.txt` assumes the mount point used by the driver; verify the real mount point with `rlcd42_sd_list` if a path is not found.
- Card insertion is not hot-plug safe: mount happens in `rlcd42_sd_init`, so re-inserting a card requires another init call.
