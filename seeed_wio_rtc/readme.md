# Wio Terminal RTC

Blockly wrapper for Wio Terminal's SAMD51 RTC: set/read time, two alarms, callbacks, and standby.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-seeed-wio-rtc |
| Version | 1.0.0 |
| Author | SeeedStudio |
| Guide | https://wiki.seeedstudio.com/Wio-Terminal-RTC/ |
| Source | https://github.com/Seeed-Studio/Seeed_Arduino_RTC |
| License | MIT |

## Supported Boards

Wio Terminal (`Seeeduino:samd:seeed_wio_terminal`)

## Description

Uses `RTC_SAMD51` and `DateTime` from Seeed_Arduino_RTC; no external RTC module is needed.

## Quick Start

1. Select Wio Terminal and enable `@aily-project/lib-seeed-wio-rtc`.
2. Initialize the RTC in `arduino_setup()`.
3. Set or read time, or configure an alarm.
