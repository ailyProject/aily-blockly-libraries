# TGAM Brainwave

UART support for a NeuroSky TGAM module. It reports signal quality, attention,
and meditation without blocking the main loop.

## Library Info

| Field | Value |
| --- | --- |
| Package | @aily-project/lib-tgam |
| Version | 1.2.0 |
| License | UNLICENSED |

## Supported Boards

Arduino AVR, ESP32, ESP8266, SAMD, RP2040, and Arduino Uno R4 boards with a
supported serial port.

## Description

The driver validates TGAM packets and updates the latest available metrics.

## Quick Start

1. Power the TGAM module from 3.3 V and connect TX, RX, and GND.
2. Add the initialization block in `arduino_setup()`. Use 57600 baud unless the
	module was reconfigured.
3. Read signal quality, attention, or meditation in `arduino_loop()`. On ESP32,
	choose Serial1 or Serial2 to set RX and TX pins.

A quality value of 0 indicates good electrode contact; 200 indicates no
contact. Do not initialize the same serial port again with `serial_begin`.
