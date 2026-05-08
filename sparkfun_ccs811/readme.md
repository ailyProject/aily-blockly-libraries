# SparkFun CCS811

SparkFun CCS811 eCO2 and TVOC air quality Blockly library.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-ccs811 |
| Version | 0.0.1 |
| Author | SparkFun Electronics |
| Source | https://github.com/sparkfun/SparkFun_CCS811_Arduino_Library |
| License | MIT |

## Supported Boards

Arduino UNO, ESP32, and other Wire-compatible boards.

## Description

This library wraps the SparkFun CCS811 Arduino library for Blockly. It supports I2C initialization, data-ready checks, eCO2 and TVOC readings, drive mode, environmental compensation, baseline save/restore, and error status.

## Quick Start

Connect by I2C, call `ccs811_init` in setup, then check `ccs811_data_available`, call `ccs811_read_results`, and read CO2/TVOC values.