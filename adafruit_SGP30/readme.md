# SGP30 air quality sensor

SGP30 gas/air quality sensor support library, which realizes real-time detection of total volatile organic compounds (TVOC) and carbon dioxide equivalent (eCO₂) in the air through I2C interface, suitable for developme...

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-adafruit-sgp30 |
| Version | 1.0.2 |
| Author | ailyProject |
| Source | N/A |
| License | Original license |

## Supported Boards

Arduino-compatible boards supported by this package.

## Description

SGP30 gas/air quality sensor support library, which realizes real-time detection of total volatile organic compounds (TVOC) and carbon dioxide equivalent (eCO₂) in the air through I2C interface, suitable for developme...

## Quick Start

1. Enable `@aily-project/lib-adafruit-sgp30` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.

If the sensor is absent, initialization reports the failure and the sketch continues. Measurement blocks retry initialization at most once per second. A failed measurement yields zero for the corresponding cached readings.
