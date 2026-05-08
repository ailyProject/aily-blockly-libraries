# SparkFun ESP8266 AT WiFi 扩展板

SparkFun ESP8266 AT WiFi Shield 的 Blockly 库，通过软件串口与 ESP8266 模块通信，实现 WiFi 网络接入和 TCP 连接。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-esp8266at |
| Version | 0.0.1 |
| Author | SparkFun Electronics |
| Source | https://github.com/sparkfun/SparkFun_ESP8266_AT_Arduino_Library |
| License | MIT |

## Supported Boards

Arduino UNO, SparkFun RedBoard（默认使用软件串口 D8/D9）

## Description

本库封装 SparkFun ESP8266 AT 库，使用库内置的全局 `esp8266` 对象，无需手动声明。支持 WiFi 连接、状态检测、IP 查询、TCP 客户端连接和数据发送。

## Quick Start

1. 插上 SparkFun ESP8266 WiFi Shield
2. 使用 `初始化 ESP8266 WiFi` 块（软件串口，9600bps）
3. 调用 `ESP8266 连接 WiFi` 填写 SSID 和密码
4. 用 `ESP8266 已连接` 块判断连接状态，然后进行 TCP 通信
