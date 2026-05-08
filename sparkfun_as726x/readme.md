# SparkFun AS726X

SparkFun AS726X six-channel spectral sensor Blockly library.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-as726x |
| Version | 0.0.1 |
| Author | Andrew England / SparkFun Electronics |
| Source | https://github.com/sparkfun/SparkFun_AS726X_Arduino_Library |
| License | MIT-style / SparkFun original |

## Supported Boards

Arduino UNO, ESP32, and other Wire-compatible boards.

## Description

This library wraps AS726X visible/NIR spectral sensors. It supports measurement, raw and calibrated channel reads, temperature, gain, measurement mode, integration time, and bulb control.

## Quick Start

Initialize, call `as726x_take_measurements`, then read calibrated channels.