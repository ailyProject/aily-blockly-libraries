# ESP32 Classic Bluetooth HID

## Library Info

`@aily-project/lib-esp32-classic-bluetooth-hid` 0.0.4 · ailyProject · MIT. Third-party terms: NOTICE.

## Supported Boards

Original ESP32 WROOM/WROVER; Arduino-ESP32 3.3.10 or later. ESP32-S3/C3 unsupported.

## Description

Classic Bluetooth keyboard, mouse, combo, media keys, gamepad and experimental Switch Pro. Two independent native libraries are bundled in `src`.

0.0.4 sets CoD before discovery, includes EIR names, adopts the 170-byte Switch descriptor and adds connection diagnostics. Six profiles compile with Arduino-ESP32 3.3.12.

## Quick Start

Initialize one mode in setup. Loop update is automatic. PRESS holds until RELEASE; mouse CLICK releases automatically. Trigger input from a button/command. BLE/BluetoothSerial cannot share the controller. Radio and Switch hardware interoperability remain unverified.

[AI contract and ABS examples](readme_ai.md) · [中文说明](readme_zh.md)
