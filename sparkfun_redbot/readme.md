# SparkFun RedBot Robot Platform

Blockly wrapper for the SparkFun RedBot robotics platform.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-redbot |
| Version | 0.0.3 |
| Author | SparkFun |
| Source | N/A |
| License | Original license |

## Supported Boards

Arduino AVR

## Description

Blockly wrapper for the SparkFun RedBot robotics platform.

## Quick Start

1. Enable `@aily-project/lib-sparkfun-redbot` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.

The bumper input uses the AVR internal pull-up. Since 0.0.3 the “bumper triggered” block returns true while the whisker is closed to ground. Projects that inverted the old block to compensate can remove that inversion. Native Coder sketches continue to receive the pin level from `RedBotBumper::read()`.
