# nanoModbus通信库

基于nanoMODBUS的轻量级Modbus RTU通信库，支持客户端和服务器模式。

## 库信息

| 字段 | 值 |
|------|-----|
| Package | @aily-project/lib-nano-modbus |
| Version | 0.0.1 |
| Author | Valerio De Benedetto |
| Source | https://github.com/debevv/nanoMODBUS |
| License | MIT |

## 支持的开发板

ESP32系列、Arduino UNO/Nano/Mega、Arduino MKR系列

## 功能说明

nanoMODBUS是一个紧凑的Modbus RTU C库，特别适用于微控制器等资源受限的系统。本Blockly库封装了nanoMODBUS的核心功能，支持：

- **客户端模式**：读写远程Modbus设备的线圈和寄存器（FC01/02/03/04/05/06）
- **服务器模式**：作为Modbus从站设备，自动处理来自主站的读写请求
- 可选择任意串口（Serial/Serial1/Serial2）
- 支持常用波特率（9600~115200）

## 快速开始

1. 将初始化积木块拖入`arduino_setup()`中
2. 客户端模式：设置目标地址后即可读写寄存器/线圈
3. 服务器模式：在`arduino_loop()`中调用"处理Modbus请求"积木块

## 注意事项

- 在内存受限的Arduino UNO上使用时需注意RAM占用（nmbs_bitfield占用250字节）
- 服务器数据模型默认支持100个线圈和32个寄存器
- 客户端和服务器应使用不同的串口，避免与Serial Monitor冲突
