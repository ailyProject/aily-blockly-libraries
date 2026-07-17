# HuskyLensV2 AI摄像头

DFRobot 二哈识图2 AI视觉传感器 Blockly 库，支持人脸/手势/姿态/巡线等算法，I2C 与串口通信。

## 库信息

| 字段 | 值 |
|------|----|
| 包名 | @aily-project/lib-huskylensv2 |
| 版本 | 1.0.9 |
| 作者 | DFRobot |
| 来源 | https://gitee.com/dfrobot/DFRobot_HuskylensV2 |
| 许可证 | LGPL |

## 支持的板卡

Arduino / ESP32 / ESP8266 等（多算法与关键点需大内存板）

## 快速入门

1. 使用 I2C 初始化块连接传感器
2. 切换算法
3. 循环获取结果 → 判断还有结果 → 弹出结果 → 读取字段
