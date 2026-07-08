# 天气站库 (Weather Station)

WiFi自动连接/AP配置门户 + yytianqi天气API获取

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-weather-station |
| Version | 1.0.0 |
| Author | ailyProject |
| License | MIT |

## Supported Boards

ESP32 系列（依赖WiFi、Preferences、DNSServer等ESP32核心库）

## Description

- **WiFi自动连接**：从NVS加载配置，连接失败自动开启AP热点配置门户
- **AP配置门户**：内置Web页面，手机连接热点即可配置WiFi和API参数
- **天气API**：集成yytianqi观察接口，获取城市/温度/湿度/天气/风力/风向
- **NVS持久化**：配置保存到ESP32 Flash，断电不丢失

## Quick Start

1. setup中调用 `ws_auto_connect` 自动连接WiFi
2. loop中检查配置模式，处理门户请求
3. 连接成功后调用 `ws_fetch_weather` 获取天气
