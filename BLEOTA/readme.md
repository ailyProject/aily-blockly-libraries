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

BLEOTA creates a BLE GATT OTA service on ESP32 boards for firmware and filesystem image updates. It supports zlib compression, CRC checking, and optional RSA-2048 signature verification.

## Quick Start

Use the quick start BLE OTA block in `setup` to create the BLE server with the default device name, add the OTA service, start advertising, and auto-process updates in `loop`.

For manual flows, use the normal initialization block after configuring the BLEOTA object. It only starts the service and advertising, so add the BLE OTA process block in `loop` yourself.
