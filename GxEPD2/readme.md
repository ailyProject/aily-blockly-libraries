# GxEPD2 e-Paper

GxEPD2 Blockly blocks for SPI e-paper displays from Good Display and Waveshare.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-gxepd2 |
| Version | 1.6.9 |
| Author | Jean-Marc Zingg |
| Source | https://github.com/ZinggJM/GxEPD2 |
| License | GPL-3.0 |

## Supported Boards

Arduino-compatible boards supported by GxEPD2. E-paper panels require 3.3V supply and 3.3V data lines.

## Description

This library wraps common GxEPD2 workflows: display initialization, paged refresh, partial windows, text, basic drawing, colors, and low-power modes. It uses the upstream GxEPD2 source and depends on Adafruit_GFX.

## Quick Start

Wire the panel by SPI, initialize the display with the matching panel driver and pins, then place drawing blocks inside a paged refresh block. Use hibernate after the last refresh to reduce power.
