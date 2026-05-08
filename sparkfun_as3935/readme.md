# SparkFun AS3935

SparkFun AS3935 lightning detector Blockly library.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-as3935 |
| Version | 0.0.1 |
| Author | Elias Santistevan / SparkFun Electronics |
| Source | https://github.com/sparkfun/SparkFun_AS3935_Lightning_Detector_Arduino_Library |
| License | MIT-style / SparkFun original |

## Supported Boards

Arduino UNO, ESP32, and other I2C/SPI-capable 3.3V boards.

## Description

This library wraps AS3935 lightning detection. It supports I2C or SPI initialization, interrupt status, storm distance, energy, environment mode, noise filtering, lightning threshold, disturber masking, and oscillator calibration.

## Quick Start

Initialize by I2C or SPI, connect the INT pin, and read the interrupt status when the pin goes high.