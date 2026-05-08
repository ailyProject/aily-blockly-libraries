# SparkFun ADS1015

SparkFun ADS1015 12-bit 4-channel I2C ADC Blockly library.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-ads1015 |
| Version | 0.0.1 |
| Author | SparkFun Electronics |
| Source | https://github.com/sparkfun/SparkFun_ADS1015_Arduino_Library |
| License | GPL-3.0 |

## Supported Boards

Arduino UNO, ESP32, and other Wire-compatible boards.

## Description

This library wraps the SparkFun ADS1015 ADC for Blockly. It supports I2C initialization, single-ended and differential readings, millivolt conversion, gain, sample rate, and conversion-ready status.

## Quick Start

Connect the sensor by Qwiic/I2C, call `ads1015_init` in setup, then read a single-ended channel in loop.