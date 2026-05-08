# SparkFun MS5803 气压传感器

SparkFun MS5803-14BA I2C 气压与温度传感器 Blockly 库。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-ms5803 |
| Version | 0.0.1 |
| Author | SparkFun Electronics |
| Source | https://github.com/sparkfun/MS5803-14BA_Breakout |
| License | MIT |

## Supported Boards

Arduino UNO, Arduino Mega, ESP32

## Description

MS5803-14BA 是一款高精度 I2C 气压和温度传感器，气压量程 0~14bar，分辨率可通过 ADC 精度参数调节。支持摄氏度/华氏度温度输出。

## Quick Start

1. 将传感器通过 I2C 连接（SDA/SCL），设置地址跳线
2. 使用「初始化 MS5803」块创建传感器对象
3. 读取温度或气压数值
