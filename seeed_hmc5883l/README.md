# HMC5883L 三轴数字罗盘

Grove三轴数字罗盘，基于HMC5883L芯片，通过I2C接口读取三轴磁场数据和计算航向角。

## 库信息

| 字段 | 值 |
|------|-----|
| Package | @aily-project/lib-seeed-hmc5883l |
| Version | 1.0.0 |
| Author | SeeedStudio |
| Source | https://github.com/Seeed-Studio/Grove_3Axis_Digital_Compass_HMC5883L |
| License | LGPL-2.1 |

## 支持的开发板

Arduino UNO/Nano/MEGA、ESP32、ESP8266、RP2040等支持I2C的开发板

## 说明

通过I2C接口（默认地址0x1E）连接HMC5883L磁力计，可读取X/Y/Z三轴磁场强度，并计算水平罗盘航向角（0~360度）。

## 快速开始

将HMC5883L模块的SDA/SCL连接到开发板的I2C引脚，在setup中调用初始化块，在loop中读取航向角。
