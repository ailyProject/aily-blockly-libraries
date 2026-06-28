# FT6336U Touch Controller

Blockly library for the FT6336U capacitive touch controller, with two-point coordinates, gestures, touch status, and parameter configuration.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-ft6336u |
| Version | 1.0.0 |
| Author | Atsushi Sasaki |
| Source | https://github.com/aselectroworks/Arduino-FT6336U |
| License | MIT |

## Supported Boards

Arduino-compatible boards via default Wire. Custom SDA/SCL pins are honored only on ESP32, ESP8266, and Teensy; other boards use default Wire.

## Description

This package wraps the FT6336U self-capacitive touch panel controller. It supports default Wire setup, optional custom I2C pins, direct reads, cached multi-touch scanning, gesture parameter writes, and system info reads.

## Quick Start

Enable `@aily-project/lib-ft6336u`, initialize in `arduino_setup()`, call scan in `arduino_loop()`, then read cached point status and coordinates.
