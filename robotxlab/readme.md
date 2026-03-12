# RobotXlab

基于Arduino UNO R3的机器人控制库，支持电机驱动、舵机控制、传感器读取和遥控器操作。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-robotxlab |
| Version | 0.0.1 |
| Author | RobotXlab |
| Source | RobotXlab |
| License | MIT |

## Supported Boards

Arduino UNO R3

## Description

RobotXlab 是一个专为 Arduino UNO R3 机器人设计的 Blockly 控制库。支持双电机驱动（正反转及调速）、舵机角度控制（Servo库及脉冲方式）、板载LED和蜂鸣器控制、SR04超声波测距、巡线传感器、光敏传感器、红外避障传感器、红外遥控器及PS2手柄遥控器。

## Quick Start

1. 在 setup 中使用"设置电机接口转速"积木控制电机
2. 使用"读取超声波距离"积木获取障碍物距离
3. 使用巡线传感器积木实现自动巡线
