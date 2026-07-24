# ESP32 OpenThread

ESP32 OpenThread 网络积木，支持数据集、Thread 网络启动、角色与地址查询。

## 功能

- 初始化、启动和停止 Thread 网络
- 创建并提交活动数据集
- 查询角色、信道、PAN ID 与 IPv6 地址

## 使用说明

1. 在工具箱中选择本库积木。
2. 先完成初始化，再调用状态、读写或控制积木。
3. 仅适用于 package.json 中列出的 ESP32 架构；特殊功能还需要 Arduino IDE 中对应的分区或协议模式。

## 注意事项

- 本转换库不包含 src.7z，直接使用 ESP32 Core 3.3.10 SDK 自带源码。
- 仅适用于带 IEEE 802.15.4 无线电且构建时启用 OpenThread 的 ESP32-C5/C6/H2。
