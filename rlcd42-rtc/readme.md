# rlcd42-rtc

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-rlcd42-rtc |
| Version | 0.0.1 |
| Author | Bryan |
| Source | On-board PCF85063 and SHTC3 drivers, Waveshare ESP32-S3-RLCD-4.2 |
| License | UNLICENSED |

## Supported Boards

- Waveshare ESP32-S3-RLCD-4.2 (on-board I2C, SDA=13 / SCL=14).

## Description

Reads the on-board PCF85063 real-time clock with power-loss detection and optional compile-time calibration, exposes individual date and time fields and formatted strings, reads the on-board SHTC3 temperature and humidity sensor, and synchronises the clock over NTP at UTC+8.

## Quick Start

1. Enable `@aily-project/lib-rlcd42-rtc` in aily Blockly.
2. In `arduino_setup()`, add `rlcd42_rtc_init` and choose whether power loss should re-seed the clock.
3. In `arduino_loop()`, call `rlcd42_rtc_read` (and `rlcd42_env_read`) before reading any field or formatted value.

Chinese description: [readme_zh.md](readme_zh.md).
