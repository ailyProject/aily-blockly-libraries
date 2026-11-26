# DFRobot Electrochemical Oxygen

Blocks for the DFRobot electrochemical oxygen concentration sensor using I2C.

中文简介：用于 DFRobot 电化学氧气浓度传感器的 I2C 积木库。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-dfrobot-eoxygen-sensor |
| Version | 0.1.1 |
| Author | DFRobot |
| Source | https://github.com/DFRobot/DFRobot_EOxygenSensor |
| License | MIT |

## Supported Boards

Arduino-compatible boards using I2C.

## Description

This package bundles the required driver source and generates initialization, reading, configuration, and control code for Aily Blockly.

## Quick Start

Place the initialization block in setup, then use read, operation, and configuration blocks in the program flow.

## Address and read errors

The SEN0496 DIP switch selects 0x70 through 0x73. Existing Blockly projects retain their switch position when regenerated. For hand-written sketches select the matching switch address. A valid 0% reading returns 0.0. A failed or incomplete read returns NAN. A failed calibration status read returns 0xFF, and failed calibration operations return false.
