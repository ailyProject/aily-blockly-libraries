# IBox S31 Camera

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-iboxs31_camera |
| Version | 1.0.0 |
| Author | OpenJumper |
| Source | N/A |
| License | Apache-2.0 |

## Supported Boards

IBox S31 (Aily board IBOX S31, ESP32-S31) only; pins and I2C addresses follow its wiring.

## Description

IBox S31 onboard OV3660 camera: photos, live video stream, picture colour, save BMP to SD card.

## Quick Start

1. Select the IBOX S31 board (Arduino-ESP32 4.0.0; PSRAM is built in).
2. Put `iboxs31_camera_init` in `arduino_setup()`, call `iboxs31_camera_capture`, then read brightness or colours; saving BMP needs `IBoxS31_SDCard`.
