# BME280温湿度气压传感器

Grove BME280温湿度气压传感器库，支持读取温度、湿度、气压和海拔高度。

## 库信息

| 字段 | 值 |
|------|-----|
| 包名 | @aily-project/lib-bme280 |
| 版本 | 1.0.0 |
| 作者 | SeeedStudio |
| 来源 | https://github.com/Seeed-Studio/Grove_BME280 |
| 许可证 | MIT |

## 支持的开发板

Arduino UNO、ESP32、ESP8266、Arduino UNO R4 WiFi等所有支持I2C的开发板。

## 描述

BME280是一款高精度环境传感器，可同时测量温度、湿度、气压。通过I2C接口通信，支持计算海拔高度。

## 快速开始

1. 将BME280传感器连接到I2C接口（SDA、SCL、VCC、GND）
2. 使用初始化块配置传感器
3. 使用读取块获取温度、湿度、气压数据