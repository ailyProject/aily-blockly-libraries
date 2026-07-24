# ESP32 OpenThread - AI 使用说明

## 适用范围

ESP32 OpenThread 网络积木，支持数据集、Thread 网络启动、角色与地址查询。

芯片/配置约束：仅适用于带 IEEE 802.15.4 无线电且构建时启用 OpenThread 的 ESP32-C5/C6/H2。

## 代码生成约定

- 所有积木类型均使用 `esp32_` 前缀。
- generator.js 会自动添加 SDK 头文件和必要的全局对象。
- 创建对象类积木应在初始化阶段执行；状态查询积木可在循环或条件中使用。
- 不打包 SDK 源码，也不生成 src.7z。

## 积木

- `esp32_openthread_begin`：初始化 OpenThread 栈。
- `esp32_openthread_end`：关闭 OpenThread 栈。
- `esp32_openthread_control`：控制 Thread 网络或接口。
- `esp32_openthread_running`：检查 OpenThread 栈是否正在运行。
- `esp32_openthread_role`：返回 disabled/detached/child/router/leader。
- `esp32_openthread_has_dataset`：检查是否已提交活动数据集。
- `esp32_openthread_dataset`：创建新的活动数据集并提交。
- `esp32_openthread_network_number`：读取 Thread 网络数值。
- `esp32_openthread_network_text`：读取网络名称或 IPv6 地址。
