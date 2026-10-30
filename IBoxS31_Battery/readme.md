# IBox S31 Battery

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-iboxs31_battery |
| Version | 1.0.0 |
| Author | OpenJumper |
| Source | N/A |
| License | Apache-2.0 |

## Supported Boards

IBox S31 (Aily board IBOX S31, ESP32-S31) only; pins and I2C addresses follow its wiring.

## Description

IBox S31 battery: BQ27220 voltage, charge estimated from voltage, low-battery flag and low-voltage shutdown.

## Quick Start

1. Select the IBOX S31 board (Arduino-ESP32 4.0.0).
2. Put `iboxs31_battery_init` in `arduino_setup()`; it samples every 100 ms from `loop()`, so keep loop delays short and read `iboxs31_battery_read` anywhere.
