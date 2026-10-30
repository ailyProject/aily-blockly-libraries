# IBox S31 USB Host

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-iboxs31_usb |
| Version | 1.0.0 |
| Author | OpenJumper |
| Source | N/A |
| License | Apache-2.0 |

## Supported Boards

IBox S31 (Aily board IBOX S31, ESP32-S31) only; pins and I2C addresses follow its wiring.

## Description

IBox S31 USB-A host port: read a USB keyboard and mouse, read and write files on a USB drive.

## Quick Start

1. Select the IBOX S31 board and keep USB Mode on Hardware CDC (not "USB-OTG (TinyUSB)").
2. Put `iboxs31_usbhost_init` in `arduino_setup()`, plug a keyboard, mouse or FAT32 USB drive into the USB-A port, then read keys, mouse values or files.
