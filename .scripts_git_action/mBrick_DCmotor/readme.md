# mBrick DC Motor

直流电机驱动库，支持单电机、两轮差速小车、四轮驱动小车控制。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-mbrick-dcmotor |
| Version | 1.0.0 |
| Author | mBrick |
| Source | mBrick_DCmotor |
| License | MIT |

## Supported Boards

ESP32系列开发板

## Description

提供直流电机的PWM控制，支持正转、反转、停止（滑行/刹车模式）。包含两轮差速小车和四轮驱动小车的完整控制接口，支持速度百分比控制和最小PWM补偿。

## Quick Start

1. 初始化电机块选择M1-M4引脚配置
2. 两轮车需先初始化两个电机，再创建小车对象
3. 四轮车需先初始化四个电机，再创建四轮车对象