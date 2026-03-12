# Adafruit SSD1331 彩色OLED

SSD1331 0.96寸16位彩色OLED显示屏（96x64像素）的Blockly积木库。

## 库信息

| 字段 | 值 |
|------|-----|
| Package | @aily-project/lib-adafruit-ssd1331 |
| Version | 1.0.0 |
| Author | Adafruit |
| Source | https://github.com/adafruit/Adafruit-SSD1331-OLED-Driver-Library-for-Arduino |
| License | BSD |

## 支持的开发板

Arduino UNO, Arduino Mega, ESP32, ESP8266 等支持SPI的开发板。

## 说明

基于Adafruit GFX的SSD1331驱动库，用于驱动0.96寸16位彩色OLED（96x64像素）。通过SPI接口通信，支持文本显示、基本图形绘制（点、线、矩形、圆、三角形等）、屏幕旋转等功能。

## 快速开始

1. 将SSD1331 OLED通过SPI连接到开发板（CS、DC、RST引脚）
2. 使用"初始化SSD1331 OLED屏幕"积木配置引脚
3. 使用绘图积木进行显示
