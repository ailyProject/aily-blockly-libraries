# nanoModbus通信库

基于nanoMODBUS的轻量级Modbus RTU/TCP通信库，支持客户端和服务器模式。

## 库信息

| 字段 | 值 |
|------|-----|
| Package | @aily-project/lib-nano-modbus |
| Version | 0.0.2 |
| Author | Valerio De Benedetto |
| Source | https://github.com/debevv/nanoMODBUS |
| License | MIT |

## 支持的开发板

ESP32系列、Arduino UNO/Nano/Mega、Arduino MKR系列

## 功能说明

nanoMODBUS是一个紧凑的Modbus C库，特别适用于微控制器等资源受限的系统。本Blockly库封装了nanoMODBUS的核心功能，支持：

- **RTU客户端模式**：通过串口读写远程Modbus设备的线圈和寄存器（FC01/02/03/04/05/06）
- **RTU服务器模式**：通过串口作为Modbus从站设备，自动处理来自主站的读写请求
- **TCP客户端模式**：通过WiFi/TCP连接到远程Modbus TCP服务器进行读写操作
- **TCP服务器模式**：通过WiFi/TCP提供Modbus服务，支持客户端连接管理
- 可选择任意串口（Serial/Serial1/Serial2）用于RTU模式
- 支持常用波特率（9600~115200）
- TCP模式自动适配ESP32和Arduino UNO R4 WiFi的WiFi库

## 快速开始

1. 将初始化积木块拖入`arduino_setup()`中
2. **RTU客户端**：选择串口和波特率，设置目标地址后即可读写寄存器/线圈
3. **TCP客户端**：填写WiFi凭据和服务器IP/端口，即可读写远程服务器
4. **RTU服务器**：在`arduino_loop()`中调用"处理Modbus请求"积木块
5. **TCP服务器**：在`arduino_loop()`中调用"处理TCP Modbus请求"积木块

## 注意事项

- 在内存受限的Arduino UNO上使用时需注意RAM占用（nmbs_bitfield占用250字节）
- 服务器数据模型默认支持100个线圈、100个离散输入和32个寄存器
- RTU模式下客户端和服务器应使用不同的串口，避免与Serial Monitor冲突
- TCP模式需要支持WiFi的开发板（ESP32、Arduino UNO R4 WiFi等）
