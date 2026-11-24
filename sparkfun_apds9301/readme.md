# SparkFun APDS9301 lux sensor

Blockly wrapper for the SparkFun APDS9301 lux sensor.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-apds9301 |
| Version | 0.0.1 |
| Author | SparkFun |
| Source | N/A |
| License | Original license |

## Supported Boards

Arduino-compatible boards supported by this package.

## Description

Blockly wrapper for the SparkFun APDS9301 lux sensor.

## Quick Start

1. Enable `@aily-project/lib-sparkfun-apds9301` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.

### Initialization status (0.0.2)

`APDS9301::begin(address)` probes the selected I²C address and reports the power-on write result. The ready block reports the last initialization result. Reinitialize after reconnecting the module.
