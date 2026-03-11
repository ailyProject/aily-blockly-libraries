# 五路巡线传感器 v3

emakefun 五路巡线传感器模块 v3，I2C接口，支持模拟值和数字值读取

## 库信息

| 字段 | 值 |
|------|-----|
| 包名 | @aily-project/lib-five_line_tracker_v3 |
| 版本 | 1.0.0 |
| 作者 | emakefun |
| 来源 | https://github.com/emakefun-arduino-library/emakefun_five_line_tracker_v3 |

## 支持的开发板

所有支持 I2C 接口的 Arduino 开发板

## 描述

五路巡线传感器模块，通过 I2C 接口与 Arduino 通信。可同时读取 5 个通道的模拟值(0-1023)和数字值(0或1)。支持设置高低阈值来调整数字转换的灵敏度。

## 快速开始

1. 将传感器连接到 I2C 接口（SDA、SCL、VCC、GND）
2. 使用"初始化五路巡线传感器"积木块初始化
3. 使用"读取模拟值"或"读取数字值"获取传感器数据
