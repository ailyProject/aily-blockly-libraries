# BLEOTA

ESP32 BLE firmware and filesystem OTA update library for receiving `.bin` update images over Bluetooth Low Energy.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-bleota |
| Version | 1.0.6 |
| Author | gb88 |
| Source | https://github.com/gb88/BLEOTA |
| License | AGPL-3.0-only |

## Supported Boards

ESP32 series boards, 3.3V.

## Description

BLEOTA creates a BLE GATT OTA service on ESP32 boards and supports application firmware and filesystem image updates. It automatically selects the BLE backend from the installed arduino-esp32 core and supports zlib compression, CRC checking, and optional RSA-2048 signature verification.

## Quick Start

Use the `start BLE OTA with device name` block in `setup` to create the BLE server, add the OTA service, and start advertising. Then open the BLEOTA Web Bluetooth tool, connect to the device, and upload the exported `.bin` file.
