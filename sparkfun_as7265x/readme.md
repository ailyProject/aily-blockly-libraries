# SparkFun AS7265X

SparkFun AS7265X 18-channel spectral triad Blockly library.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-as7265x |
| Version | 0.0.1 |
| Author | Nathan Seidle and Kevin Kuwata / SparkFun Electronics |
| Source | https://github.com/sparkfun/SparkFun_AS7265X_Arduino_Library |
| License | GPL-3.0 |

## Supported Boards

Arduino UNO, ESP32, and other Wire-compatible boards.

## Description

This library wraps AS7265X 18-channel UV/VIS/NIR spectroscopy. It supports measurement, calibrated and raw channel reads, temperatures, gain, mode, integration cycles, and bulb current/control.

## Quick Start

Initialize, call `as7265x_take_measurements`, then read calibrated channels A-W.