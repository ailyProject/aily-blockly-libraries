# SparkFun BMI270 六轴 IMU

BMI270 高性能六轴惯性测量单元（加速度计 + 陀螺仪）Blockly 库。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-bmi270 |
| Version | 0.0.1 |
| Author | SparkFun Electronics |
| Source | https://github.com/sparkfun/SparkFun_BMI270_Arduino_Library |
| License | MIT |

## Description

BMI270 是 Bosch 出品的低功耗六轴 IMU，支持加速度计（±2g~±16g）、陀螺仪（±125~±2000 deg/s），并内置计步器、手势识别、运动检测等智能功能。通过 I2C 或 SPI 接口连接。

## Quick Start

1. 使用"初始化 BMI270"积木（默认 I2C 地址 0x68）
2. 在循环中调用"读取传感器数据"积木更新数据
3. 使用"加速度"或"角速度"积木读取各轴数值

## Blocks

| 积木 | 说明 |
|------|------|
| 初始化 BMI270 I2C | 初始化传感器 |
| 读取传感器数据 | 更新内部数据缓存 |
| 加速度 X/Y/Z | 读取加速度（g） |
| 角速度 X/Y/Z | 读取角速度（deg/s） |
| 温度 | 读取芯片温度（°C） |
| 启用计步器 | 开启步数检测功能 |
| 步数 | 获取当前步数 |
| 重置步数 | 步数清零 |
| 活动状态 | 返回 0=静止/1=步行/2=跑步 |
