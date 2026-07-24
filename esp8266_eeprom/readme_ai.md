# ESP8266 EEPROM

Initialize, read, write and commit the ESP8266 flash-backed EEPROM emulation.

## Library Info
- **Name**: @aily-project/lib-esp8266-eeprom
- **Version**: 0.0.1
- **Author**: ESP8266 Arduino Core Team
- **Source**: ESP8266 Arduino Core 3.1.2

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `esp8266_eeprom_begin` | Statement | SIZE(input_value) | `esp8266_eeprom_begin(SIZE)` | Dynamic code |
| `esp8266_eeprom_read` | Value | ADDRESS(input_value) | `esp8266_eeprom_read(ADDRESS)` | Dynamic code |
| `esp8266_eeprom_write` | Statement | ADDRESS(input_value), VALUE(input_value) | `esp8266_eeprom_write(ADDRESS, VALUE)` | Dynamic code |
| `esp8266_eeprom_commit` | Value | None | `esp8266_eeprom_commit()` | Dynamic code |
| `esp8266_eeprom_length` | Value | None | `esp8266_eeprom_length()` | Dynamic code |
| `esp8266_eeprom_end` | Value | None | `esp8266_eeprom_end()` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|---|---|---|
| None | None | No dropdown parameters. |

## ABS Examples

Use the initialization block first when one is provided.

## Notes

All types use the `esp8266_` prefix. SDK sources are used directly; no `src.7z` is bundled.
