# QWeather

QWeather API client: current conditions, 7-day forecast, and a weather home screen with icons, forecast columns and clock.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-qweather |
| Version | 1.0.0 |
| Author | Bryan |
| Source | https://qweather.com |
| License | UNLICENSED |

## Supported Boards

ESP32

## Description

QWeather API client over HTTPS (gzip handled internally) plus a weather UI panel: standalone or attached to an LVGL screen, with condition icons, 3-day forecast columns and a clock.

## Quick Start

1. Enable `@aily-project/lib-qweather` in Aily Blockly (requires WiFi and an LVGL display).
2. In `arduino_setup()`, call the QWeather configure block with your API host, key and location ID, then attach or open the weather panel.
3. In `arduino_loop()`, refresh data (`qweather_update` + `qweather_ui_show`) and feed `qweather_ui_set_time` each pass.
