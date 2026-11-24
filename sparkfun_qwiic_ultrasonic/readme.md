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

### J2 direct Trigger/Echo

Connect J2.1 to 3.3 V, J2.2 to TRIG, J2.3 to ECHO and J2.4 to ground. Select separate GPIOs in the J2 echo-width block. It returns the low pulse width in microseconds. A 40 ms timeout returns zero. ECHO starts low on power-up, so the first measurement or the first measurement after a missing echo can return zero. Trigger again to measure the next complete pulse. For an ideal echo at 343 m/s, distance in millimetres equals microseconds × 0.1715.
