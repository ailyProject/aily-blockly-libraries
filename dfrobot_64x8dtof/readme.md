# DFRobot 64x8 dTOF Matrix

DFRobot 64x8 dTOF is a 64*8 direct time-of-flight laser ranging matrix sensor. It uses high-speed UART at 921600 baud and can output full-frame, single-line, single-point, or multi-point X/Y/Z coordinate and intensity data.

## Library Info

| Field | Value |
|-------|-------|
| Package | `@aily-project/lib-dfrobot-64x8dtof` |
| Version | `0.1.0` |
| Author | DFRobot |
| Source | https://github.com/DFRobot/DFRobot_64x8DTOF |
| License | MIT |

## Supported Boards

ESP32.

## Description

64x8 dTOF provides UART access to a 64*8 ranging matrix with X/Y/Z coordinates and intensity values.

## Quick Start

Initialize UART, configure single-frame mode and an output mode, call refresh data in the loop, then read cached point values by zero-based index.
