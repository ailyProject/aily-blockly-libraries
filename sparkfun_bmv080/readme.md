# SparkFun BMV080

SparkFun BMV080 PM1/PM2.5/PM10 particulate matter Blockly library.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-bmv080 |
| Version | 0.0.1 |
| Author | SparkFun Electronics |
| Source | https://github.com/sparkfun/SparkFun_BMV080_Arduino_Library |
| License | MIT |

## Supported Boards

ESP32 and supported Cortex boards listed by the upstream library.

## Description

This library wraps the SparkFun BMV080 air quality sensor for Blockly. It supports I2C initialization, continuous or duty-cycle mode, PM1/PM2.5/PM10 readings, obstruction detection, and filtering toggles. The upstream library requires the Bosch BMV080 SDK.

## Quick Start

Install the Bosch SDK as required by SparkFun, connect the sensor by Qwiic/I2C, call `bmv080_init_i2c`, then use `bmv080_read_sensor` before reading PM values.