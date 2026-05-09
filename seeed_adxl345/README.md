# ADXL345 三轴加速度计

Seeed Arduino ADXL345三轴加速度计驱动，读取XYZ轴加速度数据。

## 库信息

| 字段 | 值 |
|------|-----|
| Package | @aily-project/lib-seeed-adxl345 |
| Version | 1.0.0 |
| Author | SeeedStudio |
| Source | https://github.com/Seeed-Studio/Seeed_Arduino_ADXL345 |
| License | MIT |

## 支持的开发板

Arduino UNO/Nano/MEGA、ESP32、ESP8266、RP2040等

## 说明

ADXL345是三轴加速度计，分辨率13位，量程±16g，支持I2C和SPI接口。

## 快速开始

1. 通过I2C连接ADXL345到开发板
2. 在setup中初始化（powerOn）
3. 在loop中读取X/Y/Z轴加速度（单位：g）
