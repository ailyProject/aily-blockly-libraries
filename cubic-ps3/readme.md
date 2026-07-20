# Cubic PS3手柄

Cubic 赛事专用 PS3 蓝牙手柄库（仅手柄部分）。

## 库信息

| 字段 | 值 |
|------|----|
| 包名 | @aily-project/lib-cubic-ps3 |
| 版本 | 1.0.0 |
| 依赖 | 内置 Ps3Controller（src.7z） |

## 支持的板卡

ESP32

## 描述

按赛事示例封装：自动本机蓝牙 MAC 配对、摇杆死区（默认 30）、Y 轴取反（上推为正）、按键上升沿、断连检测。

## 快速入门

1. 初始化 Cubic PS3手柄
2. 串口查看打印的配对 MAC，用 SixaxisPairTool 写入手柄
3. 循环中读取摇杆/按键控制机器人
