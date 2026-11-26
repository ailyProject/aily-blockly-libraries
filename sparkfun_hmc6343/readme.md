# SparkFun HMC6343 3-Axis Compass

Blockly wrapper for the SparkFun HMC6343 3-axis compass sensor.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-hmc6343 |
| Version | 0.0.2 |
| Author | SparkFun |
| Source | [SparkFun HMC6343](https://github.com/sparkfun/SparkFun_HMC6343_Arduino_Library) |
| License | Original license |

## Supported Boards

Arduino-compatible boards supported by this package.

## Description

Blockly wrapper for the SparkFun HMC6343 3-axis compass sensor.

## Quick Start

1. Enable `@aily-project/lib-sparkfun-hmc6343` in Aily Blockly.
2. Wire the 3.3 V device at 0x19. Initialize, then read the desired group before getting a value. Angles are in tenths of a degree. A missing or incomplete frame returns NaN. After reconnecting, run initialization again.
