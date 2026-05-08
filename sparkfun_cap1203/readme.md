# SparkFun CAP1203

SparkFun CAP1203 capacitive touch slider Blockly library.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-cap1203 |
| Version | 0.0.1 |
| Author | SparkFun Electronics |
| Source | https://github.com/sparkfun/Qwiic_Capacitive_Touch_Slider_Arduino_Library |
| License | Beerware |

## Supported Boards

Arduino UNO, ESP32, and other Wire-compatible boards.

## Description

This library wraps the SparkFun CAP1203 Qwiic touch slider for Blockly. It supports initialization, touch and swipe detection, sensitivity, interrupt clearing, and power-button configuration.

## Quick Start

Connect the slider by Qwiic/I2C, call `cap1203_init` in setup, then use `cap1203_touched` or `cap1203_swipe` in loop.