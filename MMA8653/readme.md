# MMA8653 Accelerometer

MMA8653 three-axis accelerometer library, I2C communication, supports 2/4/8G range, 8/10-bit resolution, multiple data rates

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-mma8653 |
| Version | 1.0.0 |
| Author | Lucas Hohmann |
| Source | https://github.com/lfhohmann/MMA8653 |
| License | Original license |

## Supported Boards

Arduino-compatible boards supported by this package.

## Description

MMA8653 three-axis accelerometer library, I2C communication, supports 2/4/8G range, 8/10-bit resolution, multiple data rates

## Quick Start

1. Enable `@aily-project/lib-mma8653` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.

## I²C 读数有效性（1.0.1）

初始化探测失败后程序可以继续运行。恢复连接后执行“开始测量”可重试此前的初始化设置。读取单轴或 XYZ 积木时，待机、短读或掉线返回 INT16_MIN（−32768）；读倾角时返回 NaN。原始 8 位或 10 位样本均可合法等于 −1。Coder 可调用 `bool tryReadSensor(int16_t*, int16_t*, int16_t*)`，失败时三个输出均保留原值。
