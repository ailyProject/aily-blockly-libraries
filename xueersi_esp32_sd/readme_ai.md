# Xueersi ESP32 TF Card

Board-specific TF card blocks based on `esp32_SD`, using HSPI independently or sharing TFT_eSPI's instance when available.

## Library Info

| Field | Value |
|---|---|
| Package | `@aily-project/lib-xueersi-esp32-sd` |
| Version | `1.0.3` |
| Boards | Xueersi ESP32 handheld |
| Protocol | Shared HSPI |

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `xueersi_esp32_sd_init` | Statement | none | `xueersi_esp32_sd_init()` | Mount CS22 on shared or standalone HSPI at the highest verified frequency |
| `xueersi_esp32_sd_end` | Statement | none | `xueersi_esp32_sd_end()` | `SD.end()` |
| `xueersi_esp32_sd_card_info` | Value | INFO | `xueersi_esp32_sd_card_info(cardType)` | Selected `SD` information call |
| `xueersi_esp32_sd_card_type_name` | Value | none | `xueersi_esp32_sd_card_type_name()` | Card enum to `String` |
| `xueersi_esp32_sd_mountpoint` | Value | none | `xueersi_esp32_sd_mountpoint()` | Safe `SD.mountpoint()` string |
| `xueersi_esp32_sd_file_exists` | Value | PATH | `xueersi_esp32_sd_file_exists(...)` | `SD.exists(path)` |
| `xueersi_esp32_sd_open_file_to` | Statement | VAR, PATH, MODE | `xueersi_esp32_sd_open_file_to(...)` | `file = SD.open(...)` |
| `xueersi_esp32_sd_close_file` | Statement | VAR | `xueersi_esp32_sd_close_file(...)` | `file.close()` |
| `xueersi_esp32_sd_file_is_open` | Value | VAR | `xueersi_esp32_sd_file_is_open(...)` | `bool(file)` |
| `xueersi_esp32_sd_write_file` | Statement | VAR, CONTENT | `xueersi_esp32_sd_write_file(...)` | `file.print(...)` |
| `xueersi_esp32_sd_read_file` | Value | VAR | `xueersi_esp32_sd_read_file(...)` | Read remaining text |
| `xueersi_esp32_sd_read_file_bytes` | Value | VAR, LENGTH | `xueersi_esp32_sd_read_file_bytes(...)` | Bounded text read helper |
| `xueersi_esp32_sd_read_byte` | Value | VAR | `xueersi_esp32_sd_read_byte(...)` | `file.read()` |
| `xueersi_esp32_sd_peek_byte` | Value | VAR | `xueersi_esp32_sd_peek_byte(...)` | `file.peek()` |
| `xueersi_esp32_sd_file_available` | Value | VAR | `xueersi_esp32_sd_file_available(...)` | `file.available() > 0` |
| `xueersi_esp32_sd_file_available_bytes` | Value | VAR | `xueersi_esp32_sd_file_available_bytes(...)` | `file.available()` |
| `xueersi_esp32_sd_file_size` | Value | VAR | `xueersi_esp32_sd_file_size(...)` | `file.size()` |
| `xueersi_esp32_sd_file_position` | Value | VAR | `xueersi_esp32_sd_file_position(...)` | `file.position()` |
| `xueersi_esp32_sd_seek_file` | Value | VAR, POSITION, MODE | `xueersi_esp32_sd_seek_file(...)` | `file.seek(...)` |
| `xueersi_esp32_sd_flush_file` | Statement | VAR | `xueersi_esp32_sd_flush_file(...)` | `file.flush()` |
| `xueersi_esp32_sd_write_file_quick` | Statement | PATH, CONTENT | `xueersi_esp32_sd_write_file_quick(...)` | Open, truncate, write, close |
| `xueersi_esp32_sd_read_file_quick` | Value | PATH | `xueersi_esp32_sd_read_file_quick(...)` | Open, read all text, close |
| `xueersi_esp32_sd_append_file` | Statement | PATH, CONTENT | `xueersi_esp32_sd_append_file(...)` | Open, append, close |
| `xueersi_esp32_sd_delete_file` | Statement | PATH | `xueersi_esp32_sd_delete_file(...)` | `SD.remove(path)` |
| `xueersi_esp32_sd_rename_file` | Statement | OLD_PATH, NEW_PATH | `xueersi_esp32_sd_rename_file(...)` | `SD.rename(...)` |
| `xueersi_esp32_sd_create_dir` | Statement | PATH | `xueersi_esp32_sd_create_dir(...)` | `SD.mkdir(path)` |
| `xueersi_esp32_sd_remove_dir` | Statement | PATH | `xueersi_esp32_sd_remove_dir(...)` | `SD.rmdir(path)` |
| `xueersi_esp32_sd_list_dir` | Statement | PATH, LEVELS | `xueersi_esp32_sd_list_dir(...)` | Recursive Serial listing |

## Parameter Options

| Parameter | Values | Notes |
|---|---|---|
| `INFO` | `cardType`, `cardSize`, `totalBytes`, `usedBytes`, `numSectors`, `sectorSize` | Capacity values use MiB; sector size uses bytes |
| File `MODE` | `FILE_READ`, `FILE_WRITE`, `FILE_APPEND` | Write truncates; append preserves existing data |
| Seek `MODE` | `SeekSet`, `SeekCur`, `SeekEnd` | Origin for `File.seek` |

## Notes

- The only initialization block has no inputs. It fixes TFT CS 5, TF CS 22, SCK 18, MISO 19, and MOSI 23.
- When the Xueersi `tftscr_init` block exists, initialization reuses `TFT_eSPI::getSPIinstance()`; otherwise it lazily creates a standalone HSPI instance, so TFT_eSPI is not required. It then tries the board-safe 25/20/16/10/4 MHz range, enumerates up to 32 root entries, reopens the first non-empty regular file by path, and reads 4 KiB samples at five positions before accepting a clock.
- TFT and TF initialization may appear in either order. When both are used, they share one HSPI instance and are separated by their CS pins.
- A mount or probe failure is logged without returning from `setup()`, so later peripheral initialization still runs.
- Whole-file reads return `String` and are intended for small text files. Use byte or bounded reads for large or binary files.
- Generated helpers and block types use `xueersiEsp32Sd...` / `xueersi_esp32_sd_...` names to avoid collisions with the generic `esp32_SD` package.
- `readRAW`/`writeRAW` are intentionally not exposed because they require a correctly sized mutable buffer and raw writes can corrupt the filesystem.
