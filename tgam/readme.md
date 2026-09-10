# TGAM 脑电波

TGAM 脑电波模块驱动：通过 UART 读取信号质量、注意力、放松度。

## Library Info

| Field   | Value                                  |
| ------- | -------------------------------------- |
| Package | @aily-project/lib-tgam                 |
| Version | 1.2.0                                  |
| Author  | 无锡市思知瑞科技有限公司（大脑实验室）  |
| Source  | http://brainlab.taobao.com             |
| License | UNLICENSED                             |

## Supported Boards

Arduino UNO/Nano（AVR）、ESP32 系列（Serial1/Serial2 可指定引脚）等常见开发板；串口选项由当前板卡自动提供。

## Description

封装 NeuroSky TGAM 脑电波模块的 UART 协议解析：自动同步帧头 AA AA、只接收 0x20 大包、逐字节累加校验，校验通过后更新信号质量（0=最佳，200=未接触）、注意力（0~100）、放松度（0~100）。初始化后自动在 loop 开头非阻塞解析串口数据，不会卡住主循环。

## Quick Start

1. UNO/Nano 接线：TGAM 模块 TX → 开发板 RX(引脚0)，TGAM 模块 RX → 开发板 TX(引脚1)，VCC 接 3.3V，GND 共地；初始化积木选择串口 Serial、波特率 57600（与原程序一致，串口监视器也设为 57600；下载程序时需先断开模块接线）。
2. ESP32 接线：模块 TX → 所选 RX 引脚（如 16），模块 RX → 所选 TX 引脚（如 17），初始化积木选择 Serial1 并填入引脚，调试打印可用独立的 Serial。
3. 在 loop 中直接使用「TGAM 的信号质量」「TGAM 的注意力值」「TGAM 的放松度值」「TGAM 信号良好？」「TGAM 收到新数据？」等参数积木。
