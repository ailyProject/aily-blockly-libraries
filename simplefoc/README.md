# SimpleFOC

A Field Oriented Control (FOC) library for BLDC and Stepper motors with Arduino

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-simplefoc |
| Version | 2.4.0 |
| Author | SimpleFOC Community |
| Source | https://github.com/simplefoc/Arduino-FOC |
| License | MIT |

## Supported Boards

Arduino UNO, MEGA, DUE, ESP32, STM32, Teensy, RP2040 and many more

## Description

SimpleFOC is a cross-platform library implementing Field Oriented Control for BLDC and stepper motors. It provides smooth motor operation with high-degree of torque, velocity and position control. Supports multiple sensor types (encoders, magnetic sensors) and driver configurations (3PWM, 6PWM).

## Quick Start

1. Create motor and driver objects, link them
2. Initialize driver, sensor, and motor in setup
3. Call `motor.loopFOC()` in loop (as fast as possible)
4. Call `motor.move(target)` to set velocity/position/torque
