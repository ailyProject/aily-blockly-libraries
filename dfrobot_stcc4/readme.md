# STCC4 CO2 Sensor

Gravity STCC4 CO2 sensor library for Aily Blockly.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-dfrobot-stcc4 |
| Version | 0.1.0 |
| Author | YeezB |
| Source | https://gitee.com/yeezb/ext-stcc4-co2-sensor |
| License | MIT |

## Supported Boards

Arduino-compatible boards with I2C.

## Description

Reads CO2 concentration, temperature, humidity, and sensor status over I2C. Includes compensation, calibration, sleep, wakeup, and reset controls.

## Quick Start

Initialize the sensor in `arduino_setup()`, then call the read block in `arduino_loop()` before using the data block.
