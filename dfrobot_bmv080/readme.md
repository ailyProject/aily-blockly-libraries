# BMV080 PM Sensor

BMV080 reads PM1, PM2.5, and PM10 through I2C or SPI on ESP32 boards.

## Library Info

| Field | Value |
|-------|-------|
| Package | `@aily-project/lib-dfrobot-bmv080` |
| Version | `0.1.0` |
| Author | DFRobot |
| Source | https://gitee.com/dfrobot/DFRobot_BMV080 |
| License | MIT |

## Supported Boards

ESP32.

## Description

Supports continuous or duty-cycle PM measurement, obstruction detection, vibration filtering, and measurement algorithm settings.

## Quick Start

Initialize by I2C or SPI, configure optional features, set continuous or duty-cycle mode, call refresh data in the loop, then read cached PM values.
