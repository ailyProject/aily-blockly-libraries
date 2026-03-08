# SR04超声波距离传感器

HC-SR04超声波距离传感器的Aily Blockly库,支持2-400cm的距离测量

## 库信息

| 字段 | 值 |
|------|-----|
| 包名 | @aily-project/lib-sr04 |
| 版本 | 1.0.0 |
| 作者 | Martin Sosic |
| 来源 | https://github.com/Martinsos/arduino-lib-hc-sr04 |
| 许可证 | MIT |

## 支持的开发板

Arduino UNO/Nano/Mega、ESP32、ESP8266、Arduino UNO R4 WiFi、Raspberry Pi Pico等

## 描述

SR04超声波传感器库提供简单的距离测量功能。支持标准模式和温度补偿模式,可设置最大测量距离。测量范围2-400cm,精度约3mm。

## 快速开始

1. 连接传感器:VCC→5V, GND→GND, Trig→数字引脚, Echo→数字引脚
2. 使用"创建SR04超声波传感器"块初始化
3. 使用"测量距离"块获取距离值(厘米)
