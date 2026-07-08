# MLX90642 Thermal Imaging

## Library Info
- **Package**: `@aily-project/lib-melexis-mlx90642`
- **Version**: `0.1.0`
- **Author**: Melexis
- **License**: Apache-2.0
- **Source**: https://www.melexis.com/en/product/MLX90642

## Supported Boards

ESP32 Arduino core.

## Description

Aily Blockly library for the MLX90642 32x24 infrared thermal imaging sensor. It supports ESP32 I2C initialization, measurement mode, refresh rate, output format, frame capture, pixel temperature, frame statistics, and CSV serial output.

中文简介：MLX90642 是 32x24 红外热成像传感器，本库支持 ESP32 I2C 初始化、帧采集、像素温度、帧统计和串口 CSV 输出。

## Quick Start

1. Set SDA, SCL, and I2C address in the init block. The default address is `0x66`.
2. In loop, check `data ready`, then read one frame into the cache.
3. Use pixel, min/max/average, or CSV output blocks to process the cached frame.
