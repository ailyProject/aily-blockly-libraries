# JQ6500 语音模块库

- 包名 / 版本：`@aily-project/lib-jq6500` 1.0.0
- 用途：通过软件串口控制 JQ6500 串口语音模块（复位、音量、按序号播放、循环模式）
- 支持：带 `SoftwareSerial` 的 Arduino 开发板；已在 `arduino:avr`（Arduino Nano）上编译验证
- 依赖：仅依赖板载 `SoftwareSerial`，驱动源码随库自带，无需另外安装 Arduino 库

## 接线

| Arduino | JQ6500 |
| ------- | ------ |
| RX 引脚（默认 11） | TX |
| TX 引脚（默认 12） | RX |
| GND | GND |

串口固定 9600，8N1。音频文件需预先存入模块的 TF 卡 / SPI Flash，播放序号从 1 开始。

## 最小用法

1. `初始化 JQ6500 mp3 RX引脚 11 TX引脚 12`
2. `JQ6500 mp3 复位模块`
3. `JQ6500 mp3 设置音量 30`
4. `JQ6500 mp3 设置循环模式 不循环`
5. 需要提示音时使用 `JQ6500 mp3 播放第 1 个音频`
