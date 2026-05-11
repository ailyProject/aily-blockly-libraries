# PubSubClient

基于 PubSubClient 的 MQTT 通信 Blockly 库，用于在 WiFi 开发板上发布、订阅和处理 MQTT 消息。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-pubsubclient |
| Version | 1.0.0 |
| Author | Nick O'Leary |
| Source | https://github.com/knolleary/pubsubclient |
| License | MIT |

## Supported Boards

ESP32、ESP32-C3/C6/S2/S3、Arduino UNO R4 WiFi。

## Description

封装创建客户端、连接 Broker、发布/订阅、回调处理、状态查询和缓冲区设置。默认使用 MQTT 3.1.1，PubSubClient 默认包大小为 256 字节，可通过缓冲区块调整。

## Quick Start

1. 先完成网络连接，再在 `arduino_setup()` 中创建 MQTT 客户端。
2. 连接 Broker 后发布或订阅主题。
3. 在回调中读取消息，主循环会自动执行 `mqttClient.loop()`。