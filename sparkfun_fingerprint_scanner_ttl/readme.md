# SparkFun TTL Fingerprint Scanner

用于 GT-511C3/GT-521F 系列 TTL 指纹模块的 Blockly 库。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-fingerprint-scanner-ttl |
| Version | 0.0.1 |
| Author | Josh Hawley |
| Source | https://github.com/sparkfun/Fingerprint_Scanner-TTL |
| License | Non-commercial / attribution notice |

## Supported Boards

Arduino UNO、Mega、ESP32 等可使用 SoftwareSerial 或兼容串口的开发板。

## Description

该库封装指纹模块的打开连接、LED 控制、指纹采集、识别、验证、录入和删除。适合门禁、身份识别和交互项目。

## Quick Start

连接模块 TX/RX 与开发板 RX/TX，先初始化并打开 LED，再按录入或识别流程调用对应积木。