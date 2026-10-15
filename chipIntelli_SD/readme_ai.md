# CI13XX SD Card

Access FAT16/FAT32 SD cards through CI13XX GPIO software SPI with custom pins, diagnostics, and file and directory operations.

## Library Info
- **Name**: @aily-project/lib-chipintelli-sd
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `chipintelli_sd_init_pins` | Statement | SCK(input_value), MISO(input_value), MOSI(input_value), CS(input_value) | `chipintelli_sd_init_pins(math_number(5), math_number(2), math_number(4), math_number(3))` | `#include <SD.h>` ↵ setup: `SD.begin(5, 2, 4, 3);` |
| `chipintelli_sd_error_info` | Value (Number) | INFO(dropdown) | `chipintelli_sd_error_info(cardErrorCode)` | `#include <SD.h>` ↵ `SD.cardErrorCode()` |
| `chipintelli_sd_end` | Statement | (none) | `chipintelli_sd_end()` | `#include <SD.h>` ↵ `SD.end();` |
| `chipintelli_sd_exists` | Value (Boolean) | PATH(input_value) | `chipintelli_sd_exists(text("/data.txt"))` | `#include <SD.h>` ↵ `SD.exists("/data.txt")` |
| `chipintelli_sd_path_operation` | Statement | OP(dropdown), PATH(input_value) | `chipintelli_sd_path_operation(mkdir, text("/data"))` | `#include <SD.h>` ↵ `SD.mkdir("/data");` |
| `chipintelli_sd_file_create` | Statement | PATH(input_value), MODE(dropdown), VAR(field_input) | `chipintelli_sd_file_create(text("/data.txt"), FILE_READ, "sdFile")` | `#include <SD.h>` ↵ `File sdFile;` ↵ `sdFile = SD.open("/data.txt", FILE_READ);` |
| `chipintelli_sd_file_create_next` | Statement | DIR(field_variable), MODE(dropdown), VAR(field_input) | `chipintelli_sd_file_create_next($root, FILE_READ, "entry")` | `#include <SD.h>` ↵ `File entry;` ↵ `entry = root.openNextFile(FILE_READ);` |
| `chipintelli_sd_file_is_open` | Value (Boolean) | VAR(field_variable) | `chipintelli_sd_file_is_open($sdFile)` | `#include <SD.h>` ↵ `(bool)sdFile` |
| `chipintelli_sd_file_is_directory` | Value (Boolean) | VAR(field_variable) | `chipintelli_sd_file_is_directory($sdFile)` | `#include <SD.h>` ↵ `sdFile.isDirectory()` |
| `chipintelli_sd_file_name` | Value (String) | VAR(field_variable) | `chipintelli_sd_file_name($sdFile)` | `#include <SD.h>` ↵ `String(sdFile.name())` |
| `chipintelli_sd_file_read` | Value (Number) | VAR(field_variable), OP(dropdown) | `chipintelli_sd_file_read($sdFile, read)` | `#include <SD.h>` ↵ `sdFile.read()` |
| `chipintelli_sd_file_available` | Value (Number) | VAR(field_variable), OP(dropdown) | `chipintelli_sd_file_available($sdFile, available)` | `#include <SD.h>` ↵ `sdFile.available()` |
| `chipintelli_sd_file_position` | Value (Number) | VAR(field_variable), OP(dropdown) | `chipintelli_sd_file_position($sdFile, position)` | `#include <SD.h>` ↵ `sdFile.position()` |
| `chipintelli_sd_file_seek` | Value (Boolean) | VAR(field_variable), POSITION(input_value) | `chipintelli_sd_file_seek($sdFile, math_number(0))` | `#include <SD.h>` ↵ `sdFile.seek(0)` |
| `chipintelli_sd_file_write` | Statement | VAR(field_variable), OP(dropdown), DATA(input_value), BASE(dropdown) | `chipintelli_sd_file_write($sdFile, write, text("Hello CI13XX"), AUTO)` | `#include <SD.h>` ↵ `sdFile.write("Hello CI13XX");` |
| `chipintelli_sd_file_control` | Statement | VAR(field_variable), OP(dropdown) | `chipintelli_sd_file_control($sdFile, flush)` | `#include <SD.h>` ↵ `sdFile.flush();` |

## Parameter Options

| Parameter | Values | Description |
|---|---|---|
| INFO | cardErrorCode, cardErrorData | chipintelli_sd_error_info |
| OP | mkdir, remove, rmdir | chipintelli_sd_path_operation |
| MODE | FILE_READ, FILE_WRITE | chipintelli_sd_file_create, chipintelli_sd_file_create_next |
| OP | read, peek | chipintelli_sd_file_read |
| OP | available, availableForWrite | chipintelli_sd_file_available |
| OP | position, size | chipintelli_sd_file_position |
| OP | write, print, println | chipintelli_sd_file_write |
| BASE | AUTO, BIN, OCT, DEC, HEX | chipintelli_sd_file_write |
| OP | flush, rewindDirectory, close | chipintelli_sd_file_control |

## ABS Examples

### Write a file using configured pins

```abs
arduino_setup()
    serial_begin(Serial, 115200)
    chipintelli_sd_init_pins(math_number(5), math_number(2), math_number(4), math_number(3))
    chipintelli_sd_file_create(text("/data.txt"), FILE_WRITE, "sdFile")
    controls_if()
        @IF0: chipintelli_sd_file_is_open($sdFile)
        @DO0:
            chipintelli_sd_file_write($sdFile, println, text("hello CI13XX"), AUTO)
            chipintelli_sd_file_control($sdFile, close)
        @ELSE:
            serial_println(Serial, chipintelli_sd_error_info(cardErrorCode))

arduino_loop()
```

## Notes

1. **Variables**: `chipintelli_sd_file_create(..., "sdFile")` creates the global `File` object `sdFile` and Blockly variable `$sdFile`. `chipintelli_sd_file_create_next(..., "entry")` does the same for `entry`. Pass bare `$name` only to `field_variable` slots; an `input_value` slot would require `variables_get($name)`.
2. **Automatic initialization**: `chipintelli_sd_init_pins` requires configurable SCK, MISO, MOSI, and CS inputs. It returns no inline code and registers `SD.begin(sck, miso, mosi, cs)` at the start of setup.
3. **Pins and voltage**: configure pins to match the selected CI13XX variant and wiring. Common CI1302/CI1303/CI1306 defaults are SCK 5, MISO 2, MOSI 4, and SS 3; other variants may differ. SD signals must be 3.3V.
4. **Bus limits**: CI13XX uses GPIO software SPI without DMA. Default pins may conflict with IIS, Wire, or Serial1 depending on the variant and SDK profile.
5. **Filesystem limits**: only FAT16/FAT32 and 8.3 short file names are supported; exFAT and long file names are not supported.
6. **Open and close**: test `chipintelli_sd_file_is_open` before file operations. Close each file when finished. `chipintelli_sd_end` closes the volume and releases the software-SPI pins; initialize again before further access.
7. **Writing**: `FILE_WRITE` opens at the end and appends. Remove the existing file before opening to overwrite. BASE is used only by print/println for numeric data and is ignored by write.
8. **Directory traversal**: open a directory into a `File`, call `chipintelli_sd_file_create_next` until its result is not open, close every entry, and use rewindDirectory only on a directory.
9. **CI13XX SDK 1.0.17 initialization check**: the initialization block injects `SD.begin(...)` but does not expose its Boolean return. `SD.exists("/")` is not a mounted-volume check: the SDK's path-existence walker rejects the empty final component, while `SD.open("/", FILE_READ)` returns a valid root handle on a mounted volume. If checking readiness through root open, check the handle and close it. These are SD API semantics, not ABS ordering guarantees.
10. **String writes (SDK 1.0.17)**: use `OP=print` and `BASE=AUTO` for a Blockly String expression, without adding a newline. `write` accepts a byte or C-string/buffer; this SDK has no `write(const String&)` overload. `println` adds CRLF. Validate input before destructive remove/open operations when rejection must preserve existing contents.
11. **One object declaration per name**: each file-create block is a model producer, even in mutually exclusive branches. Use a distinct File variable name per create block; repeated producers of the same name are rejected during ABS preparation. Closing a handle does not remove its Blockly model declaration.
