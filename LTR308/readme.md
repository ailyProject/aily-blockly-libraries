# LTR308光照传感器库

基于 https://github.com/dantudose/LTR308 的Blockly积木块实现

## 功能特性

- 支持LTR308光照强度传感器
- I2C通信接口
- 测量范围：0.01 - 64,000 lux
- 高精度16位ADC
- 低功耗设计
- 适用于掌控板3.0等ESP32开发板

## 使用方法

1. 初始化LTR308传感器
2. 读取光照强度值

## 硬件连接

- VCC: 3.3V
- GND: GND  
- SDA: I2C数据线
- SCL: I2C时钟线

## 兼容性

- ESP32/ESP32-S3
- Arduino
- 工作电压：3.3V/5V