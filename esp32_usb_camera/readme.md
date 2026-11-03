# USB摄像头

Capture UVC MJPEG, save JPEG, and preview over a local network.

## Library Info

| Field | Value |
|---|---|
| Package | @aily-project/lib-esp32-usb-camera |
| Version | 0.1.0 |
| Author | ailyProject |
| Source | [Espressif UVC](https://components.espressif.com/components/espressif/usb_host_uvc) |
| License | MIT wrapper; Apache-2.0 UVC driver |

## Supported Boards

ESP32-S3, Arduino-ESP32 3.3.12, PSRAM enabled. Select USB-OTG; disable USB CDC On Boot. Debug via separate UART.

## Description

Requires Full-Speed MJPEG (12 Mbps), at most 64 KiB/frame. Hardware compatibility is unverified.

## Quick Start

1. Wire GPIO19=D-, GPIO20=D+, ground and external 5V VBUS. GPIO controls a power switch only; -1 leaves power external.
2. Initialize at 320x240/15fps, then capture. Mount storage before saving; existing files are overwritten.
3. Connect WiFi and start preview. Open its URL; /capture returns JPEG.

See [block contracts](readme_ai.md).
