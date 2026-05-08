# SparkFun MY1690 MP3 播放器

SparkFun MY1690 串口 MP3 解码器 Blockly 库。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-my1690 |
| Version | 0.0.1 |
| Author | SparkFun Electronics |
| Source | https://github.com/sparkfun/SparkFun_MY1690_MP3_Decoder_Arduino_Library |
| License | MIT |

## Supported Boards

Arduino UNO, Arduino Mega, ESP32

## Description

MY1690 是一款串口 MP3 解码芯片，支持 SD 卡存储。通过 UART 9600bps 与主控通信，支持播放控制、音量调节（0~30）、均衡器和播放模式设置。

## Quick Start

1. 将 MY1690 TX 连接 Arduino RX，RX 连接 Arduino TX（使用 HardwareSerial）
2. 将 MP3 文件命名为 0001.mp3, 0002.mp3 等放入 SD 卡
3. 使用「初始化 MY1690」并选择对应串口
