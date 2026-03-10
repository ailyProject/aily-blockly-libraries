# 矩阵键盘库

Emakefun矩阵键盘模块驱动库，支持4x4矩阵键盘（0-9、A-D、*、#）的按键检测。

## 库信息

| 字段 | 值 |
|------|-----|
| 包名 | @aily-project/lib-matrix_keyboard |
| 版本 | 1.0.0 |
| 作者 | Emakefun |
| 来源 | https://github.com/emakefun-arduino-library/emakefun_matrix_keyboard_v3 |
| 许可证 | MIT |

## 支持的开发板

Arduino UNO、ESP32、ESP8266、Arduino UNO R4 WiFi等支持I2C的开发板

## 描述

该库用于驱动Emakefun矩阵键盘模块，通过I2C接口（默认地址0x65）读取按键状态。支持检测按键按下、按住、释放和空闲状态，可获取当前按下的按键字符。

## 快速开始

1. 将矩阵键盘模块连接到开发板的I2C接口（SDA、SCL）
2. 创建矩阵键盘对象并初始化
3. 在loop中调用Tick()扫描按键状态
4. 使用按键检测块获取按键状态