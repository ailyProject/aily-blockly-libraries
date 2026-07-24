# ESP32 Wi-Fi 配网

ESP32 WiFiProv 配网积木，提供 SoftAP/BLE 配网、自动停止控制和二维码输出。

## 功能

- 启动 SoftAP 安全配网
- 在支持 BLE 的芯片上启动 BLE 配网
- 打印二维码并控制服务停止

## 使用说明

1. 在工具箱中选择本库积木。
2. 先完成初始化，再调用状态、读写或控制积木。
3. 仅适用于 package.json 中列出的 ESP32 架构；特殊功能还需要 Arduino IDE 中对应的分区或协议模式。

## 注意事项

- 本转换库不包含 src.7z，直接使用 ESP32 Core 3.3.10 SDK 自带源码。
- BLE 配网仅适用于启用 Bluetooth/NimBLE 的芯片；所有模式都需启用 Network Provisioning。
