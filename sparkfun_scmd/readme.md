# SparkFun SCMD 串行控制电机驱动

I2C/串行多路电机驱动器 Blockly 库。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-scmd |
| Version | 0.0.1 |
| Author | SparkFun Electronics |
| Source | https://github.com/sparkfun/SparkFun_Serial_Controlled_Motor_Driver_Arduino_Library |
| License | MIT |

## Description

SCMD 支持 I2C 和串口两种通信方式，可驱动最多 34 路直流电机（通过级联）。

## Quick Start

1. 使用"初始化 SCMD"积木（I2C 地址默认 0x5D）
2. 调用"启用输出"激活电机
3. 使用"电机速度"积木控制各路电机
