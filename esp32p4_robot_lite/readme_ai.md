# ESP32P4 Robot-Lite

## Library Info

| Field | Value |
| --- | --- |
| Package | `@aily-project/lib-esp32p4-robot-lite` |
| Version | 0.0.1 |
| Core | `esp32:esp32:esp32p4` |

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp32p4_robot_lite_begin` | Statement | None | `esp32p4_robot_lite_begin()` | Acquire VO1–VO4 and configure Hosted SDIO. |
| `esp32p4_robot_lite_wifi_connect` | Statement | `SSID(input_value)`, `PASSWORD(input_value)` | `esp32p4_robot_lite_wifi_connect(text("ssid"), text("password"))` | Initialize board support and call `WiFi.begin()`. |
| `esp32p4_robot_lite_wifi_connected` | Value Boolean | None | `esp32p4_robot_lite_wifi_connected()` | Compare `WiFi.status()` with `WL_CONNECTED`. |
| `esp32p4_robot_lite_ble_init` | Statement | `NAME(input_value)` | `esp32p4_robot_lite_ble_init(text("Robot-Lite"))` | Initialize board support and call `BLEDevice::init()`. |

## Generated board configuration

`hostedSetPins(47, 48, 46, 45, 44, 43, 42)` maps CLK, CMD, D0, D1, D2, D3 and RESET respectively. LDO channels are held for the lifetime of the sketch at 3300, 1800, 2500 and 3300 mV.

The target must be `esp32:esp32:esp32p4` with Arduino-ESP32 3.3.11 or later API compatibility.
