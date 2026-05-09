# Seeed Arduino FS + SFUD

SD card and SFUD flash file system operation library for Seeed development boards.

## Library Info
- **Name**: @aily-project/lib-seeed-fs
- **Version**: 1.0.0
- **Includes**:
  - SD FS: `#include <Seeed_Arduino_FS.h>`
  - SFUD FS: `#include <Seeed_Arduino_FS.h>` + `#include <Seeed_SFUD.h>`
  - SFUD Raw: `#include <sfud.h>`
- **Global objects**: `SD` (fs::SDFS), `SFUD` (fs::SFUDFS)

## Block Definitions

### SD Card Filesystem

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `seeed_fs_sd_begin` | Statement | — | `seeed_fs_sd_begin()` | `if (!SD.begin(SDCARD_SS_PIN, SDCARD_SPI, 4000000UL)) { ... }` |
| `seeed_fs_sd_begin_spi` | Statement | SS(input_value), FREQUENCY(input_value) | `seeed_fs_sd_begin_spi(math_number(1), math_number(4000000))` | `if (!SD.begin(ss, SPI, freq)) { ... }` |
| `seeed_fs_sd_card_info` | Value | INFO(field_dropdown) | `seeed_fs_sd_card_info(cardType)` | `SD.cardType()` / `((unsigned long)(SD.cardSize()/(1024*1024)))` etc. |
| `seeed_fs_file_exists` | Value | PATH(input_value) | `seeed_fs_file_exists(text("/test.txt"))` | `SD.exists(path)` |
| `seeed_fs_open_file` | Value | VAR(field_variable), PATH(input_value), MODE(field_dropdown) | `seeed_fs_open_file($file, text("/test.txt"), FILE_READ)` | `file = SD.open(path, MODE)` |
| `seeed_fs_close_file` | Statement | VAR(field_variable) | `seeed_fs_close_file(variables_get($file))` | `file.close();` |
| `seeed_fs_write_file` | Statement | VAR(field_variable), CONTENT(input_value) | `seeed_fs_write_file(variables_get($file), text("hello"))` | `file.print(String(content).c_str());` |
| `seeed_fs_read_file` | Value | VAR(field_variable) | `seeed_fs_read_file(variables_get($file))` | `seeedReadFileContent(file)` |
| `seeed_fs_file_available` | Value | VAR(field_variable) | `seeed_fs_file_available(variables_get($file))` | `file.available()` |
| `seeed_fs_file_size` | Value | VAR(field_variable) | `seeed_fs_file_size(variables_get($file))` | `file.size()` |
| `seeed_fs_write_quick` | Statement | PATH(input_value), CONTENT(input_value) | `seeed_fs_write_quick(text("/hello.txt"), text("Hello World"))` | `seeedWriteFile(path, content);` |
| `seeed_fs_read_quick` | Value | PATH(input_value) | `seeed_fs_read_quick(text("/hello.txt"))` | `seeedReadFile(path)` |
| `seeed_fs_append_file` | Statement | PATH(input_value), CONTENT(input_value) | `seeed_fs_append_file(text("/log.txt"), text("data"))` | `seeedAppendFile(path, content);` |
| `seeed_fs_delete_file` | Statement | PATH(input_value) | `seeed_fs_delete_file(text("/temp.txt"))` | `SD.remove(path)` |
| `seeed_fs_rename_file` | Statement | OLD_PATH(input_value), NEW_PATH(input_value) | `seeed_fs_rename_file(text("/old.txt"), text("/new.txt"))` | `SD.rename(oldPath, newPath)` |
| `seeed_fs_create_dir` | Statement | PATH(input_value) | `seeed_fs_create_dir(text("/mydir"))` | `SD.mkdir(path)` |
| `seeed_fs_remove_dir` | Statement | PATH(input_value) | `seeed_fs_remove_dir(text("/mydir"))` | `SD.rmdir(path)` |
| `seeed_fs_list_dir` | Statement | PATH(input_value), LEVELS(input_value) | `seeed_fs_list_dir(text("/"), math_number(0))` | `seeedListDir(SD, path, levels);` |

### SFUD Flash Filesystem (FS Layer)

> **Note**: `seeed_fs_close_file`, `seeed_fs_write_file`, `seeed_fs_read_file`, `seeed_fs_file_available`, `seeed_fs_file_size` are **shared** with the SD filesystem — the `fs::File` object is compatible.

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `seeed_sfud_fs_begin_qspi` | Statement | — | `seeed_sfud_fs_begin_qspi()` | `while (!SFUD.begin(104000000UL)) { ... }` |
| `seeed_sfud_fs_begin_spi` | Statement | SS(input_value), FREQUENCY(input_value) | `seeed_sfud_fs_begin_spi(math_number(4), math_number(4000000))` | `while (!SFUD.begin(ss, SPI, freq)) { ... }` |
| `seeed_sfud_fs_flash_info` | Value | INFO(field_dropdown) | `seeed_sfud_fs_flash_info(flashSize)` | `((unsigned long)(SFUD.flashSize()))` / `((unsigned long)(SFUD.totalBytes()/(1024*1024)))` etc. |
| `seeed_sfud_fs_file_exists` | Value | PATH(input_value) | `seeed_sfud_fs_file_exists(text("/test.txt"))` | `SFUD.exists(path)` |
| `seeed_sfud_fs_open_file` | Value | VAR(field_variable), PATH(input_value), MODE(field_dropdown) | `seeed_sfud_fs_open_file($flashFile, text("/test.txt"), FILE_READ)` | `flashFile = SFUD.open(path, MODE)` |
| `seeed_sfud_fs_write_quick` | Statement | PATH(input_value), CONTENT(input_value) | `seeed_sfud_fs_write_quick(text("/hello.txt"), text("Hello Flash!"))` | `sfudWriteFile(path, content);` |
| `seeed_sfud_fs_read_quick` | Value | PATH(input_value) | `seeed_sfud_fs_read_quick(text("/hello.txt"))` | `sfudReadFile(path)` |
| `seeed_sfud_fs_append_file` | Statement | PATH(input_value), CONTENT(input_value) | `seeed_sfud_fs_append_file(text("/log.txt"), text("data"))` | `sfudAppendFile(path, content);` |
| `seeed_sfud_fs_delete_file` | Statement | PATH(input_value) | `seeed_sfud_fs_delete_file(text("/temp.txt"))` | `SFUD.remove(path)` |
| `seeed_sfud_fs_rename_file` | Statement | OLD_PATH(input_value), NEW_PATH(input_value) | `seeed_sfud_fs_rename_file(text("/old.txt"), text("/new.txt"))` | `SFUD.rename(oldPath, newPath)` |
| `seeed_sfud_fs_create_dir` | Statement | PATH(input_value) | `seeed_sfud_fs_create_dir(text("/mydir"))` | `SFUD.mkdir(path)` |
| `seeed_sfud_fs_remove_dir` | Statement | PATH(input_value) | `seeed_sfud_fs_remove_dir(text("/mydir"))` | `SFUD.rmdir(path)` |
| `seeed_sfud_fs_list_dir` | Statement | PATH(input_value), LEVELS(input_value) | `seeed_sfud_fs_list_dir(text("/"), math_number(0))` | `seeedListDir(SFUD, path, levels);` |

### SFUD Raw Flash (Low-Level Access)

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `seeed_sfud_init` | Statement | — | `seeed_sfud_init()` | `sfud_init()` + QSPI fast read enable |
| `seeed_sfud_erase` | Statement | ADDR(input_value), SIZE(input_value) | `seeed_sfud_erase(math_number(0), math_number(4096))` | `sfud_erase(flash, addr, size)` |
| `seeed_sfud_write_str` | Statement | ADDR(input_value), CONTENT(input_value) | `seeed_sfud_write_str(math_number(0), text("Hello"))` | `sfudWriteStr(addr, content)` |
| `seeed_sfud_read_str` | Value | ADDR(input_value), LENGTH(input_value) | `seeed_sfud_read_str(math_number(0), math_number(64))` | `sfudReadStr(addr, len)` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| INFO (SD) | cardType, cardSize, totalBytes, usedBytes | SD card information type |
| INFO (SFUD FS) | flashSize, totalBytes, usedBytes | Flash information type |
| MODE | FILE_READ, FILE_WRITE, FILE_APPEND | File open mode |

## ABS Examples

### SD Card Write and Read (Wio Terminal)
```
arduino_setup()
    seeed_fs_sd_begin()
    serial_begin(Serial, 115200)
    seeed_fs_write_quick(text("/hello.txt"), text("Hello Seeed!"))
    serial_println(Serial, seeed_fs_read_quick(text("/hello.txt")))
```

### SFUD Flash Filesystem (Wio Terminal built-in W25Q32, QSPI)
```
arduino_setup()
    seeed_sfud_fs_begin_qspi()
    serial_begin(Serial, 115200)
    seeed_sfud_fs_write_quick(text("/data.txt"), text("Hello Flash!"))
    serial_println(Serial, seeed_sfud_fs_read_quick(text("/data.txt")))

arduino_loop()
    time_delay(math_number(5000))
```

### SFUD Raw Flash Read/Write/Erase
```
arduino_setup()
    seeed_sfud_init()
    serial_begin(Serial, 115200)
    seeed_sfud_erase(math_number(0), math_number(4096))
    seeed_sfud_write_str(math_number(0), text("Hello Raw Flash!"))
    serial_println(Serial, seeed_sfud_read_str(math_number(0), math_number(64)))
```

### SFUD FS Manual File Open/Close
```
arduino_setup()
    seeed_sfud_fs_begin_qspi()
    serial_begin(Serial, 115200)
    variables_set($flashFile, seeed_sfud_fs_open_file($flashFile, text("/log.txt"), FILE_WRITE))
    controls_if()
        @IF0: variables_get($flashFile)
        @DO0:
            seeed_fs_write_file(variables_get($flashFile), text("Log entry 1\n"))
            seeed_fs_close_file(variables_get($flashFile))
```

## Notes

1. **SD init**: Use `seeed_fs_sd_begin` (needs `SDCARD_SS_PIN`/`SDCARD_SPI` board macros, e.g. Wio Terminal) or `seeed_fs_sd_begin_spi` for custom CS pin.
2. **SFUD FS init**: Use `seeed_sfud_fs_begin_qspi` for Wio Terminal's built-in W25Q32 (104MHz QSPI). Use `seeed_sfud_fs_begin_spi` for external SPI flash.
3. **Shared File blocks**: After opening with `seeed_sfud_fs_open_file`, use the same `seeed_fs_close_file`, `seeed_fs_write_file`, `seeed_fs_read_file` blocks — they work on the `fs::File` object regardless of the underlying device.
4. **SFUD Raw vs SFUD FS**: Raw mode (`seeed_sfud_init` + `seeed_sfud_*`) bypasses the filesystem layer and accesses flash memory directly by byte address. Use it for low-level data storage without FAT filesystem overhead. FS mode provides a full FAT filesystem with file paths.
5. **Raw erase alignment**: Flash erase works in sectors (4096 bytes). Address and size should be multiples of 4096 for reliable operation.
6. **Raw write**: `seeed_sfud_write_str` uses `sfud_erase_write` which erases then writes — no need to call erase separately.
7. **Path format**: All FS paths must begin with `/`, e.g. `"/hello.txt"`, `"/mydir"`.
8. **Serial feedback**: All quick/device-level operations print status messages to `Serial` automatically.
