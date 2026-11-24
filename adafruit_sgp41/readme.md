# Adafruit SGP41

Blocks for the Sensirion SGP41 VOC and NOx gas sensor.

中文简介：用于 Sensirion SGP41 VOC 与 NOx 气体传感器。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-adafruit-sgp41 |
| Version | 0.1.2 |
| Author | Adafruit |
| Source | https://github.com/adafruit/Adafruit_SGP41 |
| License | BSD-3-Clause |

## Supported Boards

Arduino-compatible boards using I2C.

## Description

This package bundles the required driver source and generates initialization, reading, configuration, and control code for Aily Blockly.

## Quick Start

Initialize the instance on the selected Wire bus. From idle, use the conditioning operation before the first dual-channel measurement and again after turning the heater off. Sensirion recommends 10 seconds of conditioning and specifies a maximum of 10 seconds. During conditioning the sensor returns only the VOC raw word.

Each read block requests a measurement. The compensated measurement block accepts relative humidity in percent, then temperature in degrees Celsius, and updates both raw words from a single transaction. On a missing device or failed transfer, the generated measurement clears both cached words. A later operation probes the selected bus and can reinitialize the reconnected device. The raw values are sensor ticks.
