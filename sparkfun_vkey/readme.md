# SparkFun VKey 模拟电压键盘

通过单个模拟引脚读取 12 个按键的模拟键盘 Blockly 库。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-vkey |
| Version | 0.0.1 |
| Author | SparkFun Electronics |
| Source | https://github.com/sparkfun/SparkFun_VKey_Voltage_Keypad_Arduino_Library |
| License | MIT |

## Description

VKey 通过电阻分压网络，使用一个模拟引脚即可读取 12 个按键状态，适合节省 GPIO 资源的场景。

## Quick Start

1. 将 VKey 信号脚接模拟输入
2. 使用"初始化 VKey"积木，指定引脚号
3. 读取"按键值"积木获得 0-12 的按键编号
