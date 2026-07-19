# ESP32 SD

SPI-mode SD card blocks aligned with Arduino-ESP32 Core 3.3.10 `SD.h` and `FS.h`.

## Library Info

| Field | Value |
|---|---|
| Package | `@aily-project/lib-esp32-sd` |
| Version | `1.0.1` |
| Boards | ESP32 family |
| Protocol | SPI |

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `esp32_sd_begin` | Statement | none | `esp32_sd_begin()` | `SD.begin()` with card check |
| `esp32_sd_begin_custom` | Statement | CS, SCK, MISO, MOSI, FREQUENCY | `esp32_sd_begin_custom(...)` | `SPI.begin(...); SD.begin(...)` |
| `esp32_sd_init` | Statement | SPI, SS, FREQUENCY | `esp32_sd_init(...)` | Setup-time `SD.begin(...)` |
| `esp32_sd_begin_advanced` | Statement | SPI, SS, FREQUENCY, MOUNT_POINT, MAX_FILES, FORMAT_IF_EMPTY | `esp32_sd_begin_advanced(...)` | Full Core 3.x `SD.begin(...)` |
| `esp32_sd_end` | Statement | none | `esp32_sd_end()` | `SD.end()` |
| `esp32_sd_card_info` | Value | INFO | `esp32_sd_card_info(cardType)` | Selected `SD` information call |
| `esp32_sd_card_type_name` | Value | none | `esp32_sd_card_type_name()` | Card enum to `String` |
| `esp32_sd_mountpoint` | Value | none | `esp32_sd_mountpoint()` | Safe `SD.mountpoint()` string |
| `esp32_sd_file_exists` | Value | PATH | `esp32_sd_file_exists(...)` | `SD.exists(path)` |
| `esp32_sd_open_file` | Value | VAR, PATH, MODE | `esp32_sd_open_file(...)` | Legacy assignment expression |
| `esp32_sd_open_file_to` | Statement | VAR, PATH, MODE | `esp32_sd_open_file_to(...)` | `file = SD.open(...)` |
| `esp32_sd_close_file` | Statement | VAR | `esp32_sd_close_file(...)` | `file.close()` |
| `esp32_sd_file_is_open` | Value | VAR | `esp32_sd_file_is_open(...)` | `bool(file)` |
| `esp32_sd_write_file` | Statement | VAR, CONTENT | `esp32_sd_write_file(...)` | `file.print(...)` |
| `esp32_sd_read_file` | Value | VAR | `esp32_sd_read_file(...)` | Read remaining text |
| `esp32_sd_read_file_bytes` | Value | VAR, LENGTH | `esp32_sd_read_file_bytes(...)` | Bounded text read helper |
| `esp32_sd_read_byte` | Value | VAR | `esp32_sd_read_byte(...)` | `file.read()` |
| `esp32_sd_peek_byte` | Value | VAR | `esp32_sd_peek_byte(...)` | `file.peek()` |
| `esp32_sd_file_available` | Value | VAR | `esp32_sd_file_available(...)` | `file.available() > 0` |
| `esp32_sd_file_available_bytes` | Value | VAR | `esp32_sd_file_available_bytes(...)` | `file.available()` |
| `esp32_sd_file_size` | Value | VAR | `esp32_sd_file_size(...)` | `file.size()` |
| `esp32_sd_file_position` | Value | VAR | `esp32_sd_file_position(...)` | `file.position()` |
| `esp32_sd_seek_file` | Value | VAR, POSITION, MODE | `esp32_sd_seek_file(...)` | `file.seek(...)` |
| `esp32_sd_flush_file` | Statement | VAR | `esp32_sd_flush_file(...)` | `file.flush()` |
| `esp32_sd_write_file_quick` | Statement | PATH, CONTENT | `esp32_sd_write_file_quick(...)` | Open, truncate, write, close |
| `esp32_sd_read_file_quick` | Value | PATH | `esp32_sd_read_file_quick(...)` | Open, read all text, close |
| `esp32_sd_append_file` | Statement | PATH, CONTENT | `esp32_sd_append_file(...)` | Open, append, close |
| `esp32_sd_delete_file` | Statement | PATH | `esp32_sd_delete_file(...)` | `SD.remove(path)` |
| `esp32_sd_rename_file` | Statement | OLD_PATH, NEW_PATH | `esp32_sd_rename_file(...)` | `SD.rename(...)` |
| `esp32_sd_create_dir` | Statement | PATH | `esp32_sd_create_dir(...)` | `SD.mkdir(path)` |
| `esp32_sd_remove_dir` | Statement | PATH | `esp32_sd_remove_dir(...)` | `SD.rmdir(path)` |
| `esp32_sd_list_dir` | Statement | PATH, LEVELS | `esp32_sd_list_dir(...)` | Recursive Serial listing |

## Parameter Options

| Parameter | Values | Notes |
|---|---|---|
| `INFO` | `cardType`, `cardSize`, `totalBytes`, `usedBytes`, `numSectors`, `sectorSize` | Capacity values use MiB; sector size uses bytes |
| File `MODE` | `FILE_READ`, `FILE_WRITE`, `FILE_APPEND` | Write truncates; append preserves existing data |
| Seek `MODE` | `SeekSet`, `SeekCur`, `SeekEnd` | Origin for `File.seek` |
| `FORMAT_IF_EMPTY` | `false`, `true` | `true` can format a card with no mountable FAT filesystem |
| `FREQUENCY` | MHz, default `4` | Multiplied by `1,000,000` for `SD.begin` |

## Notes

- Mount blocks reject `CARD_NONE`. The advanced block emits `SD.begin(ss, spi, frequency, mountpoint, max_files, format_if_empty)`.
- Frequency inputs are displayed in MHz and multiplied by `1,000,000` for `SD.begin`.
- `esp32_sd_open_file` stays defined for saved workspaces but is intentionally absent from the toolbox; use `esp32_sd_open_file_to` for new projects.
- Whole-file reads return `String` and are intended for small text files. Use byte or bounded reads for large or binary files.
- Generated helpers use `esp32Sd...` names to avoid collisions with other filesystem packages.
- `readRAW`/`writeRAW` are intentionally not exposed because they require a correctly sized mutable buffer and raw writes can corrupt the filesystem.
