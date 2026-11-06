# OV3660 Camera

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-ov3660 |
| Version | 1.0.0 |
| Author | OpenJumper |
| Source | N/A |
| License | Apache-2.0 |

## Supported Boards

ESP32-S31 boards (Arduino-ESP32 4.0.0, PSRAM). Pins come from the board’s `cameraConfig` (IBox S31); a board whose camera is not an OV3660 fails to compile.

## Description

OV3660 camera (ESP32-S31): photos, live video stream, picture colour and BMP saving; pins from the board.

## Quick Start

1. Select an ESP32-S31 board with an OV3660 (IBox S31; Arduino-ESP32 4.0.0, PSRAM built in).
2. Put `ov3660_init` in `arduino_setup()`, call `ov3660_capture`, then read brightness or colours; for live video use `ov3660_stream_start`.
