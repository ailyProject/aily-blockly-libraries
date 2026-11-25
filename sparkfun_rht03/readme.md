# SparkFun RHT03 Humidity and Temperature Sensor

Blockly wrapper for the SparkFun RHT03 single-wire humidity and temperature sensor.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-rht03 |
| Version | 0.0.2 |
| Author | SparkFun |
| Source | N/A |
| License | Original license |

## Supported Boards

Arduino-compatible boards supported by this package.

## Description

Blockly wrapper for the SparkFun RHT03 single-wire humidity and temperature sensor.

## Quick Start

1. Enable `@aily-project/lib-sparkfun-rht03` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.

Read the RHT03 after its two-second power-up period. The driver leaves interrupts enabled during the two millisecond-based start delays and masks interrupts for the timing-sensitive response. A successful update returns 1.
