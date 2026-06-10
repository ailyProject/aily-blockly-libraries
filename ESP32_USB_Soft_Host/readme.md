# ESP32 USB Soft Host

ESP32-USB-Soft-Host turns selected ESP32 GPIO pins into a low-speed USB host for HID-style devices.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-esp32-usb-soft-host |
| Version | 0.1.5 |
| Author | tobozo |
| Source | https://github.com/tobozo/ESP32-USB-Soft-Host |
| License | MIT |

## Supported Boards

ESP32 boards supported by the upstream library. The library is intended for ESP32 GPIO software USB host experiments and is limited to low-speed USB devices.

## Description

This Blockly wrapper exposes initialization, task options, descriptor logging, device detection, disconnect, data, tick, timer pause/resume, and last-report value blocks. Up to four D+/D- GPIO pairs can be configured; unused ports should use `-1`.

## Quick Start

1. Add event blocks for detect/data handling.
2. Optionally configure task core, priority, LED pin, and descriptor logging.
3. Call the begin block with the D+/D- pins for your board.
