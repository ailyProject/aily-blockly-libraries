# OJoy Fuel Gauge

TI BQ27220 single-cell Li-Ion fuel gauge, supports voltage, current, temperature, capacity and health monitoring

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-ojoy_bq27220 |
| Version | 1.0.1 |
| Author | OpenJumper |
| Source | https://github.com/kodediy/kode_bq27220-idf |
| License | Original license |

## Supported Boards

OJoy (ESP32-S3). The onboard BQ27220 uses the main Wire bus at address 0x55, with GPIO5 as SDA and GPIO4 as SCL.

## Description

TI BQ27220 single-cell Li-Ion fuel gauge, supports voltage, current, temperature, capacity and health monitoring

## Quick Start

1. Enable `@aily-project/lib-ojoy_bq27220` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.
