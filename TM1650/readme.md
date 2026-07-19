# TM1650 Four-Digit Display

Control TM1650 I2C seven-segment displays from multiple Arduino-compatible boards.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-tm1650 |
| Version | 1.0.0 |
| Author | Anatoli Arkhipenko |
| Source | https://github.com/arkhipenko/TM1650 |
| License | BSD-4-Clause |

## Supported Boards

ESP32 (including ESP32-S3) and Arduino AVR. Generated examples are compile-checked; hardware testing is not claimed.

## Description

The library initializes `Wire` at 100 kHz and controls up to 16 TM1650 positions. Choose hardware I2C to use the board defaults, or custom/software-I2C pins; the latter automatically falls back to default `Wire` pins on cores that do not support `Wire.begin(SDA, SCL)`. Its four-digit workflow displays numbers, supported letters, inline decimal points, brightness, power, scrolling, and raw segment controls. TM1650 1.1.0 is bundled; no third-party installation is needed.

## Quick Start

1. Connect VCC/GND and I2C SDA/SCL; keep I2C pull-ups within the board GPIO voltage.
2. In `arduino_setup()`, choose exactly one initialization block: hardware I2C for board defaults, or custom/software I2C (ESP32-S3 example: SDA 8, SCL 9), then show `12.34`.
