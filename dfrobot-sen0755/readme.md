# TF-UW500 Underwater LiDAR

SEN0755 TF-UW500 underwater single-point LiDAR over UART/I2C, distance in mm, peak, temperature and confidence.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-dfrobot-sen0755 |
| Version | 0.1.0 |
| Author | vonweller |
| Source | https://wiki.dfrobot.com.cn/SKU_SEN0755 |
| License | MIT |

## Supported Boards

Arduino UNO (`arduino:avr:uno`) and standard ESP32 (`esp32:esp32:esp32`). Arduino Nano, Mega, ESP8266, and other board types are not declared compatible with this version. UNO UART uses SoftwareSerial on the selected RX/TX pins; ESP32 uses the selected hardware serial port. Sensor supply is 5V. UART 3.3V TTL.

## Description

SEN0755 TF-UW500 underwater single-point LiDAR over UART/I2C, distance in mm, peak, temperature and confidence.

## Quick Start

UART uses 115200 8N1. For I2C, first configure the sensor for I2C communication; its default I2C address is 0x10. Call sen0755_read before sen0755_get_data. Confidence is available in UART frames; I2C mode returns 0 for the confidence getter.
