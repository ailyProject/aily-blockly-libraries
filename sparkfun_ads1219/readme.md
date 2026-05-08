# SparkFun ADS1219

SparkFun ADS1219 24-bit 4-channel I2C ADC Blockly library.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-ads1219 |
| Version | 0.0.1 |
| Author | SparkFun Electronics |
| Source | https://github.com/sparkfun/SparkFun_ADS1219_Arduino_Library |
| License | MIT |

## Supported Boards

Arduino UNO, ESP32, and other Wire-compatible boards.

## Description

This library wraps the SparkFun ADS1219 24-bit ADC. It supports address selection, input multiplexer, gain, data rate, voltage reference, single-shot read helpers, and power-down.

## Quick Start

Connect by Qwiic/I2C, initialize with address `0x40`, choose an input mux, then read millivolts.