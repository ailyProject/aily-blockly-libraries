# 4x8 Tactile

DFRobot SEN0705 4x8 flexible tactile pressure array over UART.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-dfrobot-sen0705 |
| Version | 0.1.0 |
| Author | vonweller |
| Source | https://github.com/DFRobot/DFRobot_TactileSensor |
| License | MIT |

## Supported Boards

Arduino Mega 2560 (`arduino:avr:mega`) and standard ESP32 (`esp32:esp32:esp32`). UNO, Nano, and other board types are not declared compatible with the default configuration. Mega uses the selected hardware UART's fixed pins; its RX/TX dropdowns do not remap that UART. ESP32 uses the selected RX/TX pins. 5V sensor supply. Default baud 115200. Bundles DFRobot_TactileSensor and DFRobot_RTU.

Advanced manual use on UNO/Nano requires selecting `Serial` and wiring to hardware UART pins D0/D1. The default `Serial1` is unavailable on these boards, so they are excluded from the compatibility list. Their RX/TX dropdowns do not remap the UART. Use that port exclusively for the sensor, without USB serial logging.

## Description

DFRobot SEN0705 4x8 flexible tactile pressure array over UART.

## Quick Start

Call sen0705_init in setup, then sen0705_read before sen0705_cell. Array is 4 rows x 8 cols, 0-based.
