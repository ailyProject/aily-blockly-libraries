# Grove HCHO传感器

Grove HCHO传感器库，用于检测甲醛、苯、甲苯等挥发性有机化合物(VOC)。

## 库信息

| 字段 | 值 |
|------|-----|
| 包名 | @aily-project/lib-grove-hcho-sensor |
| 版本 | 1.0.0 |
| 作者 | Aily Project |
| 来源 | https://wiki.seeedstudio.com/Grove-HCHO_Sensor/ |
| 许可证 | MIT |

## 支持的开发板

Arduino UNO/Nano/Mega、ESP32、ESP8266、Arduino UNO R4、Raspberry Pi Pico等

## 描述

基于WSP2110半导体VOC气体传感器，检测范围1-50ppm。适用于室内空气质量监测。

## 快速开始

1. 将传感器连接到模拟引脚(如A0)
2. 在清洁空气中运行校准程序获取R0值
3. 将R0值填入初始化块中使用