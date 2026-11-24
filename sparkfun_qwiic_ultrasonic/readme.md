# SparkFun Qwiic Ultrasonic Distance Sensor

Blockly wrapper for SparkFun Qwiic Ultrasonic distance sensor.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-qwiic-ultrasonic |
| Version | 0.0.2 |
| Author | SparkFun |
| Source | https://github.com/sparkfun/SparkFun_Qwiic_Ultrasonic_Arduino_Library |
| License | Original license |

## Supported Boards

Arduino-compatible boards supported by this package.

## Description

Blockly wrapper for SparkFun Qwiic Ultrasonic distance sensor.

## Quick Start

1. Enable `@aily-project/lib-sparkfun-qwiic-ultrasonic` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.

The default Qwiic address of the TCT40 (SEN-24805) is 0x2F. The distance block triggers a measurement and reads the most recently available result in millimetres. Allow time between readings for the echo. A successful bus read may return zero, including before the first echo. The block checks the address before sending a command. An I²C error returns -1. The package installs the shared SparkFun Toolkit 1.2.1 dependency.
