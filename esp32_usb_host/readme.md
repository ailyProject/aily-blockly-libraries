# ESP32 USB Host

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-esp32-usb-host |
| Version | 1.0.0 |
| Author | OpenJumper |
| Source | N/A |
| License | Apache-2.0 |

## Supported Boards

ESP32-S31 boards (Arduino-ESP32 4.0.0), USB Mode not "USB-OTG (TinyUSB)". The library does not power the port; on the IBox S31 turn on XL9555 P07 first.

## Description

ESP32 USB host: read a USB keyboard and mouse, read and write USB drive files; port power is up to the board.

## Quick Start

1. Select an ESP32-S31 board and keep USB Mode on Hardware CDC (not "USB-OTG (TinyUSB)").
2. Power the USB port if the board needs it (IBox S31: XL9555 P07 high), put `esp32_usb_host_init` in `arduino_setup()`, then read keys, mouse values or files.
