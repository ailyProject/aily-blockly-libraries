# ESP8266 SdFat

Access FAT16, FAT32 and exFAT cards with the ESP8266 bundled SdFat library.

## Library Info
- **Name**: @aily-project/lib-esp8266-sdfat
- **Version**: 0.0.1
- **Author**: Bill Greiman
- **Source**: ESP8266 Arduino Core 3.1.2

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `esp8266_sdfat_create` | Statement | VAR(field_input) | `esp8266_sdfat_create(VAR)` | Dynamic code |
| `esp8266_sdfat_begin` | Value | VAR(field_variable), CS(field_dropdown), MHZ(input_value) | `esp8266_sdfat_begin(VAR, CS, MHZ)` | Dynamic code |
| `esp8266_sdfat_exists` | Value | VAR(field_variable), PATH(input_value) | `esp8266_sdfat_exists(VAR, PATH)` | Dynamic code |
| `esp8266_sdfat_mkdir` | Statement | VAR(field_variable), PATH(input_value) | `esp8266_sdfat_mkdir(VAR, PATH)` | Dynamic code |
| `esp8266_sdfat_remove` | Statement | VAR(field_variable), PATH(input_value) | `esp8266_sdfat_remove(VAR, PATH)` | Dynamic code |
| `esp8266_sdfat_rename` | Statement | VAR(field_variable), OLD(input_value), NEW(input_value) | `esp8266_sdfat_rename(VAR, OLD, NEW)` | Dynamic code |
| `esp8266_sdfat_sector_count` | Value | VAR(field_variable) | `esp8266_sdfat_sector_count(VAR)` | Dynamic code |
| `esp8266_sdfat_fat_type` | Value | VAR(field_variable) | `esp8266_sdfat_fat_type(VAR)` | Dynamic code |
| `esp8266_sdfat_format` | Value | VAR(field_variable) | `esp8266_sdfat_format(VAR)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|---|---|---|
| esp8266_sdfat_begin.CS | board-provided options | Selects the generated API option. |

## ABS Examples

Use the initialization block first when one is provided.

## Notes

All types use the `esp8266_` prefix. SDK sources are used directly; no `src.7z` is bundled.
