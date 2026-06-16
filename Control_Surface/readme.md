# Control Surface

Arduino library for creating MIDI controllers and MIDI devices.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-control-surface |
| Version | 1.0.0 |
| Upstream Version | 2.1.2 |
| Author | Pieter P |
| Source | https://github.com/tttapa/Control-Surface |
| License | GPL-3.0 |

## Supported Boards

AVR, SAMD, Teensy, ESP32, ESP8266, megaAVR, mbed, RP2040, UNO R4, and supported MIDI-capable cores.

## Description

This wrapper exposes the Control_Surface lifecycle, USB/serial MIDI interfaces, CC potentiometers, note buttons, and direct MIDI sends.

## Quick Start

1. Add the setup or begin block for the library.
2. Add the action, status, or event blocks needed by your project.
3. For libraries that need polling, the setup blocks automatically add the required loop call when possible.
