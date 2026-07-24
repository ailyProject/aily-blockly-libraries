# ESP8266 System

ESP8266 chip, heap, flash, reset and deep-sleep system functions.

## Library Info
- **Name**: @aily-project/lib-esp8266-system
- **Version**: 0.0.1
- **Author**: ESP8266 Arduino Core Team
- **Source**: ESP8266 Arduino Core 3.1.2

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `esp8266_system_info_number` | Value | INFO(field_dropdown) | `esp8266_system_info_number(INFO)` | Dynamic code |
| `esp8266_system_info_text` | Value | INFO(field_dropdown) | `esp8266_system_info_text(INFO)` | Dynamic code |
| `esp8266_system_restart` | Statement | None | `esp8266_system_restart()` | Dynamic code |
| `esp8266_system_erase_config` | Value | None | `esp8266_system_erase_config()` | Dynamic code |
| `esp8266_system_deep_sleep` | Statement | TIME(input_value), MODE(field_dropdown) | `esp8266_system_deep_sleep(TIME, MODE)` | Dynamic code |
| `esp8266_system_deep_sleep_instant` | Statement | TIME(input_value), MODE(field_dropdown) | `esp8266_system_deep_sleep_instant(TIME, MODE)` | Dynamic code |
| `esp8266_system_deep_sleep_max` | Value | None | `esp8266_system_deep_sleep_max()` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|---|---|---|
| esp8266_system_info_number.INFO | getChipId, getFreeHeap, getMaxFreeBlockSize, getHeapFragmentation, getFreeContStack, getFlashChipId, getFlashChipRealSize, getFlashChipSize, getFlashChipSpeed, getSketchSize, getFreeSketchSpace, getCycleCount | Selects the generated API option. |
| esp8266_system_info_text.INFO | getSdkVersion, getCoreVersion, getFullVersion, getSketchMD5, getResetReason, getResetInfo | Selects the generated API option. |
| esp8266_system_deep_sleep.MODE | RF_DEFAULT, WAKE_RFCAL, WAKE_NO_RFCAL, WAKE_RF_DISABLED | Selects the generated API option. |
| esp8266_system_deep_sleep_instant.MODE | RF_DEFAULT, WAKE_RFCAL, WAKE_NO_RFCAL, WAKE_RF_DISABLED | Selects the generated API option. |

## ABS Examples

Use the initialization block first when one is provided.

## Notes

All types use the `esp8266_` prefix. SDK sources are used directly; no `src.7z` is bundled.
