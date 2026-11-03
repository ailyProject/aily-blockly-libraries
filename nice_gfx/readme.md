# NICE_GFX

Display drivers, graphics, fonts, sprites, touch and designer UI: 50 blocks.

## Library Info

| Field | Value |
|---|---|
| Package | @aily-project/lib-nice-gfx |
| Version | 1.0.0 |
| Author | NICE_GFX contributors |
| Source | https://github.com/ailyProject/nice-gfx |
| License | Upstream notices; see [LICENSES.md](LICENSES.md) |

## Supported Boards

ESP32, STM32, RP2040/RP2350, ESP8266, CI130X, AVR, SAMD and Renesas. Support varies by driver. UI requires STL/RAM; AVR supports basic graphics.

## Description

SPI, software SPI, ESP32 QSPI, SSD1306/SH1106 I2C and board presets. Drawing blocks accept displays and sprites.

## Quick Start

Board `displayConfig` supplies model, wiring and frequency defaults; saved/manual values take priority. Use `-1` for unused pins. Fill black, select a font, set text colors and draw text. For UI, add exported `ui.h` and assets, load it, and forward touch in loop; ticking is automatic.

[Import example](examples/hello-display.abi). [ABS usage](readme_ai.md).
