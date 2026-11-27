# CST816S Touch Screen

CST816S capacitive touch screen driver library, supports gesture recognition, touch coordinate reading and interrupt handling via I2C

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-cst816s |
| Version | 1.0.1 |
| Author | OpenJumper |
| Source | https://github.com/fbiego/CST816S |
| License | MIT |

## Supported Boards

Arduino AVR, Arduino SAMD, ESP32, RP2040, STM32

## Description

CST816S is a capacitive touch screen controller from Chipsemi. This library provides gesture recognition (swipe up/down/left/right, single/double click, long press), touch coordinate reading, and interrupt handling via I2C interface.

## Quick Start

1. Add "Initialize CST816S" block in `arduino_setup()`, select I2C bus and set RST/IRQ pins
2. Use read blocks in `arduino_loop()` to get touch data (gesture, position, event)
3. Check available() to detect new touch events

Each active controller owns its IRQ pin. Call `end()` before reusing that pin. Reinitialization and destruction detach the previous handler. `available()` publishes a new touch only after a complete six-byte response.
