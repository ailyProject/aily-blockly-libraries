# BQ27220 Fuel Gauge

TI BQ27220 single-cell Li-Ion battery fuel gauge, reads battery voltage, current, temperature, and remaining capacity via I2C

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-bq27220 |
| Version | 1.0.0 |
| Author | OpenJumper |
| Source | https://github.com/kodediy/kode_bq27220-idf |
| License | Apache-2.0 |

## Supported Boards

Arduino AVR, Arduino SAMD, ESP32, RP2040

## Description

BQ27220 is a single-cell Li-Ion/LiPo battery fuel gauge from Texas Instruments. This library reads battery voltage, current, temperature, state of charge, time to empty/full, cycle count, and health percentage via I2C interface.

## Quick Start

1. Add "Initialize BQ27220" block in `arduino_setup()`, select I2C bus and address
2. Use read blocks in `arduino_loop()` to get battery data (select specific parameter from dropdown)
3. Print results using Serial print blocks
