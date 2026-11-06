# DS1302 RTC clock

DS1302 real-time clock module library, providing time reading, setting and RAM operation functions

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-ds1302 |
| Version | 1.0.1 |
| Author | msparks |
| Source | https://github.com/msparks/arduino-ds1302 |
| License | BSD-2-Clause |

## Supported Boards

Arduino AVR, ESP32, RP2040

## Description

DS1302 real-time clock module library, providing time reading, setting and RAM operation functions

The package includes the unmodified `DS1302.h` and `DS1302.cpp` driver from
msparks/arduino-ds1302 revision `5650f7d13cfb2c5a28958a62a64c80a07f58a947`.
Its copyright notice and BSD-2-Clause terms are retained in `src/DS1302.h`
and `LICENSE`. No separate Arduino library download is required.

## Quick Start

1. Enable `@aily-project/lib-ds1302` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.
