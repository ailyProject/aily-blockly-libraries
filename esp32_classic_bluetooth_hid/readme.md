# ESP32 Classic Bluetooth HID

## Library Info

`@aily-project/lib-esp32-classic-bluetooth-hid` 0.0.3 · ailyProject · MIT. Bundled third-party terms: NOTICE.

## Supported Boards

Original ESP32 WROOM/WROVER; Arduino-ESP32 3.3.10 or later. ESP32-S3/C3 unsupported.

## Description

Classic Bluetooth keyboard, mouse, keyboard/mouse combo, media keys, gamepad and experimental Switch Pro. Both independent native libraries are bundled in `src`. One mode owns the Bluetooth controller.

## Quick Start

Initialize one mode in setup, then use matching blocks. Loop update is automatic. PRESS holds until RELEASE; mouse CLICK releases automatically. Trigger actions from a button or command instead of every loop. BLE/BluetoothSerial cannot run alongside this library. Radio and Switch interoperability remain unverified.

[AI contract and ABS examples](readme_ai.md) · [中文说明](readme_zh.md)
