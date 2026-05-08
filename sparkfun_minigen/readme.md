# SparkFun MiniGen 信号发生器

SparkFun MiniGen AD9837 SPI 信号发生器 Blockly 库。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-minigen |
| Version | 0.0.1 |
| Author | SparkFun Electronics |
| Source | https://github.com/sparkfun/SparkFun_MiniGen_Arduino_Library |
| License | MIT |

## Supported Boards

Arduino UNO, Arduino Pro Mini, ESP32

## Description

MiniGen 基于 AD9837 芯片，通过 SPI 接口输出正弦波、三角波或方波信号，频率可精确调节，内置两个频率寄存器和相位寄存器。

## Quick Start

1. 通过 SPI 连接 MiniGen（MOSI/SCK + FSYNC 片选引脚）
2. 使用「初始化 MiniGen」块，指定 FSYNC 引脚
3. 设置波形类型和频率后输出信号
