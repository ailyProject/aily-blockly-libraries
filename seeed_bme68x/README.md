# BME68x 环境传感器

Seeed BME680/BME688四合一环境传感器驱动，可同时检测温度、湿度、气压和气体阻力（空气质量）。

## 库信息

| 字段 | 值 |
|------|-----|
| Package | @aily-project/lib-seeed-bme68x |
| Version | 1.0.0 |
| Author | SeeedStudio |
| Source | https://github.com/Seeed-Studio/Seeed_Arduino_BME68x |
| License | MIT |

## 支持的开发板

Arduino UNO/Nano/MEGA、ESP32、ESP8266、RP2040等支持I2C的开发板

## 说明

BME680/BME688是Bosch出品的四合一环境传感器，集成温湿度、气压和VOC气体检测，适用于室内空气质量监测和天气站应用。

## 快速开始

1. 通过I2C连接BME68x（SDO接GND地址为0x76，接VDD为0x77）
2. 在setup中初始化
3. 在loop中先调用"更新数据"块，再读取各项数值
