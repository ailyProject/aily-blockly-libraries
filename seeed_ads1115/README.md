# ADS1115 16位ADC

Seeed Arduino ADS1115驱动，16位高精度I2C ADC，支持4路单端或差分输入。

## 库信息

| 字段 | 值 |
|------|-----|
| Package | @aily-project/lib-seeed-ads1115 |
| Version | 1.0.0 |
| Author | SeeedStudio |
| Source | https://github.com/Seeed-Studio/Seeed_Arduino_ADS1115 |
| License | MIT |

## 支持的开发板

Arduino UNO/Nano/MEGA、ESP32、ESP8266、RP2040等支持I2C的开发板

## 说明

ADS1115是16位精度ADC，I2C接口，支持4个通道的单端或差分测量，可编程增益放大器（PGA）支持±0.256V至±6.144V量程。

## 快速开始

1. 连接ADS1115到I2C接口，ADDR引脚决定I2C地址
2. 在setup中初始化并设置增益
3. 在loop中读取通道原始值或电压值
