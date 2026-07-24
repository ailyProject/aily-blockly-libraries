# ESP32 Wi-Fi 配网 - AI 使用说明

## 适用范围

ESP32 WiFiProv 配网积木，提供 SoftAP/BLE 配网、自动停止控制和二维码输出。

芯片/配置约束：BLE 配网仅适用于启用 Bluetooth/NimBLE 的芯片；所有模式都需启用 Network Provisioning。

## 代码生成约定

- 所有积木类型均使用 `esp32_` 前缀。
- generator.js 会自动添加 SDK 头文件和必要的全局对象。
- 创建对象类积木应在初始化阶段执行；状态查询积木可在循环或条件中使用。
- 不打包 SDK 源码，也不生成 src.7z。

## 积木

- `esp32_wifiprov_begin_softap`：启动 SoftAP 配网服务。
- `esp32_wifiprov_begin_ble`：启动 BLE 配网服务（芯片需支持 BLE）。
- `esp32_wifiprov_end`：停止并清理配网服务。
- `esp32_wifiprov_disable_auto_stop`：禁用成功后的自动停止并设置延时。
- `esp32_wifiprov_print_qr`：向 Serial 打印二维码链接与负载。
