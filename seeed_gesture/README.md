# Grove 手势传感器

基于PAJ7620的Grove手势传感器，通过I2C接口识别9种手势动作。

## 库信息

| 字段 | 值 |
|------|-----|
| Package | @aily-project/lib-seeed-gesture |
| Version | 1.0.0 |
| Author | SeeedStudio |
| Source | https://github.com/Seeed-Studio/Grove_Gesture |
| License | MIT |

## 支持的开发板

Arduino UNO/Nano/MEGA、ESP32、ESP8266、RP2040等支持I2C的开发板

## 说明

可识别9种手势：上移、下移、左移、右移、前推、后拉、顺时针、逆时针、挥手。I2C地址0x73。

## 快速开始

1. 将Grove手势传感器连接到I2C接口
2. 在setup中初始化
3. 在loop中判断手势类型并执行相应动作
