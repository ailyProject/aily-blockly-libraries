# SparkFun Qwiic OpenLog 数据记录器

SparkFun Qwiic OpenLog（DEV-14641）的 Blockly 封装库，通过 I2C 将数据记录到 microSD 卡。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-qwiic-openlog |
| Version | 0.0.1 |
| Author | SparkFun Electronics |
| Source | https://github.com/sparkfun/SparkFun_Qwiic_OpenLog_Arduino_Library |
| License | GPL-3.0 |

## Supported Boards

Arduino UNO、Mega、ESP32 等支持 I2C 的板子。

## Description

Qwiic OpenLog 通过 I2C（默认地址 0x2A）将数据写入 microSD 卡文件，继承自 Print 类，支持 print/println，适合传感器数据记录应用。

## Quick Start

1. 插入 microSD 卡并通过 Qwiic 连接模块
2. 使用「初始化 Qwiic OpenLog」块初始化
3. 使用「打开/追加文件」块指定文件名，然后用「写入行」记录数据
