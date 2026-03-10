# 手势识别传感器

易创空间手势识别模块Arduino库，支持识别右移、左移、后移、前移、上拉、下压、离开、悬停等手势。

## 库信息

| 字段 | 值 |
|------|-----|
| 包名 | @aily-project/lib-gesture-recognizer |
| 版本 | 1.0.0 |
| 作者 | Emakefun |
| 来源 | https://github.com/emakefun-arduino-library/emakefun_gesture_recognizer |
| 许可证 | MIT |

## 支持的开发板

Arduino系列、ESP32系列、ESP32S3系列等支持I2C的开发板

## 描述

该库用于驱动易创空间的手势识别模块，通过I2C接口通信，可识别8种手势动作：右移、左移、后移、前移、上拉、下压、离开感应区、悬停。默认I2C地址为0x39。

## 快速开始

1. 将手势识别模块连接到开发板的I2C接口（SDA、SCL、VCC、GND）
2. 使用"初始化手势识别传感器"积木块初始化
3. 在循环中使用"获取手势"积木块读取识别到的手势