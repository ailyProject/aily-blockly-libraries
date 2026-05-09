# Wio Terminal 麦克风与蜂鸣器

Wio Terminal 内置麦克风与无源蜂鸣器控制库，支持音量检测和音调播放。

## 库信息

| 字段 | 值 |
|------|-----|
| Package | @aily-project/lib-seeed-wio-sound |
| Version | 1.0.0 |
| Author | SeeedStudio |
| Source | https://wiki.seeedstudio.com/Wio-Terminal-Buzzer/ |
| License | MIT |

## 支持的开发板

Wio Terminal（Seeeduino SAMD）

## 描述

本库封装了 Wio Terminal 内置麦克风（`WIO_MIC`）和无源蜂鸣器（`WIO_BUZZER`）的基本操作。麦克风返回 0~1023 的模拟值，可用于声音检测；蜂鸣器支持 analogWrite 占空比控制和 tone() 频率播放两种模式。所有引脚初始化由代码生成器自动注入 setup 区域，无需手动初始化。

## 快速开始

1. 选择 Wio Terminal 作为目标开发板
2. 将麦克风或蜂鸣器块拖入程序，无需额外初始化步骤
3. 使用「读取麦克风音量」或「蜂鸣器播放频率」即可开始使用
