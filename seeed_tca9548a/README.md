# TCA9548A 8路I2C集线器

Seeed 8通道I2C多路复用器（TCA9548A）驱动，允许在同一I2C总线上连接多个相同地址的设备。

## 库信息

| 字段 | 值 |
|------|-----|
| Package | @aily-project/lib-seeed-tca9548a |
| Version | 1.0.0 |
| Author | SeeedStudio |
| Source | https://github.com/Seeed-Studio/Seeed_Arduino_8Channel_I2C_Hub |
| License | MIT |

## 支持的开发板

Arduino UNO/Nano/MEGA、ESP32、ESP8266、RP2040等支持I2C的开发板

## 说明

TCA9548A可将一路I2C总线扩展为8路，每路可独立开关，解决多个相同I2C地址设备的冲突问题。通过A0/A1/A2引脚可配置0x70~0x77的I2C地址。

## 快速开始

1. 连接TCA9548A到主I2C总线
2. 将需要扩展的I2C设备分别连接到各通道
3. 在代码中打开对应通道后再操作该通道上的设备
