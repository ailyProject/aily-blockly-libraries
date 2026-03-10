# Emakefun游戏手柄

Emakefun游戏手柄Arduino库的Aily Blockly封装，支持按键检测、摇杆读取、陀螺仪数据获取及2.4G/BLE无线通信。

## 库信息

| 字段 | 值 |
|------|-----|
| 包名 | @aily-project/lib-emakefun-gamepad |
| 版本 | 1.0.0 |
| 作者 | Emakefun |
| 来源 | https://github.com/emakefun-arduino-library/emakefun_gamepad |
| 许可证 | MIT |

## 支持的开发板

- Arduino UNO
- Arduino Nano
- Arduino Mega

## 功能描述

本库为易创空间游戏手柄提供可视化编程支持，可读取9个按键状态、摇杆XY坐标、MPU6050陀螺仪数据，并支持通过2.4G RF24模块或BLE蓝牙进行无线数据传输。

## 快速开始

1. 安装RF24库：https://www.arduino.cc/reference/en/libraries/rf24/
2. 使用"手柄初始化"积木初始化手柄和模型
3. 使用"按键事件"积木处理按键操作
4. 使用"摇杆与传感器"积木读取摇杆和陀螺仪数据
5. 如需无线通信，使用"2.4G无线通信"或"BLE蓝牙通信"积木
