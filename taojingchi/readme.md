# Taojingchi serial screen driver library

## Description

Control brightness, pages, variables and pictures through serial commands.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-taojingchi |
| Version | 1.0.1 |
| Author | ailyProject |
| Source | N/A |
| License | Original license |

## Supported Boards

Arduino AVR, ESP32, Arduino UNO R4

## Quick Start

Enable the library, then add `taojingchi_init` in setup with your pins and screen baud rate. Connect MCU RX to screen TX, MCU TX to screen RX, and share GND. ESP32 uses hardware `Serial1`; AVR/UNO R4 use `SoftwareSerial`.

Without an init block, controls use RX 2, TX 3, 9600 baud. Explicit settings override these defaults. Match settings to your wiring and screen.

Page switching sends `page 1` plus three `0xFF` bytes. Picture paths use names such as `page1.p0.pic=2`; use send-command for other names. See `readme_ai.md` for block details.
