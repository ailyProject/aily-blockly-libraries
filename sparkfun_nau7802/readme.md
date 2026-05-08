# SparkFun NAU7802 Qwiic 称重传感器

SparkFun Qwiic Scale（SEN-15242）的 Blockly 封装库，基于 NAU7802 24 位 ADC 芯片，通过 I2C 读取称重传感器（应变片）数据。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-nau7802 |
| Version | 0.0.1 |
| Author | SparkFun Electronics |

## Quick Start

1. 连接称重传感器（应变片）到 Qwiic Scale 模块
2. 初始化后，空载时调用「去皮（归零）」
3. 放上已知重量，调用「标定」
4. 之后可直接读取「重量」

## Notes
- 标定系数可保存到 EEPROM 以备重启后恢复
