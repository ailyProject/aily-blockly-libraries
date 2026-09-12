# GxEPD2 Any Panel

One setup block exposing every e-paper driver bundled with `@aily-project/lib-gxepd2` (99 panels: 57 BW, 25 3-color, 12 4-color, 5 7-color).

## Library Info

| Field | Value |
| ----- | ----- |
| Package | @aily-project/lib-gxepd2-any |
| Version | 1.1.0 |
| Author | ajie5211 (drivers from GxEPD2 by Jean-Marc Zingg) |
| Source | https://github.com/ZinggJM/GxEPD2 |
| License | GPL-3.0 |

## Supported Boards

Boards supported by `@aily-project/lib-gxepd2` with hardware SPI (e.g. ESP32). Panels are 3.3V only.

## Description

Pick any bundled GxEPD2 panel; each label shows inches, color type, class and resolution. The created `$display` works with all stock GxEPD2 drawing blocks. Large panels page automatically within the ESP32 buffer.

## Quick Start

Wire VCC->3.3V, GND->GND, CLK->SCK, DIN->MOSI plus CS/DC/RST/BUSY, pick the PANEL entry matching your panel marking, then use the stock GxEPD2 blocks.
