# SparkFun BME280

SparkFun BME280 temperature, humidity, pressure, and altitude Blockly library.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-bme280 |
| Version | 0.0.1 |
| Author | SparkFun Electronics |
| Source | https://github.com/sparkfun/SparkFun_BME280_Arduino_Library |
| License | MIT |

## Supported Boards

Arduino UNO, ESP32, and other Wire/SPI-compatible boards.

## Description

This library wraps the SparkFun BME280 Arduino library for Blockly. It supports I2C or SPI setup, temperature, humidity, pressure, altitude, dew point, mode, oversampling, and filter controls.

## Quick Start

Connect the sensor over Qwiic/I2C, call `bme280_init_i2c` in setup, then read temperature, humidity, or pressure in loop.