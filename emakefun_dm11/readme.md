# DM11电机驱动

DM11 I2C电机驱动模块库，支持双电机PWM控制

## 库信息

| 字段 | 值 |
|------|-----|
| 包名 | @aily-project/lib-dm11 |
| 版本 | 1.0.0 |
| 作者 | Emakefun |
| 来源 | https://github.com/emakefun-arduino-library/em_dm11 |
| 许可证 | MIT |

## 支持的开发板

Arduino UNO、ESP32、ESP8266、Arduino UNO R4 WiFi等支持I2C的开发板

## 描述

DM11是使用I2C协议驱动4路PWM从而驱动2路电机的模块，默认I2C地址为0x15。支持PWM频率1-10000Hz，占空比范围0-4095。

## 快速开始

1. 将DM11模块连接到开发板的I2C接口（SDA、SCL）
2. 连接电机到模块的电机接口
3. 使用初始化块配置模块，然后使用电机控制块驱动电机