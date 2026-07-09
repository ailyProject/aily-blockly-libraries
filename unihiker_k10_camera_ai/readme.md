# K10 Camera & AI Recognition

UNIHIKER K10 camera and AI recognition library, supports photo saving, JPEG Base64 capture for vision models, face detection/recognition, pet detection, motion detection, and QR code scanning.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-unihiker-k10-camera-ai |
| Version | 0.1.3 |
| Author | DFRobot |
| Source | N/A |
| License | Original license |

## Supported Boards

UNIHIKER:esp32:k10

## Description

UNIHIKER K10 camera and AI recognition library, supports photo saving, JPEG Base64 capture for vision models, face detection/recognition, pet detection, motion detection, and QR code scanning.

The JPEG Base64 capture block temporarily pauses the camera preview, clears stale frames, captures a fresh frame, and restores the preview only if it was already visible before capture.

## Quick Start

1. Enable `@aily-project/lib-unihiker-k10-camera-ai` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.
