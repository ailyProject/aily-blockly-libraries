# IBox S31 SD Card

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-iboxs31_sdcard |
| Version | 1.0.0 |
| Author | OpenJumper |
| Source | N/A |
| License | Apache-2.0 |

## Supported Boards

IBox S31 (Aily board IBOX S31, ESP32-S31) only; pins and I2C addresses follow its wiring.

## Description

IBox S31 microSD card: power-up and mount, read/write self-test, capacity and text file access.

## Quick Start

1. Select the IBOX S31 board (Arduino-ESP32 4.0.0) and insert a FAT/FAT32 microSD card.
2. Put `iboxs31_sdcard_init` in `arduino_setup()`, then read and write files with paths such as `/log.txt`.
