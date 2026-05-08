# SparkFun Qwiic Relay 继电器

SparkFun Qwiic Relay 的 Blockly 封装库，支持单路（COM-15093）和四路（COM-16566）继电器，通过 I2C 控制。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-qwiic-relay |
| Version | 0.0.1 |
| Author | SparkFun Electronics |

## Quick Start

1. 初始化时选择单路（0x18）或四路（0x6D）地址
2. 使用「打开/关闭/切换」控制单路继电器
3. 使用「打开/关闭第 N 路」控制四路继电器的具体通道
