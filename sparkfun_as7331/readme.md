# SparkFun AS7331

SparkFun AS7331 UVA/UVB/UVC spectral UV sensor Blockly library.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-as7331 |
| Version | 0.0.1 |
| Author | SparkFun Electronics |
| Source | https://github.com/sparkfun/SparkFun_AS7331_Arduino_Library |
| License | MIT |

## Supported Boards

Arduino UNO, ESP32, and other Wire-compatible 3.3V boards.

## Description

This library wraps the AS7331 spectral UV sensor and includes the SparkFun Toolkit source needed by the driver. It supports address selection, measurement mode, UV reads, temperature, data-ready status, gain, and conversion time.

## Quick Start

Initialize in command mode, call `as7331_take_measurement`, then read UVA/UVB/UVC.