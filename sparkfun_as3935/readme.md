# SparkFun AS3935 lightning detector

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-as3935 |
| Version | 0.0.2 |
| Author | Elias Santistevan / SparkFun Electronics |
| Source | [SparkFun driver](https://github.com/sparkfun/SparkFun_AS3935_Lightning_Detector_Arduino_Library) |
| License | Beerware notice in driver |

## Supported Boards

Arduino-compatible boards with Wire or SPI.

## Description

Read interrupt cause, storm distance and raw lightning energy. The Qwiic SEN-15276 uses I²C. The SEN-15441 uses SPI.

## Quick Start

1. Connect the module and initialize its bus in setup. Ready reports the latest initialization result.
2. After IRQ rises, read the interrupt cause. Distance 63 means out of range. Failed interrupt or distance reads return 255. A failed energy read returns 4294967295.
3. Initialize again after rewiring. Coder can check `lastOperationSucceeded()` after a transfer.
