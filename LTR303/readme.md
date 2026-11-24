# LTR303 Ambient Light

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-ltr303 |
| Version | 1.0.1 |
| Author | OpenJumper |
| Source | N/A |
| License | Apache-2.0 |

## Supported Boards

ESP32 boards (Arduino-ESP32). I2C pins follow the selected board; on the IBox S31 the onboard LTR-303 uses SDA=IO0, SCL=IO1.

## Description

LTR-303 ambient light sensor: lux plus raw visible and infrared counts, I2C pins from the board.

## Quick Start

1. Select an ESP32 board; the I2C pins come from the board (IBox S31: SDA=IO0, SCL=IO1).
2. Put `ltr303_init` in `arduino_setup()`, then use `ltr303_read` in `arduino_loop()`.

1.0.2 支持 OJ Nano 的默认 Wire 和 ESP32-S3。readSample(ch0, ch1, lux) 从同一笔四字节 I²C 事务取得两个通道并计算照度。增益或积分时间改变后，等下一次转换完成再读取新设置对应的样本。
