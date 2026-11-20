# rlcd42-sd

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-rlcd42-sd |
| Version | 0.0.1 |
| Author | Bryan |
| Source | On-board SDMMC driver, Waveshare ESP32-S3-RLCD-4.2 |
| License | UNLICENSED |

## Supported Boards

- Waveshare ESP32-S3-RLCD-4.2 (on-board SDMMC 1-bit wiring, CLK=38 / CMD=21 / D0=39).

## Description

Mounts the SD card over the on-board SDMMC 1-bit bus and reports capacity, then reads, writes and appends text files, checks whether a path exists and lists directories. Paths are absolute on the mounted filesystem.

## Quick Start

1. Enable `@aily-project/lib-rlcd42-sd` in aily Blockly.
2. In `arduino_setup()`, add `rlcd42_sd_init` with the default pins 38, 21 and 39.
3. Check `rlcd42_sd_ok`, then use the read, write, append, exists and list blocks.

Chinese description: [readme_zh.md](readme_zh.md).
