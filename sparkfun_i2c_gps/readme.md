# SparkFun I2C GPS

通过 I2C 接口读取 GPS NMEA 数据流的 Arduino 库。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-i2c-gps |
| Version | 0.0.1 |
| Author | SparkFun Electronics |
| Source | https://github.com/sparkfun/SparkFun_I2C_GPS_Arduino_Library |
| License | GPL-3.0 |

## Supported Boards

Arduino UNO、Arduino Mega、ESP32

## Description

本库支持 SparkFun I2C GPS 模块（MediaTek MT3333），通过 I2C 接口获取 GPS NMEA 数据，再由 TinyGPS++ 等库进行解析。

## Quick Start

1. 连接 GPS 模块到 I2C 总线（SDA/SCL）
2. 在 Setup 中调用初始化块
3. 在 Loop 中使用「可用字节」和「读取字节」循环读取 NMEA 数据
