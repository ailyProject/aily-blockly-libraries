# M5Stack Onboard Hardware

Blockly bindings for the official M5Unified and M5GFX libraries. The selected board is detected automatically, with no onboard pin configuration required. The library covers display, input, IMU including magnetometer data, RTC, audio, battery, external power, sleep, vibration and LEDs.

NanoC6 RGB power (GPIO19) is enabled automatically before the onboard RGB LED is used.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-m5stack-unified |
| Version | 0.1.0 |
| Author | M5Stack / ailyProject |
| Source | https://github.com/m5stack/M5Unified |
| License | Original license |

## Supported Boards

ESP32

## Description

Blockly bindings for the official M5Unified and M5GFX libraries. The selected M5Stack board is detected automatically, with no onboard pin configuration required.

## Quick Start

1. Enable `@aily-project/lib-m5stack-unified` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.
