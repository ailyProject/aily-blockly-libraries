# SparkFun Qwiic OTOS 光学追踪传感器

SparkFun Qwiic OTOS（SEN-24904）的 Blockly 封装库，通过 I2C 读取机器人光学里程计数据（X、Y 位置与朝向角度）。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-qwiic-otos |
| Version | 0.0.1 |
| Author | SparkFun Electronics |
| Source | https://github.com/sparkfun/SparkFun_Qwiic_OTOS_Arduino_Library |
| License | MIT |

## Quick Start

1. 通过 Qwiic 连接 OTOS 模块
2. 初始化后调用「校准 IMU」（模块静止）
3. 使用「重置位置到原点」设置起始点
4. 在循环中读取 X 位置、Y 位置和朝向角度
