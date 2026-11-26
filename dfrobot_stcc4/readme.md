# STCC4 CO2 Sensor

Gravity STCC4 CO2 sensor library for Aily Blockly.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-dfrobot-stcc4 |
| Version | 0.1.1 |
| Author | vonweller |
| Source | https://gitee.com/yeezb/ext-stcc4-co2-sensor |
| License | MIT |

## Supported Boards

Arduino-compatible boards with I2C.

## Description

Reads CO2 concentration, temperature, humidity, and sensor status over I2C. Includes compensation, calibration, sleep, wakeup, and reset controls.

## Quick Start

Initialize the sensor in `arduino_setup()`, then call the read block in `arduino_loop()` before using the data block.

## 0.1.2

产品标识和测量值均校验本次请求、长度及每个 16 位字的 CRC。短读、CRC 错误和校准失败保留上一次有效读数。积木按有符号 ppm 展示 CO₂，现有 C++ 接口仍可获取原始 16 位字。

软件复位调用会向 I²C 通用地址发送复位命令，同一总线上支持通用复位的其他器件也可能复位。需要单器件操作时，请使用适合当前场景的器件命令。[STCC4 数据表](https://sensirion.com/media/documents/6AED4B15/69295E41/CD_DS_STCC4_D1.pdf)

## 0.1.3

修正命令的最短等待时间。产品 ID、序列号及其他带等待的命令在 Arduino 的毫秒节拍边界也会等待完整时长。软件复位接受通用地址已应答、复位数据字节未应答的返回状态。

## 0.1.4

设置温湿度补偿、设置气压补偿和进入休眠后均等待 1 毫秒，随后可立即调用下一条命令。
