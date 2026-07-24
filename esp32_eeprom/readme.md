# ESP32 EEPROM

ESP32 EEPROM 兼容存储积木，补齐 begin、commit、end 及类型化读写生命周期。

## 功能

- 分配 EEPROM 模拟区并提交到 Flash
- 字节、数值、布尔值和字符串读写
- 查询容量与脏状态

## 使用说明

1. 在工具箱中选择本库积木。
2. 先完成初始化，再调用状态、读写或控制积木。
3. 仅适用于 package.json 中列出的 ESP32 架构；特殊功能还需要 Arduino IDE 中对应的分区或协议模式。

## 注意事项

- 本转换库不包含 src.7z，直接使用 ESP32 Core 3.3.10 SDK 自带源码。
- EEPROM 是基于 Flash 的兼容层，频繁 commit 会影响 Flash 寿命。
