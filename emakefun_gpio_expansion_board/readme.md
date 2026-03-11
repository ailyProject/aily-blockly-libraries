# GPIO扩展板库

Emakefun GPIO扩展板的Aily Blockly库，通过I2C扩展8路GPIO引脚，支持数字输入输出、ADC采集、PWM输出和舵机控制。

## 库信息

| 字段 | 值 |
|------|-----|
| 包名 | @aily-project/lib-gpio_expansion_board |
| 版本 | 1.0.0 |
| 作者 | Emakefun |
| 来源 | https://github.com/emakefun-arduino-library/emakefun_gpio_expansion_board |
| 许可证 | MIT |

## 支持的开发板

Arduino UNO、ESP32、ESP8266等所有支持I2C的开发板

## 功能说明

- 8路GPIO引脚(E0-E7)，支持多种工作模式
- 数字输入输出(上拉/下拉/浮空)
- ADC模拟输入(0-1023)
- PWM输出(仅E1-E2支持，频率1-10000Hz)
- 舵机控制(仅E1-E2支持，0-180度)
- 默认I2C地址: 0x24

## 快速开始

1. 连接扩展板的I2C引脚(SDA/SCL)到开发板
2. 使用"初始化"块创建扩展板实例
3. 使用"设置模式"块配置引脚工作模式
4. 使用相应的控制块读取或输出信号
