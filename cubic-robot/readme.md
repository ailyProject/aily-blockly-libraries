# Cubic赛事机器人

适配 Cubic CoreV2（ESP32）与 Cubic Motor 扩展板。

电机控制**直接复用** `@aily-project/lib-encoder-motor`（`em::EncoderMotor`），舵机内置 `ESP32Servo`。

## 库信息

| 字段 | 值 |
|------|----|
| 包名 | @aily-project/lib-cubic-robot |
| 版本 | 1.1.1 |
| 依赖源码 | encoder-motor + ESP32Servo（已打包进 src.7z） |

## 默认引脚

- MA: 14/15，编码器 34/35
- MB: 12/17，编码器 36/39
- 舵机: 2/25/16/23

## 快速入门

1. 初始化 Cubic 机器人
2. 电机以动力/速度运转，或差速行驶
3. 读取转速/脉冲；控制舵机与按键
