# INA226 Power Monitor

INA226高精度电流、电压、功率监测芯片驱动库，支持I2C通信。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-ina226 |
| Version | 1.0.0 |
| Author | SV-Zanshin |
| Source | https://github.com/SV-Zanshin/INA226 |
| License | GPL-3.0 |

## Supported Boards

Arduino UNO, ESP32, ESP8266 等支持 I2C 的开发板

## Description

INA226 是 TI 的高精度双向电流/电压/功率监测芯片，支持最高 36V 总线电压。本库提供总线电压、分流电压、电流和功率读取功能，支持硬件平均采样设置。

## Quick Start

1. 将 INA226 的 SDA/SCL 接到开发板 I2C 引脚
2. 拖入初始化块，设置分流电阻值（单位：微欧）和最大电流
3. 使用读取块获取电压/电流/功率数据
