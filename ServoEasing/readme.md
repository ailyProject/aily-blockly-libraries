# ServoEasing

Smooth servo movement with easing, speed control, callbacks, and synchronized multi-servo moves.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-servoeasing |
| Version | 0.0.1 |
| Author | Armin Joachimsmeyer |
| Source | https://github.com/ArminJo/ServoEasing |
| License | GPL-3.0-or-later |

## Supported Boards

Arduino AVR/Mega AVR/SAMD/SAM, ESP8266, ESP32, RP2040, and STM32 boards supported by the upstream ServoEasing library.

## Description

Smooth servo movement with easing, speed control, callbacks, and synchronized multi-servo moves.

## Quick Start

1. Add `create ServoEasing` in `arduino_setup()` and choose a servo-capable pin.
2. Pick an easing type and use blocking `ease to` or non-blocking `start ease to` movement blocks.
3. For manual non-blocking mode, call the `update` block repeatedly in `arduino_loop()`.
