# BQ27220 Fuel Gauge

TI BQ27220 single-cell Li-Ion battery fuel gauge, reads battery voltage, current, temperature, and remaining capacity via I2C

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-bq27220 |
| Version | 1.0.1 |
| Author | OpenJumper |
| Source | https://github.com/kodediy/kode_bq27220-idf |
| License | Apache-2.0 |

## Supported Boards

Arduino AVR, Arduino SAMD, ESP32, RP2040

## Description

TI BQ27220 single-cell Li-Ion/LiPo fuel gauge: voltage, current, temperature, charge, time to empty/full, cycles and health over I2C, plus a voltage-based charge estimate and deep-sleep shutdown.

## Quick Start

1. Add "Initialize BQ27220" block in `arduino_setup()`, select I2C bus and address
2. Use read blocks in `arduino_loop()` to get battery data (select specific parameter from dropdown)
3. Print results using Serial print blocks
4. ESP32 I2C pins follow the board; uncalibrated gauges need the voltage-based blocks
