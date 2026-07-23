# MiaoUI OLED Menu

Animated monochrome OLED menu UI based on U8g2.

## Library Info

`@aily-project/lib-miaoui` 1.0.0 · MIT · JFeng-Z, contributors, coloz  
[Upstream source](https://github.com/coloz/MiaoUI_Arduino)

## Supported Boards

Arduino-compatible boards supported by U8g2. Requires a 128x64 monochrome
display and a full-buffer U8g2 object.

## Description

Build nested menus, editable values, switches, UTF-8 text, waves, and callbacks.
GPIO buttons and injected encoder, serial, touch, or custom input are supported.
Initialization generates the hooks and refreshes MiaoUI in `loop()`.

## Quick Start

1. Create a 128x64 full-buffer U8g2 display.
2. Add MiaoUI initialization; disable display initialization if U8g2 calls `begin()`.
3. Add pages before items, then select the first item.
4. Bind every data, wave, or text item.
5. Configure GPIO buttons or inject actions from another source.

Use one MiaoUI instance per sketch. Icons are 30x30 XBM arrays or `nullptr`.
