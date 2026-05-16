# DFRobot空气质量传感器库

DFRobot SEN0460空气质量传感器库，通过I2C接口使用Gravity接口，可测量PM2.5/PM1.0/PM10颗粒物浓度及数量，适用于室内空气质量监测。

## 库信息

| 字段 | 值 |
|------|----|
| 包名 | @aily-project/lib-dfrobot-airquality |
| 版本 | 0.1.0 |
| 作者 | DFRobot |
| 来源 | https://github.com/DFRobot/DFRobot_AirQualitySensor |
| 许可证 | MIT |

## 支持的板卡

Arduino兼容开发板（支持I2C接口）

## 描述

DFRobot SEN0460空气质量传感器是一款基于Gravity接口的I2C数字空气质量传感器。它可以测量PM2.5、PM1.0和PM10颗粒物的浓度（ug/m³）以及每0.1L空气中不同粒径颗粒物的数量。该传感器适用于室内空气质量监测、空气净化器控制等应用场景。

## 快速入门

1. 将传感器通过Gravity接口连接到开发板的I2C引脚（SDA/SCL）
2. 在Aily Blockly中启用`@aily-project/lib-dfrobot-airquality`库
3. 在`arduino_setup()`中添加"初始化空气质量传感器直到成功"块
4. 在`arduino_loop()`中使用读取块获取空气质量数据
