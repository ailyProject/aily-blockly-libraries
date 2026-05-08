# SparkFun BMP180

用于 Bosch BMP180 气压/温度传感器的 Blockly 库。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-bmp180 |
| Version | 0.0.1 |
| Author | SparkFun Electronics |
| Source | https://github.com/sparkfun/BMP180_Breakout_Arduino_Library |
| License | Beerware |

## Supported Boards

Arduino UNO、Mega、ESP32 等支持 I2C 的开发板。BMP180 供电为 3.3V。

## Description

该库封装 BMP180 的初始化、温度读取、气压读取、海平面气压换算和海拔计算。读取气压前会自动完成温度测量流程。

## Quick Start

将 VDD 接 3.3V，GND 接地，SDA/SCL 接开发板 I2C。先在 setup 中初始化，再在 loop 中读取温度或气压。