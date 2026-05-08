# SparkFun VEML6030

SparkFun VEML6030 ambient light sensor Blockly library.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-veml6030 |
| Version | 0.0.1 |
| Author | Elias Santistevan / SparkFun Electronics |
| Source | https://github.com/sparkfun/SparkFun_Ambient_Light_Sensor_Arduino_Library |
| License | MIT-style / SparkFun original |

## Supported Boards

Arduino UNO, ESP32, and other Wire-compatible boards.

## Description

This library wraps the VEML6030 Qwiic ambient light sensor. It reads ambient and white light in lux and configures gain, integration time, interrupts, thresholds, and power state.

## Quick Start

Initialize at address `0x48`, then read ambient lux in loop.