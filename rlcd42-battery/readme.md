# rlcd42-battery

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-rlcd42-battery |
| Version | 0.0.1 |
| Author | Bryan |
| License | UNLICENSED |

## Supported Boards

- Waveshare ESP32-S3-RLCD-4.2 (18650, ADC1 ch3 / GPIO4, 3:1 divider).

## Description

Reads the on-board 18650 through the ADC divider and converts voltage to state of charge with a Li-ion open-circuit-voltage curve (CALCE / Samsung INR18650-20R), smoothed and rate limited for display. Draws a segmented battery icon with an optional percentage and a USB bolt when the cable is plugged in. The percentage is not a linear voltage-to-percent map.

## Quick Start

1. Enable `@aily-project/lib-rlcd42-battery` in aily Blockly.
2. In `arduino_setup()`, add `rlcd42_batt_init` and initialise the display.
3. In `arduino_loop()`, call `rlcd42_batt_read` about once per second, then `rlcd42_batt_draw` and `rlcd42_display`.

Chinese description: [readme_zh.md](readme_zh.md).
