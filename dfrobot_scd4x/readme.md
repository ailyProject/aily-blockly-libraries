# DFRobot SCD4X

Blocks for the SCD40/SCD41 photoacoustic CO2, temperature and humidity sensor.

中文简介：用于 SCD40/SCD41 光声二氧化碳、温度和湿度传感器的积木库。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-dfrobot-scd4x |
| Version | 0.1.1 |
| Author | DFRobot |
| Source | https://github.com/DFRobot/DFRobot_SCD4X |
| License | MIT |

## Supported Boards

Arduino-compatible boards using I2C, including STM32duino.

## Description

This package bundles the required driver source and generates initialization, reading, configuration, and control code for Aily Blockly.

## Quick Start

Place the initialization block in setup. Use the data-ready block to check for the first sample. The CO₂, temperature, and humidity blocks refresh the same stored measurement when new data is ready, then return the selected field. Until another sample is ready, they return values from the stored measurement.

For saved C++ source, use the DFRobot API directly. Check `getDataReadyStatus()`, call `readMeasurement(&data)` once, and take all three fields from `data`.
