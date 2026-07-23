# AstraUI OLED Menu

Allocation-free animated OLED menu framework based on U8g2.

## Library Info

`@aily-project/lib-astraui` 1.0.0 · GPL-3.0-only · AstraThreshold,
contributors, coloz  
[Upstream source](https://github.com/AstraThreshold/oled-ui-astra)

## Supported Boards

U8g2-compatible boards with enough RAM for a full display buffer and menu.
ESP32, RP2040, STM32, and UNO R4 are the primary targets.

## Description

Build animated list/tile menus with nested pages, actions, toggles, sliders,
choices, live values, Toasts, and events. Supports two/three buttons and custom
input. Objects and backing data have static lifetime with no runtime allocation.

## Quick Start

1. Initialize U8g2 first in **full-buffer** mode.
2. Add AstraUI initialization and select the root page.
3. Inside it, create all pages before controls; then add buttons and styling.
4. Keep “display already initialized” on when U8g2 calls `begin()`.

Button scanning and `ui.tick()` are added to `loop()` automatically.
