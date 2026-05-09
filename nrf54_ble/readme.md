# nRF54 BLE

nRF54L15低功耗蓝牙(BLE)库，支持广播、连接、GATT服务、Nordic UART透传和扫描功能。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-nrf54_ble |
| Version | 1.0.0 |
| Author | Nordic Semiconductor / SeeedStudio |
| License | MIT |

## Supported Boards

Seeed XIAO nRF54L15

## Description

基于nRF54L15 HAL的BLE通信库，提供裸金属无线电控制。支持可连接/不可连接广播、GATT自定义服务与特征值、Nordic UART Service(NUS)串口透传、被动/主动扫描、低功耗模式和电池电量采样。

## Quick Start

1. 快速模式：使用「快速BLE外设」积木块一键创建NUS透传外设
2. 高级模式：分别使用初始化、广播、连接、GATT等积木块自定义BLE行为
