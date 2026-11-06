# ServoEasing

Immediate and timed servo movement in one library.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-servoeasing |
| Version | 0.0.2 |
| Author | Armin Joachimsmeyer |
| Source | https://github.com/ArminJo/ServoEasing |
| License | GPL-3.0-or-later |

## Supported Boards

Arduino AVR/Mega AVR/SAMD/SAM, ESP8266, ESP32, RP2040, and STM32.

## Description

Pin blocks need no initialization block or initial-angle input. Named-servo blocks remain available.

## Quick Start

Choose a servo pin and use immediate write, timed movement, or non-blocking timed start. This library alone provides all three. Use one control mode per physical pin.

The first timed move uses a default software position, not a measured angle. Startup movement and achievable speed depend on the hardware.
