# DFRobot Rainfall Sensor

Blocks for the DFRobot tipping-bucket rainfall sensor using its universal I2C interface.

中文简介：用于 DFRobot 翻斗式雨量传感器的通用 I2C 接口。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-dfrobot-rainfall-sensor |
| Version | 0.1.1 |
| Author | DFRobot |
| Source | https://github.com/DFRobot/DFRobot_RainfallSensor |
| License | MIT |

## Supported Boards

Arduino-compatible boards using I2C.

## Description

This package bundles the required driver source and generates initialization, reading, configuration, and control code for Aily Blockly.

## Quick Start

Place the initialization block in setup, then use read, operation, and configuration blocks in the program flow.

## I²C status and recovery

The initialization block calls `begin()` once during setup. A missing sensor allows the remaining setup and loop to run. Coder can call `begin()` again to check the product and vendor IDs. In I²C mode, calibration returns zero on success and a nonzero status on a rejected write. The period reading returns –1 on a failed window selection or incomplete response. Total rainfall, tip count and working time keep their original zero fallback, which also represents a valid dry or newly powered sensor. Use `begin()` to check presence. The selector accepts 1–24 hours in Blockly.
