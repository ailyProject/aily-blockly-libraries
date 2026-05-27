# Heart Rate Sensor

Photoelectric heart rate sensor library for BPM calculation and waveform output.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-heartrate |
| Version | 1.0.0 |
| Author | OpenJumper |
| Source | N/A |
| License | Original license |

## Supported Boards

ESP32, Arduino UNO, Arduino MKR, RP2040, and other Arduino-compatible boards with analog input.

## Description

This library reads a photoelectric heart rate sensor from an analog pin. It filters the raw signal, detects pulse peaks, calculates BPM, and exposes a waveform value for plotting.

## Quick Start

1. Connect the sensor signal pin to an analog input pin.
2. Initialize the sensor in `arduino_setup()`.
3. Call update in `arduino_loop()`, then read BPM or waveform values.
