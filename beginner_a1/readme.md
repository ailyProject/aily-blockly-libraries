# Beginner A1 Car

High-level blocks for the Beginner A1 car (main controller): ESP-NOW remote, two motors and two servos.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-beginner_a1 |
| Version | 1.0.0 |
| Author | OpenJumper |
| License | Original |

## Supported Boards

**Only the Beginner A1 board** (ESP32-C3). It relies on the board's fixed pins and the paired remote, and does not work on any other board.

## Description

Main-controller library for the Beginner A1 kit. It wraps ESP-NOW pairing, two-channel motor driving and two servos into high-level blocks, so beginners can drive the car without touching the low-level protocol. The onboard LED auto-indicates status.

## Quick Start

1. Enable `@aily-project/lib-beginner_a1` in Aily Blockly.
2. Put **init Beginner A1 car** in `arduino_setup()`; the car drives by remote automatically. Use the **button** and **servo** blocks in `arduino_loop()`.
