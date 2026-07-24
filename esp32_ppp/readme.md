# ESP32 PPP 蜂窝网络

ESP32 PPP 蜂窝调制解调器积木，支持 APN、串口引脚、联网、状态、短信和 AT 命令。

## 功能

- 配置 APN、SIM PIN 和 UART 引脚
- 启动常见 SIMCom/Quectel 调制解调器
- 查询信号、运营商和设备信息
- 发送短信及 AT 命令

## 使用说明

1. 在工具箱中选择本库积木。
2. 先完成初始化，再调用状态、读写或控制积木。
3. 仅适用于 package.json 中列出的 ESP32 架构；特殊功能还需要 Arduino IDE 中对应的分区或协议模式。

## 注意事项

- 本转换库不包含 src.7z，直接使用 ESP32 Core 3.3.10 SDK 自带源码。
- 开发板构建配置必须启用 LWIP PPP 与 esp-modem，且硬件供电应满足蜂窝模块峰值电流。
