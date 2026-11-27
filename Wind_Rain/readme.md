# Wind speed, direction and rain sensor

Wind speed, wind direction and rain sensor control library, hardware adapted to the wind speed, wind direction and raindrop sensor in the openJumper Weather IoT Master Kit, supports wind speed measurement (km/h, mph)...

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-wind |
| Version | 1.0.1 |
| Author | OpenJumper |
| Source | N/A |
| License | Original license |

## Supported Boards

Arduino AVR, ESP32

## Description

Wind speed, wind direction and rain sensor control library, hardware adapted to the wind speed, wind direction and raindrop sensor in the openJumper Weather IoT Master Kit, supports wind speed measurement (km/h, mph)...

## Quick Start

1. Enable `@aily-project/lib-wind` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.

The driver counts valid rain tips at 0.2794 mm each. The rolling hour and day use the most recent 2,000 tip timestamps. Resetting the total preserves those windows.
