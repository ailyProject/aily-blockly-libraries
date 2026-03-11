# Emakefun NLCS11 颜色传感器

Emakefun NLCS11 颜色传感器 Blockly 库，支持 RGBC 颜色检测。

## 库信息

| 字段 | 值 |
|------|-----|
| 包名 | @aily-project/lib-emakefun_nlcs11 |
| 版本 | 1.0.0 |
| 作者 | Emakefun |
| 来源 | https://github.com/emakefun-arduino-library/emakefun_color_sensor_nlcs11 |
| 协议 | MIT |

## 支持的开发板

Arduino UNO, Arduino Mega, Arduino Nano, ESP32, ESP8266, Arduino UNO R4 WiFi, RP2040

## 说明

NLCS11 是一款 I2C 接口的颜色传感器模块，能够检测环境光的 R（红）、G（绿）、B（蓝）、C（透明）四个通道的颜色值。支持配置增益（1X~2.5X）和积分时间（10ms~800ms）。

## 快速开始

1. 将 NLCS11 模块连接到 I2C 接口（SDA、SCL）
2. 在 setup 中添加"初始化 NLCS11 颜色传感器"积木块
3. 在 loop 中使用"读取到新颜色"和"颜色值"积木块获取数据
