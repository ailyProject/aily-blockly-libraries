# ArduinoFFT

arduinoFFT blocks for sampling signals, running FFT, and reading frequency peaks.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-arduino-fft |
| Version | 0.1.0 |
| Author | Enrique Condes, Didier Longueville, Bim Overbohm |
| Source | https://github.com/kosme/arduinoFFT |
| License | GPL-3.0-or-later |

## Supported Boards

Arduino-compatible boards supported by this package.

## Description

This wrapper creates FFT objects with managed real and imaginary buffers. It supports analog sampling, synthetic tone generation, windowing, FFT processing, peak detection, bin lookup, band magnitudes, and serial bin printing.

## Quick Start

Enable `@aily-project/lib-arduino-fft`, create an FFT object in `arduino_setup()`, fill samples in `arduino_loop()`, run the forward pipeline, then read the major peak frequency.