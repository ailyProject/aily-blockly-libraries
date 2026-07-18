# ESP32Cam camera

ESP32 OV2640 camera library with capture, runtime controls and MJPEG streaming.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-esp32cam |
| Version | 1.0.0 |
| Author | Junxiao Shi |
| Source | https://github.com/yoursunny/esp32cam |
| License | ISC |

## Supported Boards

ESP32 boards with a supported camera pin layout and PSRAM; ESP32 Arduino core v3.x is recommended.

## Description

Provides camera initialization, runtime image controls, safe frame ownership, format conversion, serial output, still-image responses, and MJPEG streaming.

## Quick Start

1. Enable this library and create an ESP32Cam frame variable.
2. Initialize the camera in `arduino_setup()` with the correct pin preset.
3. Capture, inspect, send, and release frames in `arduino_loop()` or a WebServer route.

Select a board configuration that enables PSRAM. The WebServer blocks use `@aily-project/lib-esp32-webserver`.
