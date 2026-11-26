# SFA40 HCHO Sensor

SFA40 reads formaldehyde, humidity, and temperature over I2C.

## Library Info

| Field | Value |
|-------|-------|
| Package | `@aily-project/lib-dfrobot-sfa40` |
| Version | `0.1.0` |
| Author | DFRobot |
| Source | https://gitee.com/dfrobot/DFRobot_SFA40 |
| License | MIT |

## Supported Boards

Arduino-compatible boards with I2C.

## Description

Provides HCHO in ppb, relative humidity, Celsius/Fahrenheit temperature, and measurement status from the DFRobot SFA40 sensor.

## Quick Start

Initialize I2C, start measurement, call refresh data in the loop, then read cached HCHO, humidity, or temperature values.

## 0.1.1

序列号读取遇到短读或 CRC 错误时长度为 0。下一次成功读取时，长度恢复为当前协议的有效字节数。
