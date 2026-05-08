# SparkFun BQ27441

SparkFun BQ27441 LiPo fuel gauge Blockly library.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-bq27441 |
| Version | 0.0.1 |
| Author | SparkFun Electronics |
| Source | https://github.com/sparkfun/SparkFun_BQ27441_Arduino_Library |
| License | Beerware |

## Supported Boards

Arduino UNO, ESP32, and other Wire-compatible boards.

## Description

This library wraps the SparkFun BQ27441 global `lipo` object for Blockly. It supports initialization, design capacity, voltage, current, capacity, power, state of charge, state of health, temperature, flags, and GPOUT settings.

## Quick Start

Call `bq27441_begin` with your battery capacity in mAh, then read `bq27441_soc`, `bq27441_voltage`, or other battery values in loop.