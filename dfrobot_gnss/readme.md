# GNSS北斗定位模块

DFRobot Gravity GNSS北斗定位模块，支持GPS/北斗/GLONASS多卫星系统定位。

## 库信息

| 字段 | 值 |
|------|-----|
| 包名 | @aily-project/lib-dfrobot-gnss |
| 版本 | 0.0.1 |
| 作者 | liliang |
| 来源 | https://github.com/DFRobot/DFRobot_GNSS |
| 许可证 | MIT |

## 支持的板卡

Arduino UNO、Arduino Mega、Arduino Leonardo、ESP32、ESP32-S3、micro:bit等

## 描述

DFRobot Gravity GNSS北斗定位模块(TEL0157)支持GPS/北斗/GLONASS多卫星系统，提供I2C和串口两种通信方式。可获取经纬度、高度、UTC时间、卫星数量、对地航速和航向等定位信息。

## 快速入门

1. 在Aily Blockly中启用 `@aily-project/lib-dfrobot-gnss`
2. 在 `arduino_setup()` 中添加GNSS初始化块
3. 在 `arduino_loop()` 中读取定位数据
