# AHT20 温湿度传感器

AHT20高精度I2C温湿度传感器驱动，精度±0.3°C/±2%RH。

## 库信息

| 字段 | 值 |
|------|-----|
| Package | @aily-project/lib-seeed-aht20 |
| Version | 1.0.0 |
| Author | SeeedStudio |
| Source | https://github.com/Seeed-Studio/Seeed_Arduino_AHT20 |
| License | MIT |

## 支持的开发板

Arduino UNO/Nano/MEGA、ESP32、ESP8266、RP2040等支持I2C的开发板

## 说明

AHT20温湿度精度高、响应快、功耗低，I2C接口（地址0x38），温度精度±0.3°C，湿度精度±2%RH。

## 快速开始

1. 连接AHT20到I2C接口（SDA/SCL）
2. 在setup中初始化
3. 在loop中读取温度和湿度值
