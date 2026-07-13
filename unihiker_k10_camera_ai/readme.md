# K10 Camera & AI Recognition

UNIHIKER K10 camera and AI vision blocks for photos, Base64 capture, face/pet/motion detection, face recognition, and QR codes.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-unihiker-k10-camera-ai |
| Version | 0.1.14 |
| Author | DFRobot |
| Source | N/A |
| License | Original license |

## Supported Boards

UNIHIKER:esp32:k10

## Description

AI initializes the shared queues, starts the camera with preview hidden, waits for the first frame, and then starts the selected AI mode once. Face detection and identity recognition share one Face mode; use face actions to learn, recognize, or clear learned faces.

## Quick Start

Initialize camera/AI in `arduino_setup()`. Add the show block only when live preview is required.
