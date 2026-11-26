# NLCS21 color sensor

Emakefun NLCS21 color sensor module supports RGBC color detection, gain and integration time configuration, and interrupt threshold setting

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-emakefun-nlcs21 |
| Version | 1.0.1 |
| Author | Emakefun |
| Source | https://github.com/emakefun-arduino-library/emakefun_color_sensor_nlcs21 |
| License | Original license |

## Supported Boards

Arduino AVR, ESP32

## Description

Emakefun NLCS21 color sensor module supports RGBC color detection, gain and integration time configuration, and interrupt threshold setting

## Quick Start

1. Enable `@aily-project/lib-emakefun-nlcs21` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.

The constructor with an explicit TwoWire bus respects its gain and integration time. Initialize stops at the first failed write. GetColor retains previous values while integration is pending and clears them on I²C failure or a zero clear channel. LastError reports the most recent bus or argument error, including threshold and interrupt operations. After a failed threshold update, retry both limits before using the threshold interrupt.
