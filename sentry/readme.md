# Sentry 视觉传感器

Sentry1/Sentry2 AI视觉传感器库，支持颜色识别、色块检测、球体识别、卡片识别、人脸识别、二维码等多种AI视觉算法。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sentry |
| Version | 2.1.5 |
| Author | Tosee Intelligence |
| Source | https://github.com/tosee-io/Sentry-Arduino |
| License | Apache-2.0 |

## Supported Boards

Arduino UNO/Nano/Mega, ESP32, ESP8266, Arduino UNO R4 WiFi

## Description

Sentry系列AI视觉传感器支持I2C和串口通信，提供丰富的视觉算法包括颜色识别、色块检测、线条检测、卡片识别、二维码识别、20类物体检测等。Sentry2还额外支持标签识别、深度学习、人脸识别和运动检测。

## Quick Start

1. 将Sentry传感器通过I2C连接到开发板（SDA/SCL）
2. 使用`sentry2_begin`初始化传感器
3. 使用`sentry2_set_vision_status`开启所需算法
4. 在loop中使用`sentry2_detected_count`和`sentry2_get_value`获取结果
