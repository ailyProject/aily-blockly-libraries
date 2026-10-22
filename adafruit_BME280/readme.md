# BME280 sensor library

Used to read data from BME280 sensors, including temperature, pressure, altitude and humidity, and output the data to a serial monitor

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-adafruit-bme280 |
| Version | 0.0.1 |
| Author | ailyProject |
| Source | N/A |
| License | Original license |

## Supported Boards

Arduino-compatible boards supported by this package.

## Description

Used to read data from BME280 sensors, including temperature, pressure, altitude and humidity, and output the data to a serial monitor

## Quick Start

1. Enable `@aily-project/lib-adafruit-bme280` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.

## Sampling Configuration

Sampling uses typed enums; old project values migrate automatically. Off disables a channel. Select 1x to 16x to read it. Standby supports up to 1000 ms.
