# Grove DHT温湿度传感器

支持DHT11、DHT22、DHT10等Grove系列温湿度传感器的驱动库。

## 库信息

| 字段 | 值 |
|------|-----|
| Package | @aily-project/lib-seeed-dht |
| Version | 1.0.0 |
| Author | SeeedStudio |
| Source | https://github.com/Seeed-Studio/Grove_Temperature_And_Humidity_Sensor |
| License | MIT |

## 支持的开发板

Arduino UNO/Nano/MEGA、ESP32、ESP8266、RP2040等

## 说明

支持DHT11（单线，精度±2°C）、DHT22（单线，精度±0.5°C）、DHT10（I2C接口）温湿度传感器。

## 快速开始

1. 将Grove DHT模块连接到数字引脚（默认D2）
2. 在setup中调用初始化块，选择正确的传感器类型
3. 在loop中读取温度和湿度值
